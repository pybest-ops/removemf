import type { CreditPack } from './pricing';
import { getD1Database } from './cloudflareDb';

type LedgerReason = 'topup' | 'consume' | 'refund' | 'adjust';
type OrderStatus = 'pending' | 'paid' | 'refunded';

type StoredOrder = {
  id: string;
  userId: string;
  provider: 'paypal';
  paypalOrderId: string;
  paypalCaptureId?: string;
  packId: CreditPack['id'];
  amountCents: number;
  currency: 'USD';
  status: OrderStatus;
  creditsGranted: number;
  creditsRemaining: number;
  creditsExpiresAt: string;
  createdAt: string;
  paidAt?: string;
  refundedAt?: string;
};

type PublicOrder = ReturnType<typeof toPublicOrder>;

type D1OrderRow = {
  id: string;
  provider: 'paypal';
  pack_id: CreditPack['id'];
  amount_cents: number;
  currency: 'USD';
  status: OrderStatus;
  credits_granted: number;
  credits_remaining: number;
  credits_expires_at: string;
  created_at: string;
  paid_at?: string;
  refunded_at?: string;
};

type LedgerEntry = {
  id: string;
  userId: string;
  jobId?: string;
  orderId?: string;
  delta: number;
  reason: LedgerReason;
  balanceAfter: number;
  createdAt: string;
};

type BillingStoreGlobal = typeof globalThis & {
  __removeMatchaOrders?: Map<string, StoredOrder>;
  __removeMatchaOrdersByPayPal?: Map<string, string>;
  __removeMatchaLedger?: LedgerEntry[];
  __removeMatchaProcessedEvents?: Set<string>;
};

// billingGlobal 保存本地开发环境的内存账本；生产环境可替换为 D1 持久化实现。
const billingGlobal = globalThis as BillingStoreGlobal;
const ordersStore = (billingGlobal.__removeMatchaOrders ??= new Map<string, StoredOrder>());
const ordersByPayPal = (billingGlobal.__removeMatchaOrdersByPayPal ??= new Map<string, string>());
const ledgerStore = (billingGlobal.__removeMatchaLedger ??= []);
const processedEvents = (billingGlobal.__removeMatchaProcessedEvents ??= new Set<string>());

// getCreditBalance 通过账本流水计算当前用户积分余额。
export function getCreditBalance(userId: string) {
  return ledgerStore.reduce((balance, entry) => (entry.userId === userId ? balance + entry.delta : balance), 0);
}

// getCreditBalanceAsync 优先从 D1 读取余额，本地开发时回退到内存账本。
export async function getCreditBalanceAsync(userId: string) {
  const db = getD1Database();

  if (!db) return getCreditBalance(userId);

  const row = await db
    .prepare('SELECT COALESCE(SUM(delta), 0) AS credits_balance FROM credit_ledger WHERE user_id = ?')
    .bind(userId)
    .first<{ credits_balance: number }>();

  return Number(row?.credits_balance ?? 0);
}

// getUserBillingSnapshot 返回账户页需要的余额、有效积分包、订单和流水。
export function getUserBillingSnapshot(userId: string) {
  const now = Date.now();
  const recentOrders = Array.from(ordersStore.values())
    .filter((order) => order.userId === userId)
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt));

  return {
    creditsBalance: getCreditBalance(userId),
    activePacks: recentOrders
      .filter((order) => order.status === 'paid' && order.creditsRemaining > 0 && new Date(order.creditsExpiresAt).getTime() > now)
      .map(toPublicOrder),
    recentOrders: recentOrders.map(toPublicOrder),
    creditLedger: ledgerStore.filter((entry) => entry.userId === userId).slice(-20).reverse()
  };
}

// getUserBillingSnapshotAsync 返回生产 D1 或本地内存中的账户计费快照。
export async function getUserBillingSnapshotAsync(userId: string) {
  const db = getD1Database();

  if (!db) return getUserBillingSnapshot(userId);

  const now = new Date().toISOString();
  const balance = await getCreditBalanceAsync(userId);
  const orders = await db
    .prepare(
      `SELECT id, provider, pack_id, amount_cents, currency, status, credits_granted, credits_remaining, credits_expires_at, created_at, paid_at, refunded_at
       FROM orders
       WHERE user_id = ?
       ORDER BY created_at DESC
       LIMIT 20`
    )
    .bind(userId)
    .all<D1OrderRow>();
  const recentOrders: PublicOrder[] = orders.results.map((order: D1OrderRow) => ({
    id: order.id,
    provider: order.provider,
    packId: order.pack_id,
    amountCents: order.amount_cents,
    currency: order.currency,
    status: order.status,
    creditsGranted: order.credits_granted,
    creditsRemaining: order.credits_remaining,
    creditsExpiresAt: order.credits_expires_at,
    createdAt: order.created_at,
    paidAt: order.paid_at,
    refundedAt: order.refunded_at
  }));

  return {
    creditsBalance: balance,
    activePacks: recentOrders.filter((order) => order.status === 'paid' && order.creditsRemaining > 0 && order.creditsExpiresAt > now),
    recentOrders,
    creditLedger: []
  };
}

// upsertUser 确保 Google 登录用户在 D1 users 表中存在。
export async function upsertUser(user: { id: string; email: string; name?: string | null; image?: string | null }) {
  const db = getD1Database();

  if (!db) return;

  const now = new Date().toISOString();

  await db
    .prepare(
      `INSERT INTO users (id, email, name, image, created_at, updated_at, last_seen_at, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
       ON CONFLICT(id) DO UPDATE SET email = excluded.email, name = excluded.name, image = excluded.image, updated_at = excluded.updated_at, last_seen_at = excluded.last_seen_at`
    )
    .bind(user.id, user.email, user.name ?? null, user.image ?? null, now, now, now)
    .run();
}

// createPendingOrder 记录 PayPal approval 前的待支付订单。
export function createPendingOrder(params: { userId: string; paypalOrderId: string; pack: CreditPack }) {
  const existingOrderId = ordersByPayPal.get(params.paypalOrderId);

  if (existingOrderId) return ordersStore.get(existingOrderId) ?? null;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + params.pack.expiresInDays * 24 * 60 * 60 * 1000);
  const order: StoredOrder = {
    id: `order_${crypto.randomUUID()}`,
    userId: params.userId,
    provider: 'paypal',
    paypalOrderId: params.paypalOrderId,
    packId: params.pack.id,
    amountCents: params.pack.priceCents,
    currency: 'USD',
    status: 'pending',
    creditsGranted: params.pack.credits,
    creditsRemaining: 0,
    creditsExpiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString()
  };

  ordersStore.set(order.id, order);
  ordersByPayPal.set(order.paypalOrderId, order.id);

  return order;
}

// createPendingOrderAsync 在 D1 或内存中记录 PayPal 待支付订单。
export async function createPendingOrderAsync(params: { userId: string; paypalOrderId: string; pack: CreditPack }) {
  const db = getD1Database();

  if (!db) return createPendingOrder(params);

  const existingOrder = await getOrderByPayPalOrderIdAsync(params.paypalOrderId);

  if (existingOrder) return existingOrder;

  const now = new Date();
  const expiresAt = new Date(now.getTime() + params.pack.expiresInDays * 24 * 60 * 60 * 1000);
  const order: StoredOrder = {
    id: `order_${crypto.randomUUID()}`,
    userId: params.userId,
    provider: 'paypal',
    paypalOrderId: params.paypalOrderId,
    packId: params.pack.id,
    amountCents: params.pack.priceCents,
    currency: 'USD',
    status: 'pending',
    creditsGranted: params.pack.credits,
    creditsRemaining: 0,
    creditsExpiresAt: expiresAt.toISOString(),
    createdAt: now.toISOString()
  };

  await db
    .prepare(
      `INSERT INTO orders (id, user_id, provider, paypal_order_id, pack_id, amount_cents, currency, status, credits_granted, credits_remaining, credits_expires_at, created_at)
       VALUES (?, ?, 'paypal', ?, ?, ?, 'USD', 'pending', ?, 0, ?, ?)`
    )
    .bind(order.id, order.userId, order.paypalOrderId, order.packId, order.amountCents, order.creditsGranted, order.creditsExpiresAt, order.createdAt)
    .run();

  return order;
}

// markOrderPaid 幂等确认订单支付成功，并给用户发放积分。
export function markOrderPaid(params: { paypalOrderId: string; paypalCaptureId?: string }) {
  const order = getOrderByPayPalOrderId(params.paypalOrderId);

  if (!order) return null;
  if (order.status === 'paid') return order;

  const updatedOrder: StoredOrder = {
    ...order,
    status: 'paid',
    paypalCaptureId: params.paypalCaptureId ?? order.paypalCaptureId,
    creditsRemaining: order.creditsGranted,
    paidAt: new Date().toISOString()
  };

  ordersStore.set(updatedOrder.id, updatedOrder);
  appendLedger({ userId: updatedOrder.userId, orderId: updatedOrder.id, delta: updatedOrder.creditsGranted, reason: 'topup' });

  return updatedOrder;
}

// markOrderPaidAsync 幂等确认 D1 或内存订单，并发放 credits。
export async function markOrderPaidAsync(params: { paypalOrderId: string; paypalCaptureId?: string }) {
  const db = getD1Database();

  if (!db) return markOrderPaid(params);

  const order = await getOrderByPayPalOrderIdAsync(params.paypalOrderId);

  if (!order) return null;
  if (order.status === 'paid') return order;

  const paidAt = new Date().toISOString();

  await db
    .prepare(`UPDATE orders SET status = 'paid', paypal_capture_id = ?, credits_remaining = credits_granted, paid_at = ? WHERE paypal_order_id = ?`)
    .bind(params.paypalCaptureId ?? null, paidAt, params.paypalOrderId)
    .run();

  await appendLedgerAsync({ userId: order.userId, orderId: order.id, delta: order.creditsGranted, reason: 'topup' });

  return {
    ...order,
    status: 'paid' as const,
    paypalCaptureId: params.paypalCaptureId ?? order.paypalCaptureId,
    creditsRemaining: order.creditsGranted,
    paidAt
  };
}

// consumeCredits 为创建 AI 任务扣减积分，余额不足时返回 null。
export function consumeCredits(params: { userId: string; jobId: string; credits: number }) {
  if (getCreditBalance(params.userId) < params.credits) return null;

  decrementPaidOrderCredits(params.userId, params.credits);

  return appendLedger({ userId: params.userId, jobId: params.jobId, delta: -params.credits, reason: 'consume' });
}

// consumeCreditsAsync 创建任务前扣减积分，D1 环境下保证余额不会扣成负数。
export async function consumeCreditsAsync(params: { userId: string; jobId: string; credits: number }) {
  const db = getD1Database();

  if (!db) return consumeCredits(params);

  if ((await getCreditBalanceAsync(params.userId)) < params.credits) return null;

  await decrementPaidOrderCreditsAsync(params.userId, params.credits);

  return appendLedgerAsync({ userId: params.userId, jobId: params.jobId, delta: -params.credits, reason: 'consume' });
}

// refundJobCredits 对未产出结果的失败任务返还已扣积分。
export function refundJobCredits(params: { userId: string; jobId: string; credits: number }) {
  const alreadyRefunded = ledgerStore.some(
    (entry) => entry.userId === params.userId && entry.jobId === params.jobId && entry.reason === 'refund'
  );

  if (alreadyRefunded) return null;

  return appendLedger({ userId: params.userId, jobId: params.jobId, delta: params.credits, reason: 'refund' });
}

// refundJobCreditsAsync 为无结果失败任务返还积分，按 jobId 幂等。
export async function refundJobCreditsAsync(params: { userId: string; jobId: string; credits: number }) {
  const db = getD1Database();

  if (!db) return refundJobCredits(params);

  const existingRefund = await db
    .prepare('SELECT id FROM credit_ledger WHERE user_id = ? AND job_id = ? AND reason = ? LIMIT 1')
    .bind(params.userId, params.jobId, 'refund')
    .first<{ id: string }>();

  if (existingRefund) return null;

  return appendLedgerAsync({ userId: params.userId, jobId: params.jobId, delta: params.credits, reason: 'refund' });
}

// getOrderByPayPalOrderId 通过 PayPal order id 查找本地订单。
export function getOrderByPayPalOrderId(paypalOrderId: string) {
  const orderId = ordersByPayPal.get(paypalOrderId);

  return orderId ? ordersStore.get(orderId) ?? null : null;
}

// getOrderByPayPalOrderIdAsync 从 D1 或内存中读取订单。
export async function getOrderByPayPalOrderIdAsync(paypalOrderId: string) {
  const db = getD1Database();

  if (!db) return getOrderByPayPalOrderId(paypalOrderId);

  const row = await db
    .prepare(
      `SELECT id, user_id, provider, paypal_order_id, paypal_capture_id, pack_id, amount_cents, currency, status, credits_granted, credits_remaining, credits_expires_at, created_at, paid_at, refunded_at
       FROM orders
       WHERE paypal_order_id = ?
       LIMIT 1`
    )
    .bind(paypalOrderId)
    .first<{
      id: string;
      user_id: string;
      provider: 'paypal';
      paypal_order_id: string;
      paypal_capture_id?: string;
      pack_id: CreditPack['id'];
      amount_cents: number;
      currency: 'USD';
      status: OrderStatus;
      credits_granted: number;
      credits_remaining: number;
      credits_expires_at: string;
      created_at: string;
      paid_at?: string;
      refunded_at?: string;
    }>();

  if (!row) return null;

  return {
    id: row.id,
    userId: row.user_id,
    provider: row.provider,
    paypalOrderId: row.paypal_order_id,
    paypalCaptureId: row.paypal_capture_id,
    packId: row.pack_id,
    amountCents: row.amount_cents,
    currency: row.currency,
    status: row.status,
    creditsGranted: row.credits_granted,
    creditsRemaining: row.credits_remaining,
    creditsExpiresAt: row.credits_expires_at,
    createdAt: row.created_at,
    paidAt: row.paid_at,
    refundedAt: row.refunded_at
  };
}

// markWebhookEventProcessed 记录已处理的 PayPal webhook 事件，保证幂等。
export function markWebhookEventProcessed(eventId: string) {
  if (processedEvents.has(eventId)) return false;

  processedEvents.add(eventId);

  return true;
}

// markWebhookEventProcessedAsync 在 D1 或内存中记录 PayPal webhook 幂等事件。
export async function markWebhookEventProcessedAsync(eventId: string, eventType?: string) {
  const db = getD1Database();

  if (!db) return markWebhookEventProcessed(eventId);

  try {
    await db
      .prepare('INSERT INTO paypal_webhook_events (id, event_type, processed_at) VALUES (?, ?, ?)')
      .bind(eventId, eventType ?? null, new Date().toISOString())
      .run();

    return true;
  } catch {
    return false;
  }
}

// appendLedgerAsync 写入 D1 或内存积分流水。
async function appendLedgerAsync(params: { userId: string; jobId?: string; orderId?: string; delta: number; reason: LedgerReason }) {
  const db = getD1Database();

  if (!db) return appendLedger(params);

  const balanceAfter = (await getCreditBalanceAsync(params.userId)) + params.delta;
  const entry: LedgerEntry = {
    id: `ledger_${crypto.randomUUID()}`,
    userId: params.userId,
    jobId: params.jobId,
    orderId: params.orderId,
    delta: params.delta,
    reason: params.reason,
    balanceAfter,
    createdAt: new Date().toISOString()
  };

  await db
    .prepare('INSERT INTO credit_ledger (id, user_id, job_id, order_id, delta, reason, balance_after, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .bind(entry.id, entry.userId, entry.jobId ?? null, entry.orderId ?? null, entry.delta, entry.reason, entry.balanceAfter, entry.createdAt)
    .run();

  return entry;
}

// decrementPaidOrderCreditsAsync 从 D1 中最早过期的付费包扣减可用 credits。
async function decrementPaidOrderCreditsAsync(userId: string, credits: number) {
  const db = getD1Database();

  if (!db) {
    decrementPaidOrderCredits(userId, credits);
    return;
  }

  let remainingCredits = credits;
  const orders = await db
    .prepare(
      `SELECT id, credits_remaining
       FROM orders
       WHERE user_id = ? AND status = 'paid' AND credits_remaining > 0
       ORDER BY credits_expires_at ASC`
    )
    .bind(userId)
    .all<{ id: string; credits_remaining: number }>();

  for (const order of orders.results) {
    if (remainingCredits <= 0) break;

    const usedCredits = Math.min(order.credits_remaining, remainingCredits);
    await db.prepare('UPDATE orders SET credits_remaining = credits_remaining - ? WHERE id = ?').bind(usedCredits, order.id).run();
    remainingCredits -= usedCredits;
  }
}

// appendLedger 写入一条积分流水，并记录写入后的余额。
function appendLedger(params: { userId: string; jobId?: string; orderId?: string; delta: number; reason: LedgerReason }) {
  const entry: LedgerEntry = {
    id: `ledger_${crypto.randomUUID()}`,
    userId: params.userId,
    jobId: params.jobId,
    orderId: params.orderId,
    delta: params.delta,
    reason: params.reason,
    balanceAfter: getCreditBalance(params.userId) + params.delta,
    createdAt: new Date().toISOString()
  };

  ledgerStore.push(entry);

  return entry;
}

// decrementPaidOrderCredits 从最早过期的已付款订单扣减剩余额度，支持后续退款判断。
function decrementPaidOrderCredits(userId: string, credits: number) {
  let remainingCredits = credits;
  const paidOrders = Array.from(ordersStore.values())
    .filter((order) => order.userId === userId && order.status === 'paid' && order.creditsRemaining > 0)
    .sort((first, second) => first.creditsExpiresAt.localeCompare(second.creditsExpiresAt));

  for (const order of paidOrders) {
    if (remainingCredits <= 0) break;

    const usedCredits = Math.min(order.creditsRemaining, remainingCredits);
    ordersStore.set(order.id, {
      ...order,
      creditsRemaining: order.creditsRemaining - usedCredits
    });
    remainingCredits -= usedCredits;
  }
}

// toPublicOrder 去掉内部字段后返回给前端展示。
function toPublicOrder(order: StoredOrder) {
  return {
    id: order.id,
    provider: order.provider,
    packId: order.packId,
    amountCents: order.amountCents,
    currency: order.currency,
    status: order.status,
    creditsGranted: order.creditsGranted,
    creditsRemaining: order.creditsRemaining,
    creditsExpiresAt: order.creditsExpiresAt,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    refundedAt: order.refundedAt
  };
}

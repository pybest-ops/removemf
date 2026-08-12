import type { CreditPack } from './pricing';

type PayPalLink = {
  href: string;
  rel: string;
};

type PayPalOrderResponse = {
  id: string;
  status: string;
  links?: PayPalLink[];
};

type PayPalCaptureResponse = {
  id: string;
  status: string;
  purchase_units?: Array<{
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
      }>;
    };
  }>;
};

const paypalApiBaseUrls = {
  sandbox: 'https://api-m.sandbox.paypal.com',
  live: 'https://api-m.paypal.com'
};

// isPayPalConfigured 表示当前环境是否具备真实 PayPal Checkout 能力。
export function isPayPalConfigured() {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

// createPayPalOrder 为指定积分包创建 PayPal Checkout 订单。
export async function createPayPalOrder(params: { pack: CreditPack; userId: string; returnUrl: string; cancelUrl: string }) {
  if (!isPayPalConfigured()) {
    return {
      orderId: `mock_paypal_${crypto.randomUUID()}`,
      approvalUrl: params.returnUrl,
      mock: true
    };
  }

  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders`, {
    method: 'POST',
    headers: await createPayPalHeaders(),
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [
        {
          custom_id: params.userId,
          description: `${params.pack.name} credit pack`,
          amount: {
            currency_code: 'USD',
            value: (params.pack.priceCents / 100).toFixed(2)
          }
        }
      ],
      application_context: {
        brand_name: 'Remove Matcha Filter',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal order create failed: ${errorText}`);
  }

  const order = (await response.json()) as PayPalOrderResponse;
  const approvalUrl = order.links?.find((link) => link.rel === 'approve')?.href;

  if (!approvalUrl) throw new Error('PayPal approval URL missing');

  return { orderId: order.id, approvalUrl, mock: false };
}

// capturePayPalOrder 在 PayPal 回跳后服务端确认扣款结果。
export async function capturePayPalOrder(orderId: string) {
  if (orderId.startsWith('mock_paypal_') || !isPayPalConfigured()) {
    return {
      orderId,
      captureId: `mock_capture_${crypto.randomUUID()}`,
      status: 'COMPLETED',
      mock: true
    };
  }

  const response = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: 'POST',
    headers: await createPayPalHeaders()
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal order capture failed: ${errorText}`);
  }

  const capturedOrder = (await response.json()) as PayPalCaptureResponse;
  const capture = capturedOrder.purchase_units?.[0]?.payments?.captures?.[0];

  return {
    orderId: capturedOrder.id,
    captureId: capture?.id,
    status: capture?.status ?? capturedOrder.status,
    mock: false
  };
}

// verifyPayPalWebhook 通过 PayPal API 验证 webhook 签名；未配置时拒绝生产处理。
export async function verifyPayPalWebhook(request: Request, body: unknown) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;

  if (!webhookId || !isPayPalConfigured()) return false;

  const response = await fetch(`${getPayPalBaseUrl()}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: await createPayPalHeaders(),
    body: JSON.stringify({
      auth_algo: request.headers.get('paypal-auth-algo'),
      cert_url: request.headers.get('paypal-cert-url'),
      transmission_id: request.headers.get('paypal-transmission-id'),
      transmission_sig: request.headers.get('paypal-transmission-sig'),
      transmission_time: request.headers.get('paypal-transmission-time'),
      webhook_id: webhookId,
      webhook_event: body
    })
  });

  if (!response.ok) return false;

  const result = (await response.json()) as { verification_status?: string };

  return result.verification_status === 'SUCCESS';
}

// getPayPalAccessToken 使用 client credentials 换取 PayPal access token。
async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) throw new Error('PayPal credentials are required');

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`PayPal token request failed: ${errorText}`);
  }

  const result = (await response.json()) as { access_token?: string };

  if (!result.access_token) throw new Error('PayPal access token missing');

  return result.access_token;
}

// createPayPalHeaders 生成调用 PayPal JSON API 所需请求头。
async function createPayPalHeaders() {
  return {
    Authorization: `Bearer ${await getPayPalAccessToken()}`,
    'Content-Type': 'application/json'
  };
}

// getPayPalBaseUrl 根据环境变量选择 PayPal sandbox 或 live API。
function getPayPalBaseUrl() {
  return process.env.PAYPAL_ENV === 'live' ? paypalApiBaseUrls.live : paypalApiBaseUrls.sandbox;
}

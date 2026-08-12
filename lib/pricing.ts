// CreditPack 定义可购买的固定积分包，避免前后端价格不一致。
export type CreditPack = {
  id: 'try_499_8' | 'popular_1499_45' | 'pro_3999_160';
  name: string;
  badge?: string;
  priceCents: number;
  credits: number;
  expiresInDays: number;
  description: string;
  features: string[];
};

// creditPacks 是首版固定付费档位；不包含免费试用、订阅或 lifetime。
export const creditPacks: CreditPack[] = [
  {
    id: 'try_499_8',
    name: 'Try',
    priceCents: 499,
    credits: 8,
    expiresInDays: 365,
    description: 'Low-risk pack for trying a few natural photo recoveries.',
    features: ['8 matcha filter removals', 'No subscription', 'Credits valid for 12 months']
  },
  {
    id: 'popular_1499_45',
    name: 'Popular',
    badge: 'Best value',
    priceCents: 1499,
    credits: 45,
    expiresInDays: 365,
    description: 'Best fit for a small photo set or playful batch corrections.',
    features: ['45 matcha filter removals', 'No subscription', 'Failed jobs return the credit']
  },
  {
    id: 'pro_3999_160',
    name: 'Pro',
    priceCents: 3999,
    credits: 160,
    expiresInDays: 365,
    description: 'For larger batches when you need more room to experiment.',
    features: ['160 matcha filter removals', 'No subscription', '12-month credit validity']
  }
];

// jobCostCredits 是单次图片恢复固定消耗的积分数。
export const jobCostCredits = 1;

// formatPackPrice 把 cents 价格格式化成定价页展示文本。
export function formatPackPrice(priceCents: number) {
  return `$${(priceCents / 100).toFixed(2)}`;
}

// getCreditPack 根据 packId 返回受支持的积分包。
export function getCreditPack(packId: string) {
  return creditPacks.find((pack) => pack.id === packId) ?? null;
}

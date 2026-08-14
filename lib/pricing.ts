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
    description: 'Low-risk starter pack for checking how AI Restore handles your photos.',
    features: ['8 AI Restores', 'Small starter pack', 'Good for testing results']
  },
  {
    id: 'popular_1499_45',
    name: 'Popular',
    badge: 'Best value',
    priceCents: 1499,
    credits: 45,
    expiresInDays: 365,
    description: 'Recommended pack for a small photo set or regular color fixes.',
    features: ['45 AI Restores', 'Best value per small set', 'Failed jobs return the credit']
  },
  {
    id: 'pro_3999_160',
    name: 'Pro',
    priceCents: 3999,
    credits: 160,
    expiresInDays: 365,
    description: 'Batch-friendly pack for creators or larger photo cleanup sessions.',
    features: ['160 AI Restores', 'Lowest cost per AI Restore', 'Built for batch experiments']
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

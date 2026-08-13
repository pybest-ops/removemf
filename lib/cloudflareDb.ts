import { getCloudflareContext } from '@opennextjs/cloudflare';

type EnvWithDb = CloudflareEnv & {
  DB?: D1Database;
};

// isLocalBaseUrl 判断当前运行环境是否显式指向本地地址，本地开发直接走内存账本。
function isLocalBaseUrl() {
  const baseUrl = process.env.APP_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? '';

  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/.test(baseUrl);
}

// getD1Database 在 Cloudflare runtime 中读取 DB binding；本地 next dev 缺失时返回 null。
export function getD1Database() {
  if (isLocalBaseUrl()) return null;

  try {
    const context = getCloudflareContext({ async: false });
    const env = context.env as EnvWithDb;

    return env.DB ?? null;
  } catch {
    return null;
  }
}

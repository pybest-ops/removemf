import { getCloudflareContext } from '@opennextjs/cloudflare';

type EnvWithDb = CloudflareEnv & {
  DB?: D1Database;
};

// getD1Database 在 Cloudflare runtime 中读取 DB binding；本地 next dev 缺失时返回 null。
export function getD1Database() {
  try {
    const context = getCloudflareContext({ async: false });
    const env = context.env as EnvWithDb;

    return env.DB ?? null;
  } catch {
    return null;
  }
}

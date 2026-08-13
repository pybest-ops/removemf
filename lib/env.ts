import { getCloudflareContext } from '@opennextjs/cloudflare';

type RuntimeEnv = CloudflareEnv & Record<string, string | undefined>;

// getEnvValue 统一读取本地 process.env 和 Cloudflare Workers runtime bindings。
export function getEnvValue(name: string) {
  const processValue = process.env[name];

  if (processValue) return processValue;

  try {
    const context = getCloudflareContext({ async: false });
    const runtimeValue = (context.env as RuntimeEnv)[name];

    if (runtimeValue) return runtimeValue;
  } catch {
    // next dev 没有初始化 Cloudflare context 时只使用 process.env。
  }

  return undefined;
}

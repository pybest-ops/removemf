import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

// prodEnvFile 是生产部署前用于同步 Worker secret 的本地环境文件。
const prodEnvFile = '.env.prod';

// prodSecretKeys 限定允许从 .env.prod 上传到 Cloudflare Worker 的敏感变量，避免误传普通配置。
const prodSecretKeys = ['PAYPAL_CLIENT_ID', 'PAYPAL_CLIENT_SECRET', 'PAYPAL_WEBHOOK_ID'];

// requiredPaypalEnv 是正式部署允许使用的 PayPal 环境，避免把 sandbox 凭据同步到生产 Worker。
const requiredPaypalEnv = 'live';

// parseEnvFile 解析简单 KEY=VALUE 格式，保留引号内的变量值但不做 shell 展开。
function parseEnvFile(content) {
  const values = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith('#')) continue;

    const separatorIndex = trimmedLine.indexOf('=');

    if (separatorIndex === -1) continue;

    const key = trimmedLine.slice(0, separatorIndex).trim();
    let value = trimmedLine.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    values[key] = value;
  }

  return values;
}

// prodEnvValues 保存 .env.prod 中解析出的生产环境变量。
const prodEnvValues = parseEnvFile(readFileSync(prodEnvFile, 'utf8'));

if (prodEnvValues.PAYPAL_ENV && prodEnvValues.PAYPAL_ENV !== requiredPaypalEnv) {
  console.error(`.env.prod 的 PAYPAL_ENV 必须是 ${requiredPaypalEnv}`);
  process.exit(1);
}

// secretsPayload 是实际同步到 removemf Worker 的 PayPal secret 集合。
const secretsPayload = Object.fromEntries(
  prodSecretKeys
    .filter((key) => prodEnvValues[key])
    .map((key) => [key, prodEnvValues[key]])
);

// missingSecretKeys 用于提前阻断缺少关键 PayPal 凭据的生产部署。
const missingSecretKeys = prodSecretKeys.filter((key) => !secretsPayload[key]);

if (missingSecretKeys.length > 0) {
  console.error(`.env.prod 缺少必需变量：${missingSecretKeys.join(', ')}`);
  process.exit(1);
}

const syncResult = spawnSync(
  'pnpm',
  ['exec', 'wrangler', 'secret', 'bulk', '--config', 'wrangler.jsonc', '--name', 'removemf'],
  {
    input: JSON.stringify(secretsPayload),
    stdio: ['pipe', 'inherit', 'inherit']
  }
);

process.exit(syncResult.status ?? 1);

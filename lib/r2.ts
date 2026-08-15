import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getEnvValue } from './env';

export type R2UploadTarget = {
  uploadUrl: string;
  objectKey: string;
  expiresAt: string;
  maxSizeBytes: number;
};

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
};

const uploadUrlTtlSeconds = 15 * 60;
const downloadUrlTtlSeconds = 10 * 60;

// getR2Config 读取 R2 S3 API 所需配置；缺任一项则返回 null 走本地 fallback。
function getR2Config(): R2Config | null {
  const accountId = getEnvValue('R2_ACCOUNT_ID') ?? getEnvValue('CLOUDFLARE_ACCOUNT_ID');
  const accessKeyId = getEnvValue('R2_ACCESS_KEY_ID');
  const secretAccessKey = getEnvValue('R2_SECRET_ACCESS_KEY');
  const bucketName = getEnvValue('R2_BUCKET_NAME');

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) return null;

  return { accountId, accessKeyId, secretAccessKey, bucketName };
}

// isR2Configured 表示当前环境是否已具备真实 R2 读写能力。
export function isR2Configured() {
  return Boolean(getR2Config());
}

// createR2Client 创建指向 Cloudflare R2 S3 兼容端点的客户端。
function createR2Client(config: R2Config) {
  return new S3Client({
    region: 'auto',
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey
    },
    forcePathStyle: true
  });
}

// createR2UploadUrl 生成浏览器直传原图到 R2 的短期 PUT URL。
export async function createR2UploadUrl(objectKey: string, contentType: string, maxSizeBytes: number): Promise<R2UploadTarget | null> {
  const config = getR2Config();

  if (!config) return null;

  const client = createR2Client(config);
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: objectKey,
    ContentType: contentType
  });
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: uploadUrlTtlSeconds });

  return {
    uploadUrl,
    objectKey,
    expiresAt: new Date(Date.now() + uploadUrlTtlSeconds * 1000).toISOString(),
    maxSizeBytes
  };
}

// createR2DownloadUrl 为原图或结果图生成短期 GET URL，供 Replicate 或前端读取。
export async function createR2DownloadUrl(objectKey: string, expiresIn = downloadUrlTtlSeconds) {
  const config = getR2Config();

  if (!config) return null;

  const client = createR2Client(config);
  const command = new GetObjectCommand({
    Bucket: config.bucketName,
    Key: objectKey
  });

  return getSignedUrl(client, command, { expiresIn });
}

// putR2Object 把服务端拿到的结果图写入 R2。
export async function putR2Object(objectKey: string, bytes: Uint8Array, contentType: string) {
  const config = getR2Config();

  if (!config) throw new Error('R2 is not configured');

  const client = createR2Client(config);
  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: objectKey,
      Body: bytes,
      ContentType: contentType
    })
  );
}

// deleteR2Object 删除用户主动移除的结果图对象；未配置 R2 时直接跳过。
export async function deleteR2Object(objectKey: string) {
  const config = getR2Config();

  if (!config) return;

  const client = createR2Client(config);
  await client.send(
    new DeleteObjectCommand({
      Bucket: config.bucketName,
      Key: objectKey
    })
  );
}

# R2 接入说明

## 必填环境变量

- `R2_ACCOUNT_ID`：Cloudflare Account ID
- `R2_ACCESS_KEY_ID`：R2 S3 API access key
- `R2_SECRET_ACCESS_KEY`：R2 S3 API secret key
- `R2_BUCKET_NAME`：存放原图和结果图的 bucket 名称

## 当前实现

- `/api/uploads/sign` 已能在 R2 配置完整时返回 PUT 签名上传 URL
- `getPublicInputUrl` 已能为 Replicate 生成 R2 短期 GET 签名 URL
- `persistRemoteImageToR2` 已能把 Replicate 输出图下载后写入 R2
- `/api/jobs/:id/download` 当前返回结果预览 URL，后续可改成每次动态签名下载 URL

## 本地 fallback

如果未配置 R2，系统会走 1MB 内的临时直传 data URI 方案。

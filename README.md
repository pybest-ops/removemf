# Remove Matcha Filter

AI 图片恢复站：上传抹茶偏色图片，返回更自然的结果图。

## 技术栈

- Next.js
- Cloudflare Pages / Workers
- D1 / R2 / Queues
- Replicate

## 运行

```bash
npm install
npm run dev
```

## 环境变量

复制 `.env.example` 为 `.env.local` 后填入真实值。

Replicate 真实调用至少需要：

- `REPLICATE_API_TOKEN_PRIVATE`
- `APP_PUBLIC_BASE_URL`

R2 真实上传和结果持久化需要：

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`

## 当前状态

- 已有首页、上传页、结果页和基础合规页
- 已有上传组件和任务轮询 hook
- 已有 Replicate prediction 创建和状态刷新适配
- 已有 R2 签名上传、签名读取和结果持久化适配
- D1、Queue 当前仍是占位适配，尚未接真实 Cloudflare 资源

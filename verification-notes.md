# 验证记录

## 2026-08-12

- 已使用 `pnpm run build` 验证 Next.js 构建通过。
- R2 环境变量键名已齐。
- R2 bucket 连通性已验证通过。
- R2 CORS 已配置，允许本地 `localhost:3000`、`localhost:3001`、`localhost:8787` 和生产域名来源。

## 未验证

- 未真实消耗 Replicate 余额跑图片恢复。
- 未验证 Replicate webhook，因为本地地址不是公网可访问地址。

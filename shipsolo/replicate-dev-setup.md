# Replicate 本地接入说明

## 必填环境变量

- `REPLICATE_API_TOKEN_PRIVATE`：Replicate API Token，已兼容代码读取
- `APP_PUBLIC_BASE_URL`：线上或可被 Replicate 访问的站点地址，已兼容代码读取

## 可选环境变量

- `REPLICATE_COLOR_MATCHER_VERSION`：`fofr/color-matcher` 的模型 version id；不填时走 `/v1/models/fofr/color-matcher/predictions`
- `NEXT_PUBLIC_MOCK_INPUT_IMAGE_URL`：调试时强制使用的公网测试图

## 当前实现状态

- 已能在服务端创建 Replicate prediction
- 已能通过轮询刷新 prediction 状态
- 已有 `/api/replicate/webhook` 接收完成回调
- 本地未接 R2 时，前端会把图片直传到后端内存，再转成 data URI 给 Replicate
- R2 和 D1 仍是适配层占位，未接真实 Cloudflare 资源

## webhook 规则

Replicate webhook 必须是 HTTPS URL。当前代码只会在 `APP_PUBLIC_BASE_URL` 或 `NEXT_PUBLIC_APP_URL` 以 `https://` 开头时传 webhook；本地 `http://localhost` 会自动不传，改用前端轮询刷新状态。

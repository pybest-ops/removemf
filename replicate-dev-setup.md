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

## 本地限制

- 临时直传只允许 1MB 内图片，避免 data URI 过大
- Replicate webhook 需要公网可访问地址；本地没有 tunnel 时，轮询接口仍可刷新任务状态

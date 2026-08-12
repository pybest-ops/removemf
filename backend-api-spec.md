# 后端 API 方案：Remove Matcha Filter

## 1. 目标

支持图片上传、异步 AI 修复、结果查询、下载、credits 计费和支付回调。

## 2. 设计原则

- 以单张图片处理为第一版范围
- 采用异步任务，避免长请求阻塞
- 所有创建/支付/回调接口都要幂等
- 结果图只返回短期签名 URL，不直接暴露永久对象地址

## 3. 组件职责

- `Workers`：API 网关、鉴权、签名、任务创建、支付回调
- `D1`：用户会话、任务、账本、订单元数据
- `R2`：原图、结果图、缩略图
- `Queues`：异步处理任务
- `AI Provider`：执行图片恢复/颜色校正

## 4. 会话模型

V1 不做复杂账号体系，先用匿名会话 + Cookie。用户首次访问时创建 `session_id`，所有 credits 和任务都挂在这个会话上；后续再补邮箱登录也不影响主流程。

## 5. API 列表

### `POST /api/session/init`

创建或恢复匿名会话。

请求：空。

响应：
- `sessionId`
- `creditsBalance`
- `anonymous: true`

### `POST /api/uploads/sign`

为原图生成上传签名。

请求：
- `filename`
- `contentType`
- `sizeBytes`

响应：
- `uploadUrl`
- `objectKey`
- `expiresAt`
- `maxSizeBytes`

校验：
- 图片格式白名单
- 大小限制
- 当前会话有效

### `POST /api/jobs`

创建修复任务。

请求：
- `inputObjectKey`
- `modelName`
- `idempotencyKey`

响应：
- `jobId`
- `status: queued`
- `costCredits`

处理：
- 校验 credits 是否足够
- 扣减 credits 或先冻结 credits
- 写入任务记录
- 投递队列

### `GET /api/jobs/:id`

查询任务状态。

响应：
- `jobId`
- `status`
- `progress`
- `errorCode`
- `errorMessage`
- `inputPreviewUrl`
- `outputPreviewUrl`
- `createdAt`
- `updatedAt`

### `GET /api/jobs/:id/download`

返回结果图短期下载地址。

响应：
- `downloadUrl`
- `expiresAt`

### `GET /api/me`

查询当前会话信息。

响应：
- `sessionId`
- `creditsBalance`
- `recentJobs`
- `orders`

### `POST /api/checkout/create`

创建 credits 购买单。

请求：
- `packId`
- `returnUrl`

响应：
- `checkoutUrl`
- `orderId`

### `POST /api/payments/webhook`

支付回调。

要求：
- 验证签名
- 幂等处理
- 订单成功后发放 credits

### `POST /api/jobs/:id/retry`

对失败任务重试一次。

约束：
- 只允许未成功且未达到重试上限的任务

## 6. 队列消息结构

```json
{
  "jobId": "job_123",
  "sessionId": "sess_123",
  "inputObjectKey": "uploads/original/xxx.png",
  "outputObjectKey": "results/final/yyy.png",
  "modelName": "image-recovery-v1",
  "attempt": 1,
  "createdAt": "2026-08-12T11:00:00Z"
}
```

## 7. 任务状态机

- `created`：任务已记录
- `queued`：已进入队列
- `processing`：AI worker 正在处理
- `completed`：处理成功
- `failed`：处理失败
- `expired`：原图或结果过期清理

## 8. 错误码

- `UNAUTHORIZED_SESSION`
- `FILE_TOO_LARGE`
- `UNSUPPORTED_FORMAT`
- `INSUFFICIENT_CREDITS`
- `JOB_NOT_FOUND`
- `MODEL_TIMEOUT`
- `MODEL_ERROR`
- `WEBHOOK_INVALID`

## 9. 结果与下载策略

- 原图默认短期保留
- 结果图支持限时下载
- 下载 URL 只发短链，不裸露 R2 公网对象
- 到期后异步清理对象和索引记录

## 10. 第一版建议

- 先只支持 PNG / JPG / WEBP
- 先只支持单张处理
- 先只做 session-based credits
- 先接一个 AI Provider，不做多模型切换

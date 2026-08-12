# 技术方案：Remove Matcha Filter

## 1. 目标

做一个 AI 图片恢复站。用户上传偏抹茶、偏绿、偏黄的图片后，系统异步处理并返回更自然的结果图，支持下载与 credits 计费。

## 2. 架构总览

- 前端：用户上传、预览、进度、结果展示
- 后端：鉴权、任务创建、文件签名、计费、结果查询
- AI 层：Replicate 图像恢复 / 颜色校正 / 偏色压制
- 存储：原图、处理图、任务元数据、credits 账本
- 队列：异步处理任务，避免长请求阻塞

## 3. 推荐技术栈

### 前端

- Next.js 或等价 React 框架
- 部署在 Cloudflare Pages
- 页面：Landing、Upload、Result、Pricing、FAQ、Policy

### 后端

- Cloudflare Workers 作为 BFF
- D1 存任务表、用户表、credits 账本
- R2 存原图和结果图
- Queues 派发图像处理任务

### AI

- 第一版优先接 Replicate 图像模型 API
- 只做单图处理，不做复杂工作台
- 输出定位为“自然恢复”，不承诺原图像素级还原

### 存储

- R2：原图、结果图、缩略图
- D1：任务状态、用户、订单、credits
- 可选 KV：短期状态缓存

### 队列

- 上传成功后创建 job
- job 进入队列
- worker 消费 job，调用 AI API
- 处理完成后写回结果地址和状态

## 4. 核心流程

1. 用户上传图片
2. 前端请求后端创建任务
3. 后端返回上传地址或直传签名
4. 图片落到 R2
5. 后端创建 job 并写入 D1
6. job 进入队列
7. AI worker 读取原图并调用模型
8. 结果图写入 R2
9. 任务状态更新为 completed
10. 前端轮询或订阅结果并展示 before/after

## 5. 数据模型

### user

- id
- email
- created_at

### job

- id
- user_id
- input_image_key
- output_image_key
- status: pending / processing / completed / failed
- model_name
- cost_credits
- created_at
- updated_at

### credit_ledger

- id
- user_id
- delta
- reason
- job_id
- created_at

### order

- id
- user_id
- provider_order_id
- amount
- currency
- status
- created_at

## 6. API 设计

- `POST /api/jobs`：创建处理任务
- `POST /api/uploads/sign`：获取上传签名或直传凭证
- `GET /api/jobs/:id`：查询任务状态
- `POST /api/webhooks/payments`：支付回调
- `GET /api/me`：查看 credits 和任务历史

## 7. 失败策略

- AI 调用失败：标记 failed，可重试一次
- 图片过大：前端和后端都做尺寸限制
- credits 不足：拦截创建任务
- 结果超时：前端显示排队中，允许稍后刷新

## 8. 计费建议

- 新用户送少量免费 credits
- 每张图消耗固定 credits
- 后续购买 credits 包
- 不建议第一版做复杂订阅阶梯

## 9. 版本路线

### V1

- 单张上传
- 单张恢复
- before/after 对比
- 下载结果
- 免费 credits + 付费 credits

### V2

- 批量处理
- 历史记录
- 登录体系完善
- 更多模型切换

### V3

- 批量队列优化
- 质量评分
- 更细的参数控制

## 10. 风险

- 处理效果不稳定
- 用户把“恢复自然”理解成“完全还原”
- 推理成本高于定价
- 上传和结果存储需要严格控制生命周期

## 11. 结论

第一版最稳的方案是：
- 前端用 Next.js
- 后端用 Cloudflare Workers
- 存储用 R2 + D1
- 队列用 Cloudflare Queues
- AI 先接第三方图像模型 API

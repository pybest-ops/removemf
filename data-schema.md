# 数据表设计：Remove Matcha Filter

## 1. 设计目标

支持匿名会话、任务流转、credits 账本、订单回调和结果追踪。

## 2. 表结构

### `sessions`

匿名会话表。

字段：
- `id` UUID / string
- `created_at`
- `updated_at`
- `last_seen_at`
- `credits_balance` int
- `email` nullable string
- `source` nullable string
- `status` active / blocked / deleted

索引：
- `id`
- `email`

### `jobs`

图片修复任务表。

字段：
- `id`
- `session_id`
- `input_object_key`
- `output_object_key` nullable
- `status`
- `model_name`
- `cost_credits`
- `progress` int
- `error_code` nullable
- `error_message` nullable
- `created_at`
- `started_at` nullable
- `completed_at` nullable
- `expires_at`
- `idempotency_key`

索引：
- `session_id, created_at`
- `status, created_at`
- `idempotency_key`

### `assets`

文件资产表，用于原图、结果图和缩略图。

字段：
- `id`
- `job_id`
- `kind` original / preview / result / thumbnail
- `r2_key`
- `mime_type`
- `size_bytes`
- `width`
- `height`
- `created_at`
- `expires_at`

索引：
- `job_id`
- `r2_key`

### `credit_ledger`

credits 流水表。

字段：
- `id`
- `session_id`
- `job_id` nullable
- `order_id` nullable
- `delta` int
- `reason` topup / consume / refund / adjust
- `balance_after` int
- `created_at`

索引：
- `session_id, created_at`
- `job_id`
- `order_id`

### `orders`

购买订单表。

字段：
- `id`
- `session_id`
- `provider`
- `provider_order_id`
- `pack_id`
- `amount_cents`
- `currency`
- `status` pending / paid / failed / refunded
- `credits_granted`
- `created_at`
- `paid_at` nullable
- `refunded_at` nullable

索引：
- `session_id, created_at`
- `provider_order_id`

### `job_events`

任务事件表，用于排查链路问题。

字段：
- `id`
- `job_id`
- `event_type`
- `payload_json`
- `created_at`

索引：
- `job_id, created_at`

## 3. 账本规则

- credits 只通过 `credit_ledger` 变更
- 余额字段可以冗余保留在 `sessions`，但最终以账本为准
- 任务创建时先冻结或直接扣减 credits，二选一，不混用
- 支付成功后写一条正向账本，再更新余额

## 4. 任务生命周期

1. 创建 `jobs` 记录
2. 写入 `assets` 原图记录
3. 进入队列
4. worker 更新 `started_at` 和 `status=processing`
5. 成功后写 `output_object_key`
6. 补 `assets` 结果图记录
7. 更新 `status=completed`
8. 失败则写 `error_code` 和 `error_message`

## 5. 清理策略

- 原图保留短周期，默认 24 小时到 7 天
- 结果图保留更久，但也要有过期任务
- 任务元数据保留更久，方便账务和排障
- 过期对象由定时任务清理

## 6. 实现建议

- D1 先放这些核心表就够
- 不要一开始加太多历史冗余表
- 先保证任务、文件、账本、订单四条主线跑通

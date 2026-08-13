# AI 模型接入方案：Remove Matcha Filter

## 1. 结论

第一版改用 Replicate。

主模型优先选 `fofr/color-matcher`，备选模型选 `flux-kontext-apps/restore-image`。

理由：
- `fofr/color-matcher` 直接做颜色匹配和白平衡修正，和“去掉抹茶色偏”最贴近。
- `flux-kontext-apps/restore-image` 适合做更泛化的图片恢复，作为兜底更稳。
- Replicate 的预测 API、webhooks 和模型集合都适合异步图片处理产品。
- 你手里已经有余额，先用现成平台验证效果更快。

参考：
- [Replicate create prediction](https://replicate.com/docs/topics/predictions/create-a-prediction/)
- [Replicate webhooks](https://replicate.com/docs/topics/webhooks/)
- [Replicate image editing collection](https://replicate.com/collections/image-editing)
- [Replicate color-matcher](https://replicate.com/fofr/color-matcher)
- [Replicate restore-image](https://replicate.com/flux-kontext-apps/restore-image)

## 2. 推荐链路

1. 用户上传图片
2. 前端把图片传给后端
3. 后端保存原图到 R2
4. 后端创建 Replicate prediction
5. prediction 进入异步处理
6. Replicate 通过 webhook 回调处理结果
7. worker 保存结果图到 R2
8. worker 更新 job 状态
9. 前端轮询任务结果并展示 before/after

## 3. 选择 Replicate 的原因

Replicate 的 HTTP API 里有明确的 `predictions.create`、`predictions.get`、`predictions.cancel`，也支持 webhook 和轮询。
官方说明里，API 创建的预测输入和输出会在一段时间后删除，所以我们必须把结果图存到自己的 R2 里，不能只依赖平台临时 URL。

参考：
- [Replicate HTTP API](https://replicate.com/docs/reference/http/)
- [Replicate webhooks](https://replicate.com/docs/topics/webhooks/)

## 4. 主模型：`fofr/color-matcher`

这个模型的定位是颜色匹配和白平衡修正，适合处理偏绿、偏黄、偏暖的照片。
它还能接受参考图；如果没有参考图，则只做白平衡修正。

适合我们的地方：
- 去掉抹茶色偏
- 恢复更自然的白平衡
- 做快速、便宜的第一版恢复

风险：
- 对复杂场景的“原图还原”能力有限
- 只靠颜色匹配不一定能恢复所有细节

## 5. 备选模型：`flux-kontext-apps/restore-image`

这个模型定位是通用图片恢复，适合修复损伤、去伪影、上色和增强自然感。

适合我们的地方：
- 当 `color-matcher` 效果不够时作为兜底
- 处理更复杂的输入图
- 提供更强的“恢复感”

风险：
- 成本可能更高
- 输出更偏“修复后自然”，不一定是单纯色偏修正

## 6. 产品策略

第一版只上一个主模型，不做前端可见的多模型切换。

建议策略：
- 默认先跑 `fofr/color-matcher`
- 如果任务失败或结果过弱，再走 `restore-image`
- 前端只展示“AI 恢复”结果，不暴露内部模型名

## 7. Replicate 调用方式

### 创建预测

使用 Replicate 的预测接口创建异步任务：
- 社区模型：`POST /v1/predictions`
- 官方模型：`POST /v1/models/{model_owner}/{model_name}/predictions`

V1 推荐直接调用社区模型接口，省掉一些模型层封装。

### 状态查询

- `GET /v1/predictions/{id}`

### 回调

- 通过 webhook 接收完成事件
- 结果落地到我们自己的 R2

## 8. 输出存储策略

因为 Replicate 的 API 预测输入/输出会自动过期，我们必须：
- webhook 收到结果后立即下载
- 存到自己的 R2
- 在 D1 里记录最终结果 key

不能把平台临时 URL 当作长期结果地址。

## 9. Prompt / 输入策略

第一版先用固定提示，不做复杂 prompt 编辑器。

主输入：
- 原图

主目标：
- 减少绿色/黄色偏色
- 恢复自然肤色
- 保持主体和构图稳定

## 10. 成本判断

- `color-matcher` 适合低成本、快验证
- `restore-image` 适合作为质量兜底
- 先用小额度测试单张成本，再决定免费额度和 credits 价格

## 11. 结论

Replicate 可以做，而且对这个项目更合适。
第一版最稳的接法是：
- 主模型：`fofr/color-matcher`
- 兜底模型：`flux-kontext-apps/restore-image`
- 异步预测 + webhook 落库 + R2 持久化

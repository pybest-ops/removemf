# 项目控制板

## 当前状态

- 阶段：13-orchestrator
- 总状态：MVP 骨架已生成
- 结论：按 AI 图片恢复工具站推进，先做最小闭环

## DAG

1. research
2. PRD
3. pricing / compliance
4. copy
5. design
6. backend / data
7. frontend
8. SEO / PM / compliance recheck
9. QA
10. launch
11. data review

## 任务拆解

- research：确认需求和竞品
- PRD：定义上传、修复、对比、下载、credits 路径
- pricing / compliance：确认免费额度、credits 定价、免责声明
- copy：冻结首页、上传页、FAQ、结果页文案
- design：确定工具站视觉与上传体验
- backend / data：接入图片处理、任务队列、结果存储
- frontend：搭建上传、预览、结果页
- SEO / PM / compliance recheck：复核索引、schema、合规声明
- QA：检查上传、处理、下载、错误态、移动端
- launch：发布、绑定域名、提交索引、外部宣发
- data review：看转化、处理成功率、成本、反馈

## 推荐技术栈

- 前端：Next.js + Cloudflare Pages
- 后端：Cloudflare Workers
- 存储：R2 + D1
- 队列：Cloudflare Queues
- AI：Replicate `fofr/color-matcher`，兜底 `flux-kontext-apps/restore-image`

## 已定方案

- 匿名 session + credits 账本
- 单图异步处理
- 上传原图、结果图短期存储
- 先只接 Replicate，不做前端可见的多模型切换

## 当前阻塞

- 生产部署、公开发布、索引提交、真实流量监控都需要权限确认后继续

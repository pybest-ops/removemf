# 项目控制板

## 当前状态

- 阶段：13-orchestrator / 流水线返修
- 总状态：MVP 页面和合规草案已补强，生产上线仍 BLOCKED
- 结论：项目已从纯 scaffold 返修为可继续验收的 AI 图片恢复工具站草案，但支付、后端生产化、部署和真实流量仍未授权/未确认

## DAG

1. research：DONE
2. PRD：DONE
3. pricing / compliance：NEEDS_REVIEW
4. copy：DONE
5. design：DONE
6. backend / data：NEEDS_REVIEW
7. frontend：NEEDS_REVIEW
8. SEO / PM / compliance recheck：NEEDS_REVIEW
9. QA：WAITING
10. launch：BLOCKED
11. data review：WAITING

## 任务拆解

- research：确认需求和竞品
- PRD：定义上传、修复、对比、下载、credits 路径
- pricing / compliance：确认免费额度、credits 定价、免责声明、Privacy / Terms / Refund 草案
- copy：冻结首页、上传页、FAQ、结果页文案
- design：确定工具站视觉与上传体验
- backend / data：接入图片处理、任务队列、结果存储；生产化前需单独评审
- frontend：搭建上传、预览、结果页、pricing、FAQ、法律页
- SEO / PM / compliance recheck：复核索引、schema、合规声明、占位文案、PRD 用户任务覆盖
- QA：检查上传、处理、下载、错误态、移动端、法律页和非保证性表达
- launch：发布、绑定域名、提交索引、外部宣发；当前缺授权
- data review：看转化、处理成功率、成本、反馈；上线后执行

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
- 页面表达只承诺 natural / more balanced result，不承诺 recreating the untouched source file

## 当前阻塞

- 生产部署、公开发布、索引提交、真实流量监控都需要权限确认后继续
- paid credits 价格、过期规则、退款窗口和支付服务商未确认
- support email 和最终 retention window 未确认

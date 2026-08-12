# 阻塞日志

| 阻塞项 | 影响 | 解锁动作 | 状态 |
| --- | --- | --- | --- |
| 生产部署授权缺失 | 不能发布真实站点 | 用户明确授权部署 | BLOCKED |
| 域名和索引权限缺失 | 不能绑定域名和提交搜索引擎 | 用户完成 DNS/GSC/Bing 权限配置 | BLOCKED |
| 真实支付策略未确认 | paid credits 只能保持 planned，不可作为生产可购买能力 | 用户确认价格、数量、过期规则、支付服务商、退款窗口 | NEEDS_REVIEW |
| 后端生产持久化未评审 | credits、orders、jobs 不能当生产可信数据 | 单独做后端生产化评审 | NEEDS_REVIEW |
| support email 未确认 | 法律页只能写 MVP 草案，不能提供最终联系渠道 | 用户提供域名邮箱或支持渠道 | NEEDS_REVIEW |
| retention window 未确认 | Privacy 只能写 limited period，不能写最终保留天数 | 用户确认图片和任务记录保留周期 | NEEDS_REVIEW |

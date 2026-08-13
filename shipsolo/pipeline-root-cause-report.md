# 做站流水线断点审计：法律页占位问题

## 问题现象

用户协议、隐私政策、退款政策页面只有标题和 占位文案 文案，不符合 ShipSolo 做站流水线的法律页交付标准。

## 直接证据

- `app/terms/page.tsx` 仍为 `占位服务条款文案`。
- `app/privacy/page.tsx` 仍为 `占位隐私政策文案`。
- `app/refund/page.tsx` 仍为 `占位退款政策文案`。
- `pricing-compliance-notes.md` 只记录“需要 Privacy、Terms、Refund”，没有生成页面正文。
- `compliance-checklist.md` 的合规检查项全部未勾选。
- `stage-status.md` 已把 `pricing / compliance` 标为 `NEEDS_REVIEW`，证据是“合规页占位”。

## 对照流水线要求

`student-site-compliance-pipeline` 阶段要求的交付物包括：

- 合规评估报告
- Privacy / Terms / Cookie / Refund 草稿
- 禁用词 / 风险词清单
- 法律页 route contract
- QA 合规验收点

当前项目只完成了 route scaffold，没有完成草稿、风险词、route contract 和 QA 验收点。

## 根因判断

### 1. 合规阶段被压缩成了“备注”

`pricing-compliance-notes.md` 只写了定价与合规判断，没有进入法律页正文生成。这说明执行时只做了阶段判断，没有调用或完整执行 `student-site-compliance-pipeline`。

### 2. 前端阶段把“有路由”误判成“有页面”

`/privacy`、`/terms`、`/refund` 三个 route 存在，但正文是 占位文案。正常流水线验收应检查法律页内容是否和数据收集、AI、支付、存储一致，而不是只检查 route 不 404。

### 3. QA / compliance recheck 没有执行

如果执行了合规复核，`占位服务条款文案`、`占位隐私政策文案`、`占位退款政策文案` 会被直接判为 P0/P1 问题，因为公开站点不能带 占位文案 法律页。

### 4. Orchestrator 没有用硬闸门阻断

`project-control.md` 写了合规任务，但没有生成原始的 `stage-status.md`、`blocked-log.md`、`handoff.md` 等流水线控制文档。缺少状态板后，占位页面没有被拦截。

## 责任环节

- 第一责任：`04-compliance` 未完成。
- 第二责任：`frontend` 只落了占位 route。
- 第三责任：`SEO / PM / compliance recheck` 和 `QA` 未执行。
- 总控责任：`13-orchestrator` 没有在合规未完成时设置硬阻断。

## 不是根因的项

- 不是 Tailwind、Next.js 或组件能力问题。
- 不是用户协议页面样式问题。
- 不是缺少 Header 导致的观感问题。
- 不是部署问题；源码本身就是占位。

## 修复顺序

1. 执行 `student-site-compliance-pipeline`：基于 PRD、上传图片、AI API、R2 存储、credits、支付草案生成合规报告。
2. 生成 `Privacy / Terms / Refund` 三页草案：明确数据收集、图片处理、第三方服务、AI 结果边界、退款规则。
3. 补法律页 route contract：确认 `/privacy`、`/terms`、`/refund` 的页面职责、必须字段、footer 入口。
4. 更新 `compliance-checklist.md`：把已满足项勾选，未确认项保留 `[待确认]`。
5. 更新 `stage-status.md`：合规页完成后将 `pricing / compliance` 从 `NEEDS_REVIEW` 改为 `DONE` 或 `NEEDS_REVIEW` with explicit open items。
6. 执行 QA / compliance recheck：搜索 `占位文案`，检查法律页不承诺原图恢复，不遗漏上传和 AI 第三方处理。

## 当前结论

当前网站没有按做站流水线完成法律页，是因为流水线只执行到了 MVP scaffold，跳过了 `04-compliance` 的正式交付和后续 QA 闸门。

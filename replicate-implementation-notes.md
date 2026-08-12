# Replicate 实施备注

## 推荐执行顺序

1. 先把 job 表和 R2 存储打通
2. 再写 Replicate prediction 创建接口
3. 再接 webhook 回写 job 状态
4. 再做结果图下载和前端轮询
5. 最后加 credits 扣减和失败重试

## 首版注意点

- 不要让前端直连 Replicate
- 不要把临时 output URL 直接当永久链接
- 不要一开始做模型切换面板
- 不要把“恢复原图”说成百分百还原

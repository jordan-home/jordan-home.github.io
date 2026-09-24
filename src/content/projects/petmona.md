---
title: "PetMona"
summary: "AI 宠物肖像生成电商。免费预览 → 付费 HD 文件 / 实体画框，主打『它们也是家人』的情绪价值。"
year: "2026"
role: "前端 / AI 集成 / 支付"
stack:
  - "Next.js 15"
  - "TypeScript"
  - "Cloudflare Workers"
  - "Stripe"
  - "DALL-E / SD API"
  - "ImageMagick"
  - "Printful API"
demo: "https://petmona.app"
cover: "/illustrations/projects/petmona.webp"
featured: true
order: 2
pubDate: 2026-01-15
category: "engineering"
highlights:
  - "免费预览 → 付费高保真，三档价格带（$3.99 / $36.99 / $79）"
  - "6 种艺术风格预设（文艺复兴油画 / 水彩 / 北欧极简 / 流行艺术 / 浮雕剪影 / 水墨）"
  - "集成 Printful 自动对接美国本土印刷 + 全球物流"
  - "为灰发宠物 / 临终宠物专门设计『温和』风格系列"
---

PetMona 是一个面向北美宠物主人市场的 AI 肖像生成电商。

## 解决的问题

把宠物照片转成『能挂上墙』的艺术品。市场上同类产品订阅制复杂、AI 生成的图常常『不像』，价格也不透明。

## 我的工作

- **前端**：Next.js 15 + App Router，6 种艺术风格的实时预览 + 对比滑块
- **AI 集成**：基于 DALL-E / Stable Diffusion 做了 prompt 模板化，对不同风格 / 不同宠物类型（狗 / 猫 / 鸟 / 兔）做了预调优
- **支付**：Stripe 三档定价（HD 单图 / 8x10 印刷 / 12x16 黑橡木画框），无订阅
- **印刷集成**：通过 Printful API 把订单推送到美国本土印刷 + 直发
- **特殊场景**：为『灰发宠物』 / 『临终宠物』做了『温和』风格预设——情绪价值是这个产品的核心

## 设计原则

无订阅、无月费。用户上传照片，免费看 4 种风格的预览，满意才付。**没有『看起来像但不像』的失望**——水墨 / 剪影等风格刻意把『不像』变成艺术选择。

## 当前状态

2026 年初上线，重点投放 Reddit 宠物社区 + Instagram。
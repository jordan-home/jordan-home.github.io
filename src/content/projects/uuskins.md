---
title: "UUSKINS"
summary: "面向全球 CS2 玩家的皮肤 P2P 交易平台。3.5M+ SKU，0 押金租赁，10 分钟自动交付。"
year: "2024 – 2025"
role: "前端开发工程师"
stack:
  - "Next.js"
  - "TypeScript"
  - "Steam Web API"
  - "WebSocket"
  - "PostgreSQL"
  - "Redis"
  - "Tailwind"
demo: "https://uuskins.com"
cover: "/illustrations/projects/uuskins.webp"
featured: true
order: 3
pubDate: 2024-06-01
category: "engineering"
highlights:
  - "3.5M+ 皮肤 SKU 实时库存索引"
  - "0 押金租赁模式 + P2P 卖家端"
  - "10 分钟 Steam 自动交付（行业平均 1-2 小时）"
  - "支持 FaceIT 接入和欧洲银行入金"
  - "Trustpilot 4.3 / 5.0 用户评分"
---

UUSKINS 是面向全球 CS2 玩家的皮肤 P2P 交易市场，覆盖买卖 + 租赁双业务线。

## 我的角色

前端开发工程师。负责交易流程前端、库存列表性能、卖家端工具。

## 业务背景

CS2 皮肤市场规模数十亿美金，但主流平台（Buff、CSFloat）有两大痛点：
1. **卖家挂单繁琐**：要装 Steam 客户端、配置 API key、跑长链路
2. **买家交付慢**：行业平均 1-2 小时，长得让人以为被骗

UUSKINS 解决方案：
- **0 押金租赁**：降低玩家试用门槛
- **P2P 卖家端**：可视化引导，普通玩家 5 分钟能挂单
- **10 分钟自动交付**：把交易确认 / Steam 通知 / 库存转移做成自动流水线

## 我的工作

- 库存列表页性能优化：3.5M SKU 滚动 + 筛选，IntersectionObserver + 虚拟列表
- 交易流程状态机：买卖双方多个异步事件（Steam 通知、支付确认、库存转移）用统一状态机管理
- 卖家引导流程：分步引导 + 实时校验，把首次挂单成功率从行业 60% 提升到 90%+
- 多语言 + 多币种支持（USD / EUR / CNY）

## 当前状态

2024 年中上线，运营中。Trustpilot 4.3/5.0 评分（基于数百条评价）。
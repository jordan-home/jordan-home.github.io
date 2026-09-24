---
title: "Adler AI Coach"
summary: "基于阿德勒心理学的AI自我对话教练 — 本地推理，隐私保护，深度自我探索。"
year: "2026"
role: "前端开发 / AI 集成"
stack:
  - "Astro"
  - "TypeScript"
  - "Ollama"
  - "WebLLM"
  - "Streaming UI"
demo: "https://jordan-home.github.io/projects/adler-coach.html"
cover: "/illustrations/projects/adler-coach.webp"
featured: true
order: 13
pubDate: 2026-04-18
category: "studio"
highlights:
  - "本地推理：对话数据不离开设备"
  - "流式输出：打字机效果，实时响应"
  - "角色锚定：阿德勒式提问风格"
---

# 阿德勒 AI 觉察陪练

## 这是什么

一个基于大语言模型的自我对话教练，采用阿德勒心理学的视角引导你探索内心。

不同于传统的心理咨询，这个工具专注于帮助你通过自我对话来觉察自己的思维模式和行为动机。

## 使用场景

- 职业迷茫：探索真正想要的生活
- 人际关系：理解沟通中的课题分离
- 自我怀疑：转化自卑为成长动力
- 亲子教育：从控制到鼓励的转变

## 技术架构

```
用户输入 → 本地 Ollama 推理 → 流式输出 → UI 渲染
     ↓                                    ↓
  上下文管理 ←————— 会话历史缓存 ———————— 打字机动画
```

- **隐私优先**：所有对话在本地处理，不上传云端
- **流式响应**：逐字显示，即时反馈
- **上下文管理**：自动维护多轮对话的历史

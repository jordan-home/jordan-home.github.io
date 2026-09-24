---
title: "ChatGPT API 调用入门"
pubDate: 2026-01-22
description: "OpenAI Chat Completions API 的基础调用、流式输出、token 控制、温度参数 — 第一次接 LLM 不踩坑。"
category: technology
tags: ["AI", "API"]
---

OpenAI 的 Chat Completions API 是接入 LLM 最常用的入口。本文梳理实战要点。

## 基础调用

```python
from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {"role": "system", "content": "你是一个助手。"},
        {"role": "user", "content": "你好"},
    ],
)
print(response.choices[0].message.content)
```

## 关键参数

### temperature

控制输出的随机性。0 = 确定性，1 = 最大随机。一般 0.7。

### max_tokens

限制响应长度，省钱。

### top_p

nucleus sampling。一般不用，跟 temperature 二选一。

## 流式输出

```python
stream = client.chat.completions.create(
    model="gpt-4",
    messages=[...],
    stream=True,
)
for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="")
```

## 注意事项

- **不要把 API key 写进前端代码**
- **控制 token 数**：长对话要压缩历史
- **缓存常见响应**：同样 prompt 多次请求直接用缓存
- **失败重试**：网络问题 / rate limit 都要有重试

## 上下文管理

长对话的核心：把历史消息压到 token 限制内。

```python
def trim_messages(messages, max_tokens=4000):
    # 保留 system + 最近 N 条
    ...
```

简单，但每个项目都会重写一遍。
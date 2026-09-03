---
title: ChatGPT API 调用入门
date: 2026-01-22
description: OpenAI ChatGPT API 完整调用指南：获取 API Key、构建请求参数、流式响应处理、成本控制与最佳实践。
tags:
  - AI
  - API
  - OpenAI
categories:
  - 技术笔记
---

## 前言

OpenAI API 为开发者提供了访问 GPT 模型的能力。本文介绍如何调用 ChatGPT API，包括环境配置、请求格式和实际应用。

## 准备工作

### 1. 获取 API Key

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册账号并绑定支付方式
3. 在 API Keys 页面创建新的密钥

**注意**：API Key 只显示一次，请妥善保存！

### 2. 安装 OpenAI SDK

```bash
npm install openai
# 或
yarn add openai
```

## 基本调用

### 1. Node.js 调用

```javascript
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: 'your-api-key'
});

async function chat() {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: '你是一个专业的程序员助手'
      },
      {
        role: 'user',
        content: '用 JavaScript 写一个快速排序函数'
      }
    ],
    temperature: 0.7,
    max_tokens: 1000
  });
  
  console.log(response.choices[0].message.content);
}

chat();
```

### 2. 使用环境变量

```bash
# .env 文件
OPENAI_API_KEY=your-api-key
```

```javascript
require('dotenv').config();
const OpenAI = require('openai');

const client = new OpenAI();
```

### 3. cURL 调用

```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## 参数详解

### model

```javascript
// 推荐模型
model: 'gpt-4o'        // 最新版 GPT-4
model: 'gpt-4-turbo'   // GPT-4 快速版
model: 'gpt-3.5-turbo' // 性价比高
```

### messages

```javascript
messages: [
  {
    role: 'system',     // 系统提示词
    content: '你是一个有帮助的助手'
  },
  {
    role: 'user',      // 用户消息
    content: '问题内容'
  },
  {
    role: 'assistant',  // AI 回复（用于对话历史）
    content: '回复内容'
  }
]
```

### temperature

控制输出的随机性：

```javascript
temperature: 0  // 确定性输出
temperature: 0.7  // 平衡（推荐）
temperature: 2  // 高度随机
```

### max_tokens

限制输出长度：

```javascript
max_tokens: 100   // 最多 100 个 token
max_tokens: -1    // 不限制
```

### top_p

与 temperature 类似，控制采样：

```javascript
top_p: 0.1   // 更保守
top_p: 1     // 不限制（默认）
```

### functions（函数调用）

```javascript
const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{role: 'user', content: '北京今天天气如何？'}],
  tools: [
    {
      type: 'function',
      function: {
        name: 'get_weather',
        description: '获取指定城市的天气',
        parameters: {
          type: 'object',
          properties: {
            city: {
              type: 'string',
              description: '城市名称'
            }
          },
          required: ['city']
        }
      }
    }
  ]
});

// 返回结果
console.log(response.choices[0].message.tool_calls);
```

## 实际应用示例

### 1. 智能客服机器人

```javascript
const conversation = [
  {role: 'system', content: '你是电商客服，请友好地回答用户问题'}
];

async function handleMessage(userMessage) {
  conversation.push({role: 'user', content: userMessage});
  
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: conversation,
    temperature: 0.7
  });
  
  const reply = response.choices[0].message.content;
  conversation.push({role: 'assistant', content: reply});
  
  return reply;
}
```

### 2. 代码审查

```javascript
async function reviewCode(code) {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: '你是一个资深代码审查员，请审查代码并提出改进建议'
      },
      {
        role: 'user',
        content: `请审查以下代码：\n\n${code}`
      }
    ],
    temperature: 0.3
  });
  
  return response.choices[0].message.content;
}
```

### 3. 内容生成

```javascript
async function generateBlogPost(topic) {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: '你是一个专业博主，擅长写技术文章'
      },
      {
        role: 'user',
        content: `请写一篇关于 "${topic}" 的技术博客，不少于 1000 字`
      }
    ],
    temperature: 0.8,
    max_tokens: 2000
  });
  
  return response.choices[0].message.content;
}
```

## 流式输出（Streaming）

```javascript
const stream = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{role: 'user', content: '写一个故事'}],
  stream: true
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content || '';
  process.stdout.write(content);
}
```

## 错误处理

```javascript
async function safeChat(prompt) {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [{role: 'user', content: prompt}]
    });
    return response.choices[0].message.content;
  } catch (error) {
    if (error.code === 'insufficient_quota') {
      return 'API 配额不足，请检查账户余额';
    }
    if (error.code === 'rate_limit_exceeded') {
      // 等待后重试
      await sleep(5000);
      return safeChat(prompt);
    }
    console.error('Error:', error.message);
    throw error;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

## 成本优化

### Token 计算

```javascript
// 估算成本
// GPT-4o: $5/1M 输入，$15/1M 输出
// GPT-3.5-turbo: $0.5/1M 输入，$1.5/1M 输出

const inputTokens = 1000;
const outputTokens = 500;

const cost = (inputTokens / 1000000) * 0.5 + 
             (outputTokens / 1000000) * 1.5;
console.log(`预估成本: $${cost.toFixed(4)}`);
```

### 优化建议

1. **精简提示词**：删除冗余内容
2. **使用摘要**：对长对话进行摘要
3. **选择合适模型**：简单任务用 GPT-3.5
4. **设置 max_tokens**：避免过度输出

## 总结

- **API Key**：从 OpenAI 平台获取
- **基本调用**：model + messages + response
- **参数**：temperature、max_tokens 等
- **流式输出**：提升用户体验
- **成本控制**：选择合适模型，精简提示词

掌握这些基础，你就可以开始构建 AI 应用了！

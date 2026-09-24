---
title: "GraphQL 初探"
pubDate: 2021-03-10
description: "GraphQL 入门：为什么需要它，跟 REST 比有什么优势，怎么上手。"
category: technology
tags: ["GraphQL", "API"]
---

GraphQL 是 Facebook 2015 年开源的 API 查询语言。这篇文章记录初学的关键点。

## 什么是 GraphQL

一种 API 查询语言，让客户端按需请求数据，避免 REST 的 over-fetching / under-fetching 问题。

## 核心概念

- **Schema**：用 SDL 写的数据类型定义
- **Query**：客户端发起的读取请求
- **Mutation**：客户端发起的写入请求
- **Resolver**：服务端每个字段对应的取数函数

## 一个简单例子

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Query {
  user(id: ID!): User
}
```

## 跟 REST 比

| 维度 | REST | GraphQL |
|---|---|---|
| 端点数 | 多 | 1 个 |
| 数据形状 | 服务端定 | 客户端定 |
| 版本管理 | URL 加版本 | Schema 演进 |
| 缓存 | HTTP 缓存 | 按场景处理 |

## 什么时候用

- 多端共用 API（Web / iOS / Android）
- 字段组合复杂
- 频繁迭代的字段

## 什么时候不用

- 简单 CRUD
- 文件下载等特殊请求
- 团队没有学习时间

入门不难，但要把 Schema 设计好需要时间。
---
title: "设计模式之单例模式"
pubDate: 2026-01-15
description: "单例模式：确保一个类只有一个实例，并提供全局访问点。"
category: technology
tags: ["设计模式", "前端"]
---

单例是设计模式里最简单的之一。

## 核心要点

1. 构造函数私有化
2. 提供一个静态方法返回唯一实例
4. 全局都可以通过这个方法访问

## 经典实现

```javascript
class Singleton {
  constructor() {
    if (Singleton.instance) {
      return Singleton.instance;
    }
    Singleton.instance = this;
    this.data = [];
  }

  static getInstance() {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}
```

## 实际使用

- 全局状态管理（Redux store, Vuex store）
- 配置对象
- 日志对象
- 浏览器中的 window / document

## 注意点

- **多线程环境**：要加锁，否则可能产生多个实例
- **测试**：单例难以 mock，不方便单元测试
- **滥用**：不是所有类都该单例；该有多个实例时别强行单例

## ES Module 方案

现代 JS 用 ES Module 天然单例：

```javascript
// counter.js
export const counter = { value: 0 };

// app.js
import { counter } from './counter.js';
counter.value += 1;  // 整个应用共享一个 counter
```

比 class 单例简单太多了 —— **优先用 module 单例**。
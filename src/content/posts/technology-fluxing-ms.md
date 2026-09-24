---
title: "代码中的设计模式：那些面试和工作都用得上的东西"
pubDate: 2026-04-14
description: "面试 + 工作中最高频的设计模式：单例 / 工厂 / 策略 / 装饰器 / 观察者 / 代理。"
category: technology
tags: ["设计模式", "JavaScript"]
---

设计模式不用死记硬背，**理解场景**最重要。

## 单例模式（Singleton）

**场景**：全局状态管理、配置对象、数据库连接池。

```javascript
class Config {
  static instance = null;
  static getInstance() {
    if (!Config.instance) Config.instance = new Config();
    return Config.instance;
  }
}
```

## 工厂模式（Factory）

**场景**：多种 driver 创建（数据库、UI 组件）、根据参数决定具体类型。

```javascript
function createParser(type) {
  switch (type) {
    case 'csv': return new CsvParser();
    case 'json': return new JsonParser();
  }
}
```

## 策略模式（Strategy）

**场景**：算法的多种实现，根据情况选一种（支付方式、排序算法）。

```javascript
const strategies = {
  alipay: (amount) => /* 支付宝支付 */,
  wechat: (amount) => /* 微信支付 */,
};

function pay(method, amount) {
  strategies[method](amount);
}
```

## 装饰器模式（Decorator）

**场景**：动态加功能（日志、缓存、权限）。

```javascript
function withLogging(fn) {
  return function(...args) {
    console.log(`Calling ${fn.name}`);
    return fn(...args);
  };
}

const fetchUser = withLogging(async (id) => { /* ... */ });
```

## 观察者模式（Observer）

**场景**：事件订阅、响应式更新。

```javascript
class EventBus {
  constructor() { this.listeners = {}; }
  on(event, handler) {
    (this.listeners[event] ??= []).push(handler);
  }
  emit(event, data) {
    this.listeners[event]?.forEach(h => h(data));
  }
}
```

## 代理模式（Proxy）

**场景**：懒加载、缓存、权限、Vue 响应式。

```javascript
const cached = new Proxy(api, {
  get(target, key) {
    if (!cache[key]) cache[key] = target[key]();
    return cache[key];
  },
});
```

## 适配器模式（Adapter）

**场景**：让不兼容的接口一起工作（旧 API 包成新 API）。

## 模板方法模式（Template Method）

**场景**：流程固定，步骤可替换（React 组件继承、生命周期方法）。

## 实战经验

### 1. 不要为了用模式而用

简单 `new` 更清楚的时候，强行套模式反而糟糕。

### 2. 模式是名字，不是答案

知道"这是观察者模式"的最大价值是**和别人沟通**时效率高，不是代码变得更对。

### 3. 现代 JS 替代很多

- ES Module = 天然单例
- Proxy = 代理模式
- EventTarget = 观察者模式
- 函数式 = 策略模式

### 4. 学习顺序

单例 → 工厂 → 策略 → 装饰器 → 观察者 → 代理 → 模板方法 → 适配器 → 组合 → 命令 → 责任链

模式是**常见问题的命名**。理解场景，遇到能用时自然会用。
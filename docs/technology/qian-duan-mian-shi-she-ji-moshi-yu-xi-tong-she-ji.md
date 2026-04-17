---
title: 前端面试进阶：设计模式与系统设计实战指南
date: 2026-04-14
tags:
  - 前端
  - 面试
  - 设计模式
categories:
  - 技术笔记
---
## 前言

前端面试的难点不在于你会多少 API，而在于**能不能把零散的知识点连成线**，在面试中讲出一个完整的故事。

这篇文章是基于我在准备面试过程中的实战笔记整理，重点覆盖高频考点：设计模式、系统设计、浏览器原理。

## 设计模式：不是为了背，是为了理解

### 为什么面试必问设计模式

面试官问设计模式，不是想听你背教科书，而是：

1. **看你有没有架构思维**——能不能从具体代码里抽象出通用结构
2. **看你能不能说清楚 trade-off**——知道这个模式好，也知道它什么时候不该用
3. **看你有没有读过源码**——Vue3、React、Redux 里面全是设计模式

### 代理模式 vs 装饰器模式：最常被问的对比

```
代理模式：控制访问（你不知道真实对象存在）
装饰器模式：增强功能（你知道并主动扩展）
```

**实战理解：**

Vue3 的 reactive 是代理——你访问 `obj.name`，实际上是 `Proxy` 在中间拦截，你不知道 Proxy 做了什么处理。

React 的 HOC（高阶组件）是装饰器——你把 `Button` 传进去，出来是 `withLogger(Button)`，你知道你在增强它。

**面试话术：**
> "代理模式适合做拦截和控制，比如 Vue3 的响应式；装饰器模式适合做功能增强，比如 React 的 HOC。两者区别在于访问者是否知道被包装。"

### 观察者模式：Vue 和 React 的事件基石

```
Subject（被观察者）
  ↓ 订阅
Observer（观察者）
  ↓ 状态变化通知
多个 Observer 收到更新
```

**实际应用：**
- Vue3 的依赖收集：data 变化 → 自动通知所有使用处
- EventBus：组件间通信
- Redux：状态变化 → 通知所有 subscriber

**实现一个简化版：**
```javascript
class EventBus {
  constructor() {
    this.subscribers = {}
  }
  on(event, callback) {
    (this.subscribers[event] || (this.subscribers[event] = [])).push(callback)
  }
  emit(event, data) {
    (this.subscribers[event] || []).forEach(cb => cb(data))
  }
  off(event, callback) {
    const cbs = this.subscribers[event]
    if (cbs) this.subscribers[event] = cbs.filter(cb => cb !== callback)
  }
}
```

## 系统设计：从组件到架构

### 前端架构的三个层次

**1. 组件设计：单个组件的内部结构**
- 状态管理：组件自己管理 vs 全局共享
- 副作用处理：useEffect 的依赖设计
- 复用抽象：HOC vs Render Props vs Hooks

**2. 页面设计：多个组件的组合**
- 数据流：自上而下 props drilling vs Context vs 状态管理
- 副作用边界：哪些在客户端，哪些在服务端
- 路由设计：按业务域分还是按页面分

**3. 应用架构：整体技术选型和模块划分**
- 构建工具：Vite vs Webpack
- 状态管理：Redux vs Zustand vs Jotai
- 服务端方案：SSR vs SSG vs CSR

### 性能优化的本质

性能优化不是炫技，而是回答一个问题：

> **用户感知到卡顿的瓶颈在哪里？**

常见瓶颈和解决方案：

| 瓶颈 | 诊断 | 解决 |
|------|------|------|
| 首屏慢 | 网络请求多/大 | 代码分割、CDN、压缩 |
| 操作卡 | JS 主线程阻塞 | Web Worker、requestIdleCallback |
| 白屏 | SSR/SSG 不够 | 预渲染、静态化 |
| 重排/重绘 | 频繁 DOM 操作 | 虚拟列表、will-change |

## 浏览器原理：说不清楚不算真的会

### 渲染流程

```
HTML → DOM Tree
CSS  → CSSOM Tree
↓
Render Tree（合并）
↓
Layout（布局）
↓
Paint（绘制）
↓
Composite（合成）
```

理解这个流程才能理解为什么 `transform` 比 `top/left` 性能好——因为 `transform` 跳过了 Layout，直接到 Composite。

### 事件循环：说清楚不容易

```
执行栈 → 所有同步任务
  ↓
MicroTask（Promise.then, MutationObserver）
  ↓
RAF（requestAnimationFrame）
  ↓
Task（setTimeout, setInterval）
  ↓
渲染
```

一个常考的问题：**宏任务和微任务的区别**？

微任务是**对本轮任务结果的补充**，比如 Promise.then 在本轮事件循环结束前执行；宏任务是**下一轮事件循环**才执行。

## 准备面试的策略

**不要背，要练。**

我的做法：
1. 每个知识点，先自己实现一遍（比如自己写一个 EventBus）
2. 每次面试结束后，把被问到的题目记下来，下次重点复习
3. 对着镜子或录音讲出来——能讲清楚才是真的理解

---

*本文是我在前端面试准备过程中的实战笔记，欢迎交流。*

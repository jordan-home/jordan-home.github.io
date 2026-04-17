---
title: 代码中的设计模式：那些面试和工作都用得上的东西
date: 2026-04-14
tags:
  - 设计模式
  - JavaScript
  - 架构
categories:
  - IT
---
## 前言

设计模式被很多人学成了「面试八股文」，但它真正有用的地方是**帮你建立代码结构的直觉**。

这篇文章不是模式字典，而是关于**什么时候该用什么模式**的实战笔记。

## 为什么学设计模式

三个理由：

1. **面试高频**：代理模式、装饰器模式、观察者模式是前端面试老三样
2. **读懂框架源码**：React、Vue 内部大量使用设计模式，不懂就读不懂
3. **写可维护的代码**：知道模式的人，写出来的东西更好扩展

## 最实用的几种模式

### 1. 代理模式（Proxy）：控制访问

**核心思想**：不直接访问对象，而是通过代理对象。

**实际场景**：
```javascript
// Vue3 的响应式系统就是一个代理模式
const obj = new Proxy(data, {
  get(target, key) {
    track(target, key) // 依赖收集
    return target[key]
  },
  set(target, key, value) {
    trigger(target, key) // 触发更新
    return Reflect.set(target, key, value)
  }
})
```

**什么时候用**：当你需要控制对对象的访问——读取时做拦截，修改时做校验或通知。

**和装饰器的区别**：代理是「你不知道真实对象存在」，装饰器是「你知道并且想增强它」。

### 2. 装饰器模式（Decorator）：动态增强

**核心思想**：不修改原有类，给它增加新功能。

**实际场景**：
```javascript
// React HOC（高阶组件）本质是装饰器模式
function withLogger(Component) {
  return function(props) {
    console.log('Rendering:', Component.name)
    return <Component {...props} />
  }
}

const EnhancedButton = withLogger(Button)
```

**什么时候用**：当你需要在不修改原组件的情况下，给组件增加日志、权限校验、主题等横切关注点。

### 3. 观察者模式（Observer）：一对多依赖

**核心思想**：当一个对象状态变化，所有依赖它的对象都会收到通知。

**实际场景**：
```javascript
// Vue 的响应式本质上就是观察者模式
class Observer {
  constructor() {
    this.subscribers = []
  }
  subscribe(fn) {
    this.subscribers.push(fn)
  }
  notify(data) {
    this.subscribers.forEach(fn => fn(data))
  }
}
```

**什么时候用**：表单验证联动、组件间通信、事件总线。

### 4. 单例模式（Singleton）：全局唯一

**核心思想**：一个类只有一个实例。

**实际场景**：
```javascript
// Redux store 就是单例
const store = createStore(reducer)

// axios 实例也是
const api = axios.create({ baseURL: '...' })
```

**什么时候用**：全局状态管理、配置中心、日志实例。**注意**：单例是方便，但它也是隐式的全局状态，用多了会导致难以追踪的数据流。

### 5. 工厂模式（Factory）：封装创建逻辑

**核心思想**：不直接 new，而是通过工厂函数创建。

**实际场景**：
```javascript
// React 的 createElement 本质是工厂
function createElement(type, props, ...children) {
  return { type, props, children }
}

// Vue 的 h() 函数也是
```

**什么时候用**：当你需要根据不同条件创建不同类型的对象，且创建逻辑可能变化。

## 一个重要的认知

**设计模式不是银弹。**

很多人学完设计模式之后，看什么都像模式，想套用它。这是不对的。

模式是**对重复问题的通用解**，而不是所有问题的解。

Peter 的建议是：**先写出来，再重构出模式**。而不是一开始就想好要用哪个模式。

## 怎么学才有用

1. **从框架源码里学**：Vue3 的 reactive、React 的 HOC、Redux 的实现——带着「这里用了什么模式」去看
2. **自己写一遍**：看完代理模式，自己实现一个 Vue3 reactive
3. **在实际项目中识别**：下次看到组件之间的通信，想想这是不是观察者模式

---

*注：本文是《设计模式的艺术》阅读笔记 + 个人实战经验整理。*

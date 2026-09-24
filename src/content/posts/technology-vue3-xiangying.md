---
title: "Vue3 响应式原理深度解析"
pubDate: 2026-02-06
description: "Vue 3 响应式 API：Proxy 替代 Object.defineProperty、ref / reactive / computed / watch 的实现细节。"
category: technology
tags: ["Vue", "响应式"]
---

Vue 3 把响应式系统用 Proxy 重写，从根本上解决了 Vue 2 的几个痛点。

## 核心：Proxy

```javascript
const reactive = (target) => new Proxy(target, {
  get(target, key, receiver) {
    track(target, key);  // 依赖收集
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    Reflect.set(target, key, value, receiver);
    trigger(target, key);  // 触发更新
  },
});
```

比 `Object.defineProperty` 强：
- 能监听**新增/删除属性**
- 能监听**数组变化**（不用 hack）
- 性能更好

## ref 和 reactive

- `ref(value)`：把基本类型 / 对象包成响应式对象，通过 `.value` 访问
- `reactive(obj)`：把对象的所有属性变响应式

内部都通过 Proxy 实现。

## computed

惰性求值 + 自动追踪依赖：

```javascript
const fullName = computed(() => `${firstName.value} ${lastName.value}`);
```

只有依赖变化时才重新计算。带缓存。

## watch 和 watchEffect

- `watch()` 监听特定响应式数据
- `watchEffect()` 自动追踪函数内的依赖

## 常见坑

- **解构会丢失响应性**：

```javascript
const state = reactive({ count: 0 });
const { count } = state;  // 不再响应了
```

解构前用 `toRefs`：

```javascript
const { count } = toRefs(state);
```

- **整个对象替换**：

```javascript
state = { count: 1 };  // 不会更新（reactive 不接管变量本身）
state.count = 1;        // 会更新
```

理解 Proxy 行为，响应式才不会出 bug。
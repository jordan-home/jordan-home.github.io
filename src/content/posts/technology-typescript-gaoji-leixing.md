---
title: "TypeScript 高级类型"
pubDate: 2026-01-08
description: "TypeScript 高级类型系统：泛型、类型守卫、映射类型、模板字面量类型 — 用对了能消灭 80% 运行时错误。"
category: technology
tags: ["TypeScript", "前端"]
---

TypeScript 的真正威力在于类型系统的高级特性。这篇文章梳理实战中用得最多的几种。

## 泛型

类型参数化，提高复用：

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
```

## 类型守卫

运行时检查 + 类型收窄：

```typescript
function isString(x: unknown): x is string {
  return typeof x === 'string';
}
```

## 映射类型

从一个类型派生另一个：

```typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

## 模板字面量类型

字符串字面量也能参与类型：

```typescript
type Event = 'click' | 'focus';
type EventHandler = `on${Capitalize<Event>}`;
```

## 条件类型

类型层面的三元：

```typescript
type IsString<T> = T extends string ? true : false;
```

## 工具类型

`Partial<T>`, `Pick<T, K>`, `Omit<T, K>`, `Required<T>`, `Record<K, V>` 这些是日常会用到的。

掌握这些，你就能写出**真正可靠**的类型代码。
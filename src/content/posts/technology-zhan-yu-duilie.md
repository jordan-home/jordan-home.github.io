---
title: "栈与队列：数据结构基础"
pubDate: 2026-01-26
description: "栈（LIFO）和队列（FIFO）的原理、JavaScript 实现、典型应用。"
category: technology
tags: ["数据结构", "算法"]
---

栈和队列是最基础的数据结构，应用极广。

## 栈（Stack）

LIFO — Last In First Out。

```javascript
class Stack {
  constructor() { this.items = []; }
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
  isEmpty() { return this.items.length === 0; }
}
```

应用：函数调用栈、撤销/重做、括号匹配、浏览器前进后退。

## 队列（Queue）

FIFO — First In First Out。

```javascript
class Queue {
  constructor() { this.items = []; }
  enqueue(item) { this.items.push(item); }
  dequeue() { return this.items.shift(); }  // O(n)
  isEmpty() { return this.items.length === 0; }
}
```

`shift()` 是 O(n)，生产环境用循环队列或双端队列。

应用：任务调度、消息队列、宽度优先搜索。

## 双端队列（Deque）

两端都能插入删除。

应用：滑动窗口、最大/最小队列。

## 实际选择

- 简单暂存：数组就行
- 性能敏感：用链表实现
- 高并发：用专业的库（Java 的 ConcurrentLinkedQueue）

理解栈和队列，是理解其他算法的基础（DFS 用栈，BFS 用队列）。
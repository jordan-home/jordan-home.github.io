---
title: 栈与队列：数据结构基础
date: 2026-01-26
tags:
  - 数据结构
  - 算法
categories:
  - IT
---
## 前言

栈（Stack）和队列（Queue）是两种最基本的线性数据结构，广泛应用于算法和系统设计中。

## 栈（Stack）

### 概念

栈是一种**后进先出（LIFO, Last In First Out）**的数据结构。

```
栈示意图：
    ┌───┐
    │ 5 │  ← 栈顶（最后入栈）
    ├───┤
    │ 3 │
    ├───┤
    │ 1 │  ← 栈底（最先入栈）
    └───┘
```

### 操作

- **push**：入栈（添加到栈顶）
- **pop**：出栈（移除栈顶元素）
- **peek**：查看栈顶元素
- **isEmpty**：判断是否为空

### JavaScript 实现

```javascript
class Stack {
  constructor() {
    this.items = [];
  }
  
  // 入栈
  push(element) {
    this.items.push(element);
  }
  
  // 出栈
  pop() {
    if (this.items.length === 0) {
      return undefined;
    }
    return this.items.pop();
  }
  
  // 查看栈顶
  peek() {
    return this.items[this.items.length - 1];
  }
  
  // 是否为空
  isEmpty() {
    return this.items.length === 0;
  }
  
  // 大小
  size() {
    return this.items.length;
  }
  
  // 清空
  clear() {
    this.items = [];
  }
}

// 使用
const stack = new Stack();
stack.push(1);
stack.push(3);
stack.push(5);
console.log(stack.pop()); // 5
console.log(stack.peek()); // 3
```

### 应用场景

#### 1. 函数调用栈

```javascript
// 递归调用本质就是栈
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

// 调用过程：
// factorial(3)
// 3 * factorial(2)
// 3 * 2 * factorial(1)
// 3 * 2 * 1
// 6
```

#### 2. 括号匹配

```javascript
function isValidBracket(s) {
  const stack = new Stack();
  const pairs = {
    ')': '(',
    ']': '[',
    '}': '{'
  };
  
  for (const char of s) {
    if (['(', '[', '{'].includes(char)) {
      stack.push(char);
    } else if ([')', ']', '}'].includes(char)) {
      if (stack.isEmpty() || stack.pop() !== pairs[char]) {
        return false;
      }
    }
  }
  
  return stack.isEmpty();
}

console.log(isValidBracket('()[]{}')); // true
console.log(isValidBracket('([)]'));  // false
```

#### 3. 浏览器历史记录

```javascript
// 前进/后退按钮就是栈的应用
class BrowserHistory {
  constructor() {
    this.backStack = new Stack();
    this.forwardStack = new Stack();
  }
  
  visit(url) {
    this.backStack.push(url);
    this.forwardStack.clear();
  }
  
  back() {
    if (this.backStack.size() <= 1) return null;
    this.forwardStack.push(this.backStack.pop());
    return this.backStack.peek();
  }
  
  forward() {
    if (this.forwardStack.isEmpty()) return null;
    const url = this.forwardStack.pop();
    this.backStack.push(url);
    return url;
  }
}
```

## 队列（Queue）

### 概念

队列是一种**先进先出（FIFO, First In First Out）**的数据结构。

```
队列示意图：
    入队 → [1] [3] [5] [7] → 出队
           ↑           ↑
         队首         队尾
```

### 操作

- **enqueue**：入队（添加到队尾）
- **dequeue**：出队（移除队首元素）
- **front**：查看队首元素
- **isEmpty**：判断是否为空

### JavaScript 实现

```javascript
class Queue {
  constructor() {
    this.items = [];
  }
  
  // 入队
  enqueue(element) {
    this.items.push(element);
  }
  
  // 出队
  dequeue() {
    if (this.items.length === 0) {
      return undefined;
    }
    return this.items.shift();
  }
  
  // 查看队首
  front() {
    return this.items[0];
  }
  
  // 是否为空
  isEmpty() {
    return this.items.length === 0;
  }
  
  // 大小
  size() {
    return this.items.length;
  }
}
```

### 优先队列

```javascript
class PriorityQueue {
  constructor() {
    this.items = [];
  }
  
  enqueue(element, priority) {
    const queueElement = { element, priority };
    let added = false;
    
    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }
    
    if (!added) {
      this.items.push(queueElement);
    }
  }
  
  dequeue() {
    return this.items.shift()?.element;
  }
}

// 使用
const pq = new PriorityQueue();
pq.enqueue('任务A', 2);
pq.enqueue('任务B', 1);
pq.enqueue('任务C', 3);
console.log(pq.dequeue()); // 任务B
```

### 应用场景

#### 1. 任务调度

```javascript
class TaskScheduler {
  constructor() {
    this.queue = new Queue();
  }
  
  addTask(task) {
    this.queue.enqueue(task);
  }
  
  executeNext() {
    const task = this.queue.dequeue();
    if (task) {
      task();
    }
  }
  
  executeAll() {
    while (!this.queue.isEmpty()) {
      this.executeNext();
    }
  }
}
```

#### 2. 广度优先搜索（BFS）

```javascript
function bfs(graph, start) {
  const queue = new Queue();
  const visited = new Set();
  
  queue.enqueue(start);
  visited.add(start);
  
  const result = [];
  
  while (!queue.isEmpty()) {
    const vertex = queue.dequeue();
    result.push(vertex);
    
    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.enqueue(neighbor);
      }
    }
  }
  
  return result;
}

// 使用
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

console.log(bfs(graph, 'A')); // ['A', 'B', 'C', 'D', 'E', 'F']
```

#### 3. 消息队列

```javascript
class MessageQueue {
  constructor() {
    this.queue = new Queue();
    this.handlers = [];
  }
  
  subscribe(handler) {
    this.handlers.push(handler);
  }
  
  publish(message) {
    this.queue.enqueue(message);
    this.process();
  }
  
  process() {
    while (!this.queue.isEmpty()) {
      const message = this.queue.dequeue();
      this.handlers.forEach(handler => handler(message));
    }
  }
}
```

## 栈与队列对比

| 特性 | 栈 | 队列 |
|------|-----|------|
| 原则 | LIFO（后进先出） | FIFO（先进先出） |
| 操作 | push/pop | enqueue/dequeue |
| 队首 | 一端 | 两端 |
| 应用 | 递归、撤销、历史记录 | 任务调度、BFS、消息队列 |

## 实际使用建议

### 1. 使用数组作为底层实现

```javascript
// 栈：push + pop（高效）
// 队列：unshift + pop（低效）
//      使用指针优化更好
```

### 2. 注意边界条件

```javascript
// 空栈/空队列操作
pop();    // 返回 undefined
dequeue(); // 返回 undefined
```

### 3. 选择合适的数据结构

- 需要**撤销**功能 → 栈
- 需要**公平处理** → 队列
- 需要**优先级** → 优先队列

## 总结

- **栈**：后进先出，push/pop
- **队列**：先进先出，enqueue/dequeue
- **栈应用**：函数调用、括号匹配、历史记录
- **队列应用**：任务调度、BFS、消息队列
- 理解这两种数据结构是学习更复杂算法的基础

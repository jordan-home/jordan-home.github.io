---
title: BFS 与 DFS 算法详解
date: 2026-03-05
tags:
  - 算法
  - BFS
  - DFS
categories:
  - IT
---

## 前言

广度优先搜索（BFS）和深度优先搜索（DFS）是图遍历的两种基本算法，广泛应用于路径查找、拓扑排序等问题。

## BFS vs DFS

| 特性 | BFS | DFS |
|------|-----|-----|
| 全称 | Breadth-First Search | Depth-First Search |
| 实现 | 队列 | 栈/递归 |
| 特点 | 层层遍历 | 一条道走到黑 |
| 空间 | O(宽度) | O(深度) |
| 适用 | 最短路径 | 拓扑排序 |

## BFS（广度优先搜索）

### 基本实现

```javascript
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];
  
  visited.add(start);
  
  while (queue.length > 0) {
    const vertex = queue.shift();
    result.push(vertex);
    
    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}
```

### 最短路径

```javascript
function bfsShortestPath(graph, start, end) {
  if (start === end) return [start];
  
  const visited = new Set([start]);
  const queue = [[start]];
  
  while (queue.length > 0) {
    const path = queue.shift();
    const vertex = path[path.length - 1];
    
    for (const neighbor of graph[vertex] || []) {
      if (neighbor === end) {
        return [...path, neighbor];
      }
      
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([...path, neighbor]);
      }
    }
  }
  
  return -1; // 无路径
}
```

### 二叉树 BFS

```javascript
function levelOrder(root) {
  if (!root) return [];
  
  const result = [];
  const queue = [root];
  
  while (queue.length > 0) {
    const level = [];
    const levelSize = queue.length;
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      level.push(node.val);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    result.push(level);
  }
  
  return result;
}
```

## DFS（深度优先搜索）

### 递归实现

```javascript
function dfs(graph, start, visited = new Set()) {
  visited.add(start);
  console.log(start);
  
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}
```

### 迭代实现（栈）

```javascript
function dfsIterative(graph, start) {
  const visited = new Set();
  const stack = [start];
  
  while (stack.length > 0) {
    const vertex = stack.pop();
    
    if (!visited.has(vertex)) {
      visited.add(vertex);
      console.log(vertex);
      
      // 反向入栈保证顺序
      for (const neighbor of [...graph[vertex]].reverse()) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
        }
      }
    }
  }
}
```

### 二叉树 DFS

```javascript
// 前序遍历
function preorder(root, result = []) {
  if (!root) return result;
  result.push(root.val);
  preorder(root.left, result);
  preorder(root.right, result);
  return result;
}

// 中序遍历
function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}

// 后序遍历
function postorder(root, result = []) {
  if (!root) return result;
  postorder(root.left, result);
  postorder(root.right, result);
  result.push(root.val);
  return result;
}
```

## 实战应用

### 1. 岛屿数量

```javascript
function numIslands(grid) {
  if (!grid.length) return 0;
  
  let count = 0;
  const rows = grid.length;
  const cols = grid[0].length;
  
  function dfs(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === '0') {
      return;
    }
    
    grid[r][c] = '0'; // 标记已访问
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === '1') {
        count++;
        dfs(r, c);
      }
    }
  }
  
  return count;
}
```

### 2. 课程表（拓扑排序）

```javascript
function canFinish(numCourses, prerequisites) {
  const graph = Array.from({ length: numCourses }, () => []);
  const inDegree = Array(numCourses).fill(0);
  
  // 构建图
  for (const [course, prereq] of prerequisites) {
    graph[prereq].push(course);
    inDegree[course]++;
  }
  
  // BFS
  const queue = [];
  for (let i = 0; i < numCourses; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }
  
  let count = 0;
  while (queue.length > 0) {
    const course = queue.shift();
    count++;
    
    for (const next of graph[course]) {
      inDegree[next]--;
      if (inDegree[next] === 0) queue.push(next);
    }
  }
  
  return count === numCourses;
}
```

### 3. 平衡二叉树

```javascript
function isBalanced(root) {
  function height(node) {
    if (!node) return 0;
    
    const left = height(node.left);
    if (left === -1) return -1;
    
    const right = height(node.right);
    if (right === -1) return -1;
    
    if (Math.abs(left - right) > 1) return -1;
    
    return Math.max(left, right) + 1;
  }
  
  return height(root) !== -1;
}
```

### 4. 最大深度

```javascript
// BFS
function maxDepthBFS(root) {
  if (!root) return 0;
  
  let depth = 0;
  const queue = [root];
  
  while (queue.length > 0) {
    depth++;
    const levelSize = queue.length;
    
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  
  return depth;
}

// DFS
function maxDepthDFS(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepthDFS(root.left), maxDepthDFS(root.right));
}
```

## 总结

- **BFS**：用队列，适合最短路径、层次遍历
- **DFS**：用栈/递归，适合拓扑排序、岛屿问题
- **核心**：理解数据结构的差异
- **应用**：树/图遍历、路径查找、检测环

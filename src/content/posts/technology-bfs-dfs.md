---
title: "BFS 与 DFS 算法详解"
pubDate: 2026-03-05
description: "广度优先搜索 (BFS) 和深度优先搜索 (DFS) — 二叉树 / 图 / 矩阵上的两种基本遍历。"
category: technology
tags: ["算法", "BFS"]
---

BFS 和 DFS 是图遍历的两种基本策略，几乎所有图算法都基于它们。

## BFS — 广度优先

按层遍历，用队列：

```javascript
function bfs(root) {
  const queue = [root];
  const visited = new Set([root]);

  while (queue.length) {
    const node = queue.shift();
    console.log(node.val);

    for (const neighbor of node.children) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}
```

特点：
- 找**最短路径**（无权图）
- 空间复杂度 O(树宽度)
- 层序遍历二叉树

## DFS — 深度优先

一条路走到底，用栈（或递归）：

```javascript
function dfs(root) {
  if (!root) return;
  console.log(root.val);
  for (const child of root.children) {
    dfs(child);
  }
}
```

递归版最简洁，但深度大时会栈溢出，要改迭代：

```javascript
function dfsIterative(root) {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    console.log(node.val);
    for (let i = node.children.length - 1; i >= 0; i--) {
      stack.push(node.children[i]);
    }
  }
}
```

特点：
- 路径 / 连通性问题
- 拓扑排序
- 空间复杂度 O(树深度)

## 二叉树经典题

### 层级遍历

```javascript
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const level = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
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

### 最大深度

```javascript
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

## 矩阵上的 BFS

最短路径 / 岛屿数量 / 腐烂的橘子。

## 怎么选

- **层级 / 最短路径** → BFS
- **路径存在 / 拓扑** → DFS
- **不确定** → 两种都写，看看哪个对

BFS 和 DFS 是图算法的基石，必须熟练。
---
title: 树与二叉树完全指南
date: 2026-03-20
description: 数据结构核心：从树的定义、遍历、二叉搜索树到平衡二叉树，掌握树形数据结构的所有关键知识点与算法实现。
meta:
  - name: og:title
    content: 树与二叉树完全指南
  - name: og:description
    content: 数据结构核心：从树的定义、遍历、二叉搜索树到平衡二叉树，掌握树形数据结构的所有关键知识点与算法实现。
  - name: og:image
    content: https://jordan-home.github.io/head.jpeg
  - name: twitter:title
    content: 树与二叉树完全指南
  - name: twitter:description
    content: 数据结构核心：从树的定义、遍历、二叉搜索树到平衡二叉树，掌握树形数据结构的所有关键知识点与算法实现。
  - name: twitter:image
    content: https://jordan-home.github.io/head.jpeg
tags:
  - 数据结构
  - 算法
categories:
  - 技术笔记
---

## 前言

树和二叉树是计算机科学中最重要的数据结构之一，广泛应用于数据库、文件系统、算法等领域。

## 树的基本概念

```
        A          ← 根节点
       / \
      B   C        ← 内部节点
     /   / \
    D   E   F      ← 叶子节点
```

- **节点**：树的基本元素
- **根节点**：树的顶部节点
- **父节点/子节点**：相对关系
- **叶子节点**：没有子节点的节点
- **深度**：从根到当前节点的路径长度
- **高度**：从当前节点到最深叶子节点的距离

## 二叉树

每个节点最多有两个子节点的树。

```
       1
      / \
     2   3
    / \   \
   4   5   6
```

### 定义

```javascript
class TreeNode {
  constructor(val) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}
```

## 遍历算法

### 1. 前序遍历（根-左-右）

```javascript
// 递归
function preorder(root, result = []) {
  if (!root) return result;
  result.push(root.val);
  preorder(root.left, result);
  preorder(root.right, result);
  return result;
}

// 迭代
function preorderIterative(root) {
  if (!root) return [];
  const result = [];
  const stack = [root];
  
  while (stack.length) {
    const node = stack.pop();
    result.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  
  return result;
}
```

### 2. 中序遍历（左-根-右）

```javascript
// 递归
function inorder(root, result = []) {
  if (!root) return result;
  inorder(root.left, result);
  result.push(root.val);
  inorder(root.right, result);
  return result;
}

// 迭代
function inorderIterative(root) {
  const result = [];
  const stack = [];
  let current = root;
  
  while (current || stack.length) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();
    result.push(current.val);
    current = current.right;
  }
  
  return result;
}
```

### 3. 后序遍历（左-右-根）

```javascript
// 递归
function postorder(root, result = []) {
  if (!root) return result;
  postorder(root.left, result);
  postorder(root.right, result);
  result.push(root.val);
  return result;
}

// 迭代（双栈法）
function postorderIterative(root) {
  if (!root) return [];
  const result = [];
  const stack1 = [root];
  const stack2 = [];
  
  while (stack1.length) {
    const node = stack1.pop();
    stack2.push(node);
    if (node.left) stack1.push(node.left);
    if (node.right) stack1.push(node.right);
  }
  
  while (stack2.length) {
    result.push(stack2.pop().val);
  }
  
  return result;
}
```

### 4. 层序遍历（BFS）

```javascript
function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  
  while (queue.length) {
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

## 二叉搜索树（BST）

```javascript
class BST {
  constructor() {
    this.root = null;
  }
  
  insert(val) {
    const node = new TreeNode(val);
    
    if (!this.root) {
      this.root = node;
      return;
    }
    
    let current = this.root;
    while (true) {
      if (val < current.val) {
        if (!current.left) {
          current.left = node;
          break;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node;
          break;
        }
        current = current.right;
      }
    }
  }
  
  search(val) {
    let current = this.root;
    
    while (current) {
      if (val === current.val) return current;
      if (val < current.val) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    
    return null;
  }
}
```

## 常见操作

### 1. 最大深度

```javascript
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

### 2. 平衡二叉树

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

### 3. 最近公共祖先

```javascript
function lowestCommonAncestor(root, p, q) {
  if (!root || root === p || root === q) return root;
  
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  
  if (left && right) return root;
  return left || right;
}
```

### 4. 二叉树转链表

```javascript
function flatten(root) {
  if (!root) return;
  
  flatten(root.left);
  flatten(root.right);
  
  const right = root.right;
  root.right = root.left;
  root.left = null;
  
  let current = root;
  while (current.right) {
    current = current.right;
  }
  current.right = right;
}
```

### 5. 验证二叉搜索树

```javascript
function isValidBST(root, min = -Infinity, max = Infinity) {
  if (!root) return true;
  
  if (root.val <= min || root.val >= max) return false;
  
  return isValidBST(root.left, min, root.val) &&
         isValidBST(root.right, root.val, max);
}
```

## 完全二叉树

```javascript
function isCompleteTree(root) {
  if (!root) return true;
  
  const queue = [root];
  let foundNull = false;
  
  while (queue.length) {
    const node = queue.shift();
    
    if (node === null) {
      foundNull = true;
    } else {
      if (foundNull) return false;
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  
  return true;
}
```

## 堆

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  parent(i) { return Math.floor((i - 1) / 2); }
  left(i) { return 2 * i + 1; }
  right(i) { return 2 * i + 2; }
  
  insert(val) {
    this.heap.push(val);
    this.bubbleUp(this.heap.length - 1);
  }
  
  bubbleUp(i) {
    while (i > 0) {
      const p = this.parent(i);
      if (this.heap[p] > this.heap[i]) {
        [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
        i = p;
      } else {
        break;
      }
    }
  }
  
  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.bubbleDown(0);
    return min;
  }
  
  bubbleDown(i) {
    while (this.left(i) < this.heap.length) {
      let smallest = this.left(i);
      const r = this.right(i);
      
      if (r < this.heap.length && this.heap[r] < this.heap[smallest]) {
        smallest = r;
      }
      
      if (this.heap[i] > this.heap[smallest]) {
        [this.heap[i], this.heap[smallest]] = [this.heap[smallest], this.heap[i]];
        i = smallest;
      } else {
        break;
      }
    }
  }
}
```

## 总结

- **遍历**：前序、中序、后序、层序
- **BST**：有序性，高效搜索
- **操作**：深度、平衡、LCA、验证
- **堆**：优先级队列，Top K 问题
- **应用**：文件系统、数据库索引、算法优化

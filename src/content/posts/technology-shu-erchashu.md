---
title: "树与二叉树完全指南"
pubDate: 2026-03-20
description: "树 / 二叉树 / BST / AVL / 红黑树 — 数据结构中的树家族。"
category: technology
tags: ["数据结构", "算法"]
---

树是数据结构里最重要的一族，应用极广（DOM、AST、文件系统、数据库索引）。

## 基本概念

- **节点（Node）**：树的元素
- **根（Root）**：最顶层的节点
- **子节点 / 父节点**：相对关系
- **叶节点（Leaf）**：没有子节点的
- **深度（Depth）**：根到当前节点的路径长度
- **高度（Height）**：当前节点到叶节点的最长路径

## 二叉树

每个节点最多两个子节点（左 / 右）。

### 遍历

```javascript
// 前序：根 → 左 → 右
function preOrder(node) {
  if (!node) return;
  console.log(node.val);
  preOrder(node.left);
  preOrder(node.right);
}

// 中序：左 → 根 → 右（BST 中序 = 升序）
function inOrder(node) {
  if (!node) return;
  inOrder(node.left);
  console.log(node.val);
  inOrder(node.right);
}

// 后序：左 → 右 →根
function postOrder(node) {
  if (!node) return;
  postOrder(node.left);
  postOrder(node.right);
  console.log(node.val);
}
```

## BST（二叉搜索树）

左 < 根 < 右。查找 / 插入 / 删除平均 O(log n)，最差 O(n)（退化成链表）。

## AVL 树

自平衡 BST，左右子树高度差 ≤ 1。查找永远 O(log n)。

## 红黑树

近似平衡（最长路径不超过最短路径 2 倍）。插入 / 删除比 AVL 简单。**C++ STL 的 map、Java TreeMap、Linux 内核调度**都用它。

## B 树 / B+ 树

多路平衡搜索树。**数据库索引**就是 B+ 树。

## Trie（前缀树）

字符多路搜索树。**自动补全 / 拼写检查**用它。

## 实战应用

- **DOM**：HTML 是树结构
- **AST**：编译器解析代码
- **数据库索引**：B+ 树
- **文件系统**：目录树
- **决策树**：机器学习

## 选择建议

- 内存里需要快速查找：BST / AVL / 红黑树
- 磁盘数据库：B+ 树
- 字符串前缀匹配：Trie
- 通用场景：库的红黑树实现（map / set）

理解树，编码世界就清晰了一半。
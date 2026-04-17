---
title: 动态规划入门指南
date: 2026-02-10
tags:
  - 算法
  - 动态规划
categories:
  - 技术笔记
---
## 前言

动态规划（Dynamic Programming，简称 DP）是算法中最重要也是最难掌握的思想之一。本文通过实例帮你理解 DP。

## 什么是动态规划

动态规划是一种**将复杂问题分解为更小子问题**的算法思想，适用于**最优子结构**和**重叠子问题**的情况。

### 适用条件

1. **最优子结构**：问题的最优解可以由子问题的最优解构成
2. **重叠子问题**：子问题会被重复计算

### DP vs 分治

| 特性 | 分治 | 动态规划 |
|------|------|---------|
| 子问题 | 独立 | 重叠 |
| 解决方式 | 自顶向下 | 自底向上 |
| 重复计算 | 有 | 无（用表存储） |

## 经典例题

### 1. 斐波那契数列

#### 暴力递归（指数级）

```javascript
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// 时间复杂度 O(2^n)，会超时
```

#### DP 解法

```javascript
// 方法1：自底向上（迭代）
function fib(n) {
  if (n <= 1) return n;
  
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// 方法2：空间优化
function fib(n) {
  if (n <= 1) return n;
  
  let prev2 = 0, prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}
```

### 2. 爬楼梯

```javascript
// 问题：爬 n 层楼梯，每次可以爬 1 或 2 层，有多少种方法？

function climb(n) {
  if (n <= 2) return n;
  
  const dp = [0, 1, 2];
  for (let i = 3; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// 空间优化
function climb(n) {
  if (n <= 2) return n;
  
  let prev2 = 1, prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
  }
  return prev1;
}
```

### 3. 背包问题

```javascript
// 问题：给定背包容量和物品重量/价值，求最大价值

function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null)
    .map(() => Array(capacity + 1).fill(0));
  
  for (let i = 1; i <= n; i++) {
    for (let j = 0; j <= capacity; j++) {
      if (weights[i - 1] <= j) {
        dp[i][j] = Math.max(
          dp[i - 1][j],
          dp[i - 1][j - weights[i - 1]] + values[i - 1]
        );
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
  }
  
  return dp[n][capacity];
}

// 使用
const weights = [2, 3, 4, 5];
const values = [3, 4, 5, 6];
const capacity = 8;
console.log(knapsack(weights, values, capacity)); // 10
```

### 4. 最长公共子序列

```javascript
function LCS(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  
  const dp = Array(m + 1).fill(null)
    .map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  return dp[m][n];
}

console.log(LCS('abcde', 'ace')); // 3
```

### 5. 最大子序和

```javascript
// 问题：找到连续子数组的最大和

function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  
  for (let i = 1; i < nums.length; i++) {
    // 决定是继续当前序列还是重新开始
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  
  return maxSum;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
```

### 6. 打家劫舍

```javascript
// 问题：不能偷相邻房子，求最大金额

function rob(nums) {
  if (nums.length === 0) return 0;
  if (nums.length === 1) return Math.max(0, nums[0]);
  
  const n = nums.length;
  const dp = Array(n).fill(0);
  
  dp[0] = Math.max(0, nums[0]);
  dp[1] = Math.max(dp[0], nums[1]);
  
  for (let i = 2; i < n; i++) {
    dp[i] = Math.max(
      dp[i - 1],           // 不偷当前
      dp[i - 2] + nums[i]  // 偷当前
    );
  }
  
  return dp[n - 1];
}

// 空间优化
function rob(nums) {
  if (nums.length === 0) return 0;
  
  let prev2 = 0;
  let prev1 = Math.max(0, nums[0]);
  
  for (let i = 1; i < nums.length; i++) {
    const curr = Math.max(prev1, prev2 + nums[i]);
    prev2 = prev1;
    prev1 = curr;
  }
  
  return prev1;
}
```

## DP 解题步骤

### 1. 定义状态

```javascript
// 例如：dp[i] 表示爬 i 层楼梯的方法数
```

### 2. 状态转移方程

```javascript
// 例如：dp[i] = dp[i-1] + dp[i-2]
```

### 3. 初始化

```javascript
// 例如：dp[0] = 0, dp[1] = 1
```

### 4. 遍历顺序

```javascript
// 从小到大遍历
for (let i = 2; i <= n; i++) { ... }
```

### 5. 返回结果

```javascript
return dp[n];
```

## DP 优化技巧

### 空间优化

```javascript
// 原始：O(n) 空间
const dp = [0, 1];
for (let i = 2; i <= n; i++) {
  dp[i] = dp[i-1] + dp[i-2];
}

// 优化：O(1) 空间
let prev2 = 0, prev1 = 1;
for (let i = 2; i <= n; i++) {
  const curr = prev1 + prev2;
  prev2 = prev1;
  prev1 = curr;
}
```

### 一维到二维

```javascript
// 有时需要用二维 dp 处理更复杂的情况
// 例如：背包问题需要二维
```

## 常见 DP 题型

| 题型 | 特点 | 示例 |
|------|------|------|
| 线性 DP | 状态转移单一 | 斐波那契、爬楼梯 |
| 区间 DP | 区间划分 | 回文分割 |
| 背包 DP | 容量限制 | 0-1 背包、完全背包 |
| 状态机 DP | 多状态 | 打家劫舍 |
| 树形 DP | 树结构 | 二叉树直径 |

## 总结

- **核心思想**：将问题分解为子问题，用空间换时间
- **关键步骤**：定义状态 → 转移方程 → 初始化 → 遍历
- **优化方向**：空间优化、时间优化
- **多练习**：动态规划需要大量练习才能掌握

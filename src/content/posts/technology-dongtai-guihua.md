---
title: "动态规划入门指南"
pubDate: 2026-02-10
description: "动态规划的核心思想：状态 + 转移方程 + 备忘录，从爬楼梯到最长公共子序列。"
category: technology
tags: ["算法", "动态规划"]
---

动态规划是算法里最值得花时间学的一种。

## 核心思想

把大问题拆成小问题，**记住**小问题的答案，避免重复计算。

## 三要素

1. **状态**：当前问题的描述
2. **转移方程**：状态之间怎么转移
3. **初始条件**：最简单的状态

## 入门例子：爬楼梯

每次爬 1 或 2 阶，n 阶楼梯有几种爬法？

```javascript
function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1, b = 2;
  for (let i = 3; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
}
```

状态：`dp[i]` = 爬到第 i 阶的方法数。
转移方程：`dp[i] = dp[i-1] + dp[i-2]`。
初始：`dp[1] = 1, dp[2] = 2`。

## 第二步：背包问题

有 N 件物品，重量 w[i]，价值 v[i]，背包承重 W。求最大价值。

```javascript
function knapsack(W, w, v) {
  const dp = Array(W + 1).fill(0);
  for (let i = 0; i < w.length; i++) {
    for (let j = W; j >= w[i]; j--) {
      dp[j] = Math.max(dp[j], dp[j - w[i]] + v[i]);
    }
  }
  return dp[W];
}
```

## 第三步：最长公共子序列（LCS）

两个字符串的最长公共子序列。

```javascript
function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i-1] === b[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
      }
    }
  }
  return dp[m][n];
}
```

## 学习建议

- 先会**递归** + **记忆化搜索**（top-down）
- 再写**递推**（bottom-up）
- 用一维数组优化空间

动态规划不是背题型，是理解"如何定义状态 + 写转移方程"。
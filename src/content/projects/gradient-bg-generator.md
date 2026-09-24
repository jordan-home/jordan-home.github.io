---
title: "Gradient Background Generator"
summary: "渐变晕染背景生成器 — 输入数字种子，生成柔和朦胧的三原色渐变，一键复制CSS代码。"
year: "2026"
role: "前端开发 / 算法设计"
stack:
  - "Canvas API"
  - "JavaScript"
  - "Color Theory"
  - "Clipboard API"
demo: "https://jordan-home.github.io/projects/gradient-bg-generator.html"
cover: "/illustrations/projects/gradient-bg.webp"
featured: true
order: 14
pubDate: 2026-04-20
category: "studio"
highlights:
  - "三原色混合算法：红/绿/蓝柔和融合"
  - "毛玻璃效果：多层模糊叠加"
  - "一键复制：直接获取CSS代码"
---

# 渐变晕染背景生成器

## 这是什么

一个创意工具，通过简单的数字输入生成独特的柔和渐变背景。灵感来自水彩晕染效果，适合用作网站背景、社交媒体配图或视觉创作。

## 核心算法

```javascript
// 伪代码：三原色晕染
function generateGradient(seed) {
  const r = noise2D(seed, 0) * 255;
  const g = noise2D(seed, 1) * 255;
  const b = noise2D(seed, 2) * 255;
  
  return {
    colors: [r, g, b],
    blur: layers.map(l => noise2D(seed + l, 3) * 100)
  };
}
```

- **Simplex Noise**：生成平滑的随机分布
- **色彩空间转换**：RGB → HSL 便于调整饱和度
- **多层模糊**：模拟水彩纸的渗透效果

## 输出格式

- PNG 高清图片（1920×1080）
- CSS `background: linear-gradient(...)` 代码
- SVG 矢量版本

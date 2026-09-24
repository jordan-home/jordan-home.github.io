---
title: "md2pdf Tool"
summary: "Markdown 电子书生成器 — 文件夹拖入即可生成 PDF，支持3套预设模板。"
year: "2026"
role: "全栈开发"
stack:
  - "Node.js"
  - "jsPDF"
  - "HTML-to-Canvas"
  - "Drag & Drop API"
demo: "https://jordan-home.github.io/projects/md2pdf/"
repo: "https://github.com/jordan-home/md2pdf"
cover: "/illustrations/projects/md2pdf.webp"
featured: false
order: 15
pubDate: 2026-04-08
category: "studio"
highlights:
  - "拖拽导入：文件夹直接生成电子书"
  - "三种模板：经典 / 简约 / 学术风格"
  - "自动排版：目录、页码、章节分隔"
---

# md2pdf 电子书工具

## 这是什么

一个将 Markdown 文件转换为 PDF 电子书的命令行工具。特别适合制作技术文档、读书笔记、内部手册等。

## 使用流程

1. 创建 Markdown 文件夹，按章节命名
2. 运行 `md2pdf ./my-book`
3. 选择模板，生成 PDF
4. 分发或打印

## 技术亮点

- **文件监听**：热重载，修改后自动生成
- **模板系统**：Jinja2 风格的分段模板
- **字体嵌入**：中文字体完整支持
- **跨平台**：macOS / Linux / Windows

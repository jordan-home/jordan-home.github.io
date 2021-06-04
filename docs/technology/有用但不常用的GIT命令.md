---
title: 有用但是不常用的Git命令
date: 2021-5-25
sidebar: auto
categories:
  - IT
tags:
  - Git
---

## 都改了什么？
### 看多个提交的修改
```bash
git log -p
# 简略版
git log --stat
```
### 查看某个commit
```bash
git show commitValue [filePath]
```

## 上次commit提交的代码有遗漏？
```bash
# 不会产生新的commit记录，而是合并在上一个commit里面
git commit --amend
```

不是上次，而是上上次、上上上次...,怎么办？
```bash
# 如果 git rebase -i, 则进入选择commit界面，将目标commit由pick改为edit
git rebase -i commitValue
# 修改code
git add XX
git commit --amend
git rebase --continue
# end
```

## 某个commit不想要了？
```bash
git rebase -i
# 选择目标commit,直接删除这一行
git rebase --continue
# end
```

## 官方链接
[View More about Git](https://git-scm.com/book/zh/v2)
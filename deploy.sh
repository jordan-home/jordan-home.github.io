#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

commitTime=`date +'%Y-%m-%d %H:%M:%S'`

# 构建静态文件
npm run build

# 使用 git subtree 推送到 master 分支（GitHub Pages）
# --force 确保即使有非快进更新也能推送
git subtree push --prefix blog git@github.com:jordan-home/jordan-home.github.io.git master --force

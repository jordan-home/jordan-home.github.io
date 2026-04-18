#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

commitTime=`date +'%Y-%m-%d %H:%M:%S'`

# 构建静态文件
npm run build

# 使用 git subtree 推送到 master 分支（GitHub Pages）
# 这会将 blog 目录作为子目录推送到远程的 master 分支
git subtree push --prefix blog git@github.com:jordan-home/jordan-home.github.io.git master --squash

#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

commitTime=`date +'%Y-%m-%d %H:%M:%S'`

# 进入生成的文件夹
cd blog

git init
git add -A
git commit -m "build add delploy at $commitTime"

# 如果发布到 https://<USERNAME>.github.io  填写你刚刚创建的仓库地址
git push -f git@github.com:jordan-home/jordan-home.github.io.git master

cd ../

rm -rf blog

cd -

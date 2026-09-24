#!/usr/bin/env bash
set -e

# Jordan の Words — Astro build & deploy to GitHub Pages
# Builds site to ./dist and pushes to dev branch on origin.
# (GitHub Pages 站点源配置为 dev 分支根目录)

REPO="git@github.com:jordan-home/jordan-home.github.io.git"
BRANCH="dev"

echo "· 安装依赖（如需要）"
if [ ! -d node_modules ]; then
  npm install
fi

echo "· 构建站点"
npm run build

echo "· 部署到 $BRANCH 分支"
cd dist
rm -rf .git
git init -q
git checkout -B "$BRANCH" -q
git config user.email "jordan@deploy.local"
git config user.name "Jordan"
git add -A
git commit -q -m "deploy: $(date +%Y-%m-%d_%H%M)"
git push -f "$REPO" "$BRANCH"

cd ..
echo "· 部署完成"
#!/usr/bin/env node
/**
 * 给 dist/sitemap-0.xml 每个 url 追加 <lastmod>YYYY-MM-DD</lastmod>
 * 在 astro build 完成后由 npm run build 链式调用，确保 sitemap 已生成。
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const sitemapPath = resolve(process.cwd(), 'dist/sitemap-0.xml');

if (!existsSync(sitemapPath)) {
  console.error(`[sitemap-lastmod] ${sitemapPath} not found — did astro build run?`);
  process.exit(1);
}

const now = new Date().toISOString().slice(0, 10);
const xml = readFileSync(sitemapPath, 'utf-8');

const updated = xml.replace(
  /<url>([\s\S]*?)<\/url>/g,
  (_, body) => `<url>${body}<lastmod>${now}</lastmod></url>`
);

writeFileSync(sitemapPath, updated, 'utf-8');
const count = (xml.match(/<url>/g) || []).length;
console.log(`[sitemap-lastmod] added <lastmod>${now}</lastmod> to ${count} urls`);
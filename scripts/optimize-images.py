#!/usr/bin/env python3
"""
图片压缩脚本 — PNG → WebP（cwebp -q 82）

策略：
- 用 cwebp 生成 .webp 版本（体积比 PNG 小 70-90%）
- PNG 保留作 fallback（如已删除会跳过）
- 输入支持 .png 或 .webp（重复跑幂等）

使用：
    python3 scripts/optimize-images.py

依赖：
    brew install webp
"""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent / "public" / "illustrations"

IMAGES = [
    "hero-skin.webp",
    "cover-default.webp",
    "cover-technology.webp",
    "cover-note.webp",
    "cover-health.webp",
    "cover-lifes.webp",
    "about-portrait.webp",
    "projects-desk.webp",
    "404-lost-cat.webp",
    "seal-red.webp",
    "divider-bamboo.webp",
    "divider-cloud.webp",
    "projects/sweet-novel.webp",
    "projects/petmona.webp",
    "projects/uuskins.webp",
]


def convert(src: Path) -> int:
    webp = src.with_suffix(".webp") if src.suffix != ".webp" else src
    orig_size = src.stat().st_size
    # cwebp [options] -q quality input -o output
    subprocess.run(
        ["cwebp", "-q", "82", "-m", "6", str(src), "-o", str(webp)],
        check=True, capture_output=True,
    )
    new_size = webp.stat().st_size
    saved = orig_size - new_size
    pct = 100 * saved / orig_size if orig_size else 0
    print(f"  {src.name:35s}  {orig_size//1024:5d}K  →  WebP {new_size//1024:5d}K  ({pct:5.1f}% smaller)")
    return new_size


def main():
    total_orig = 0
    total_new = 0
    count = 0

    for path in IMAGES:
        full = ROOT / path
        if not full.exists():
            continue
        orig = full.stat().st_size
        new = convert(full)
        total_orig += orig
        total_new += new
        count += 1

    print("---")
    print(f"Converted {count} images")
    if total_orig > 0:
        print(f"Total: {total_orig/1024/1024:.1f}MB → {total_new/1024/1024:.2f}MB "
              f"({100*(total_orig-total_new)/total_orig:.1f}% smaller)")


if __name__ == "__main__":
    main()
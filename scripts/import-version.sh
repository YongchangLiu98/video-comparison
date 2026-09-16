#!/bin/zsh
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "用法: ./scripts/import-version.sh <版本目录名> <包含 by_case 的结果目录>"
  exit 1
fi

LABEL="$1"
SOURCE="$2/by_case"
TARGET="$(cd "$(dirname "$0")/.." && pwd)/videos/$LABEL"

if [[ ! -d "$SOURCE" ]]; then
  echo "找不到目录: $SOURCE"
  exit 1
fi

mkdir -p "$TARGET"
rsync -a --delete --include='*/' --include='*.mp4' --exclude='*' "$SOURCE/" "$TARGET/"
echo "已导入到: $TARGET"
echo "下一步：在 comparison.config.js 的 columns 中添加或更新版本。"

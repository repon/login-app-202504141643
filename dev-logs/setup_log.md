---
title: 開発環境セットアップログ
type: log
status: completed
last_updated: 2025-04-14
---

# 🚀 開発環境セットアップログ

このログは、OAuthログインアプリにおける初期セットアップの作業記録です。

---

## ✅ 実施内容一覧

### 🏗 プロジェクト作成

- `pnpm create next-app` を使用してプロジェクトを作成
- 選択内容：
  - TypeScript：Yes
  - ESLint：Yes
  - Tailwind CSS：Yes
  - src ディレクトリ：Yes
  - App Router：Yes
  - Turbopack：No
  - Import Alias：No（`@/` デフォルトを使用）

---

### ⚙️ Prettier 導入

```bash
pnpm add -D prettier eslint-config-prettier
```

- `.prettierrc` に以下の設定を追加：

```json
{
  "singleQuote": true,
  "semi": false,
  "trailingComma": "es5",
  "printWidth": 100
}
```

- `.prettierignore` を作成：

```
.next
node_modules
out
```

- VSCode 用 `.vscode/settings.json`（任意）：

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

### 🧹 Prettier スクリプト追加

```json
"scripts": {
  "format": "prettier --write .",
  "format:check": "prettier --check ."
}
```

---

### 🧪 ESLint 構成の調整

- 初期構成では `eslint.config.mjs` が `FlatCompat` により生成されていたため、以下のように調整：

```js
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import prettier from 'eslint-config-prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [...compat.extends('next/core-web-vitals', 'next/typescript'), prettier]
```

---

### 🧯 Lint / Format 動作確認

- `pnpm lint` → ✅ エラーなしで通過
- `pnpm format:check` → ⚠️ 指摘あり（整形前のファイル10件）
- `pnpm format` 実行で修正予定

---

## 📘 所感

- Prettier + ESLint Flat Config は構成がシンプルでメンテしやすい
- `eslint-config-next` 経由の `eslint-plugin-next` は `pnpm` では単体解決できず、FlatCompatで維持した方が安定
- CLIスクリプト整備によって、CIやコミット前チェックも拡張しやすくなった

---

## ♻️ 追加対応（2025-04-14）

### 🧼 不要ファイルの整理

- `public/` 以下のデフォルト画像（`vercel.svg`, `file.svg` など）をすべて削除
- `src/app/page.tsx` を削除（不要な初期ルートページ）
- `.DS_Store`, `._*` など macOS の不要ファイルも削除済み

---

### 🎨 layout.tsx の調整

- `metadata` にタイトル・説明を設定（SEO & SNS対応）
- Googleフォント（Geist Sans / Mono）をインポートし、 `<html>` にクラス適用：

```tsx
<html lang="ja" className={`${geistSans.variable} ${geistMono.variable}`}>
```

---

### 🌈 globals.css の最適化

- `@theme inline` を削除（未使用のため）
- `font-family: Arial` を削除し、Tailwind `font-sans` に一任
- カスタム変数（--background / --foreground）と dark mode 対応は残して利用

---

### 🧪 環境確認

- `pnpm lint` → ✅ 通過
- `pnpm format:check` → ✅ 整形済み
- `pnpm dev` → ✅ 起動OK（ページが存在しないため404だが正常）

---

## 🪝 Husky + Lint-staged 導入（2025-04-14）

### ✅ 目的

- Cursor利用時に `Prettier` や `ESLint` が保存時に動かない問題を解消するため
- `git commit` 前に整形・Lintチェックを自動実行

---

### 🔧 導入手順

```bash
pnpm dlx husky-init && pnpm install
pnpm add -D lint-staged
```

- `prepare` スクリプトが自動で追加され、`.husky/pre-commit` も作成された

---

### 🧩 `package.json` に追加した設定

```json
"scripts": {
  "prepare": "husky install"
},
"lint-staged": {
  "**/*.{js,ts,tsx,json,css,md}": [
    "prettier --write",
    "eslint --fix"
  ]
}
```

---

### 🔗 .husky/pre-commit の内容

```sh
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

pnpm exec lint-staged
```

---

### ✅ 動作確認ログ

- コミット前に整形ミスを含んだファイルを検出
- `pnpm exec lint-staged` により `prettier` で構文エラーを検知
- `git commit` を自動ブロックし、元の状態にロールバック
- Husky + lint-staged が **正しく動作することを確認済み！🎉**

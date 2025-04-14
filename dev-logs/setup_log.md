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
import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"
import prettier from "eslint-config-prettier"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  prettier
]
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

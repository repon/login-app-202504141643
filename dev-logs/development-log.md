---
title: 実装ログ
type: log
status: active
last_updated: 2025-04-15
---

# 🛠 開発ログ（OAuthログインアプリ）

## 2025-04-15

### 着手：

- `/auth/login` 実装に着手予定

### 実施：

- `development.md` を修正（誤って完了扱いにしていた項目を未完に戻す）
- `setup_log.md` とともに `dev-logs/` にまとめて整理

### 次のアクション：

- `/auth/login` ルートの `page.tsx` ＋ `redirect()` 実装
- `GOOGLE_CLIENT_ID` など環境変数の `.env.local` 設定

### 完了：

- Google Cloud Console にて OAuth 同意画面・認証情報を設定
- `.env.local` に `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL` を設定
- `/auth/login` にアクセス → Googleログイン画面へ遷移を確認 ✅
- テストユーザーの追加により認証エラーを解消

### 次のアクション：

- `/api/auth/callback` のエンドポイントを作成
  - 認可コード → `access_token` / `id_token` に交換
  - JWT を Cookie に保存

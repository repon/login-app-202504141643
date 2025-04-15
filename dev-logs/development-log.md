---
title: 実装ログ
type: log
status: active
last_updated: 2025-04-15
---

# 🛠 開発ログ（OAuthログインアプリ）

## 2025-04-15

### 完了：

- Google Cloud Console にて OAuth 同意画面・認証情報を設定
- `.env.local` に `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_APP_URL` を設定
- `/auth/login` にアクセス → Googleログイン画面へ遷移を確認 ✅
- テストユーザーの追加により認証エラーを解消

- `/api/auth/callback` 実装
  - 認可コードを Google のトークンエンドポイントで `id_token` に交換
  - `token` を HttpOnly Cookie に保存（Secure, Lax 設定）
- Cookie保存を DevTools で確認 ✅

### 次のアクション：

- `/api/me` 実装
  - CookieからJWTを読み取り、ユーザー情報を返すAPI
  - 後でJWT署名検証も追加予定

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

## 2025-04-15（続き）

### 完了：

- `/api/me` を実装し、CookieからJWTを読み取ってユーザー情報を返す処理を確認 ✅
- `token` Cookie を decode し、以下の情報が取得できた：

```json
{
  "email": ***,
  "name": ***,
  "avatar": url
}
```

### 次のアクション：

- `/api/logout` を実装して、Cookie を削除するログアウト処理を追加
- `jwt.verify()` または `jose` によるトークンの署名検証を導入予定

## 2025-04-15（さらに続き）

### 完了：

- `/api/logout` 実装
  - `token` Cookie を削除（maxAge: 0）
  - GETアクセスでは405になることを確認（POSTのみ許可）
  - `src/app/logout/page.tsx` にログアウトボタンを配置し、fetchでPOST送信
- ブラウザ操作で `Logout` ボタン押下 → Cookie削除 ✅
- `/api/me` にアクセス → `401 Unauthorized` を返すことを確認 ✅（ログアウト成功）

### 次のアクション候補：

- JWTの署名検証（`jose`でGoogle公開鍵を取得してverify）
- PrismaでUserをDBに保存（emailをキーにUpsert）
- `middleware.ts` を導入して、ログイン必須ページのアクセス制御を行う

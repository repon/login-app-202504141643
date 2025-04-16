---
title: 実装ログ
type: log
status: active
last_updated: 2025-04-16
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

## 2025-04-16

### 完了：

- JWT署名の検証機構を導入（ライブラリ：`jose`）
- GoogleのJWK公開鍵セットを `createRemoteJWKSet()` で取得・キャッシュ
- `verifyGoogleToken(token)` 関数を `lib/verify-jwt.ts` に実装
- `/api/me` にて `jwt.decode()` → `jwtVerify()` に置き換え
- 改ざんされたトークン・期限切れトークンでは `401 Unauthorized` を返すよう動作確認 ✅
- 旧ライブラリ `jsonwebtoken` を削除し、`pnpm lint` / `pnpm dev` 問題なし ✅

### 次のアクション：

- PrismaでログインユーザーをDBに保存（emailをキーにUpsert）
- `middleware.ts` によるログイン必須ルートの制御

## 2025-04-16（続き）

### 完了：

- `/api/auth/callback` にユーザー保存処理を追加
  - `verifyGoogleToken()` の署名検証後、payload から `email`, `name`, `picture` を取得
  - `prisma.user.upsert()` により、DBに `User` レコードを保存（Railway上のPostgreSQLで確認 ✅）
- `verifyGoogleToken()` に try/catch を導入し、呼び出し側で null 判定が可能な構成に変更
- 型 `GoogleTokenPayload` を定義し、payload の型安全を実現

### 次のアクション：

- `middleware.ts` を実装し、ログイン必須ルートにアクセス制御を追加
- フロントエンドでログイン状態の表示を切り替える UI を追加

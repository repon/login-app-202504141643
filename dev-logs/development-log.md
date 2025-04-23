---
title: 実装ログ
type: log
status: active
last_updated: 2025-04-17
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

## 2025-04-16（さらに続き）

### 完了：

- `middleware.ts` を実装し、ログインしていないユーザーのアクセス制御を追加
  - Cookieに `token` が存在しない場合、保護ルート（`/dashboard`）へのアクセスを `/auth/login` にリダイレクト
  - `src/app/dashboard/page.tsx` を仮作成し、動作テストを実施
  - ログアウト状態で `/dashboard` にアクセスすると正しくリダイレクトされることを確認 ✅

### 次のアクション：

- `useAuth()` フックでログイン状態をクライアント側で取得
- UI側でログイン/ログアウトの出し分けを行う

## 2025-04-17

### 完了：

- `/api/me` のレスポンスを `payload` 経由で正しく `setUser()` に渡すよう修正
  - それにより `user.name`, `user.email`, `user.avatar` が null になる問題を解消 ✅
- `Header.tsx` にて `useAuth()` フックを使い、ログイン状態に応じて表示を出し分け
  - ログイン時：ユーザー名・アイコン・ログアウトボタン表示
  - 未ログイン時：「ログイン」リンクを表示
- `a href="/api/logout"` による GET 送信をやめて、`fetch('/api/logout', { method: 'POST' })` に変更し、405エラーを解消 ✅
- Cookie削除後の表示切り替えも動作確認済み ✅
- JWT期限切れ時の `/api/me` で `JWTExpired` エラーが検出され、401を返すことを確認 ✅（再ログインにより復旧）

### 次のアクション：

- Context化による `useAuth()` の状態共有（複数コンポーネント対応） ※必要になれば対応
- JWTのリフレッシュ or 自動再ログイン対応（今後の拡張課題）

## 2025-04-20

### 完了：

- `next/image` で Google のプロフィール画像が表示されない問題を修正
  - ドメイン `lh3.googleusercontent.com` を `next.config.js` に `images.domains` として追加
- `/dashboard` にてユーザーのプロフィール画像（avatar）を正しく表示できるようになった ✅
- GitHubログインなど、今後の外部画像表示にも対応できる構成に整備済み
- `User` モデルの `picture` を `avatarUrl` に統一、コードと型を整理中

### 次のアクション：

- `/dashboard` でのプロフィール情報編集機能（名前変更）を実装
- DBの `User` モデルを正規化し、JWTから渡された値と明示的に分けて保持
- Prismaマイグレーションと `upsert` 処理の修正を含めた構成整理

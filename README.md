# 🔐 OAuthログインアプリ（学習目的）

このアプリは、セキュアなOAuthログイン処理を学ぶために、Next.jsと自作BFF構成で構築された認証システムです。  
Auth.js や NextAuth などの認証ライブラリには頼らず、OAuth連携・トークン処理・Cookie管理をすべて自前で実装しています。

---

## ✅ 目的とゴール

### 🎯 学習目的

- OAuth2 認証の流れを理解する（認可コード → トークン交換）
- HttpOnly Cookie による安全なセッション管理を実装する
- BFF構成での Cookie運用・セキュリティ対策を理解する
- 将来的なパスワード認証やRBAC拡張に備えた構成力を養う

### 🏁 ゴール

- [ ] 最小構成（ログイン／ログアウト／ログイン中ユーザー取得）を実装
- [ ] Cookieベースのセキュアな認証状態管理を実装
- [ ] 応用編：自前パスワード認証を別ブランチで追加予定

---

## 🏗 使用スタック構成

| 項目 | 技術 |
|------|------|
| フレームワーク | Next.js（App Router） |
| ORM | Prisma |
| DB | Railway 上の PostgreSQL |
| デプロイ | Vercel |
| 認証 | OAuth2（Google/GitHubなど） |
| トークン | id_token（JWT） |
| セッション管理 | `Set-Cookie`（HttpOnly / Secure / SameSite=Lax） |

---

## 📌 API仕様

| エンドポイント | メソッド | 処理内容 |
|----------------|----------|----------|
| `/auth/login` | GET | OAuthプロバイダへリダイレクト |
| `/api/auth/callback` | GET | 認可コード受け取り → トークン取得 → Cookie保存 |
| `/api/me` | GET | CookieからJWTを検証し、ログイン中ユーザー情報を返す |
| `/api/logout` | POST | Cookieを削除しログアウト処理を行う |

---

## 🧾 DBスキーマ（Prisma）

```ts
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  avatarUrl String?
  createdAt DateTime @default(now())
}
````

---

## 🔐 認証設計とセキュリティ

|項目|設定|
|---|---|
|JWTの保存先|HttpOnly Cookie|
|Cookie属性|`HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=3600`|
|JWT検証方法|OAuthプロバイダの公開鍵で署名検証|
|セッション形式|Stateless（JWTベース）|
|エラー処理|JWT不正・期限切れ：401、ユーザー未登録：insert or 404|

---

## ⚙️ 認証状態管理（App Router構成）

- `useAuth()`：クライアント側フックで `/api/me` を叩いてユーザー状態を取得
- `middleware.ts`：JWTがなければ `/auth/login` にリダイレクト、保護ルート制御に活用

---

## 📚 今後の拡張予定（応用編）

- 自前のメール+パスワード認証（bcryptでハッシュ処理）
- ロール・権限管理（RBAC）導入
- OAuthプロバイダの追加（Twitter, LINEなど）
- テスト自動化（`api/auth/*.test.ts`）
- ポートフォリオ用UIの導入
- Linter・フォーマッター導入（ESLint + Prettier + pnpm構成）

---

## 🧠 メモ

このアプリは、学習目的で設計・構成・実装をすべて自前で行った「構成力の見えるログインアプリ」です。  
ブラックボックスなライブラリに頼らず、トークンの取得・検証・保存・破棄の流れをコードベースで体験するための教材として作成しています。

---

## ✍️ Cursorとの連携

このプロジェクトでは、進行管理とチャットログを `dev-logs/` ディレクトリにMarkdown形式で残しています。  
Cursorに認識させるため、各ファイルには下記のようなYAMLメタ情報（frontmatter）を記述しています。

例：

```
---
title: タスク一覧
type: task
status: active
last_updated: 2025-03-29
---
```

まず、進行管理ファイル`development.md`に、要件定義`README.md`からTodoを作成して下さい。
Todoの区切りごとに、進行管理ファイルとチャットログ`chatlog.md`を更新して下さい。

---

## **重要** 動作テストは細かく

- 常に動く状態を確認したいので、動作テストを細かく行ってください。
- 動作テストは、進行管理ファイルのTodoリストの区切りで必ず行って下さい。
- また、一度に作成するコードが多い場合にも、適宜行いましょう

---

## ✏️ テスト観点（任意）

- `/api/me` が未ログイン状態で401になることを確認
- JWTが期限切れのときに再ログインが促されること
- CookieがHttpOnly/Secure/SameSite=Laxで設定されていること
- ログアウト時にCookieが消去されること
- 登録されていないユーザーが初回ログインで挿入されること

---

## 📝 ライセンス

MIT（ご自由にどうぞ）
---
title: タスク一覧
type: task
status: active
last_updated: 2025-04-14
---

# ✅ 開発タスクリスト（OAuthログインアプリ）

このファイルは、README.md の要件に基づいた開発タスクの進行管理用です。Cursorなどで認識させるため、YAML形式のfrontmatterを含んでいます。

---

## 🏁 最小構成タスク（MVP）

- [ ] `/auth/login`：OAuthプロバイダにリダイレクトする処理
- [ ] `/api/auth/callback`：認可コード受け取り → id_token取得 → Cookie保存
- [ ] `/api/me`：JWTをCookieから検証してユーザー情報を返す
- [ ] `/api/logout`：Cookieを削除してログアウト
- [ ] JWTの署名検証処理（`lib/auth.ts`）
- [ ] Google OAuth連携処理（`lib/oauth.ts`）

---

## 🔐 認証状態の構成タスク

- [ ] `useAuth()`：クライアント側で `/api/me` を叩いて状態管理
- [ ] `middleware.ts`：JWTがなければ `/auth/login` にリダイレクト
- [ ] JWT失効・不正のときのエラー処理（401）
- [ ] 初回ログイン時に `User` テーブルへ登録（なければinsert）

---

## 🗃 DB・Prisma関連タスク

- [ ] `User` モデルを `schema.prisma` に定義
- [ ] `prisma migrate dev` によるテーブル作成
- [ ] OAuthログイン時に `User` テーブルと照合＆登録

---

## 🧪 テスト観点・動作確認（手動）

- [ ] 未ログイン状態で `/api/me` にアクセスして 401 を確認
- [ ] CookieにHttpOnly, Secure, SameSite属性が付いていること
- [ ] 正常ログインで `/api/me` からユーザー情報が取得できること
- [ ] ログアウト後に `/api/me` が401になること

---

## 🚀 応用拡張タスク（任意ブランチ）

- [ ] 自前のメール+パスワード認証（bcryptでハッシュ処理）
- [ ] ロール・権限管理（RBAC）
- [ ] 複数OAuthプロバイダ対応（GitHub, Twitterなど）
- [ ] テスト自動化（`api/auth/*.test.ts`）
- [ ] ポートフォリオ向けUIの導入（`/dashboard`など）

---
title: タスク一覧
type: task
status: active
last_updated: 2025-04-15
---

# ✅ 実装Todo（OAuthログインアプリ）

## 🎯 最小構成ログインAPIの完成

- [ ] `/auth/login` のリダイレクト処理実装（Google OAuthプロバイダ）
- [ ] `/api/auth/callback` のトークン取得 → JWT保存（HttpOnly Cookie）処理
- [ ] `/api/me` JWT検証 → ユーザー情報返却処理
- [ ] `/api/logout` Cookie削除 → ログアウト処理

## 🧱 セッション・Cookie制御

- [ ] Cookie仕様定義（HttpOnly / Secure / SameSite=Lax / Max-Age 3600）
- [ ] JWTの保存場所、検証方法の決定（OAuthプロバイダの公開鍵を使用）
- [ ] JWT検証ロジックを `lib/auth.ts` に実装
- [ ] Cookieの削除処理を `logout` APIに実装

## 🗃 DB処理（Prisma）

- [ ] Prisma schema に `User` モデルを定義済み
- [ ] 初回ログイン時のみ `User` を `upsert`（なければ挿入）する処理を追加

## 🧭 認証状態のルール実装

- [ ] `middleware.ts`：Cookieなければ `/auth/login` にリダイレクト
- [ ] `/dashboard` 等の保護ルートで `middleware.ts` を活用
- [ ] `useAuth()` composableの実装（`/api/me` を叩いて状態管理）

## 🧹 UI・コードの整理

- [x] `public/` フォルダの初期素材を削除
- [x] `src/app/page.tsx` の削除
- [x] `layout.tsx` のタイトル修正
- [x] `globals.css` の未使用スタイル整理

## 🛠 セットアップ＆開発環境まわり

- [x] ESLint / Prettier 導入
- [x] `pnpm format` / `pnpm lint` 動作確認済み
- [x] Husky導入（pre-commitで整形＆lintチェック）
- [x] `dev-logs/setup_log.md` に導入記録を保存済み

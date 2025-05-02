---
title: タスク一覧
type: task
status: active
last_updated: 2025-04-17
---

# ✅ 実装Todo（OAuthログインアプリ）

## 🎯 最小構成ログインAPIの完成

- [x] `/auth/login` のリダイレクト処理実装（Google OAuthプロバイダ）
- [x] `/api/auth/callback` のトークン取得 → JWT保存（HttpOnly Cookie）処理
- [x] `/api/me` JWT検証 → ユーザー情報返却処理
- [x] `/api/logout` Cookie削除 → ログアウト処理

## 🧱 セッション・Cookie制御

- [x] Cookie仕様定義（HttpOnly / Secure / SameSite=Lax / Max-Age 3600）
- [x] JWTの保存場所、検証方法の決定（OAuthプロバイダの公開鍵を使用）
- [x] JWT検証ロジックを `src/lib/verify-jwt.ts` に実装
- [x] Cookieの削除処理を `logout` APIに実装

## 🗃 DB処理（Prisma）

- [x] Prisma schema に `User` モデルを定義
- [x] 初回ログイン時のみ `User` を `upsert`（なければ挿入）する処理を追加

## 🧭 認証状態のルール実装

- [x] `middleware.ts`：Cookieなければ `/auth/login` にリダイレクト
- [x] `/dashboard` 等の保護ルートで `middleware.ts` を活用
- [x] `useAuth()` composableの実装（`/api/me` を叩いて状態管理）

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

## 🚀 応用フェーズ（ログイン機能の再利用／アプリとしての完成度強化）

このログインアプリは「ほぼ全ての現場で必要」「汎用・疎結合にできる」機能群の1つとして構築されており、将来的に以下のような方針で他アプリへ再利用されることを想定しています。

---

### 🧩 再利用に向けた設計タスク

- [ ] `lib/auth`, `hooks/useAuth.ts`, `middleware/authGuard.ts` を他アプリでも利用可能な構造で保持する
- [ ] 今後構築予定の以下のアプリに、ログイン機能を内包させて実装する
  - [ ] パスワードリセット機能アプリ（password-reset-app）
  - [ ] RBAC権限管理アプリ（rbac-app）
  - [ ] その他フォーム・タスク系アプリ（予定）
- [ ] 将来的に `/packages/auth` へ切り出し、ライブラリ化することも想定する

---

### 🔧 アプリとしての完成度向上タスク（再利用とは別軸）

- [ ] Prisma User モデルのロール対応（`role: 'user' | 'admin'`）と `/admin` ページ制御
- [ ] `/auth/login` にメール＋パスワード認証フォーム（bcrypt対応）を追加
- [ ] トークン期限切れ時の自動リダイレクト（JWT `exp` に応じて）
- [ ] UIコンポーネントの分離（Header / Footer / ProtectedPage など）
- [ ] Tailwind を活用した見た目の整理
- [ ] APIの型定義強化（`zod` や型ガード導入）
- [ ] テスト自動化（`/api/me`, `/api/logout`, `/api/auth/callback` 等を `supertest` 等で検証）
- [ ] 本番反映に向けた `.env.production`, Vercel環境変数整備

## 📣 公開版ログインアプリ（4月完成目標）

このログインアプリは、学習目的とともに「最低限の認証機能を備えた公開可能な構成」を目指しており、以下の条件で4月中の公開を目標とします。

---

### 🎯 4月末までのスコープ（優先実装項目）

- [ ] `/`, `/dashboard` ページを最低限のUIで整備（ログイン状態表示含む）
- [ ] ナビゲーション表示：Home / Dashboard / Login / Logout（Header）
- [ ] middleware.ts による保護ルート制御（`/dashboard` に未ログイン時リダイレクト）
- [ ] `.env.production` 作成と Vercel 本番デプロイ確認
- [ ] 公開用 `README.md`（目的・仕様・URL）整備
- [ ] GitHub公開（リポジトリ名、ライセンス、Vercelリンク）

---

### 📦 除外（今回の公開スコープには含まない）

- 自前パスワード認証機能
- ロール管理／RBAC
- テスト導入（supertest等）
- トークン自動リフレッシュ

---

### 📝 公開用READMEとの連携

- 公開用 `README.md` にもこの構成・スコープを明記し、成果物として説明可能な状態に整える。
- 完了後は `/dev-logs/publish_log.md` に記録を残す。

last_updated: 2025-04-20

---

## 🌿 ブランチ構成方針（2025-04-24）

このプロジェクトは「疎結合な再利用可能ログイン機能の実装」を目的としており、DB永続化の有無に応じてブランチを以下のように分けて構成します。

### 🔀 ブランチ方針

| ブランチ名 | 概要                                     | Prisma使用 | デプロイ先     |
| ---------- | ---------------------------------------- | ---------- | -------------- |
| `main`     | JWT完結ログイン（最小構成・公開用）      | ❌         | ✅ Vercel本番  |
| `prisma`   | DBあり構成（プロフィール編集・拡張対応） | ✅         | Preview (任意) |

- `main` ブランチでは Prisma 関連ファイルを削除 or 条件分岐によって無効化
- `prisma` ブランチでは現状の構成を保ち、今後の拡張機能（RBAC, プロフィール編集等）を進める
- 共通ファイル（README.md, .env.example）は両ブランチで共有・統一管理

---

last_updated: 2025-04-23

---

title: 開発ログ
type: development
status: active
last_updated: 2024-05-02

---

# 開発ログ

## 2024-05-02 プロジェクト分析と改善計画

### 分析結果

1. README.mdとREADME.dev.mdの整合性

   - 特に重大な誤りは見当たらず、現状のままで問題なし

2. リファクタリング計画

#### a) 認証関連コードの整理

- `verify-jwt.ts`の改善

  - JWT検証ロジックの汎用化
  - Google固有部分の分離
  - エラーハンドリング強化
  - 型定義の拡充

- `useAuth.ts`の改善
  - 認証状態管理の明確化
  - エラーハンドリング改善
  - 型定義の拡充

#### b) 型定義の強化

- `/api/me`のレスポンス型定義
- エラーレスポンス型の統一
- 認証コールバックのレスポンス型定義

#### c) エラーレスポンス形式の統一

```typescript
interface ErrorResponse {
  error: {
    code: string // エラーコード（例: "AUTH_ERROR"）
    message: string // エラーメッセージ
    details?: unknown // 追加のエラー詳細
  }
}
```

#### d) テスト項目（将来的な検討用）

1. 認証関連

   - ログイン成功時のJWT生成
   - 無効なトークンでのアクセス
   - トークン期限切れ時の挙動
   - ログアウト時のCookie削除

2. ルーティング

   - 未認証時のリダイレクト
   - 認証済み時のダッシュボード表示

3. APIエンドポイント
   - `/api/me`の正常系/異常系
   - `/api/auth/callback`の正常系/異常系

#### e) セキュリティ強化

- CSRF対策

  - SameSite Cookie属性の設定（実装済み）
  - CSRFトークンの導入検討
  - 重要操作での二重認証検討

- レート制限（Rate Limiting）
  - ブルートフォース攻撃防止
  - サーバーリソース保護
  - サービス品質維持

### 今後の作業計画

1. `verify-jwt.ts`のリファクタリング
2. `useAuth.ts`のリファクタリング
3. 型定義の強化
4. エラーレスポンス形式の統一
5. セキュリティ強化（CSRF対策、レート制限）

### 備考

- 現状、ダッシュボード画面でユーザー名やメールアドレスが正しく表示されない不具合がある。
- これはリファクタリング計画a-c（認証関連コード整理・型定義強化・エラーレスポンス統一）を完了することで解消予定。
- `/api/me`のレスポンス型定義と`useAuth.ts`のデータ取得・UI反映の見直しで対応する。

### 新たに解消すべき課題

- ログアウト状態と判定されてもCookieが残り、/dashboardに遷移してもログイン画面にリダイレクトされない問題が発生している。
- 以前はログアウト状態と判定された際にCookieを削除していたが、リファクタリング後はこの挙動が変化している可能性がある。
- 今後のリファクタリングでこの問題も解消する。

### テスト項目一覧（導入する場合）

**1. 認証関連**

- 正常なJWTでのログイン状態取得（/api/me）
  - 推奨: supertest, jest
- 無効なJWTでの401レスポンスとCookie削除
  - 推奨: supertest, jest
- JWT期限切れ時の401レスポンスとCookie削除
  - 推奨: supertest, jest, time-mocking
- ログアウトAPI実行後、Cookieが削除されること
  - 推奨: supertest, jest

**2. ルーティング・ガード**

- 未認証で/dashboardアクセス時、/auth/loginへリダイレクトされる
  - 推奨: supertest, jest
- 認証済みで/dashboardアクセス時、ユーザー情報が正しく表示される
  - 推奨: supertest, jest

**3. APIエンドポイント**

- /api/me: 正常系（payloadあり）・異常系（error型、Cookie削除）
  - 推奨: supertest, jest
- /api/logout: 正常系（message）・異常系（error型）
  - 推奨: supertest, jest

**4. UI表示**

- ログイン状態でユーザー名・メールアドレスが表示される
  - 推奨: @testing-library/react, jest
- 未ログイン時は「ログインが必要です」等のメッセージが表示される
  - 推奨: @testing-library/react, jest

**5. E2Eテスト（オプション）**

- ログイン〜ダッシュボード〜ログアウトまでの一連のユーザー操作フロー
  - 推奨: Playwright
- Cookieのセット・削除、リダイレクト挙動のブラウザレベル検証
  - 推奨: Playwright

### セキュリティ強化案

#### CSRF対策

- 認証CookieはHttpOnly/SameSite=Laxで運用（現状十分）
- 重要なPOST系API追加時はCSRFトークン方式の導入を検討
  - 推奨ライブラリ例: csurf, @fastify/csrf-protection など

#### レート制限（Rate Limiting）

- 主要API（/api/auth/callback, /api/me, /api/logout等）にレートリミットを導入
  - 例: 1分間に10回まで
  - 推奨ライブラリ例: rate-limiter-flexible, @vercel/edge-rate-limit

### 2024-05-02 リファクタリング・改善内容まとめ

- 認証関連コード（verify-jwt.ts, useAuth.ts, middleware等）の責務分離・型定義強化・エラーハンドリング統一を実施
- APIレスポンス型（成功・エラー）を明示し、全APIでエラーレスポンス形式を統一
- 認証失敗時やトークン不正時には必ずCookieを削除する運用に統一
- /api/logout, middleware等も含めてCookie削除・認証状態管理の一貫性を確保
- テスト観点を洗い出し、API・UI・E2Eそれぞれに推奨ライブラリを明記
- セキュリティ強化案（CSRF対策・レート制限）を整理し、今後の拡張方針も明確化
- README.md, README.dev.mdと現状の実装に大きな齟齬はないが、型定義・エラー形式・セキュリティ・テスト方針など細かい運用はdevelopment.mdに詳細を記載

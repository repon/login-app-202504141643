# 🔐 OAuthログインアプリ

このアプリは、Next.js（App Router）による**セキュアなOAuthログイン処理**を学習目的で実装したものです。
BFF構成を採用し、Auth.js / NextAuth等を使わずに、OAuth認証・JWT処理・Cookie管理を**すべて自前で実装**しています。

---

## 🎯 学習目的とゴール

### 📌 目的

- OAuth2の認可コードフローを理解（code → token → JWT）
- HttpOnly Cookieによる安全なセッション管理の実装
- BFF構成におけるCookie運用とセキュリティ対策の理解
- 将来的なパスワード認証やRBACへの拡張を見据えた構成力の強化

### ✅ ゴール

- [x] 最小構成のログイン／ログアウト／ユーザー取得を実装
- [x] Cookieベースのセッション管理を構築
- [ ] パスワード認証構成の別ブランチ追加（予定）

---

## 🧭 ブランチ構成

| ブランチ名 | 構成                   | 説明                                           |
| ---------- | ---------------------- | ---------------------------------------------- |
| `main`     | OAuth + Cookie認証のみ | DBなし構成。最小構成の認証処理                 |
| `prisma`   | OAuth + DB連携あり構成 | Prisma + PostgreSQL によるユーザー管理付き構成 |

---

## 🛠 使用技術（prismaブランチ基準）

| 区分           | 技術構成                                    |
| -------------- | ------------------------------------------- |
| フレームワーク | Next.js（App Router）                       |
| 言語           | TypeScript                                  |
| ORM            | Prisma（prismaブランチのみ）                |
| DB             | Railway上のPostgreSQL（prismaブランチのみ） |
| 認証           | OAuth2（Google）                            |
| セッション     | JWT（HttpOnly Cookie保存）                  |
| デプロイ       | Vercel                                      |

---

## 📑 API一覧

| エンドポイント       | メソッド | 概要                             |
| -------------------- | -------- | -------------------------------- |
| `/auth/login`        | GET      | Google OAuthへリダイレクト       |
| `/api/auth/callback` | GET      | トークン取得 → Cookie保存        |
| `/api/me`            | GET      | JWT検証 → ログイン中ユーザー取得 |
| `/api/logout`        | POST     | Cookie削除 → ログアウト          |

---

## 🔐 セキュリティ設計

| 要素           | 設定内容                                      |
| -------------- | --------------------------------------------- |
| JWT保存        | HttpOnly Cookie                               |
| Cookie属性     | Secure / SameSite=Lax / Path=/ / Max-Age=3600 |
| JWT検証        | プロバイダの公開鍵を使った署名検証            |
| セッション形式 | Stateless（JWTベース）                        |
| エラー処理     | 401（トークン不正／期限切れ）など             |

---

## シーケンス図

```mermaid
sequenceDiagram
  participant U as User
  participant B as Browser
  participant S as Server
  participant G as Google

  U->>B: クリック（ログイン）<br/>（ページ: `/auth/login`）
  B->>S: GET /auth/login<br/>（サーバ: `/app/auth/login/page.tsx`）
  S->>G: Google認可エンドポイントにリダイレクト
  G->>S: リダイレクトバック + 認可コード<br/>（URL: `/api/auth/callback?code=xxx`）
  S->>G: POST /token でアクセストークン取得<br/>（サーバ: `/app/api/auth/callback/route.ts`）
  S->>S: JWT生成・Set-Cookie
  S-->>B: リダイレクト（/dashboard）<br/>（ページ: `/dashboard`）
  B->>S: GET /api/me<br/>（サーバ: `/app/api/me/route.ts`）
  S-->>B: ユーザー情報を返却（ログイン状態表示）
```

---

## 🧠 補足：再利用構成と拡張計画

### 再利用に向けた構成

- 認証処理（`lib/auth.ts`, `middleware.ts`, `hooks/useAuth.ts`）を共通化しやすい形で設計
- `/packages/auth`として外出しできる構成も検討

### 将来的な拡張候補

- 自前のパスワード認証（bcrypt）
- RBAC（管理者・一般ユーザー）によるアクセス制御
- Prisma Role管理 + `/admin` ページ保護
- リフレッシュトークン導入／自動ログアウト
- APIスキーマの型厳密化（zod等）
- E2E/ユニットテスト自動化（vitest等）

---

## 🧪 テスト観点

- 未ログインで `/api/me` にアクセス → 401
- JWTの期限切れ → 再ログイン要求
- Cookie属性（Secure, HttpOnly, SameSite）確認
- ログアウトでCookie削除
- 初回ログイン時のユーザー登録

---

## 📝 その他

### `.env.example`

```env
# Google OAuth 認証に必要（Google Cloud Console で取得）
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# アプリのベースURL（Vercelデプロイ時は本番URLに）
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_URL=http://localhost:3000
```

### Cursor連携について

- `dev-logs/` に進行ログやタスクメモをMarkdown形式で保存
- YAML frontmatterでCursorに認識させている

```md
---
title: タスク一覧
type: task
status: active
last_updated: 2025-03-29
---
```

---

MIT License / ご自由にどうぞ

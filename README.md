# 🔐 Login App - Next.js + JWT 認証

このアプリは、Next.js（App Router）で構築された**シンプルなJWTログインアプリ**です。  
フロントエンドとバックエンドを統合した**BFF構成**で、認証状態の保持やログイン後の画面切り替えを実装しています。

---

## 🚀 デモ

- アプリURL: [https://yourname.vercel.app](https://yourname.vercel.app)
- GitHubリポジトリ: [https://github.com/yourname/login-app](https://github.com/yourname/login-app)

---

## ⚙️ 使用技術・構成

| 分類           | 内容                        |
| -------------- | --------------------------- |
| フレームワーク | Next.js（App Router）       |
| 言語           | TypeScript                  |
| 認証           | JWT（自前実装、Cookie保存） |
| デプロイ       | Vercel（フロント）          |

---

## ✨ 実装ポイント・工夫点

- **JWT認証とCookieの連携**：
  - `HttpOnly` CookieにJWTを保存して、セキュアなログインを実現
- **`/api/me`によるユーザー状態取得**：
  - ページ描画時に認証状態をチェックし、ログイン後の表示を制御
- **middleware.ts or useAuth()** によるルート保護
- **Tailwind CSS** による簡潔なUI構築

---

## 📦 セットアップ手順

```bash
git clone https://github.com/yourname/login-app.git
cd login-app
cp .env.example .env
npm install
npm run dev
```

---

## 📁 .env 設定例

```env
APP_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
```

---

## 🧪 今後の拡張予定

- [ ] Prisma + Railway によるDB連携構成（`prisma` ブランチにて開発中）
- [ ] ユーザー登録・プロフィール編集
- [ ] RBAC（ロールベースアクセス制御）
- [ ] パスワードリセット
- [ ] 通知機能の追加
- [ ] テスト（supertest / vitest）導入

---

## 🧑‍💻 作者について

- フロントエンドエンジニア歴5年（Vue, React）
- 要件定義・API設計から実装・運用まで一貫対応
- Twitter: [@yourname](https://twitter.com/yourname)
- ポートフォリオ: [https://yourname.dev](https://yourname.dev)

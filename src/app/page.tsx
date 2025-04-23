'use client'

import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const { user, loading } = useAuth()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">ログインアプリにようこそ</h1>
      {loading ? (
        <p>ログイン状態を確認中...</p>
      ) : user ? (
        <p>{user.name}さんでログインしています。</p>
      ) : (
        <p>ログインしていない状態です。上部メニューからログインしてください。</p>
      )}
    </div>
  )
}

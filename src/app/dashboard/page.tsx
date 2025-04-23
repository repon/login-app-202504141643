'use client'

import { useAuth } from '@/hooks/useAuth'
import Image from 'next/image'

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p>読み込み中...</p>
  }

  if (!user) {
    return <p className="text-red-500">このページはログインが必要です。ログインしてください。</p>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">ようこそ、{user.name}さん</h2>
      <p>メールアドレス: {user.email}</p>
      {user.avatarUrl && (
        <Image
          src={user.avatarUrl}
          alt="ユーザーのプロフィール画像"
          width={80}
          height={80}
          className="rounded-full"
        />
      )}
      <p>このページはログインしたユーザーだけがアクセスできます。</p>
    </div>
  )
}

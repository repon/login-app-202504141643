'use client'

import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <header>
      {user ? (
        <div>
          <span>{user.name} さん</span>
          <img src={user.avatarUrl} alt="avatar" width={32} height={32} />
          <button
            onClick={() => {
              fetch('/api/logout', {
                method: 'POST',
              }).then(() => {
                window.location.href = '/'
              })
            }}
          >
            ログアウト
          </button>
        </div>
      ) : (
        <div>
          <a href="/auth/login">ログイン</a>
        </div>
      )}
    </header>
  )
}

'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const { user, loading } = useAuth()

  return (
    <header className="flex justify-between items-center px-4 py-2 border-b">
      <h1 className="text-lg font-bold">ログインアプリ</h1>

      {!loading && (
        <nav className="flex gap-4 items-center">
          <Link href="/">Home</Link>
          <Link href="/dashboard">Dashboard</Link>
          {user ? (
            <>
              <span>{user.name} さん</span>
              <button
                onClick={() => {
                  fetch('/api/logout', { method: 'POST' }).then(() => location.assign('/'))
                }}
                className="text-blue-500"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/auth/login" className="text-blue-500">
              Login
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}

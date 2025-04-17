'use client'

import { useEffect, useState } from 'react'

type User = {
  email: string
  name?: string
  avatarUrl?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/me')
        if (!response.ok) {
          setUser(null)
        } else {
          const data = await response.json()
          setUser(data.payload)
        }
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading }
}

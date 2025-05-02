'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  email: string
  name?: string
  avatarUrl?: string
}

type UseAuthOptions = {
  redirectOnFail?: boolean
}

export function useAuth(options: UseAuthOptions = {}) {
  const { redirectOnFail = true } = options
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/me')

        if (response.status === 401) {
          setUser(null)

          if (redirectOnFail) {
            router.push('/auth/login')
          }

          return
        }

        if (!response.ok) {
          setUser(null)
          return
        }

        const data = await response.json()
        setUser({
          email: data.payload.email,
          name: data.payload.name,
          avatarUrl: data.payload.picture,
        })
      } catch (error) {
        console.error('ユーザー情報の取得に失敗しました', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router, redirectOnFail])

  return { user, loading }
}

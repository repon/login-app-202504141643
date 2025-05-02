'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type ApiMeSuccess = {
  payload: {
    email: string
    name?: string
    picture?: string
    [key: string]: unknown
  }
}
type ApiMeError = {
  error: string | { code: string; message: string; details?: unknown }
}

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
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/me')
        if (response.status === 401) {
          setUser(null)
          setError('認証されていません')
          if (redirectOnFail) {
            router.push('/auth/login')
          }
          return
        }
        if (!response.ok) {
          setUser(null)
          setError('ユーザー情報取得に失敗しました')
          return
        }
        const data: ApiMeSuccess | ApiMeError = await response.json()
        if ('payload' in data && data.payload.email) {
          setUser({
            email: data.payload.email,
            name: data.payload.name,
            avatarUrl: data.payload.picture,
          })
          setError(null)
        } else {
          setUser(null)
          setError('ユーザー情報が取得できません')
        }
      } catch (err) {
        setUser(null)
        setError('ユーザー情報の取得に失敗しました')
        console.error('ユーザー情報の取得に失敗しました', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [router, redirectOnFail])

  return { user, loading, error }
}

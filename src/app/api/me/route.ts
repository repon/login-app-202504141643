import { NextRequest, NextResponse } from 'next/server'
import { verifyGoogleToken, JWTPayload } from '@/lib/verify-jwt'

// レスポンス型
interface ApiMeSuccess {
  payload: JWTPayload
}
interface ApiMeError {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  // Cookie削除用レスポンス
  const clearCookie = () =>
    NextResponse.json<ApiMeError>(
      {
        error: {
          code: 'UNAUTHORIZED',
          message: '認証情報がありません。再度ログインしてください。',
        },
      },
      {
        status: 401,
        headers: {
          'Set-Cookie': 'token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
        },
      }
    )

  if (!token) {
    return clearCookie()
  }

  try {
    const result = await verifyGoogleToken(token)
    if ('error' in result) {
      return clearCookie()
    }
    return NextResponse.json<ApiMeSuccess>({ payload: result.payload })
  } catch (error) {
    console.error('JWT verify failed:', error)
    return clearCookie()
  }
}

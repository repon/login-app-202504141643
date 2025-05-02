import { NextResponse } from 'next/server'

// レスポンス型
interface LogoutSuccess {
  message: string
}
interface LogoutError {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export async function POST() {
  try {
    const res = NextResponse.json<LogoutSuccess>({ message: 'Logged out' })
    res.cookies.set('token', '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    })
    return res
  } catch (error) {
    return NextResponse.json<LogoutError>(
      {
        error: {
          code: 'LOGOUT_ERROR',
          message: 'ログアウト処理に失敗しました',
          details: error,
        },
      },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { verifyGoogleToken } from '@/lib/verify-jwt'

export async function GET(req: NextRequest) {
  // src/app/api/auth/callback/route.ts のどこかで以下を追記！

  const base = process.env.APP_URL?.replace(/\/$/, '') ?? ''
  const redirectUri = `${base}/api/auth/callback`

  const code = req.nextUrl.searchParams.get('code')
  if (!code) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  })

  const tokenJson = await tokenRes.json()
  const id_token = tokenJson.id_token

  if (!id_token) {
    return NextResponse.redirect(new URL('/auth/login?error=token', req.url))
  }

  // JWTを検証し、payloadを取り出す
  const payload = await verifyGoogleToken(id_token)
  if (!payload) {
    return NextResponse.redirect(new URL('/auth/login?error=verify', req.url))
  }

  // 🍪 トークンをCookieに保存してリダイレクト
  const res = NextResponse.redirect(new URL('/dashboard', req.url))
  res.cookies.set({
    name: 'token',
    value: id_token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  })

  return res
}

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
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
      redirect_uri: process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback',
      grant_type: 'authorization_code',
    }),
  })

  const tokenJson = await tokenRes.json()
  const id_token = tokenJson.id_token

  if (!id_token) {
    return NextResponse.redirect(new URL('/auth/login?error=token', req.url))
  }

  // トークンをCookieに保存
  const res = NextResponse.redirect(new URL('/', req.url))
  res.cookies.set({
    name: 'token',
    value: id_token,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  })

  return res
}

import { NextRequest, NextResponse } from 'next/server'
import { verifyGoogleToken } from '@/lib/verify-jwt'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const isProtectedPath = req.nextUrl.pathname.startsWith('/dashboard')

  const verified = token && (await verifyGoogleToken(token))

  if (!verified && isProtectedPath) {
    const loginUrl = new URL('/auth/login', req.url)
    const res = NextResponse.redirect(loginUrl)
    res.cookies.set('token', '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    })
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}

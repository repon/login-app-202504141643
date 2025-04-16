import { NextRequest, NextResponse } from 'next/server'
import { verifyGoogleToken } from '@/lib/verify-jwt'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = await verifyGoogleToken(token)

    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    return NextResponse.json({ payload })
  } catch (error) {
    console.error('JWT verify failed:', error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

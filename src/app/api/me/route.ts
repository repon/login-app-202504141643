import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded = jwt.decode(token) as { email: string; name?: string; picture?: string }

    if (!decoded || !decoded.email) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    return NextResponse.json({
      email: decoded.email,
      name: decoded.name,
      avatar: decoded.picture,
    })
  } catch (error) {
    console.error('Token validation error:', error)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}

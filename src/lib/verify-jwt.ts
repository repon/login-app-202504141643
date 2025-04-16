import { jwtVerify, createRemoteJWKSet } from 'jose'

export type GoogleTokenPayload = {
  email: string
  name?: string
  picture?: string
} & Partial<Record<string, unknown>>

const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

export async function verifyGoogleToken(token: string): Promise<GoogleTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, GOOGLE_JWKS, {
      issuer: 'https://accounts.google.com',
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    return payload as GoogleTokenPayload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

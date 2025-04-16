import { jwtVerify, createRemoteJWKSet } from 'jose'

const GOOGLE_JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'))

export async function verifyGoogleToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, GOOGLE_JWKS, {
      issuer: 'https://accounts.google.com',
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    return payload
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

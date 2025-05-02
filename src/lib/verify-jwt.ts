import { jwtVerify, createRemoteJWKSet, JWTVerifyOptions, JWTVerifyGetKey } from 'jose'

// 共通のJWTペイロード型
export type JWTPayload = {
  email: string
  name?: string
  picture?: string
  [key: string]: unknown
}

// エラー型
export type JWTError = {
  code: 'INVALID_TOKEN' | 'EXPIRED_TOKEN' | 'UNKNOWN_ERROR'
  message: string
  details?: unknown
}

// Google固有の設定
const GOOGLE_CONFIG = {
  jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
  issuer: 'https://accounts.google.com',
  audience: process.env.GOOGLE_CLIENT_ID,
} as const

// 汎用的なJWT検証関数
export async function verifyJWT(
  token: string,
  getKey: JWTVerifyGetKey,
  options: JWTVerifyOptions
): Promise<{ payload: JWTPayload } | { error: JWTError }> {
  try {
    const { payload } = await jwtVerify(token, getKey, options)
    return { payload: payload as JWTPayload }
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'JWTExpired') {
        return {
          error: {
            code: 'EXPIRED_TOKEN',
            message: 'トークンの有効期限が切れています',
            details: error,
          },
        }
      }
      return {
        error: {
          code: 'INVALID_TOKEN',
          message: '無効なトークンです',
          details: error,
        },
      }
    }
    return {
      error: {
        code: 'UNKNOWN_ERROR',
        message: '予期せぬエラーが発生しました',
        details: error,
      },
    }
  }
}

// Googleトークン検証用の関数
export async function verifyGoogleToken(
  token: string
): Promise<{ payload: JWTPayload } | { error: JWTError }> {
  const jwks = createRemoteJWKSet(new URL(GOOGLE_CONFIG.jwksUri))

  return verifyJWT(token, jwks, {
    issuer: GOOGLE_CONFIG.issuer,
    audience: GOOGLE_CONFIG.audience,
  })
}

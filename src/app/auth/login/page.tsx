import { redirect } from 'next/navigation'

export default function LoginPage() {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const REDIRECT_URL = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback'
  const SCOPE = 'openid profile email'
  const RESPONSE_TYPE = 'code'
  // src/app/auth/login/page.tsx または OAuth URL を生成してる場所

  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`
  console.log('🔁 redirectUri sent to Google:', redirectUri)

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}`

  redirect(googleAuthUrl)
}

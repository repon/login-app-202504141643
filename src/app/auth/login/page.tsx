import { redirect } from 'next/navigation'

export default function LoginPage() {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const REDIRECT_URL = process.env.NEXT_PUBLIC_APP_URL + '/api/auth/callback'
  const SCOPE = 'openid profile email'
  const RESPONSE_TYPE = 'code'

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth')
  googleAuthUrl.searchParams.set('client_id', GOOGLE_CLIENT_ID!)
  googleAuthUrl.searchParams.set('redirect_uri', REDIRECT_URL)
  googleAuthUrl.searchParams.set('response_type', RESPONSE_TYPE)
  googleAuthUrl.searchParams.set('scope', SCOPE)
  googleAuthUrl.searchParams.set('prompt', 'select_account')

  redirect(googleAuthUrl.href)
}

'use client'

export default function LogoutPage() {
  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' })
    location.href = '/'
  }

  return <button onClick={handleLogout}>Logout</button>
}

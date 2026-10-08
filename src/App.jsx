import { useEffect, useState } from 'react'
import { api, clearToken, getToken } from './api.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import NewHirePortal from './NewHirePortal.jsx'

export default function App() {
  const [user, setUser] = useState(null)
  const [view, setView] = useState('login')
  const [checking, setChecking] = useState(() => Boolean(getToken()))

  // Restore the session from a stored token.
  useEffect(() => {
    if (!getToken()) return
    let ignore = false
    api('/auth/me')
      .then((me) => { if (!ignore) setUser(me) })
      .catch(() => clearToken())
      .finally(() => { if (!ignore) setChecking(false) })
    return () => { ignore = true }
  }, [])

  // api.jsx fires this when the server rejects the token.
  useEffect(() => {
    const onExpired = () => setUser(null)
    window.addEventListener('auth:expired', onExpired)
    return () => window.removeEventListener('auth:expired', onExpired)
  }, [])

  function signOut() {
    clearToken()
    setUser(null)
    setView('login')
  }

  if (checking) return null
  if (!user) {
    return view === 'signup'
      ? <Signup onLoggedIn={setUser} onSwitch={() => setView('login')} />
      : <Login onLoggedIn={setUser} onSwitch={() => setView('signup')} />
  }
  return user.role === 'admin'
    ? <AdminDashboard user={user} onSignOut={signOut} />
    : <NewHirePortal user={user} onSignOut={signOut} />
}

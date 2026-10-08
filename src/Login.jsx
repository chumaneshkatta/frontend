import { useState } from 'react'
import { api, clearToken, setToken } from './api.jsx'

export default function Login({ onLoggedIn, onSwitch }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const tok = await api('/auth/login', { method: 'POST', body: { email, password } })
      setToken(tok.accessToken)
      const me = await api('/auth/me')
      onLoggedIn(me)
    } catch (err) {
      clearToken()
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-wrap">
      <form className="login" onSubmit={submit}>
        <h1>Welcome to the team</h1>
        <p>Sign in to manage onboarding or see your own checklist.</p>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <p className="err" role="alert">{error}</p>
        <button className="btn primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="switch">New here? <button type="button" className="link" onClick={onSwitch}>Create an account</button></p>
      </form>
    </div>
  )
}

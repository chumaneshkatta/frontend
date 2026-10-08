import { useState } from 'react'
import { api, clearToken, setToken } from './api.jsx'

export default function Signup({ onLoggedIn, onSwitch }) {
  const [form, setForm] = useState({ fullName: '', email: '', department: '', role: 'user', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    setBusy(true)
    try {
      await api('/auth/register', {
        method: 'POST',
        body: {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          department: form.department.trim() || null,
        },
      })
      const tok = await api('/auth/login', { method: 'POST', body: { email: form.email.trim(), password: form.password } })
      setToken(tok.accessToken)
      onLoggedIn(await api('/auth/me'))
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
        <h1>Create your account</h1>
        <p>New hires get their onboarding checklist once HR adds tasks.</p>
        <label htmlFor="s-name">Full name</label>
        <input id="s-name" type="text" required maxLength={120} autoComplete="name" value={form.fullName} onChange={set('fullName')} />
        <label htmlFor="s-email">Email</label>
        <input id="s-email" type="email" required autoComplete="username" value={form.email} onChange={set('email')} />
        <label htmlFor="s-dept">Department (optional)</label>
        <input id="s-dept" type="text" maxLength={80} placeholder="Engineering, Sales, HR, Finance…" value={form.department} onChange={set('department')} />
        <label htmlFor="s-role">I am a</label>
        <select id="s-role" value={form.role} onChange={set('role')}>
          <option value="user">New hire</option>
          <option value="admin">HR admin (only works for the very first admin)</option>
        </select>
        <label htmlFor="s-pass">Password (8+ characters)</label>
        <input id="s-pass" type="password" required minLength={8} maxLength={72} autoComplete="new-password" value={form.password} onChange={set('password')} />
        <label htmlFor="s-confirm">Confirm password</label>
        <input id="s-confirm" type="password" required minLength={8} maxLength={72} autoComplete="new-password" value={form.confirm} onChange={set('confirm')} />
        <p className="err" role="alert">{error}</p>
        <button className="btn primary" disabled={busy}>{busy ? 'Creating account…' : 'Create account'}</button>
        <p className="switch">Already have an account? <button type="button" className="link" onClick={onSwitch}>Sign in</button></p>
      </form>
    </div>
  )
}

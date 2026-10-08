import { useState } from 'react'
import { api } from './api.jsx'

// Rendered only while open (Modal unmounts children when closed), so state resets each time.
export default function EmployeeDialog({ employee, onClose, onSaved }) {
  const editing = Boolean(employee)
  const [form, setForm] = useState({
    fullName: employee?.fullName ?? '',
    email: employee?.email ?? '',
    department: employee?.department ?? '',
    position: employee?.position ?? '',
    startDate: employee?.startDate ?? '',
    password: '',
  })
  const [error, setError] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setError('')
    const base = {
      fullName: form.fullName.trim(),
      department: form.department.trim(),
      position: form.position.trim(),
      startDate: form.startDate || null,
    }
    try {
      if (editing) {
        await api(`/employees/${employee.id}`, { method: 'PUT', body: base })
        onSaved(null)
      } else {
        const body = { ...base, email: form.email.trim() }
        if (form.password) body.password = form.password
        onSaved(await api('/employees', { method: 'POST', body }))
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={submit}>
      <h3>{editing ? 'Edit employee' : 'Add employee'}</h3>
      <label htmlFor="e-name">Full name</label>
      <input id="e-name" type="text" required maxLength={120} value={form.fullName} onChange={set('fullName')} />
      {!editing && (
        <>
          <label htmlFor="e-email">Email</label>
          <input id="e-email" type="email" required value={form.email} onChange={set('email')} />
        </>
      )}
      <label htmlFor="e-dept">Department</label>
      <input id="e-dept" type="text" maxLength={80} placeholder="Engineering, Sales, HR, Finance…" value={form.department} onChange={set('department')} />
      <label htmlFor="e-pos">Position</label>
      <input id="e-pos" type="text" maxLength={120} value={form.position} onChange={set('position')} />
      <label htmlFor="e-start">Start date</label>
      <input id="e-start" type="date" value={form.startDate} onChange={set('startDate')} />
      {!editing && (
        <>
          <label htmlFor="e-pass">Password (optional, 8+ characters)</label>
          <input id="e-pass" type="password" autoComplete="new-password" minLength={8} maxLength={72} placeholder="Leave blank to generate one" value={form.password} onChange={set('password')} />
        </>
      )}
      <p className="err" role="alert">{error}</p>
      <div className="row">
        <button type="button" className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary">Save employee</button>
      </div>
    </form>
  )
}

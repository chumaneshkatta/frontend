import { useState } from 'react'
import { api } from './api.jsx'

export default function TaskDialog({ employeeId, task, onClose, onSaved }) {
  const editing = Boolean(task)
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [dueDate, setDueDate] = useState(task?.dueDate ?? '')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    const fields = { title: title.trim(), description, dueDate: dueDate || null }
    try {
      if (editing) await api(`/tasks/${task.id}`, { method: 'PUT', body: fields })
      else await api('/tasks', { method: 'POST', body: { ...fields, userId: employeeId } })
      onSaved(editing ? 'Task updated' : 'Task added')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={submit}>
      <h3>{editing ? 'Edit task' : 'Add task'}</h3>
      <label htmlFor="t-title">Title</label>
      <input id="t-title" type="text" required maxLength={200} value={title} onChange={(e) => setTitle(e.target.value)} />
      <label htmlFor="t-desc">Description</label>
      <textarea id="t-desc" rows={3} maxLength={5000} value={description} onChange={(e) => setDescription(e.target.value)} />
      <label htmlFor="t-due">Due date</label>
      <input id="t-due" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      <p className="err" role="alert">{error}</p>
      <div className="row">
        <button type="button" className="btn" onClick={onClose}>Cancel</button>
        <button className="btn primary">Save task</button>
      </div>
    </form>
  )
}

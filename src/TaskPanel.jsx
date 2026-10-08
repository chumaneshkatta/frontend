import { useEffect, useState } from 'react'
import { api } from './api.jsx'
import Modal from './Modal.jsx'
import TaskDialog from './TaskDialog.jsx'

// Shows and manages one employee's tasks. `refreshKey` lets the parent force a reload.
export default function TaskPanel({ employeeId, refreshKey, onChanged, notify }) {
  const [detail, setDetail] = useState(null)
  const [reload, setReload] = useState(0)
  const [dialog, setDialog] = useState(null) // { task } while open; task is null when adding

  useEffect(() => {
    if (!employeeId) return
    let ignore = false
    api(`/employees/${employeeId}`)
      .then((d) => { if (!ignore) setDetail(d) })
      .catch((err) => notify(err.message))
    return () => { ignore = true }
  }, [employeeId, reload, refreshKey, notify])

  if (!employeeId) {
    return (
      <section className="panel">
        <div className="bar"><h2>Tasks</h2></div>
        <p className="empty">Select an employee to see their tasks.</p>
      </section>
    )
  }
  const current = detail && detail.id === employeeId ? detail : null

  async function act(fn, message) {
    try {
      await fn()
      if (message) notify(message)
      setReload((n) => n + 1)
      onChanged()
    } catch (err) {
      notify(err.message)
    }
  }

  const toggle = (t) => act(() => api(`/tasks/${t.id}`, { method: 'PUT', body: { completed: !t.completed } }))
  const remove = (t) => {
    if (confirm(`Delete the task "${t.title}"?`)) act(() => api(`/tasks/${t.id}`, { method: 'DELETE' }), 'Task deleted')
  }

  return (
    <section className="panel">
      <div className="bar">
        <h2>{current ? `${current.fullName}'s tasks` : 'Tasks'}</h2>
        <button className="btn primary" onClick={() => setDialog({ task: null })}>Add task</button>
      </div>
      {current && current.tasks.length === 0 && <p className="empty">No tasks yet. Add one for this employee.</p>}
      <ul className="tasks">
        {current?.tasks.map((t) => (
          <li key={t.id} className={t.completed ? 'done' : ''}>
            <input type="checkbox" checked={t.completed} aria-label={`Mark complete: ${t.title}`} onChange={() => toggle(t)} />
            <div className="body">
              <div className="t">{t.title}</div>
              {t.description && <div className="d">{t.description}</div>}
              {t.dueDate && <div className="d">Due {t.dueDate}</div>}
            </div>
            <div className="acts">
              <button className="btn sm" onClick={() => setDialog({ task: t })}>Edit</button>
              <button className="btn sm danger" onClick={() => remove(t)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
      <Modal open={dialog !== null} onClose={() => setDialog(null)}>
        {dialog && (
          <TaskDialog
            employeeId={employeeId}
            task={dialog.task}
            onClose={() => setDialog(null)}
            onSaved={(msg) => { setDialog(null); act(async () => {}, msg) }}
          />
        )}
      </Modal>
    </section>
  )
}

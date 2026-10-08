import { useEffect, useState } from 'react'
import { api } from './api.jsx'
import ChatBot from './ChatBot.jsx'

export default function NewHirePortal({ user, onSignOut }) {
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState('')
  const [pending, setPending] = useState(null) // id of the task being saved

  useEffect(() => {
    let ignore = false
    api('/tasks/my-tasks')
      .then((t) => { if (!ignore) setTasks(t) })
      .catch((err) => { if (!ignore) setError(err.message) })
    return () => { ignore = true }
  }, [])

  async function toggle(task) {
    setPending(task.id)
    setError('')
    try {
      const updated = await api(`/tasks/${task.id}`, { method: 'PUT', body: { completed: !task.completed } })
      setTasks((all) => all.map((t) => (t.id === updated.id ? updated : t)))
    } catch (err) {
      setError(err.message)
    } finally {
      setPending(null)
    }
  }

  const done = tasks.filter((t) => t.completed).length
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0

  return (
    <div className="portal">
      <header>
        <h1>Hi {user.fullName.split(' ')[0]}, let&apos;s get you set up</h1>
        <button className="btn" onClick={onSignOut}>Sign out</button>
      </header>
      <main>
        <section className="card">
          <h2>Your onboarding checklist</h2>
          <p className="sub">{tasks.length ? `${done} of ${tasks.length} tasks done` : 'No tasks assigned yet.'}</p>
          <div className="meter" role="progressbar" aria-label="Onboarding progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
            <i style={{ width: `${pct}%` }} />
          </div>
          <ul className="checklist">
            {tasks.map((t) => (
              <li key={t.id} className={t.completed ? 'done' : ''}>
                <input id={`task-${t.id}`} type="checkbox" checked={t.completed} disabled={pending === t.id} onChange={() => toggle(t)} />
                <label htmlFor={`task-${t.id}`}>
                  {t.title}
                  {t.description && <small>{t.description}</small>}
                  {t.dueDate && <small>Due {t.dueDate}</small>}
                </label>
              </li>
            ))}
          </ul>
          <p className="err" role="alert">{error}</p>
        </section>
        <ChatBot />
      </main>
    </div>
  )
}

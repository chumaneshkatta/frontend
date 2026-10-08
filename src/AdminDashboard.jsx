import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from './api.jsx'
import EmployeeDialog from './EmployeeDialog.jsx'
import Modal from './Modal.jsx'
import TaskPanel from './TaskPanel.jsx'
import Toast from './Toast.jsx'

const PAGE_SIZE = 10

export default function AdminDashboard({ user, onSignOut }) {
  const [data, setData] = useState({ items: [], total: 0 })
  const [page, setPage] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [search, setSearch] = useState('')
  const [reload, setReload] = useState(0)
  const [selectedId, setSelectedId] = useState(null)
  const [empDialog, setEmpDialog] = useState(null) // { employee } (null employee = add)
  const [created, setCreated] = useState(null) // new employee with a temporary password
  const [toast, setToast] = useState('')
  const toastTimer = useRef(null)

  const notify = useCallback((msg) => {
    setToast(msg)
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(''), 2600)
  }, [])

  // Debounce the search box.
  useEffect(() => {
    const id = setTimeout(() => { setSearch(searchText.trim()); setPage(0) }, 300)
    return () => clearTimeout(id)
  }, [searchText])

  useEffect(() => {
    let ignore = false
    api(`/employees?page=${page}&size=${PAGE_SIZE}&search=${encodeURIComponent(search)}`)
      .then((d) => { if (!ignore) setData(d) })
      .catch((err) => notify(err.message))
    return () => { ignore = true }
  }, [page, search, reload, notify])

  const refresh = useCallback(() => setReload((n) => n + 1), [])

  async function remove(emp) {
    if (!confirm(`Delete ${emp.fullName} and all their tasks? This can't be undone.`)) return
    try {
      await api(`/employees/${emp.id}`, { method: 'DELETE' })
      if (selectedId === emp.id) setSelectedId(null)
      if (data.items.length === 1 && page > 0) setPage(page - 1)
      notify('Employee deleted')
      refresh()
    } catch (err) {
      notify(err.message)
    }
  }

  const from = data.total ? page * PAGE_SIZE + 1 : 0
  const to = Math.min((page + 1) * PAGE_SIZE, data.total)

  return (
    <div className="admin">
      <header>
        <h1>Onboarding · HR admin</h1>
        <span>{user.fullName}</span>
        <button className="btn" onClick={onSignOut}>Sign out</button>
      </header>
      <div className="layout">
        <section className="panel">
          <div className="bar">
            <h2>Employees</h2>
            <input type="search" placeholder="Search name, email, department" aria-label="Search employees" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
            <button className="btn primary" onClick={() => setEmpDialog({ employee: null })}>Add employee</button>
          </div>
          <div className="scroll">
            <table>
              <thead>
                <tr><th>Employee</th><th>Department</th><th>Progress</th><th><span className="sr">Actions</span></th></tr>
              </thead>
              <tbody>
                {data.items.length === 0 && (
                  <tr><td colSpan={4} className="empty">No employees found. Add the first new hire.</td></tr>
                )}
                {data.items.map((e) => (
                  <tr key={e.id} className={e.id === selectedId ? 'sel' : ''}>
                    <td>{e.fullName}<small>{e.email}</small></td>
                    <td>{e.department || '–'}<small>{e.position}</small></td>
                    <td>
                      <progress max={e.totalTasks || 1} value={e.completedTasks} aria-label="Task progress" />
                      <small>{e.completedTasks} of {e.totalTasks} done</small>
                    </td>
                    <td>
                      <div className="acts">
                        <button className="btn sm" onClick={() => setSelectedId(e.id)}>Tasks</button>
                        <button className="btn sm" onClick={() => setEmpDialog({ employee: e })}>Edit</button>
                        <button className="btn sm danger" onClick={() => remove(e)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pager">
            <span>{from}–{to} of {data.total}</span>
            <button className="btn sm" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
            <button className="btn sm" disabled={to >= data.total} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        </section>

        <TaskPanel employeeId={selectedId} refreshKey={reload} onChanged={refresh} notify={notify} />
      </div>

      <Modal open={empDialog !== null} onClose={() => setEmpDialog(null)}>
        {empDialog && (
          <EmployeeDialog
            employee={empDialog.employee}
            onClose={() => setEmpDialog(null)}
            onSaved={(createdEmployee) => {
              setEmpDialog(null)
              notify(createdEmployee ? 'Employee added' : 'Employee updated')
              if (createdEmployee?.temporaryPassword) setCreated(createdEmployee)
              refresh()
            }}
          />
        )}
      </Modal>

      <Modal open={created !== null} onClose={() => setCreated(null)}>
        {created && (
          <div>
            <h3>Employee created</h3>
            <p>Share this temporary password with <strong>{created.fullName}</strong>. It is shown only once.</p>
            <p><code>{created.temporaryPassword}</code></p>
            <div className="row"><button className="btn primary" onClick={() => setCreated(null)}>Done</button></div>
          </div>
        )}
      </Modal>

      <Toast message={toast} />
    </div>
  )
}

import { useEffect, useRef, useState } from 'react'
import { api } from './api.jsx'

const SUGGESTIONS = ['How many vacation days do I get?', 'Can I work remotely?', 'How do I submit expenses?']

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { id: 0, who: 'bot', text: 'Hi! Ask me about leave, remote work, expenses, benefits, payroll or IT security.' },
  ])
  const [question, setQuestion] = useState('')
  const [busy, setBusy] = useState(false)
  const nextId = useRef(1)
  const logRef = useRef(null)

  useEffect(() => {
    logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages])

  async function ask(q) {
    const text = q.trim()
    if (text.length < 3 || busy) return
    const add = (m) => setMessages((all) => [...all, { id: nextId.current++, ...m }])
    add({ who: 'me', text })
    setQuestion('')
    setBusy(true)
    try {
      const r = await api('/rag/chat', { method: 'POST', body: { question: text } })
      add({ who: 'bot', text: r.answer, sources: r.sources })
    } catch (err) {
      add({ who: 'bot', text: err.message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="card chat">
      <h2>Ask about company policies</h2>
      <p className="sub">Answers come from the onboarding policy library.</p>
      <div className="chips">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" className="chip" onClick={() => ask(s)}>{s}</button>
        ))}
      </div>
      <div className="log" ref={logRef} aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.who}`}>
            {m.text}
            {m.sources?.length > 0 && <small>From: {m.sources.map((s) => s.title).join(', ')}</small>}
          </div>
        ))}
        {busy && <div className="msg bot">Looking that up…</div>}
      </div>
      <form className="ask" onSubmit={(e) => { e.preventDefault(); ask(question) }}>
        <input type="text" placeholder="e.g. How many vacation days do I get?" aria-label="Your question" minLength={3} maxLength={500} required value={question} onChange={(e) => setQuestion(e.target.value)} />
        <button className="btn primary" disabled={busy}>Ask</button>
      </form>
    </section>
  )
}

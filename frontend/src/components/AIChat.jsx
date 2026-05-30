import { useState, useRef, useEffect } from 'react'

const SUGGESTIONS = [
  'What is the biggest risk today?',
  'Which countries are critical?',
  'Summarize the transport risks',
  'What should I monitor closely?',
]

export default function AIChat({ news, risks }) {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([
    { role: 'assistant', text: "Hi! I'm your supply chain analyst. Ask me anything about current risks." }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [ping, setPing] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setPing(true), 3000)
      return () => clearTimeout(t)
    }
    setPing(false)
  }, [open])

  const context = `
You are a supply chain risk analyst AI embedded in SupplyGuard dashboard.
Current live data:
RISKS: ${JSON.stringify(risks.slice(0, 10))}
HEADLINES: ${JSON.stringify(news.slice(0, 10))}
Be concise, direct, use bullet points. Max 3-4 sentences or 4 bullets.
  `.trim()

  const send = async (text) => {
    const q = text || input.trim()
    if (!q || loading) return
    setInput('')
    setMsgs(m => [...m, { role: 'user', text: q }])
    setLoading(true)
    try {
      const history = msgs.filter((_, i) => i > 0).map(m => ({ role: m.role, content: m.text }))
      const res = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'phi3:mini',
          stream: false,
          messages: [
            { role: 'system', content: context },
            ...history,
            { role: 'user', content: q }
          ]
        })
      })
      const data = await res.json()
      const reply = data.message?.content || 'Sorry, could not get a response.'
      setMsgs(m => [...m, { role: 'assistant', text: reply }])
    } catch {
      setMsgs(m => [...m, { role: 'assistant', text: 'Connection error. Make sure the API is reachable.' }])
    }
    setLoading(false)
  }

  return (
    <>
      <button onClick={() => setOpen(o => !o)} style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 999,
        width: 54, height: 54, borderRadius: '50%',
        background: 'linear-gradient(135deg,#3b7ef8,#06b6d4)',
        border: 'none', cursor: 'pointer', fontSize: 22,
        boxShadow: '0 8px 32px rgba(59,126,248,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'transform 0.2s',
      }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        {open ? '✕' : '🤖'}
        {ping && !open && (
          <span style={{
            position: 'absolute', top: 0, right: 0,
            width: 14, height: 14, borderRadius: '50%',
            background: '#ef4444', border: '2px solid #030711',
            animation: 'pulse 1.5s infinite'
          }} />
        )}
      </button>

      {open && (
        <div style={{
          position: 'fixed', bottom: 94, right: 28, zIndex: 998,
          width: 360, height: 480,
          background: 'var(--surface)', border: '1px solid rgba(59,126,248,0.25)',
          borderRadius: 18, display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,126,248,0.1)',
          overflow: 'hidden', animation: 'slideUp 0.25s ease',
        }}>
          <div style={{
            padding: '14px 18px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(59,126,248,0.06)'
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#3b7ef8,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>🤖</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>Risk Analyst AI</div>
              <div style={{ fontSize: 10, color: 'var(--green)', fontFamily: 'Space Mono,monospace', letterSpacing: 1 }}>● ONLINE</div>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {msgs.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '9px 13px',
                  borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  background: m.role === 'user' ? 'linear-gradient(135deg,#3b7ef8,#06b6d4)' : 'var(--surface2)',
                  border: m.role === 'user' ? 'none' : '1px solid var(--border)',
                  fontSize: 12, color: m.role === 'user' ? '#fff' : 'var(--text)',
                  lineHeight: 1.6, whiteSpace: 'pre-wrap'
                }}>{m.text}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 5, padding: '8px 13px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '14px 14px 14px 4px', width: 'fit-content' }}>
                {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', animation: `pulse 1.2s ease ${i*0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {msgs.length <= 1 && (
            <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  fontSize: 11, padding: '5px 10px', borderRadius: 20,
                  background: 'rgba(59,126,248,0.08)', border: '1px solid rgba(59,126,248,0.2)',
                  color: 'var(--blue)', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about supply chain risks..."
              style={{
                flex: 1, background: 'var(--surface2)', border: '1px solid var(--border2)',
                borderRadius: 10, padding: '9px 13px', fontSize: 12,
                color: 'var(--text)', outline: 'none', fontFamily: 'inherit',
              }}
            />
            <button onClick={() => send()} disabled={loading || !input.trim()} style={{
              width: 36, height: 36, borderRadius: 10, border: 'none',
              background: input.trim() ? 'linear-gradient(135deg,#3b7ef8,#06b6d4)' : 'var(--surface2)',
              color: '#fff', cursor: input.trim() ? 'pointer' : 'default',
              fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>↑</button>
          </div>
        </div>
      )}
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:none } }`}</style>
    </>
  )
}

import { useState, useEffect, useCallback } from 'react'

let _addToast = null

export function toast(msg, type = 'info') {
  _addToast?.({ msg, type, id: Date.now() })
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  const add = useCallback((t) => {
    setToasts(prev => [...prev, t])
    setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 3200)
  }, [])

  useEffect(() => { _addToast = add; return () => { _addToast = null } }, [add])

  const colors = { info: '#3b7ef8', success: '#10b981', error: '#ef4444', warning: '#f59e0b' }
  const icons  = { info: 'ℹ️', success: '✓', error: '✕', warning: '⚠️' }

  return (
    <div style={{ position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', pointerEvents: 'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: 'var(--surface2)', border: `1px solid ${colors[t.type]}44`,
          borderLeft: `3px solid ${colors[t.type]}`, borderRadius: 10, padding: '10px 18px',
          fontSize: 13, color: 'var(--text)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', gap: 8, animation: 'toastIn 0.3s ease', whiteSpace: 'nowrap',
        }}>
          <span>{icons[t.type]}</span><span>{t.msg}</span>
        </div>
      ))}
      <style>{`@keyframes toastIn { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }`}</style>
    </div>
  )
}

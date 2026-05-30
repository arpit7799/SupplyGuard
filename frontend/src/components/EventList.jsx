import { useState } from 'react'
import AlertCard from './AlertCard'

export default function EventList({ events }) {
  const [filter, setFilter] = useState('all')
  const filters = ['all', 'high', 'medium', 'low']
  const filtered = filter === 'all' ? events : events.filter(e => e.risk === filter)
  const counts = { all: events.length, high: events.filter(e=>e.risk==='high').length, medium: events.filter(e=>e.risk==='medium').length, low: events.filter(e=>e.risk==='low').length }
  const activeColor = { all: 'var(--blue)', high: '#EF4444', medium: '#D97706', low: '#059669' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            textTransform: 'capitalize', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
            background: filter === f ? activeColor[f] : 'white',
            border: `1.5px solid ${filter === f ? activeColor[f] : 'var(--border2)'}`,
            color: filter === f ? 'white' : 'var(--muted2)',
            boxShadow: filter === f ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
          }}>
            {f} <span style={{ opacity: 0.75, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}>{counts[f]}</span>
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.length === 0
          ? <p style={{ color: 'var(--muted)', fontSize: 13, padding: '1rem' }}>No events found.</p>
          : filtered.map(e => <AlertCard key={e.id} item={e} />)}
      </div>
    </div>
  )
}

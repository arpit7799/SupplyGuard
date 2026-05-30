const shimmer = {
  background: 'linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.4s infinite',
  borderRadius: 8,
}

export default function Skeleton() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '110px 1.5rem 2rem', display: 'grid', gridTemplateColumns: '360px 1fr', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ ...shimmer, height: 12, width: '75%' }} />
              <div style={{ ...shimmer, height: 10, width: '45%' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ ...shimmer, height: 72, borderRadius: 14 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[...Array(3)].map((_, i) => <div key={i} style={{ ...shimmer, height: 96, borderRadius: 14 }} />)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
            <div style={{ ...shimmer, height: 320, borderRadius: 16 }} />
            <div style={{ ...shimmer, height: 320, borderRadius: 16 }} />
          </div>
          <div style={{ ...shimmer, height: 160, borderRadius: 16 }} />
        </div>
      </div>
    </div>
  )
}

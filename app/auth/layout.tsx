export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#1E2329',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: "'DM Sans', system-ui, sans-serif",
    }}>
      {/* Logo */}
      <a href="/" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        textDecoration: 'none',
        marginBottom: '40px',
      }}>
        <div style={{
          width: 36,
          height: 36,
          background: '#E8500A',
          borderRadius: 9,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
            <path d="M3 18h18" />
            <path d="M5 18v-1a7 7 0 0 1 14 0v1" />
            <path d="M10 11V7a2 2 0 0 1 4 0v4" />
          </svg>
        </div>
        <span style={{
          fontWeight: 600,
          fontSize: 18,
          color: '#FAFAF8',
          letterSpacing: '-0.02em',
        }}>
          Santi<span style={{ color: '#E8500A' }}>er</span>
        </span>
      </a>

      {children}

      <p style={{
        marginTop: 32,
        fontSize: 13,
        color: 'rgba(255,255,255,0.25)',
        textAlign: 'center',
      }}>
        © 2026 Santier.app · Construit în România
      </p>
    </div>
  )
}

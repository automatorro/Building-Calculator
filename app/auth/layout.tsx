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
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path d="M2 14L8 2L14 14M5 10H11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{
          fontWeight: 600,
          fontSize: 18,
          color: '#FAFAF8',
          letterSpacing: '-0.02em',
        }}>
          Building<span style={{ color: '#E8500A' }}>Calc</span>
        </span>
      </a>

      {children}

      <p style={{
        marginTop: 32,
        fontSize: 13,
        color: 'rgba(255,255,255,0.25)',
        textAlign: 'center',
      }}>
        © 2026 BuildingCalc · Construit în România
      </p>
    </div>
  )
}

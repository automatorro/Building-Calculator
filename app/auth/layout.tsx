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

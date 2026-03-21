'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{
        padding: '10px 24px',
        background: '#E8500A',
        color: 'white',
        border: 'none',
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'DM Sans, system-ui, sans-serif',
        transition: 'background .15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = '#C43F06')}
      onMouseLeave={e => (e.currentTarget.style.background = '#E8500A')}
    >
      🖨 Printează / Salvează PDF
    </button>
  )
}

'use client'

export default function LogoMark({ size = 30 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        background: '#E8500A',
        borderRadius: 7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <svg
        width={Math.round(size * 0.7)}
        height={Math.round(size * 0.7)}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 18h18" />
        <path d="M19 18v-1a7 7 0 0 0-14 0v1" />
        <path d="M12 10V7" />
        <path d="M9 11V9" />
        <path d="M15 11V9" />
      </svg>
    </div>
  )
}

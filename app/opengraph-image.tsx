import { ImageResponse } from 'next/og'
import { site } from '@/lib/site'

export const dynamic = 'force-static'
export const alt = `Agentic Income Template - Clone-and-deploy AI-tool comparison starter`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #05070d 0%, #0b1220 52%, #111827 100%)',
          color: '#f8fafc',
          fontFamily: 'Inter, Arial, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 75% 25%, #14b8a644, transparent 34%), radial-gradient(circle at 88% 70%, #f9731633, transparent 30%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -20,
            top: 70,
            width: 430,
            height: 430,
            border: '1px solid rgba(219,234,254,0.18)',
            borderRadius: 48,
            transform: 'rotate(8deg)',
            background: 'rgba(255,255,255,0.045)',
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', padding: 76, width: 820, position: 'relative' }}>
          <div
            style={{
              display: 'flex',
              width: 360,
              padding: '10px 18px',
              borderRadius: 999,
              border: '1px solid rgba(219,234,254,0.18)',
              color: '#14b8a6',
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            L4 / {site.domain}
          </div>
          <div style={{ marginTop: 42, fontSize: 78, fontWeight: 900, lineHeight: 0.95 }}>{site.name}</div>
          <div style={{ marginTop: 28, fontSize: 34, fontWeight: 700, color: '#dbeafe' }}>{site.tagline}</div>
          <div style={{ marginTop: 24, fontSize: 24, lineHeight: 1.35, color: '#94a3b8' }}>{site.description}</div>
        </div>
      </div>
    ),
    size
  )
}

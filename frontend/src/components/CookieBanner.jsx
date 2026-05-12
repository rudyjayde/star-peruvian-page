import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('sp_cookie_consent')
    if (!consent) setTimeout(() => setVisible(true), 1500)
  }, [])

  const accept = () => {
    localStorage.setItem('sp_cookie_consent', 'accepted')
    setVisible(false)
  }

  const reject = () => {
    localStorage.setItem('sp_cookie_consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: 'rgba(10,10,10,0.97)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      padding: '20px 24px',
      animation: 'slideUpBanner 0.4s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <style>{`
        @keyframes slideUpBanner {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 260 }}>
          <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>🍪</span>
          <div>
            <p style={{ color: 'white', fontSize: 14, fontWeight: 600, marginBottom: 4, fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>
              Usamos cookies
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.6 }}>
              Utilizamos cookies propias y de terceros para mejorar tu experiencia de navegación.
              Al continuar, aceptas nuestra{' '}
              <Link to="/privacidad" style={{ color: 'var(--red)', textDecoration: 'underline' }} onClick={accept}>
                Política de Privacidad
              </Link>
              {' '}y el uso de cookies.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
          <button
            onClick={reject}
            style={{
              padding: '10px 20px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.6)',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => e.target.style.borderColor = 'rgba(255,255,255,0.5)'}
            onMouseLeave={e => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
          >
            Solo esenciales
          </button>
          <button
            onClick={accept}
            style={{
              padding: '10px 24px',
              background: 'var(--red)',
              border: 'none',
              color: 'white',
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.03em',
              transition: 'var(--transition)',
            }}
            onMouseEnter={e => e.target.style.background = 'var(--red-dark)'}
            onMouseLeave={e => e.target.style.background = 'var(--red)'}
          >
            Aceptar todas
          </button>
        </div>
      </div>
    </div>
  )
}

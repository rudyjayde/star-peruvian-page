import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Minus, Plus } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { resolveAssetUrl } from '../utils/assetUrl'

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart()
  const navigate = useNavigate()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <div style={{ background: 'var(--blue)', padding: '80px 0 48px' }}>
        <div className="container">
          <Link to="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            ← Seguir comprando
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'white' }}>
            Tu Carrito
          </h1>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 24px', maxWidth: 860 }}>
        {items.length === 0 ? (
          <div className="empty-state">
            <p>Tu carrito está vacío.</p>
            <Link to="/" className="btn btn-red" style={{ marginTop: 16, display: 'inline-flex' }}>
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            {items.map(item => (
              <div
                key={item.productId}
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                  padding: '16px 0',
                  borderBottom: '1px solid var(--gray-200)',
                }}
              >
                <img
                  src={resolveAssetUrl(item.image) || '/img/logo ACTUALIZADO.png'}
                  alt={item.name}
                  style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 'var(--radius)', flexShrink: 0 }}
                  onError={e => { e.target.src = '/img/logo ACTUALIZADO.png' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ color: 'var(--gray-600)', fontSize: 14 }}>
                    S/ {item.price.toFixed(2)} · mín. {item.minOrder}u
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => updateQuantity(item.productId, Math.max(item.minOrder, item.quantity - item.minOrder))}
                    aria-label="Reducir cantidad"
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ minWidth: 32, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
                  <button
                    type="button"
                    className="btn-icon"
                    onClick={() => updateQuantity(item.productId, item.quantity + item.minOrder)}
                    aria-label="Aumentar cantidad"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div style={{ fontWeight: 700, color: 'var(--red)', minWidth: 90, textAlign: 'right' }}>
                  S/ {(item.price * item.quantity).toFixed(2)}
                </div>
                <button
                  type="button"
                  className="btn-icon danger"
                  onClick={() => removeItem(item.productId)}
                  aria-label="Quitar del carrito"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0' }}>
              <span style={{ fontSize: 18, fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--red)' }}>
                S/ {total.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              className="btn btn-red btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/checkout')}
            >
              Proceder al pago
            </button>
          </>
        )}
      </div>
    </div>
  )
}

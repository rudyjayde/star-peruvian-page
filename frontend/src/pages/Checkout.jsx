import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useCart } from '../context/CartContext'

const CULQI_SCRIPT_SRC = 'https://checkout.culqi.com/js/v4'
const CULQI_PUBLIC_KEY = import.meta.env.VITE_CULQI_PUBLIC_KEY

export default function Checkout() {
  const { items, total, clear } = useCart()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '' })
  const [scriptReady, setScriptReady] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const customerRef = useRef(customer)
  customerRef.current = customer

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    if (items.length === 0) navigate('/carrito')
  }, [items, navigate])

  useEffect(() => {
    if (document.querySelector(`script[src="${CULQI_SCRIPT_SRC}"]`)) {
      setScriptReady(true)
      return
    }
    const script = document.createElement('script')
    script.src = CULQI_SCRIPT_SRC
    script.onload = () => setScriptReady(true)
    document.body.appendChild(script)
  }, [])

  // Culqi's widget calls this global callback with the tokenized card once
  // the buyer finishes entering it in the iframe it opens.
  useEffect(() => {
    window.culqi = async () => {
      if (!window.Culqi.token) {
        setError(window.Culqi.error?.user_message || 'No se pudo procesar la tarjeta')
        setSubmitting(false)
        return
      }

      try {
        const res = await axios.post('/api/checkout', {
          items: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
          customer: customerRef.current,
          culqiToken: window.Culqi.token.id,
        })
        clear()
        navigate('/', { state: { orderConfirmed: res.data.orderId } })
      } catch (err) {
        setError(err.response?.data?.message || 'Ocurrió un error al procesar tu pedido')
      } finally {
        setSubmitting(false)
      }
    }
    return () => { delete window.culqi }
  }, [items, clear, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!CULQI_PUBLIC_KEY) {
      setError('Los pagos aún no están configurados (falta VITE_CULQI_PUBLIC_KEY). Contacta al administrador.')
      return
    }
    if (!scriptReady || !window.Culqi) {
      setError('El sistema de pagos aún está cargando, intenta de nuevo en unos segundos')
      return
    }

    setSubmitting(true)
    window.Culqi.publicKey = CULQI_PUBLIC_KEY
    window.Culqi.settings({
      title: 'Star Peruvian',
      currency: 'PEN',
      amount: Math.round(total * 100),
    })
    window.Culqi.open()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <div style={{ background: 'var(--blue)', padding: '80px 0 48px' }}>
        <div className="container">
          <Link to="/carrito" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            ← Volver al carrito
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'white' }}>
            Finalizar Pedido
          </h1>
        </div>
      </div>

      <div className="container" style={{ padding: '48px 24px', maxWidth: 560 }}>
        {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre completo *</label>
            <input
              type="text"
              className="form-input"
              value={customer.name}
              onChange={e => setCustomer(c => ({ ...c, name: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              className="form-input"
              value={customer.email}
              onChange={e => setCustomer(c => ({ ...c, email: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Teléfono *</label>
            <input
              type="tel"
              className="form-input"
              value={customer.phone}
              onChange={e => setCustomer(c => ({ ...c, phone: e.target.value }))}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Dirección de entrega</label>
            <input
              type="text"
              className="form-input"
              value={customer.address}
              onChange={e => setCustomer(c => ({ ...c, address: e.target.value }))}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderTop: '1px solid var(--gray-200)', marginTop: 8 }}>
            <span style={{ fontWeight: 600 }}>Total a pagar</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--red)' }}>
              S/ {total.toFixed(2)}
            </span>
          </div>

          <button type="submit" className="btn btn-red btn-lg" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
            {submitting ? 'Procesando...' : 'Pagar con tarjeta'}
          </button>
        </form>
      </div>
    </div>
  )
}

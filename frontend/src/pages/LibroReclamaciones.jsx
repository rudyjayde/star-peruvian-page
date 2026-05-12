import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const initialForm = {
  nombre: '',
  apellido: '',
  dni: '',
  telefono: '',
  email: '',
  direccion: '',
  tipo_bien: 'producto',
  descripcion_bien: '',
  monto: '',
  tipo_reclamo: 'reclamo',
  detalle_reclamo: '',
  pedido_consumidor: '',
}

export default function LibroReclamaciones() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState(null) // null | 'loading' | 'success' | 'error'
  const [correlativo, setCorrelativo] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await axios.post('/api/reclamaciones', form)
      setCorrelativo(res.data.numero_correlativo)
      setStatus('success')
      setForm(initialForm)
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error al enviar. Intente nuevamente.')
      setStatus('error')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      {/* Header */}
      <div style={{ background: 'var(--blue)', padding: '80px 0 48px' }}>
        <div className="container">
          <Link to="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            ← Volver al inicio
          </Link>
          <div style={{ display: 'inline-block', background: 'rgba(227,6,19,0.2)', border: '1px solid rgba(227,6,19,0.3)', color: 'rgba(255,255,255,0.8)', padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
            INDECOPI
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'white', letterSpacing: '0.02em' }}>
            Libro de Reclamaciones
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 12, fontSize: 14, maxWidth: 580 }}>
            Conforme al Código de Protección y Defensa del Consumidor (Ley N° 29571), ponemos a
            su disposición este Libro de Reclamaciones Virtual.
          </p>
        </div>
      </div>

      {/* INDECOPI notice */}
      <div style={{ background: 'var(--off-white)', borderBottom: '1px solid var(--gray-200)', padding: '16px 0' }}>
        <div className="container" style={{ maxWidth: 860 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 13, color: 'var(--gray-600)' }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>ℹ️</span>
            <p style={{ margin: 0, lineHeight: 1.7 }}>
              La formulación de una <strong>queja</strong> no es una denuncia y no inicia un procedimiento administrativo.
              Un <strong>reclamo</strong> implica disconformidad con los bienes o servicios adquiridos.
              STAR PERUVIAN responderá en un plazo máximo de <strong>30 días calendario</strong>.
              El registro de su reclamación no impide acudir ante <strong>INDECOPI</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Success screen */}
      {status === 'success' ? (
        <div className="container" style={{ padding: '80px 24px', maxWidth: 600, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 24px' }}>
            ✅
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>
            Reclamación Registrada
          </h2>
          <p style={{ color: 'var(--gray-600)', fontSize: 15, lineHeight: 1.8, marginBottom: 8 }}>
            Su reclamación ha sido registrada correctamente. Guarde el siguiente número correlativo:
          </p>
          <div style={{ background: 'var(--blue)', color: 'white', fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '0.06em', padding: '16px 32px', borderRadius: 8, display: 'inline-block', margin: '16px 0 24px' }}>
            {correlativo}
          </div>
          <p style={{ color: 'var(--gray-600)', fontSize: 14, lineHeight: 1.8, marginBottom: 32 }}>
            Le responderemos dentro de los próximos 30 días calendario por el email o teléfono proporcionado.
            Si necesita seguimiento, contáctenos por WhatsApp indicando su número correlativo.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={`https://wa.me/51974789135?text=Hola%2C%20tengo%20una%20reclamaci%C3%B3n%20registrada%20con%20el%20n%C3%BAmero%20${correlativo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-blue"
            >
              Dar seguimiento por WhatsApp
            </a>
            <button onClick={() => setStatus(null)} className="btn" style={{ border: '1px solid var(--gray-200)' }}>
              Nueva reclamación
            </button>
          </div>
        </div>
      ) : (
        /* Form */
        <div className="container" style={{ padding: '64px 24px', maxWidth: 860 }}>
          <form onSubmit={handleSubmit}>

            {/* Section 1: Datos del consumidor */}
            <FormSection title="1. Datos del Consumidor o Usuario">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                <Field label="Nombre *" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Tu nombre" />
                <Field label="Apellidos *" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Tus apellidos" />
                <Field label="DNI / RUC *" name="dni" value={form.dni} onChange={handleChange} placeholder="12345678" maxLength={15} />
                <Field label="Teléfono *" name="telefono" value={form.telefono} onChange={handleChange} placeholder="+51 999 999 999" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginTop: 16 }}>
                <Field label="Correo electrónico *" name="email" type="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" />
                <Field label="Dirección (opcional)" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Lima, Perú" />
              </div>
            </FormSection>

            {/* Section 2: Bien contratado */}
            <FormSection title="2. Identificación del Bien Contratado">
              <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                {[['producto', 'Producto'], ['servicio', 'Servicio']].map(([val, label]) => (
                  <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '10px 20px', border: `2px solid ${form.tipo_bien === val ? 'var(--blue)' : 'var(--gray-200)'}`, borderRadius: 8, fontWeight: form.tipo_bien === val ? 700 : 400, color: form.tipo_bien === val ? 'var(--blue)' : 'var(--gray-600)', background: form.tipo_bien === val ? 'rgba(30,58,138,0.05)' : 'white', transition: 'var(--transition)', fontSize: 14 }}>
                    <input type="radio" name="tipo_bien" value={val} checked={form.tipo_bien === val} onChange={handleChange} style={{ display: 'none' }} />
                    {label}
                  </label>
                ))}
              </div>
              <Field label="Descripción del producto o servicio *" name="descripcion_bien" value={form.descripcion_bien} onChange={handleChange} placeholder="Ej: Casacas de invierno talla M, pedido #1234..." textarea rows={3} />
              <div style={{ marginTop: 16, maxWidth: 280 }}>
                <Field label="Monto pagado (S/.) opcional" name="monto" type="number" value={form.monto} onChange={handleChange} placeholder="0.00" min="0" step="0.01" />
              </div>
            </FormSection>

            {/* Section 3: Detalle del reclamo */}
            <FormSection title="3. Detalle de la Reclamación">
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 10, fontWeight: 600 }}>Tipo *</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {[
                    ['reclamo', 'Reclamo', 'Disconformidad con el bien o servicio recibido'],
                    ['queja', 'Queja', 'Malestar con la atención recibida sin disconformidad económica'],
                  ].map(([val, label, desc]) => (
                    <label key={val} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', padding: '12px 16px', border: `2px solid ${form.tipo_reclamo === val ? 'var(--red)' : 'var(--gray-200)'}`, borderRadius: 8, background: form.tipo_reclamo === val ? 'rgba(227,6,19,0.04)' : 'white', transition: 'var(--transition)', flex: 1, minWidth: 240 }}>
                      <input type="radio" name="tipo_reclamo" value={val} checked={form.tipo_reclamo === val} onChange={handleChange} style={{ marginTop: 3, accentColor: 'var(--red)' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: form.tipo_reclamo === val ? 'var(--red)' : 'var(--text)' }}>{label}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2, lineHeight: 1.5 }}>{desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <Field
                label="Detalle de su reclamo o queja *"
                name="detalle_reclamo"
                value={form.detalle_reclamo}
                onChange={handleChange}
                placeholder="Describa con detalle lo ocurrido: fecha de compra, producto involucrado, problema presentado..."
                textarea
                rows={5}
              />

              <div style={{ marginTop: 16 }}>
                <Field
                  label="¿Qué solicita como solución? *"
                  name="pedido_consumidor"
                  value={form.pedido_consumidor}
                  onChange={handleChange}
                  placeholder="Ej: Cambio del producto, devolución del pago, corrección del pedido..."
                  textarea
                  rows={3}
                />
              </div>
            </FormSection>

            {/* Legal notice */}
            <div style={{ background: 'var(--off-white)', border: '1px solid var(--gray-200)', borderRadius: 8, padding: '16px 20px', fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 32 }}>
              Al enviar este formulario declaro que los datos proporcionados son verídicos y acepto que
              STAR PERUVIAN trate mis datos personales conforme a su{' '}
              <Link to="/privacidad" style={{ color: 'var(--red)' }}>Política de Privacidad</Link>.
              Entiendo que recibiré respuesta en un plazo máximo de 30 días calendario.
            </div>

            {status === 'error' && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '12px 16px', color: '#dc2626', fontSize: 14, marginBottom: 24 }}>
                ⚠️ {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn btn-red"
              style={{ fontSize: 15, padding: '14px 40px', opacity: status === 'loading' ? 0.7 : 1 }}
            >
              {status === 'loading' ? 'Enviando...' : 'Enviar Reclamación'}
            </button>

          </form>

          <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--gray-200)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/terminos" className="btn btn-outline-red btn-sm">Términos y Condiciones</Link>
            <Link to="/privacidad" className="btn btn-sm" style={{ border: '1px solid var(--gray-200)' }}>Política de Privacidad</Link>
            <Link to="/" className="btn btn-sm" style={{ border: '1px solid var(--gray-200)' }}>← Volver al inicio</Link>
          </div>
        </div>
      )}
    </div>
  )
}

// Reusable form field
function Field({ label, name, value, onChange, placeholder, textarea, rows, type = 'text', ...rest }) {
  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    border: '1.5px solid var(--gray-200)',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'var(--font-body)',
    color: 'var(--text)',
    background: 'white',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    resize: textarea ? 'vertical' : undefined,
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--gray-600)', marginBottom: 6 }}>
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 4}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'var(--blue)'}
          onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={e => e.target.style.borderColor = 'var(--blue)'}
          onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
          {...rest}
        />
      )}
    </div>
  )
}

function FormSection({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--text)', marginBottom: 20, paddingBottom: 10, borderBottom: '2px solid var(--gray-100)' }}>
        {title}
      </h2>
      {children}
    </div>
  )
}

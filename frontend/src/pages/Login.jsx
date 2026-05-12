import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ username: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (tab === 'register' && form.password !== form.confirmPassword) {
      return setError('Las contraseñas no coinciden')
    }

    setLoading(true)
    try {
      if (tab === 'login') {
        const userData = await login(form.username, form.password)
        navigate(userData.role === 'admin' ? '/admin' : '/')
      } else {
        await register(form.username, form.password)
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ocurrió un error. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (t) => {
    setTab(t)
    setError('')
    setForm({ username: '', password: '', confirmPassword: '' })
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <Link to="/">
          <img
            src="/img/logo ACTUALIZADO.png"
            alt="STAR PERUVIAN"
            className="login-logo"
            onError={e => { e.target.style.display = 'none' }}
          />
        </Link>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--off-white)',
          borderRadius: 'var(--radius)',
          padding: 4,
          marginBottom: 28,
        }}>
          {[
            { id: 'login', label: 'Iniciar Sesión' },
            { id: 'register', label: 'Registrarse' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => switchTab(t.id)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: 'calc(var(--radius) - 2px)',
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: '0.03em',
                cursor: 'pointer',
                border: 'none',
                transition: 'var(--transition)',
                background: tab === t.id ? 'white' : 'transparent',
                color: tab === t.id ? 'var(--blue)' : 'var(--gray-400)',
                boxShadow: tab === t.id ? 'var(--shadow-sm)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <h1 className="login-title" style={{ fontSize: 20, marginBottom: 4 }}>
          {tab === 'login' ? 'Bienvenido de vuelta' : 'Crear cuenta'}
        </h1>
        <p className="login-subtitle">
          {tab === 'login'
            ? 'Ingresa tus datos para acceder'
            : 'Regístrate para acceder a tu cuenta'}
        </p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Ingresa tu usuario"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              required
              autoComplete="username"
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
              minLength={6}
            />
          </div>

          {tab === 'register' && (
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>
          )}

          <button type="submit" className="btn-login" disabled={loading}>
            {loading
              ? (tab === 'login' ? 'Verificando...' : 'Creando cuenta...')
              : (tab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta')}
          </button>
        </form>

        {tab === 'register' && (
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--gray-400)', lineHeight: 1.6 }}>
            Al registrarte aceptas nuestros términos de uso.<br />
            Las cuentas nuevas son para clientes mayoristas.
          </p>
        )}

        <div className="login-back" style={{ marginTop: 20 }}>
          <Link to="/">← Volver al sitio web</Link>
        </div>
      </div>
    </div>
  )
}

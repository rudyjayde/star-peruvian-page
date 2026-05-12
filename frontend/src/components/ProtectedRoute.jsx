import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--off-white)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid var(--gray-200)',
            borderTopColor: 'var(--blue)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/" replace />

  return children
}

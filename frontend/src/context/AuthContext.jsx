import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('sp_token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get('/api/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('sp_token')
          delete axios.defaults.headers.common['Authorization']
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const res = await axios.post('/api/auth/login', { username, password })
    const { token, user: userData } = res.data
    localStorage.setItem('sp_token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
    return userData
  }

  const register = async (username, password) => {
    const res = await axios.post('/api/auth/register', { username, password })
    const { token, user: userData } = res.data
    localStorage.setItem('sp_token', token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('sp_token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

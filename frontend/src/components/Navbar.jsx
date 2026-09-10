import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'
import { Settings, LogOut, ChevronDown, User, ShieldCheck, ShoppingCart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const links = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Productos', href: '#productos' },
  { label: 'Marcas', href: '#marcas' },
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Cómo Comprar', href: '#como-comprar' },
  { label: 'Contacto', href: '#contacto' },
]

const selectCategory = (slug) => {
  window.dispatchEvent(new CustomEvent('sp-select-category', { detail: { slug } }))
}

function CategoryItem({ category, onSelect }) {
  const [open, setOpen] = useState(false)
  const hasChildren = category.children?.length > 0

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => hasChildren && setOpen(true)}
      onMouseLeave={() => hasChildren && setOpen(false)}
    >
      <button
        type="button"
        onClick={() => onSelect(category.slug)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          padding: '10px 16px',
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--text)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'var(--font-body)',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--off-white)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        {category.name}
        {hasChildren && <ChevronDown size={13} style={{ transform: 'rotate(-90deg)' }} />}
      </button>
      {hasChildren && open && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '100%',
          background: 'white',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--gray-200)',
          minWidth: 180,
          overflow: 'hidden',
        }}>
          {category.children.map(child => (
            <CategoryItem key={child.slug} category={child} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

function CategoriesMenu({ scrolled }) {
  const [categories, setCategories] = useState([])
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    axios.get('/api/categories').then(res => setCategories(res.data)).catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (categories.length === 0) return null

  const handleSelect = (slug) => {
    selectCategory(slug)
    setOpen(false)
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        className="nav-link"
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', font: 'inherit', color: 'inherit' }}
      >
        Categorías
        <ChevronDown size={13} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'var(--transition-fast)' }} />
      </button>
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 12px)',
          left: 0,
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--gray-200)',
          minWidth: 200,
          overflow: 'visible',
          zIndex: 1001,
          padding: '6px 0',
        }}>
          {categories.map(category => (
            <CategoryItem key={category.slug} category={category} onSelect={handleSelect} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileCategories, setMobileCategories] = useState([])
  const { user, logout } = useAuth()
  const { count } = useCart()
  const location = useLocation()
  const dropdownRef = useRef(null)

  useEffect(() => {
    axios.get('/api/categories').then(res => setMobileCategories(res.data)).catch(() => setMobileCategories([]))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setDropdownOpen(false)
  }, [location])

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleNavClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const el = document.querySelector(href)
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 72
        window.scrollTo({ top, behavior: 'smooth' })
      }
      setMenuOpen(false)
    }
  }

  const initials = user ? user.username.slice(0, 2).toUpperCase() : ''
  const isAdmin = user?.role === 'admin'

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : 'transparent'}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <img
              src="/img/logo ACTUALIZADO.png"
              alt="STAR PERUVIAN"
              onError={e => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
            <span style={{
              display: 'none',
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
              fontWeight: '800',
              color: scrolled ? 'var(--blue)' : 'white',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              STAR <span style={{ color: 'var(--red)' }}>PERUVIAN</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="navbar-links">
            <CategoriesMenu scrolled={scrolled} />
            {links.map(l => (
              <a key={l.label} href={l.href} className="nav-link" onClick={e => handleNavClick(e, l.href)}>
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="navbar-cta">
            <Link
              to="/carrito"
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: '50%',
                color: scrolled ? 'var(--text)' : 'white',
              }}
              aria-label="Carrito"
            >
              <ShoppingCart size={20} />
              {count > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'var(--red)',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: 10,
                  fontWeight: 700,
                  width: 16,
                  height: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
            {user ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    background: scrolled ? 'var(--off-white)' : 'rgba(255,255,255,0.12)',
                    border: scrolled ? '1px solid var(--gray-200)' : '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 100,
                    padding: '6px 14px 6px 6px',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: isAdmin
                      ? 'linear-gradient(135deg, var(--red), var(--blue))'
                      : 'linear-gradient(135deg, var(--blue-light), var(--blue))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'var(--font-display)',
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {initials}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 14,
                    fontWeight: 500,
                    color: scrolled ? 'var(--text)' : 'white',
                  }}>
                    {user.username}
                  </span>
                  <ChevronDown
                    size={14}
                    color={scrolled ? 'var(--gray-600)' : 'rgba(255,255,255,0.7)'}
                    strokeWidth={2}
                    style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'var(--transition)' }}
                  />
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'white',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--gray-200)',
                    minWidth: 200,
                    overflow: 'hidden',
                    zIndex: 1001,
                    animation: 'slideUp 0.15s ease',
                  }}>
                    <div style={{
                      padding: '14px 16px',
                      borderBottom: '1px solid var(--gray-100)',
                      background: 'var(--off-white)',
                    }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
                        {user.username}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 5 }}>
                        {isAdmin
                          ? <><ShieldCheck size={11} color="var(--red)" /> Administrador</>
                          : <><User size={11} /> Cliente</>
                        }
                      </div>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '12px 16px',
                          fontSize: 14,
                          fontWeight: 600,
                          color: 'var(--blue)',
                          borderBottom: '1px solid var(--gray-100)',
                          transition: 'var(--transition)',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(30,58,138,0.04)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <Settings size={15} color="var(--blue)" />
                        Panel Admin
                      </Link>
                    )}

                    <button
                      onClick={() => { logout(); setDropdownOpen(false) }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 16px',
                        fontSize: 14,
                        fontWeight: 500,
                        color: 'var(--red)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'var(--transition)',
                        fontFamily: 'var(--font-body)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(227,6,19,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <LogOut size={15} />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-red btn-sm">
                Iniciar Sesión
              </Link>
            )}

            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {mobileCategories.length > 0 && (
          <div style={{ padding: '8px 0 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 8 }}>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600, marginBottom: 8 }}>
              Categorías
            </div>
            {mobileCategories.map(category => (
              <button
                key={category.slug}
                className="mobile-nav-link"
                style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => { selectCategory(category.slug); setMenuOpen(false) }}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
        {links.map(l => (
          <a key={l.label} href={l.href} className="mobile-nav-link" onClick={e => handleNavClick(e, l.href)}>
            {l.label}
          </a>
        ))}

        {user ? (
          <>
            <div style={{ padding: '16px 0 8px', color: 'rgba(255,255,255,0.4)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
              {user.username} · {isAdmin ? 'Admin' : 'Cliente'}
            </div>
            {isAdmin && (
              <Link
                to="/admin"
                className="mobile-nav-link"
                onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10 }}
              >
                <Settings size={18} />
                Panel Admin
              </Link>
            )}
            <button
              onClick={() => { logout(); setMenuOpen(false) }}
              className="mobile-nav-link"
              style={{ width: '100%', textAlign: 'left', color: 'var(--red)', background: 'none', border: 'none', fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="btn btn-red"
            style={{ marginTop: 16, justifyContent: 'center' }}
            onClick={() => setMenuOpen(false)}
          >
            Iniciar Sesión / Registrarse
          </Link>
        )}
      </div>
    </>
  )
}

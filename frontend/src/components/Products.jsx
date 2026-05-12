import { useState, useEffect } from 'react'
import axios from 'axios'

const DEMO_PRODUCTS = [
  {
    _id: '1',
    name: 'Casaca Invierno Premium',
    category: 'Casacas',
    price: 240,
    stock: 120,
    minOrder: 12,
    images: ['/img/Casacas Invierno Sesion-14.jpg'],
    active: true,
  },
  {
    _id: '2',
    name: 'Casaca Térmica Sport',
    category: 'Casacas',
    price: 280,
    stock: 84,
    minOrder: 12,
    images: ['/img/Casacas Invierno Sesion-19.jpg'],
    active: true,
  },
  {
    _id: '3',
    name: 'Casaca Ejecutiva',
    category: 'Casacas',
    price: 300,
    stock: 60,
    minOrder: 12,
    images: ['/img/Casacas Invierno Sesion-20.jpg'],
    active: true,
  },
  {
    _id: '4',
    name: 'Casaca Slim Fit',
    category: 'Casacas',
    price: 260,
    stock: 96,
    minOrder: 12,
    images: ['/img/Casacas Invierno Sesion-22.jpg'],
    active: true,
  },
  {
    _id: '5',
    name: 'Casaca Outdoor',
    category: 'Casacas',
    price: 320,
    stock: 48,
    minOrder: 12,
    images: ['/img/Casacas Invierno Sesion-23.jpg'],
    active: true,
  },
  {
    _id: '6',
    name: 'Chaleco Azul Navy',
    category: 'Chalecos',
    price: 180,
    stock: 144,
    minOrder: 12,
    images: ['/img/chaleco-azul-Invierno Sesion-12.jpg'],
    active: true,
  },
  {
    _id: '7',
    name: 'Chaleco Beige Clásico',
    category: 'Chalecos',
    price: 180,
    stock: 120,
    minOrder: 12,
    images: ['/img/chaleco-beige-Invierno Sesion-12.jpg'],
    active: true,
  },
  {
    _id: '8',
    name: 'Chaleco Rojo Intenso',
    category: 'Chalecos',
    price: 180,
    stock: 108,
    minOrder: 12,
    images: ['/img/chaleco-rojo-Invierno Sesion-12.jpg'],
    active: true,
  },
]

export default function Products() {
  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [loading, setLoading] = useState(false)

  // Builds category tabs dynamically from whatever products exist
  const categories = ['Todos', ...new Set(products.map(p => p.category))]

  useEffect(() => {
    setLoading(true)
    axios.get('/api/products')
      .then(res => { if (res.data?.length > 0) setProducts(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Re-lanza las animaciones reveal cuando los productos cambian
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    const cards = document.querySelectorAll('.product-card')
    cards.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [products, activeCategory])

  const filtered = activeCategory === 'Todos'
    ? products
    : products.filter(p => p.category === activeCategory)

  const handleWhatsApp = (product) => {
    const msg = encodeURIComponent(
      `Hola, estoy interesado en el producto: *${product.name}* (precio por docena: S/ ${product.price}). ¿Tienen stock disponible?`
    )
    window.open(`https://wa.me/51999999999?text=${msg}`, '_blank')
  }

  return (
    <section className="products-section section" id="productos">
      <div className="container">
        <div className="products-header">
          <div>
            <div className="label reveal">Catálogo</div>
            <h2 className="section-title reveal">
              Nuestros <span className="text-red">Productos</span>
            </h2>
          </div>
          <div className="category-tabs reveal">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '64px', color: 'var(--gray-400)' }}>
            Cargando productos...
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((product, i) => (
              <div key={product._id || product.id} className="product-card reveal" style={{ transitionDelay: `${(i % 4) * 0.1}s` }}>
                <div className="product-img-wrap">
                  <img
                    src={product.images?.[0] || '/img/logo ACTUALIZADO.png'}
                    alt={product.name}
                    loading="lazy"
                    onError={e => { e.target.src = '/img/logo ACTUALIZADO.png' }}
                  />
                  {product.stock > 0 ? (
                    <span className="product-badge">Stock</span>
                  ) : (
                    <span className="product-badge out">Agotado</span>
                  )}
                  <div className="product-overlay">
                    <button
                      className="product-overlay-btn"
                      onClick={() => handleWhatsApp(product)}
                    >
                      Consultar por WhatsApp
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price-row">
                    <div>
                      <div className="product-price">S/ {product.price}</div>
                      <div className="product-price-label">precio por docena</div>
                    </div>
                    <span className="product-min">Mín. {product.minOrder || 12}u</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="empty-state">
            <p>No hay productos en esta categoría por el momento.</p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 48 }} className="reveal">
          <a
            href="https://wa.me/51999999999?text=Hola%2C%20quiero%20ver%20el%20catálogo%20completo%20de%20productos%20al%20por%20mayor"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-blue btn-lg"
          >
            Ver Catálogo Completo por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

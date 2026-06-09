import { useEffect, useState } from 'react'
import axios from 'axios'
import { Search, ZoomIn, ZoomOut } from 'lucide-react'
import { normalizeImageList, normalizeTextList, resolveAssetUrl } from '../utils/assetUrl'

const DEMO_PRODUCTS = [
  {
    _id: '1',
    name: 'Casaca Invierno Premium',
    brand: 'PUMA',
    category: 'Casacas',
    price: 240,
    stock: 120,
    minOrder: 12,
    colors: ['Negro', 'Gris'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/img/Casacas Invierno Sesion-14.jpg'],
    active: true,
  },
  {
    _id: '2',
    name: 'Casaca Térmica Sport',
    brand: "LEVI'S",
    category: 'Casacas',
    price: 280,
    stock: 84,
    minOrder: 12,
    colors: ['Azul', 'Negro'],
    sizes: ['M', 'L', 'XL'],
    images: ['/img/Casacas Invierno Sesion-19.jpg'],
    active: true,
  },
  {
    _id: '3',
    name: 'Casaca Ejecutiva',
    brand: 'UNDER ARMOUR',
    category: 'Casacas',
    price: 300,
    stock: 60,
    minOrder: 12,
    colors: ['Negro', 'Beige'],
    sizes: ['S', 'M', 'L'],
    images: ['/img/Casacas Invierno Sesion-20.jpg'],
    active: true,
  },
  {
    _id: '4',
    name: 'Casaca Slim Fit',
    brand: 'GUESS',
    category: 'Casacas',
    price: 260,
    stock: 96,
    minOrder: 12,
    colors: ['Blanco', 'Negro'],
    sizes: ['S', 'M', 'L', 'XL'],
    images: ['/img/Casacas Invierno Sesion-22.jpg'],
    active: true,
  },
  {
    _id: '5',
    name: 'Casaca Outdoor',
    brand: 'REEBOK',
    category: 'Casacas',
    price: 320,
    stock: 48,
    minOrder: 12,
    colors: ['Verde', 'Negro'],
    sizes: ['M', 'L', 'XL'],
    images: ['/img/Casacas Invierno Sesion-23.jpg'],
    active: true,
  },
  {
    _id: '6',
    name: 'Chaleco Azul Navy',
    brand: 'SMART SEXY',
    category: 'Chalecos',
    price: 180,
    stock: 144,
    minOrder: 12,
    colors: ['Azul', 'Negro'],
    sizes: ['S', 'M', 'L'],
    images: ['/img/chaleco-azul-Invierno Sesion-12.jpg'],
    active: true,
  },
  {
    _id: '7',
    name: 'Chaleco Beige Clásico',
    brand: 'WHISPERSLEELA',
    category: 'Chalecos',
    price: 180,
    stock: 120,
    minOrder: 12,
    colors: ['Beige', 'Crema'],
    sizes: ['S', 'M', 'L'],
    images: ['/img/chaleco-beige-Invierno Sesion-12.jpg'],
    active: true,
  },
  {
    _id: '8',
    name: 'Chaleco Rojo Intenso',
    brand: 'H&Y',
    category: 'Chalecos',
    price: 180,
    stock: 108,
    minOrder: 12,
    colors: ['Rojo', 'Negro'],
    sizes: ['M', 'L', 'XL'],
    images: ['/img/chaleco-rojo-Invierno Sesion-12.jpg'],
    active: true,
  },
]

const compareProducts = (left, right) => {
  const leftCategory = String(left.category || '').trim()
  const rightCategory = String(right.category || '').trim()
  const categoryResult = leftCategory.localeCompare(rightCategory, 'es', { sensitivity: 'base' })
  if (categoryResult !== 0) return categoryResult

  const leftBrand = String(left.brand || '').trim()
  const rightBrand = String(right.brand || '').trim()
  const brandResult = leftBrand.localeCompare(rightBrand, 'es', { sensitivity: 'base' })
  if (brandResult !== 0) return brandResult

  const leftName = String(left.name || '').trim()
  const rightName = String(right.name || '').trim()
  const nameResult = leftName.localeCompare(rightName, 'es', { sensitivity: 'base' })
  if (nameResult !== 0) return nameResult

  return Number(right.createdAt ? new Date(right.createdAt).getTime() : 0) - Number(left.createdAt ? new Date(left.createdAt).getTime() : 0)
}

function ProductCard({ product, onBrandSelect, onWhatsApp, onPreview, style }) {
  const images = normalizeImageList(product.images)
  const imageSources = images.length > 0
    ? images.map(resolveAssetUrl)
    : ['/img/logo ACTUALIZADO.png']
  const colors = normalizeTextList(product.colors)
  const sizes = normalizeTextList(product.sizes)
  const brand = String(product.brand || '').trim()
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    setActiveImageIndex(0)
  }, [product.id, product._id, imageSources.join('|')])

  const hasMultipleImages = imageSources.length > 1
  const currentImage = imageSources[activeImageIndex] || imageSources[0]

  const goToNextImage = () => {
    if (!hasMultipleImages) return
    setActiveImageIndex(index => (index + 1) % imageSources.length)
  }

  const goToPrevImage = (event) => {
    event.stopPropagation()
    if (!hasMultipleImages) return
    setActiveImageIndex(index => (index - 1 + imageSources.length) % imageSources.length)
  }

  return (
    <div className="product-card reveal" style={style}>
      <div className="product-img-wrap">
        {hasMultipleImages && (
          <>
            <button type="button" className="product-img-nav prev" onClick={goToPrevImage} aria-label="Imagen anterior">
              ‹
            </button>
            <button
              type="button"
              className="product-img-nav next"
              onClick={(event) => {
                event.stopPropagation()
                goToNextImage()
              }}
              aria-label="Siguiente imagen"
            >
              ›
            </button>
            <div className="product-image-count">
              {activeImageIndex + 1}/{imageSources.length}
            </div>
          </>
        )}
        <button
          type="button"
          className="product-image-zoom"
          onClick={() => onPreview(product, activeImageIndex)}
          aria-label="Ampliar imagen"
          title="Ampliar imagen"
        >
          <Search size={16} strokeWidth={2.5} />
        </button>
        <img
          src={currentImage}
          alt={product.name}
          loading="lazy"
          title={product.name}
          style={{ cursor: 'default' }}
          onClick={() => onPreview(product, activeImageIndex)}
          onError={event => { event.target.src = '/img/logo ACTUALIZADO.png' }}
        />
        {product.stock > 0 ? (
          <span className="product-badge">Stock</span>
        ) : (
          <span className="product-badge out">Agotado</span>
        )}
        <div className="product-overlay">
          <button
            className="product-overlay-btn"
            onClick={() => onWhatsApp(product)}
          >
            Consultar por WhatsApp
          </button>
        </div>
      </div>

      <div className="product-info">
        {brand && (
          <button
            type="button"
            className="product-brand"
            onClick={() => onBrandSelect(brand)}
            title={`Ver productos de ${brand}`}
          >
            {brand}
          </button>
        )}
        <div className="product-category">{product.category}</div>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-price-row">
          <div>
            <div className="product-price">S/ {product.price}</div>
            <div className="product-price-label">precio por docena</div>
          </div>
          <span className="product-min">Mín. {product.minOrder || 12}u</span>
        </div>

        {(colors.length > 0 || sizes.length > 0) && (
          <div className="product-variants">
            {colors.length > 0 && (
              <div className="product-variant-group">
                <span className="product-variant-label">Colores</span>
                <div className="product-variant-list">
                  {colors.map(color => (
                    <span key={color} className="product-variant-chip">
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {sizes.length > 0 && (
              <div className="product-variant-group">
                <span className="product-variant-label">Tallas</span>
                <div className="product-variant-list">
                  {sizes.map(size => (
                    <span key={size} className="product-variant-chip soft">
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Products() {
  const [products, setProducts] = useState(DEMO_PRODUCTS)
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [activeBrand, setActiveBrand] = useState('Todos')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(null)

  const categories = ['Todos', ...[...new Set(products.map(product => String(product.category || '').trim()).filter(Boolean))].sort((left, right) => left.localeCompare(right, 'es', { sensitivity: 'base' }))]
  const brands = ['Todos', ...[...new Set(products.map(product => String(product.brand || '').trim()).filter(Boolean))].sort((left, right) => left.localeCompare(right, 'es', { sensitivity: 'base' }))]

  useEffect(() => {
    setLoading(true)
    axios.get('/api/products')
      .then(res => { if (res.data?.length > 0) setProducts(res.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handleBrandSelection = (event) => {
      const brand = String(event.detail?.brand || 'Todos').trim() || 'Todos'
      setActiveBrand(brand)
      document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    window.addEventListener('sp-select-brand', handleBrandSelection)
    return () => window.removeEventListener('sp-select-brand', handleBrandSelection)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible') }),
      { threshold: 0.1 }
    )
    const cards = document.querySelectorAll('.product-card')
    cards.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [products, activeCategory, activeBrand])

  const filtered = products
    .filter(product => {
    const matchesCategory = activeCategory === 'Todos' || product.category === activeCategory
    const productBrand = String(product.brand || '').trim()
    const matchesBrand = activeBrand === 'Todos' || productBrand === activeBrand
    return matchesCategory && matchesBrand
  })
    .sort(compareProducts)

  const handleWhatsApp = (product) => {
    const msg = encodeURIComponent(
      `Hola, estoy interesado en el producto: *${product.name}*${product.brand ? ` de marca ${product.brand}` : ''} (precio por docena: S/ ${product.price}). ¿Tienen stock disponible?`
    )
    window.open(`https://wa.me/51974789135?text=${msg}`, '_blank')
  }

  const setBrandFilter = (brand) => {
    setActiveBrand(brand)
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const openPreview = (product, imageIndex = 0) => {
    const images = normalizeImageList(product.images)
      .map(resolveAssetUrl)
      .filter(Boolean)

    setPreview({
      product,
      images: images.length > 0 ? images : ['/img/logo ACTUALIZADO.png'],
      index: Math.min(imageIndex, Math.max(images.length - 1, 0)),
      zoom: 1,
    })
  }

  const closePreview = () => setPreview(null)

  const movePreview = (direction) => {
    setPreview(current => {
      if (!current || current.images.length <= 1) return current
      const nextIndex = (current.index + direction + current.images.length) % current.images.length
      return { ...current, index: nextIndex }
    })
  }

  const changePreviewZoom = (delta) => {
    setPreview(current => {
      if (!current) return current
      const nextZoom = Math.max(1, Math.min(2.5, Number((current.zoom + delta).toFixed(2))))
      return { ...current, zoom: nextZoom }
    })
  }

  const resetPreviewZoom = () => {
    setPreview(current => current ? { ...current, zoom: 1 } : current)
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
            {(activeBrand !== 'Todos' || activeCategory !== 'Todos') && (
              <div className="active-filter-chip reveal">
                <span>
                  Filtrando:
                  {activeBrand !== 'Todos' ? ` marca ${activeBrand}` : ''}
                  {activeBrand !== 'Todos' && activeCategory !== 'Todos' ? ' · ' : ''}
                  {activeCategory !== 'Todos' ? ` categoría ${activeCategory}` : ''}
                </span>
                <button type="button" onClick={() => { setActiveBrand('Todos'); setActiveCategory('Todos') }}>
                  Limpiar
                </button>
              </div>
            )}
          </div>

          <div className="category-tabs reveal">
            {categories.map(category => (
              <button
                key={category}
                className={`cat-tab ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="brand-filter-row reveal">
          <div className="brand-filter-label">Marcas</div>
          <div className="category-tabs">
            {brands.map(brand => (
              <button
                key={brand}
                className={`cat-tab ${activeBrand === brand ? 'active' : ''}`}
                onClick={() => setBrandFilter(brand)}
              >
                {brand}
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
            {filtered.map((product, index) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onBrandSelect={setBrandFilter}
                onWhatsApp={handleWhatsApp}
                onPreview={openPreview}
                style={{ transitionDelay: `${(index % 4) * 0.1}s` }}
              />
            ))}
          </div>
        )}

        {filtered.length === 0 && !loading && (
          <div className="empty-state">
            <p>No hay productos para esta combinación de marca y categoría.</p>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 48 }} className="reveal">
          <a
            href="https://wa.me/51974789135?text=Hola%2C%20quiero%20ver%20el%20cat%C3%A1logo%20completo%20de%20productos%20al%20por%20mayor"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-blue btn-lg"
          >
            Ver Catálogo Completo por WhatsApp
          </a>
        </div>

        {preview && (
          <div className="product-preview-overlay" onClick={closePreview}>
            <div className="product-preview-modal" onClick={event => event.stopPropagation()}>
              <button type="button" className="product-preview-close" onClick={closePreview} aria-label="Cerrar vista previa">
                ×
              </button>

              <div className="product-preview-image-wrap">
                {preview.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="product-preview-nav prev"
                      onClick={() => movePreview(-1)}
                      aria-label="Imagen anterior"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      className="product-preview-nav next"
                      onClick={() => movePreview(1)}
                      aria-label="Siguiente imagen"
                    >
                      ›
                    </button>
                    <div className="product-preview-counter">
                      {preview.index + 1}/{preview.images.length}
                    </div>
                  </>
                )}

                <div className="product-preview-zoom-controls">
                  <button type="button" onClick={() => changePreviewZoom(0.15)} aria-label="Acercar">
                    <ZoomIn size={16} strokeWidth={2.5} />
                  </button>
                  <button type="button" onClick={() => changePreviewZoom(-0.15)} aria-label="Alejar">
                    <ZoomOut size={16} strokeWidth={2.5} />
                  </button>
                  <button type="button" onClick={resetPreviewZoom}>
                    100%
                  </button>
                </div>

                <img
                  src={preview.images[preview.index]}
                  alt={preview.product.name}
                  className="product-preview-image"
                  style={{
                    transform: `scale(${preview.zoom || 1})`,
                    transformOrigin: 'center center',
                  }}
                />
              </div>

              {preview.images.length > 1 && (
                <div className="product-preview-thumbs">
                  {preview.images.map((image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      className={`product-preview-thumb ${preview.index === index ? 'active' : ''}`}
                      onClick={() => setPreview(current => current ? { ...current, index } : current)}
                    >
                      <img src={image} alt={`miniatura-${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

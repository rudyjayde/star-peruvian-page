import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const BASE_BRANDS = [
  { name: 'WHISPERSLEELA', color: '#002855' },
  { name: 'JAYDE CHOQUE', color: '#C41230' },
  { name: 'RAE', color: '#000000' },
  { name: 'SMART SEXY', color: '#111111' },
  { name: 'PUMA', color: '#E4000F' },
  { name: 'UNDER ARMOUR', color: '#1D1D1B' },
  { name: "LEVI'S", color: '#CC0000' },
  { name: 'JADE INTIMATE', color: '#003087' },
  { name: 'PRIVATE', color: '#4A0E8F' },
  { name: 'H&Y', color: '#009A44' },
  { name: 'REEBOK', color: '#CC0000' },
  { name: 'GUESS', color: '#000000' },
]

const FALLBACK_BRAND_MAP = new Map(BASE_BRANDS.map(brand => [brand.name.toUpperCase(), brand.color]))

const hashColor = (value) => {
  const palette = ['#E4000F', '#002855', '#111111', '#4A0E8F', '#009A44', '#CC0000', '#0B5FFF', '#6B7280']
  let hash = 0
  for (let index = 0; index < value.length; index += 1) {
    hash = value.charCodeAt(index) + ((hash << 5) - hash)
  }
  return palette[Math.abs(hash) % palette.length]
}

const getBrandColor = (name) => FALLBACK_BRAND_MAP.get(name.toUpperCase()) || hashColor(name)

function BrandPill({ brand, onClick }) {
  return (
    <button
      type="button"
      className="brand-pill"
      style={{ '--brand-color': brand.color }}
      onClick={() => onClick(brand.name)}
    >
      <span className="brand-pill-dot" />
      <span>{brand.name}</span>
    </button>
  )
}

export default function Brands() {
  const [brands, setBrands] = useState([])

  useEffect(() => {
    let mounted = true

    axios.get('/api/products')
      .then(res => {
        if (!mounted) return

        const grouped = new Map()
        res.data?.forEach(product => {
          const brandName = String(product.brand || '').trim()
          if (!brandName) return
          grouped.set(brandName, (grouped.get(brandName) || 0) + 1)
        })

        const baseBrands = BASE_BRANDS.map(brand => ({
          name: brand.name,
          color: brand.color,
          count: grouped.get(brand.name) || grouped.get(brand.name.toUpperCase()) || 0,
        }))

        const extraBrands = [...grouped.entries()]
          .filter(([name]) => !BASE_BRANDS.some(base => base.name.toUpperCase() === name.toUpperCase()))
          .map(([name, count]) => ({
            name,
            count,
            color: getBrandColor(name),
          }))
          .sort((left, right) => left.name.localeCompare(right.name))

        setBrands([...baseBrands, ...extraBrands])
      })
      .catch(() => {
        if (!mounted) return
        setBrands(BASE_BRANDS.map(brand => ({ ...brand, count: 0 })))
      })

    return () => {
      mounted = false
    }
  }, [])

  const marqueeBrands = useMemo(() => {
    if (brands.length === 0) return []
    return [...brands, ...brands]
  }, [brands])

  const marqueeRowTwo = useMemo(() => {
    if (brands.length === 0) return []
    const offset = Math.max(1, Math.floor(brands.length / 2))
    return [...brands.slice(offset), ...brands.slice(0, offset), ...brands.slice(offset), ...brands.slice(0, offset)]
  }, [brands])

  const handleBrandClick = (brandName) => {
    window.dispatchEvent(new CustomEvent('sp-select-brand', { detail: { brand: brandName } }))
    document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="brands-section section" id="marcas">
      <div className="container">
        <div className="brands-header reveal">
          <div className="label">Marcas</div>
          <h2 className="section-title">
            Distribuidores de las mejores<br />
            <span className="text-red">marcas internacionales</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
            Trabajamos con marcas líderes del mercado. Todos nuestros productos
            son auténticos y con respaldo de garantía.
          </p>
        </div>
      </div>

      <div className="brands-marquee-outer">
        <div className="brands-marquee-row brands-row-1">
          {marqueeBrands.map((brand, index) => (
            <BrandPill key={`r1-${brand.name}-${index}`} brand={brand} onClick={handleBrandClick} />
          ))}
        </div>
        <div className="brands-marquee-row brands-row-2">
          {marqueeRowTwo.map((brand, index) => (
            <BrandPill key={`r2-${brand.name}-${index}`} brand={brand} onClick={handleBrandClick} />
          ))}
        </div>
      </div>
    </section>
  )
}

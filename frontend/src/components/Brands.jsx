const brands = [
  { name: 'WHISPERSLEELA', color: '#002855' },
  { name: 'JAYDE CHOQUE',  color: '#C41230' },
  { name: 'RAE',           color: '#000000' },
  { name: 'SMART SEXY',    color: '#111111' },
  { name: 'PUMA',          color: '#E4000F' },
  { name: 'UNDER ARMOUR',  color: '#1D1D1B' },
  { name: "LEVI'S",        color: '#CC0000' },
  { name: 'JADE INTIMATE', color: '#003087' },
  { name: 'PRIVATE',       color: '#4A0E8F' },
  { name: 'H&Y',           color: '#009A44' },
  { name: 'REEBOK',        color: '#CC0000' },
  { name: 'GUESS',         color: '#000000' },
]

// Duplicate for seamless infinite loop
const row1 = [...brands, ...brands]
const row2 = [...brands.slice(5), ...brands.slice(0, 5), ...brands.slice(5), ...brands.slice(0, 5)]

function BrandPill({ brand }) {
  return (
    <div
      className="brand-pill"
      style={{ '--brand-color': brand.color }}
    >
      <span className="brand-pill-dot" />
      {brand.name}
    </div>
  )
}

export default function Brands() {
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

      {/* Carrusel infinito — dos filas en direcciones opuestas */}
      <div className="brands-marquee-outer">
        <div className="brands-marquee-row brands-row-1">
          {row1.map((brand, i) => (
            <BrandPill key={`r1-${i}`} brand={brand} />
          ))}
        </div>
        <div className="brands-marquee-row brands-row-2">
          {row2.map((brand, i) => (
            <BrandPill key={`r2-${i}`} brand={brand} />
          ))}
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef } from 'react'

export default function Hero() {
  const titleRef = useRef(null)
  const subtitleRef = useRef(null)
  const actionsRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    const elements = [titleRef, subtitleRef, actionsRef, statsRef]
    elements.forEach((ref, i) => {
      if (ref.current) {
        ref.current.style.opacity = '0'
        ref.current.style.transform = 'translateY(30px)'
        setTimeout(() => {
          if (ref.current) {
            ref.current.style.transition = 'opacity 0.8s cubic-bezier(0.4,0,0.2,1), transform 0.8s cubic-bezier(0.4,0,0.2,1)'
            ref.current.style.opacity = '1'
            ref.current.style.transform = 'translateY(0)'
          }
        }, 200 + i * 140)
      }
    })
  }, [])

  return (
    <section className="hero" id="inicio">
      <div className="hero-video-wrap">
        {/* VIDEO DE FONDO — reemplaza "fondo-video.mp4" por el nombre de tu video en la carpeta /video */}
        <video
          src="/video/fondo-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      </div>
      <div className="hero-overlay" />

      <div className="container hero-content" style={{ width: '100%' }}>

        {/* ── ETIQUETA PEQUEÑA SOBRE EL TÍTULO ── */}
        <div ref={titleRef} className="hero-badge">
          <span>★</span> DISTRIBUIDORES E IMPORTADORES DE LAS MEJORES MARCAS
          {/* ↑ Cambia este texto por lo que quieras mostrar como badge */}
        </div>

        {/* ── TÍTULO PRINCIPAL ── */}
        <h1 ref={subtitleRef} className="hero-title">
          <span className="line-accent">STAR</span> PERUVIAN
          {/* ↑ Cambia "STAR" y "PERUVIAN" por el nombre de tu empresa */}
          <br />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.28em', fontWeight: '500', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.25em', textTransform: 'uppercase', display: 'block', marginTop: 8 }}>
            Importación &amp; Distribución Mayorista
            {/* ↑ Subtítulo debajo del nombre — cambia o borra esta línea */}
          </span>
        </h1>

        {/* ── DESCRIPCIÓN / PÁRRAFO PRINCIPAL ── */}
        <p ref={actionsRef} className="hero-subtitle">
          Productos originales con los mejores precios por volumen.
          Venta exclusivamente <strong style={{ color: 'white' }}>por mayor</strong> — mínimo 1 docena.
          Envíos a todo el Perú.
          {/* ↑ Cambia este párrafo con tu descripción */}
        </p>

        {/* ── BOTONES DE ACCIÓN ── */}
        <div className="hero-actions" ref={actionsRef} style={{ opacity: 1, transform: 'none' }}>

          {/* BOTÓN 1 — Ver catálogo (lleva a la sección de productos) */}
          <a
            href="#productos"
            className="btn btn-red btn-lg"
            onClick={e => {
              e.preventDefault()
              document.querySelector('#productos')?.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            Ver Catálogo →
            {/* ↑ Cambia el texto del botón rojo */}
          </a>

          {/* BOTÓN 2 — WhatsApp: cambia el número 51999999999 por el tuyo (código país sin +) */}
          <a
            href="https://wa.me/51974789135?text=Hola%2C%20quiero%20información%20sobre%20productos%20al%20por%20mayor"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-white btn-lg"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
            {/* ↑ Cambia el texto del botón blanco */}
          </a>
        </div>

        {/* ── ESTADÍSTICAS PEQUEÑAS EN EL HERO ── */}
        <div className="hero-stats" ref={statsRef}>
          {[
            { num: '+500', label: 'Clientes activos' },      // ← Cambia número y etiqueta
            { num: '100%', label: 'Cobertura nacional' },    // ← Cambia número y etiqueta
            { num: '+50',  label: 'Categorías' },            // ← Cambia número y etiqueta
            { num: '24h',  label: 'Tiempo de respuesta' },   // ← Cambia número y etiqueta
          ].map(s => (
            <div key={s.label}>
              <div className="hero-stat-num">{s.num.includes('+') ? <><span>+</span>{s.num.replace('+','')}</> : s.num}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="hero-scroll">
        <div className="scroll-line" />
        Scroll
        {/* ↑ Texto del indicador de scroll — puedes borrarlo o cambiarlo */}
      </div>
    </section>
  )
}

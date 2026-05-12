export default function About() {
  return (
    <section className="about-section section">
      <div className="container">
        <div className="about-grid">

          {/* ── VIDEO DE TIKTOK (lado izquierdo) ── */}
          {/* ↑ Para cambiar el video reemplaza el ID en la URL del src del iframe (los números al final) */}
          <div className="about-img-wrap reveal-left">
            <div style={{ position: 'relative', width: '100%', paddingBottom: '177%', borderRadius: 16, overflow: 'hidden', background: '#000' }}>
              <iframe
                src="https://www.tiktok.com/embed/v2/7231507645205695750"
                title="STAR PERUVIAN TikTok"
                allow="autoplay; fullscreen"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                loading="lazy"
              />
            </div>

            {/* BADGE SOBRE EL VIDEO (número destacado) */}
            <div className="about-img-badge">
              <strong>+5</strong>
              {/* ↑ Cambia el número */}
              <span>Años en el mercado</span>
              {/* ↑ Cambia el texto debajo del número */}
            </div>
          </div>

          {/* ── CONTENIDO DERECHO ── */}
          <div className="about-content reveal-right">

            {/* ETIQUETA PEQUEÑA */}
            <div className="label label-blue">Sobre Nosotros</div>
            {/* ↑ Cambia esta etiqueta */}

            {/* TÍTULO */}
            <h2 className="section-title about-title">
              Más que un distribuidor,
              <br />
              <span className="text-red">tu socio comercial</span>
              {/* ↑ Cambia el título */}
            </h2>

            {/* PÁRRAFO 1 */}
            <p className="about-text">
              STAR PERUVIAN nació con la visión de democratizar el acceso a productos
              de calidad para emprendedores y negocios en todo el Perú. Somos importadores
              directos, lo que nos permite ofrecer los mejores precios del mercado.
              {/* ↑ Cambia este párrafo con tu historia */}
            </p>

            {/* PÁRRAFO 2 */}
            <p className="about-text">
              Nuestra red de distribución cubre los 25 departamentos del país, trabajando
              con más de 500 revendedores activos que confían en nuestra calidad,
              puntualidad y servicio personalizado.
              {/* ↑ Cambia este párrafo */}
            </p>

            {/* ── LISTA DE VALORES / CARACTERÍSTICAS ── */}
            {/* Agrega o quita items de esta lista: */}
            <div className="about-values">
              {[
                'Importación directa sin intermediarios',   // ← Cambia cada item
                'Precios competitivos por volumen',
                'Stock permanente garantizado',
                'Envíos seguros a todo el Perú',
                'Facturación con boleta y factura',
                'Atención post-venta dedicada',
              ].map(v => (
                <div key={v} className="about-value">
                  <div className="about-value-dot" />
                  <span className="about-value-text">{v}</span>
                </div>
              ))}
            </div>

            {/* ── BOTONES ── */}
            <div style={{ marginTop: 36, display: 'flex', gap: 16, flexWrap: 'wrap' }}>

              {/* BOTÓN 1 — WhatsApp: cambia el número */}
              <a
                href="https://wa.me/51974789135?text=Hola%2C%20quiero%20conocer%20más%20sobre%20STAR%20PERUVIAN"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-red"
              >
                Contáctanos
                {/* ↑ Cambia el texto del botón */}
              </a>

              {/* BOTÓN 2 */}
              <a
                href="#productos"
                className="btn btn-outline-red"
                onClick={e => { e.preventDefault(); document.querySelector('#productos')?.scrollIntoView({ behavior: 'smooth' }) }}
              >
                Ver productos
                {/* ↑ Cambia el texto del botón */}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ══════════════════════════════════════════════════════
// SECCIÓN DE TESTIMONIOS — Reseñas de clientes
// Agrega, quita o edita las reseñas en el array de abajo
// ══════════════════════════════════════════════════════
const testimonials = [
  {
    initials: 'MR',                          // ← Iniciales del cliente (aparecen en el círculo)
    name: 'María Rodríguez',                 // ← Nombre completo
    role: 'Propietaria de tienda, Lima',     // ← Cargo o ciudad
    stars: 5,                                // ← Estrellas del 1 al 5
    text: 'Llevo 3 años comprando con Star Peruvian y siempre me han cumplido. Los precios son imbatibles y la calidad es excelente. Mis clientes quedan contentos y yo vendo más.',
    //   ↑ Texto del testimonio
  },
  {
    initials: 'JC',
    name: 'Juan Carlos Quispe',
    role: 'Revendedor, Arequipa',
    stars: 5,
    text: 'Probé varios distribuidores antes de encontrar Star Peruvian. La diferencia es notable: stock real, envíos puntuales y atención personalizada. 100% recomendado.',
  },
  {
    initials: 'LA',
    name: 'Lucía Aparicio',
    role: 'Emprendedora, Cusco',
    stars: 5,
    text: 'Empecé comprando una sola docena para probar. Ahora hago pedidos semanales. El WhatsApp siempre tiene respuesta rápida y los precios son los mejores que encontré.',
  },
  {
    initials: 'RV',
    name: 'Roberto Vargas',
    role: 'Distribuidor regional, Trujillo',
    stars: 5,
    text: 'Excelente empresa. Me enviaron un pedido de 200 prendas a Trujillo sin ningún problema. Todo llegó en perfectas condiciones y a tiempo para mi feria.',
  },
  {
    initials: 'CS',
    name: 'Carmen Salinas',
    role: 'Tienda online, Lima',
    stars: 5,
    text: 'Las casacas de invierno se vendieron en tiempo récord. La calidad del producto supera el precio. Mis compradores online están felices y ya tengo varios repetidores.',
  },
  {
    initials: 'AP',
    name: 'Andrés Paredes',
    role: 'Mayorista, Piura',
    stars: 5,
    text: 'Trabajo con Star Peruvian hace 2 años. Son confiables, serios y siempre cumplen con los tiempos de entrega. El producto es de calidad garantizada.',
  },
]

export default function Testimonials() {
  return (
    <section className="testimonials-section section">
      <div className="container">
        <div className="testimonials-header reveal">

          {/* ETIQUETA PEQUEÑA */}
          <div className="label">Testimonios</div>
          {/* ↑ Cambia esta etiqueta */}

          {/* TÍTULO */}
          <h2 className="section-title">
            Lo que dicen nuestros <span className="text-red">clientes</span>
            {/* ↑ Cambia el título */}
          </h2>

          {/* SUBTÍTULO */}
          <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
            Más de 100 mayoristas confían en nosotros cada mes.
            {/* ↑ Cambia este texto */}
          </p>
        </div>

        {/* Muestra los primeros 3 testimonios — para mostrar más cambia el .slice(0, 3) */}
        <div className="testimonials-grid">
          {testimonials.slice(0, 3).map((t, i) => (
            <div key={t.name} className={`testimonial-card reveal reveal-delay-${i + 1}`}>
              <span className="quote-icon">"</span>
              <div className="stars">{'★'.repeat(t.stars)}</div>
              <p className="testimonial-text">{t.text}</p>
              <div className="testimonial-author">
                <div className="testimonial-avatar">{t.initials}</div>
                <div>
                  <div className="testimonial-name">{t.name}</div>
                  <div className="testimonial-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BOTÓN — enlace a Facebook para más reseñas */}
        <div style={{ textAlign: 'center', marginTop: 48 }} className="reveal">
          {/* ↑ Cambia el href por el link de tu página de Facebook */}
          <a
            href="https://www.facebook.com/profile.php?id=61562848862441"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-red"
          >
            Ver más reseñas en Facebook →
            {/* ↑ Cambia el texto del botón */}
          </a>
        </div>
      </div>
    </section>
  )
}

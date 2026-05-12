import { Zap, MapPin, Shield, Smartphone } from 'lucide-react'

const shippingItems = [
  {
    icon: Zap,
    title: 'Despacho el mismo día',
    desc: 'Pedidos confirmados antes de las 2pm se despachan el mismo día hábil.',
  },
  {
    icon: MapPin,
    title: 'Cobertura nacional',
    desc: 'Enviamos a los 25 departamentos del Perú a través de las mejores empresas de transporte.',
  },
  {
    icon: Shield,
    title: 'Envío asegurado',
    desc: 'Tu pedido viaja asegurado. En caso de pérdida o daño, nos hacemos responsables.',
  },
  {
    icon: Smartphone,
    title: 'Seguimiento en tiempo real',
    desc: 'Recibe el número de guía y sigue tu pedido en tiempo real hasta su entrega.',
  },
]

const transportistas = ['Olva Courier', 'Shalom', 'GRAEL', 'Cruz del Sur', 'Marvisur', 'Estrella Polar']

export default function Shipping() {
  return (
    <section className="shipping-section section" id="envios">
      <div className="container">
        <div className="shipping-grid">
          <div className="shipping-content reveal-left">
            <div className="label">Envíos</div>
            <h2 className="section-title">
              Llegamos a todo
              <br />
              <span className="text-red">el Perú</span>
            </h2>
            <p style={{ color: 'var(--gray-600)', marginTop: 16, lineHeight: 1.8 }}>
              Nuestro sistema logístico garantiza que tu pedido llegue en perfectas
              condiciones a cualquier rincón del país. Trabajamos con las mejores
              transportistas nacionales.
            </p>

            <div className="shipping-list">
              {shippingItems.map(item => {
                const Icon = item.icon
                return (
                  <div key={item.title} className="shipping-item">
                    <div className="shipping-item-icon">
                      <Icon size={22} strokeWidth={1.75} />
                    </div>
                    <div>
                      <div className="shipping-item-title">{item.title}</div>
                      <div className="shipping-item-desc">{item.desc}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: 32 }}>
              <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Transportistas aliadas:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {transportistas.map(t => (
                  <span key={t} style={{
                    padding: '6px 14px',
                    background: 'var(--off-white)',
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'var(--gray-600)',
                    border: '1px solid var(--gray-200)',
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="reveal-right">
            <div className="shipping-map-wrap" style={{ background: '#e8edf2', padding: 0, overflow: 'hidden' }}>
              <iframe
                title="Cobertura nacional - Perú"
                src="https://maps.google.com/maps?q=Peru&t=m&z=5&ie=UTF8&iwloc=B&output=embed&hl=es"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', minHeight: 480 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="map-badge" style={{ zIndex: 10 }}>🗺️ 25 Departamentos</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

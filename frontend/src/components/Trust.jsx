import { ShieldCheck, DollarSign, Truck, Zap, Users, FileText, RefreshCw, Package } from 'lucide-react'

const benefits = [
  {
    icon: ShieldCheck,
    title: 'Productos 100% Originales',
    desc: 'Trabajamos directamente con fabricantes y proveedores certificados. Calidad garantizada en cada producto.',
  },
  {
    icon: DollarSign,
    title: 'Precios Mayoristas',
    desc: 'Precios altamente competitivos por volumen. Ahorra hasta un 40% comparado con el mercado minorista.',
  },
  {
    icon: Truck,
    title: 'Envíos a Todo el Perú',
    desc: 'Despachos a los 25 departamentos. Coordinamos con las mejores empresas de transporte del país.',
  },
  {
    icon: Zap,
    title: 'Stock Permanente',
    desc: 'Mantenemos inventario constante de todos nuestros productos para asegurar disponibilidad inmediata.',
  },
  {
    icon: Users,
    title: 'Atención Personalizada',
    desc: 'Asesoramos a cada cliente en la selección de productos. Respuesta en menos de 24 horas.',
  },
  {
    icon: FileText,
    title: 'Facturación Electrónica',
    desc: 'Emitimos boletas y facturas electrónicas. Cumplimos con todos los requisitos tributarios de SUNAT.',
  },
  {
    icon: RefreshCw,
    title: 'Cambios y Devoluciones',
    desc: 'Política de cambios flexible ante defectos de fábrica. Tu inversión está protegida.',
  },
  {
    icon: Package,
    title: 'Mínimo 12 Unidades',
    desc: 'Venta exclusiva por docena para garantizar precios mayoristas. Ideal para negocios y revendedores.',
  },
]

export default function Trust() {
  return (
    <section className="trust-section section" id="nosotros">
      <div className="container">
        <div className="trust-header reveal">
          <div className="label">¿Por qué elegirnos?</div>
          <h2 className="section-title">
            La confianza de más de<br />
            <span className="text-red">100 Mayoristas en todo el Perú</span>
          </h2>
          <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
            Más de 5 años distribuyendo productos de calidad en todo el Perú.
            Somos tu mejor aliado comercial.
          </p>
        </div>

        <div className="trust-grid">
          {benefits.map((b, i) => {
            const Icon = b.icon
            return (
              <div key={b.title} className={`trust-card reveal reveal-delay-${(i % 4) + 1}`}>
                <div className="trust-icon">
                  <Icon size={28} strokeWidth={1.75} />
                </div>
                <h3 className="trust-title">{b.title}</h3>
                <p className="trust-desc">{b.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

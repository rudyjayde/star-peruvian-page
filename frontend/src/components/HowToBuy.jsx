import { MessageCircle, ClipboardList, CreditCard, PackageCheck } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: MessageCircle,
    title: 'Contacta por WhatsApp',
    desc: 'Escríbenos por WhatsApp o visítanos. Cuéntanos qué productos te interesan y en qué cantidades.',
  },
  {
    num: '02',
    icon: ClipboardList,
    title: 'Elige tu pedido',
    desc: 'Te enviamos el catálogo actualizado con precios por docena. Selecciona los productos y cantidades.',
  },
  {
    num: '03',
    icon: CreditCard,
    title: 'Confirma y paga',
    desc: 'Confirma tu pedido y realiza el pago por transferencia, Yape, Plin o efectivo en tienda.',
  },
  {
    num: '04',
    icon: PackageCheck,
    title: 'Recibe tu pedido',
    desc: 'Preparamos y despachamos tu pedido. Cobertura a todo el Perú con las mejores transportistas.',
  },
]

export default function HowToBuy() {
  return (
    <section className="howto-section section" id="como-comprar">
      <div className="container">
        <div className="howto-header">
          <div className="label label-white reveal">Cómo Comprar</div>
          <h2 className="section-title reveal" style={{ color: 'white' }}>
            Comprar al por mayor es <span style={{ color: 'var(--red)' }}>fácil</span>
          </h2>
          <p className="section-subtitle reveal" style={{ color: 'rgba(255,255,255,0.65)', margin: '16px auto 0' }}>
            Solo necesitas 4 pasos para hacer tu pedido mayorista con nosotros.
            Mínimo 12 unidades por referencia.
          </p>
        </div>

        <div className="howto-grid">
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <div key={step.num} className={`howto-card reveal reveal-delay-${i + 1}`}>
                <div className="howto-num">{step.num}</div>
                <div className="howto-icon">
                  <Icon size={28} strokeWidth={1.75} />
                </div>
                <h3 className="howto-title">{step.title}</h3>
                <p className="howto-desc">{step.desc}</p>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }} className="reveal">
          <a
            href="https://wa.me/51974789135?text=Hola%2C%20quiero%20hacer%20un%20pedido%20al%20por%20mayor"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-red btn-lg"
          >
            Empezar mi pedido ahora →
          </a>
        </div>
      </div>
    </section>
  )
}

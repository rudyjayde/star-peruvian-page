import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Terminos() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      {/* Header */}
      <div style={{ background: 'var(--blue)', padding: '80px 0 48px' }}>
        <div className="container">
          <Link to="/" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            ← Volver al inicio
          </Link>
          <div style={{ display: 'inline-block', background: 'rgba(227,6,19,0.2)', border: '1px solid rgba(227,6,19,0.3)', color: 'rgba(255,255,255,0.8)', padding: '4px 14px', borderRadius: 100, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
            Legal
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, color: 'white', letterSpacing: '0.02em' }}>
            Términos y Condiciones
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 12, fontSize: 14 }}>
            Última actualización: Mayo 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '64px 24px', maxWidth: 860 }}>
        <div style={{ fontFamily: 'var(--font-body)', lineHeight: 1.8, color: 'var(--gray-600)' }}>

          <Section title="1. Aceptación de los Términos">
            Al acceder y utilizar el sitio web de <strong style={{ color: 'var(--text)' }}>STAR PERUVIAN</strong>, usted acepta quedar
            vinculado por estos Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos,
            no podrá acceder al servicio. Estos términos aplican a todos los visitantes, usuarios y cualquier
            persona que acceda o utilice nuestros servicios.
          </Section>

          <Section title="2. Descripción del Servicio">
            STAR PERUVIAN es una empresa de importación y distribución mayorista con sede en Lima, Perú.
            Nuestros servicios incluyen la venta al por mayor de productos de ropa, accesorios y artículos
            relacionados, destinados exclusivamente a revendedores y negocios. La venta mínima es de una
            docena (12 unidades) por referencia.
          </Section>

          <Section title="3. Condiciones de Venta Mayorista">
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>La venta es <strong style={{ color: 'var(--text)' }}>exclusivamente al por mayor</strong>. El pedido mínimo es de 12 unidades por referencia.</li>
              <li>Los precios publicados corresponden al precio por docena (12 unidades) y están sujetos a cambios sin previo aviso.</li>
              <li>STAR PERUVIAN se reserva el derecho de verificar la identidad del comprador antes de procesar cualquier pedido.</li>
              <li>Los pedidos se confirman únicamente con el pago completo o el adelanto acordado.</li>
              <li>El stock está sujeto a disponibilidad. No garantizamos la disponibilidad permanente de todos los productos.</li>
            </ul>
          </Section>

          <Section title="4. Formas de Pago">
            Aceptamos los siguientes métodos de pago:
            <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Transferencia bancaria</li>
              <li>Yape / Plin</li>
              <li>Efectivo (solo en tienda física)</li>
              <li>Depósito bancario</li>
            </ul>
            <p style={{ marginTop: 8 }}>
              El pedido se procesa una vez confirmado el pago completo o el adelanto pactado.
            </p>
          </Section>

          <Section title="5. Envíos y Entrega">
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Realizamos envíos a los 25 departamentos del Perú a través de empresas de transporte aliadas.</li>
              <li>Los tiempos de entrega varían según el destino y la empresa transportista.</li>
              <li>El costo de envío es responsabilidad del comprador, salvo acuerdo específico.</li>
              <li>STAR PERUVIAN no se responsabiliza por daños o pérdidas ocasionados por la empresa transportista, sin embargo, orientamos al cliente en los casos de siniestro.</li>
              <li>Los pedidos se despachan en un plazo máximo de 48 horas hábiles tras la confirmación del pago.</li>
            </ul>
          </Section>

          <Section title="6. Devoluciones y Cambios">
            <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Aceptamos cambios por <strong style={{ color: 'var(--text)' }}>defectos de fábrica</strong> dentro de los 7 días calendario de recibido el pedido.</li>
              <li>El cliente debe documentar el defecto con fotografías y comunicarlo por WhatsApp antes de efectuar cualquier devolución.</li>
              <li>No se aceptan devoluciones por cambio de opinión, tallas incorrectas solicitadas por el cliente, o productos sin defecto comprobable.</li>
              <li>El costo de envío de la devolución es asumido por el cliente, salvo cuando el defecto sea responsabilidad comprobada de STAR PERUVIAN.</li>
            </ul>
          </Section>

          <Section title="7. Propiedad Intelectual">
            Todo el contenido del sitio web, incluyendo textos, imágenes, logotipos, diseños y código,
            es propiedad de STAR PERUVIAN o sus respectivos titulares. Queda prohibida su reproducción,
            distribución o uso comercial sin autorización previa y por escrito.
          </Section>

          <Section title="8. Limitación de Responsabilidad">
            STAR PERUVIAN no será responsable por daños indirectos, incidentales o consecuentes derivados
            del uso o la imposibilidad de uso de nuestros servicios. Nuestra responsabilidad máxima se
            limita al valor del pedido involucrado en la reclamación.
          </Section>

          <Section title="9. Ley Aplicable">
            Estos Términos se rigen por las leyes de la República del Perú. Cualquier disputa será sometida
            a los tribunales competentes de la ciudad de Lima, Perú. El consumidor tiene derecho a presentar
            una reclamación ante el <strong style={{ color: 'var(--text)' }}>INDECOPI</strong> o utilizar nuestro{' '}
            <Link to="/libro-reclamaciones" style={{ color: 'var(--red)' }}>Libro de Reclamaciones</Link>.
          </Section>

          <Section title="10. Contacto">
            Para consultas sobre estos términos contáctenos por:
            <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>WhatsApp: +51 974 789 135</li>
              <li>Email: contacto@starperuvian.com</li>
              <li>Dirección: Lima, Perú</li>
            </ul>
          </Section>

        </div>

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--gray-200)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/privacidad" className="btn btn-outline-red btn-sm">Política de Privacidad</Link>
          <Link to="/libro-reclamaciones" className="btn btn-blue btn-sm">Libro de Reclamaciones</Link>
          <Link to="/" className="btn btn-sm" style={{ border: '1px solid var(--gray-200)' }}>← Volver al inicio</Link>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 14, paddingBottom: 10, borderBottom: '2px solid var(--gray-100)' }}>
        {title}
      </h2>
      <div style={{ fontSize: 15, lineHeight: 1.8 }}>{children}</div>
    </div>
  )
}

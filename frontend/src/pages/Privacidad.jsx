import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Privacidad() {
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
            Política de Privacidad y Cookies
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 12, fontSize: 14 }}>
            Última actualización: Mayo 2024
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container" style={{ padding: '64px 24px', maxWidth: 860 }}>
        <div style={{ fontFamily: 'var(--font-body)', lineHeight: 1.8, color: 'var(--gray-600)' }}>

          <Section title="1. Responsable del Tratamiento">
            El responsable del tratamiento de sus datos personales es <strong style={{ color: 'var(--text)' }}>STAR PERUVIAN</strong>,
            empresa con sede en Lima, Perú. Puede contactarnos a través de:
            <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>WhatsApp: +51 974 789 135</li>
              <li>Email: contacto@starperuvian.com</li>
              <li>Dirección: Lima, Perú</li>
            </ul>
          </Section>

          <Section title="2. Datos que Recopilamos">
            Recopilamos los siguientes tipos de información:
            <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong style={{ color: 'var(--text)' }}>Datos de registro:</strong> Nombre de usuario y contraseña cifrada al crear una cuenta.</li>
              <li><strong style={{ color: 'var(--text)' }}>Datos de contacto:</strong> Nombre, número de teléfono, correo electrónico cuando nos escribe.</li>
              <li><strong style={{ color: 'var(--text)' }}>Datos de navegación:</strong> Dirección IP, tipo de navegador, páginas visitadas, tiempo de visita (a través de cookies).</li>
              <li><strong style={{ color: 'var(--text)' }}>Datos de reclamaciones:</strong> Información proporcionada al completar el Libro de Reclamaciones.</li>
            </ul>
          </Section>

          <Section title="3. Finalidad del Tratamiento">
            Utilizamos sus datos para:
            <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li>Gestionar su cuenta de usuario y acceso al sitio web.</li>
              <li>Procesar pedidos y coordinar envíos.</li>
              <li>Responder consultas y atender reclamaciones.</li>
              <li>Mejorar la experiencia de navegación y el funcionamiento del sitio.</li>
              <li>Enviar información comercial sobre productos y ofertas (solo si ha dado su consentimiento).</li>
              <li>Cumplir con obligaciones legales según la legislación peruana.</li>
            </ul>
          </Section>

          <Section title="4. Base Legal del Tratamiento">
            El tratamiento de sus datos se basa en:
            <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Su consentimiento explícito al registrarse o aceptar esta política.</li>
              <li>La ejecución de un contrato de compraventa.</li>
              <li>El cumplimiento de obligaciones legales (Ley N° 29733 - Ley de Protección de Datos Personales del Perú).</li>
              <li>Nuestro interés legítimo en mejorar nuestros servicios.</li>
            </ul>
          </Section>

          <Section title="5. Política de Cookies">
            <p style={{ marginBottom: 12 }}>
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio.
              Utilizamos los siguientes tipos de cookies:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'var(--off-white)', borderRadius: 8, padding: '16px 20px', border: '1px solid var(--gray-200)' }}>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 6 }}>🔧 Cookies Esenciales</strong>
                <p style={{ margin: 0, fontSize: 14 }}>
                  Necesarias para el funcionamiento básico del sitio. Incluyen la sesión de usuario (token de autenticación)
                  y las preferencias de cookies. No pueden desactivarse.
                </p>
              </div>
              <div style={{ background: 'var(--off-white)', borderRadius: 8, padding: '16px 20px', border: '1px solid var(--gray-200)' }}>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 6 }}>📊 Cookies de Análisis</strong>
                <p style={{ margin: 0, fontSize: 14 }}>
                  Nos ayudan a entender cómo los visitantes interactúan con el sitio. Los datos son anónimos y agregados.
                  Solo se activan si acepta todas las cookies.
                </p>
              </div>
              <div style={{ background: 'var(--off-white)', borderRadius: 8, padding: '16px 20px', border: '1px solid var(--gray-200)' }}>
                <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 6 }}>🗺️ Cookies de Terceros</strong>
                <p style={{ margin: 0, fontSize: 14 }}>
                  El mapa de Google Maps en la sección de envíos puede establecer cookies de Google LLC.
                  Consulte la política de privacidad de Google para más información.
                </p>
              </div>
            </div>

            <p style={{ marginTop: 16 }}>
              Puede gestionar sus preferencias de cookies desde la configuración de su navegador o usando los botones
              que aparecen en el banner de cookies al ingresar al sitio.
            </p>
          </Section>

          <Section title="6. Conservación de los Datos">
            Sus datos personales se conservarán:
            <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Datos de cuenta: mientras mantenga su cuenta activa.</li>
              <li>Datos de pedidos: 5 años según obligaciones tributarias.</li>
              <li>Datos de reclamaciones: 3 años según Código de Protección al Consumidor (INDECOPI).</li>
              <li>Datos de navegación: máximo 13 meses.</li>
            </ul>
          </Section>

          <Section title="7. Compartición de Datos">
            No vendemos ni alquilamos sus datos personales. Podemos compartirlos con:
            <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Empresas de transporte (Olva, Shalom, GRAEL, etc.) para gestionar envíos.</li>
              <li>Autoridades competentes cuando sea requerido por ley.</li>
              <li>INDECOPI en caso de reclamaciones formales.</li>
            </ul>
          </Section>

          <Section title="8. Sus Derechos (Ley N° 29733)">
            Conforme a la Ley de Protección de Datos Personales del Perú, usted tiene derecho a:
            <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <li><strong style={{ color: 'var(--text)' }}>Acceso:</strong> Conocer qué datos tenemos sobre usted.</li>
              <li><strong style={{ color: 'var(--text)' }}>Rectificación:</strong> Corregir datos incorrectos o desactualizados.</li>
              <li><strong style={{ color: 'var(--text)' }}>Cancelación:</strong> Solicitar la eliminación de sus datos.</li>
              <li><strong style={{ color: 'var(--text)' }}>Oposición:</strong> Oponerse al tratamiento de sus datos para fines comerciales.</li>
            </ul>
            <p style={{ marginTop: 12 }}>
              Para ejercer estos derechos, contáctenos por WhatsApp o email indicando su solicitud. Responderemos en un plazo máximo de 20 días hábiles.
            </p>
          </Section>

          <Section title="9. Seguridad">
            Implementamos medidas técnicas y organizativas para proteger sus datos:
            <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <li>Contraseñas cifradas con algoritmo bcrypt.</li>
              <li>Tokens de sesión con expiración automática.</li>
              <li>Acceso restringido a datos por roles (admin/usuario).</li>
              <li>Conexiones seguras HTTPS en producción.</li>
            </ul>
          </Section>

          <Section title="10. Cambios en esta Política">
            Podemos actualizar esta Política de Privacidad periódicamente. Los cambios entrarán en vigor al publicarse
            en este sitio web. Le recomendamos revisar esta página periódicamente. Para consultas,
            contáctenos a través de nuestros canales oficiales.
          </Section>

        </div>

        <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--gray-200)', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <Link to="/terminos" className="btn btn-outline-red btn-sm">Términos y Condiciones</Link>
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

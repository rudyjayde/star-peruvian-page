import { useState } from 'react'

const images = [
  { src: '/img/Casacas Invierno Sesion-14.jpg', alt: 'Casaca Invierno' },
  { src: '/img/Casacas Invierno Sesion-19.jpg', alt: 'Casaca Sport' },
  { src: '/img/Casacas Invierno Sesion-20.jpg', alt: 'Casaca Ejecutiva' },
  { src: '/img/chaleco-azul-Invierno Sesion-12.jpg', alt: 'Chaleco Azul' },
  { src: '/img/Casacas Invierno Sesion-22.jpg', alt: 'Casaca Slim' },
  { src: '/img/chaleco-rojo-Invierno Sesion-12.jpg', alt: 'Chaleco Rojo' },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section className="gallery-section section">
      <div className="container">
        <div className="gallery-header reveal">
          <div className="label">Galería</div>
          <h2 className="section-title">
            Nuestros <span className="text-red">productos</span> en detalle
          </h2>
        </div>

        <div className="gallery-grid reveal">
          {images.map((img, i) => (
            <div
              key={i}
              className="gallery-item"
              onClick={() => setLightbox(img)}
              style={{ cursor: 'pointer' }}
            >
              <img src={img.src} alt={img.alt} loading="lazy" />
              <div className="gallery-item-overlay">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            cursor: 'zoom-out',
          }}
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: 8 }}
          />
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              width: 48,
              height: 48,
              borderRadius: '50%',
              fontSize: 24,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ×
          </button>
        </div>
      )}
    </section>
  )
}

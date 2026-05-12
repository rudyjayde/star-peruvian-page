# STAR PERUVIAN — Sitio Web Mayorista

Sitio web profesional completo para distribuidora mayorista.

## Estructura del Proyecto

```
star-peruvian-page/
├── frontend/         React + Vite (Puerto 3000)
├── backend/          Node.js + Express (Puerto 5000)
├── img/              Imágenes del sitio
└── video/            Video de fondo (fondo-video.mp4)
```

## Requisitos

- Node.js 18+
- MongoDB (local o Atlas)

## Instalación y Ejecución

### 1. Backend

```bash
cd backend
npm install
```

Copia el archivo de entorno:
```bash
# El archivo .env ya está creado con valores por defecto
# Edítalo si tienes MongoDB Atlas o cambias el puerto
```

Inicia el servidor:
```bash
npm run dev
```

El backend corre en: http://localhost:5000

> **Usuario admin creado automáticamente:**
> - Usuario: `admin`
> - Contraseña: `admin123`

### 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend corre en: http://localhost:3000

## Páginas del sitio

| URL | Descripción |
|-----|-------------|
| `/` | Sitio web principal |
| `/login` | Login del administrador |
| `/admin` | Panel de administración |

## Panel Admin

Accede en: http://localhost:3000/login

- Usuario: **admin**
- Contraseña: **admin123**

### Funcionalidades del Admin:
- ✅ Crear, editar y eliminar productos
- ✅ Subir imágenes de productos
- ✅ Gestionar stock y precios
- ✅ Activar/desactivar productos
- ✅ Ver estadísticas

## Sin MongoDB (Modo Demo)

El frontend funciona con datos de demostración sin necesidad de MongoDB.
Solo levanta el frontend y verás los productos de ejemplo.

## WhatsApp

Actualiza el número de WhatsApp en los archivos:
- `frontend/src/components/Hero.jsx`
- `frontend/src/components/Products.jsx`
- `frontend/src/components/Footer.jsx`
- `frontend/src/components/WhatsAppButton.jsx`
- `frontend/src/components/CTASection.jsx`

Reemplaza `51974789135` con tu número real (código país + número sin +).

## Redes Sociales

Links configurados en `Footer.jsx`:
- Instagram: https://www.instagram.com/starperuviann/
- Facebook: https://www.facebook.com/profile.php?id=61562848862441
- TikTok: https://www.tiktok.com/@star_peruvian

## Producción (Build)

```bash
cd frontend
npm run build
```

Los archivos estáticos se generan en `frontend/dist/`.

## Tecnologías

- **Frontend:** React 18, Vite, React Router, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer
- **CSS:** CSS Variables personalizado (sin frameworks)
- **Fuentes:** Syne + DM Sans (Google Fonts)

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function serveParentAssets() {
  return {
    name: 'serve-parent-assets',
    configureServer(server) {
      const mimeTypes = {
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
      }

      server.middlewares.use((req, res, next) => {
        const urlPath = req.url.split('?')[0]

        if (urlPath.startsWith('/video/') || urlPath.startsWith('/img/')) {
          const subPath = urlPath.startsWith('/video/') ? urlPath.slice(7) : urlPath.slice(5)
          const dir = urlPath.startsWith('/video/') ? '../video' : '../img'
          const filePath = path.resolve(__dirname, dir, decodeURIComponent(subPath))

          if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath).toLowerCase()
            const mime = mimeTypes[ext] || 'application/octet-stream'
            const stat = fs.statSync(filePath)

            // Range request support for video
            if (req.headers.range && mime.startsWith('video/')) {
              const range = req.headers.range
              const parts = range.replace(/bytes=/, '').split('-')
              const start = parseInt(parts[0], 10)
              const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1
              const chunkSize = end - start + 1

              res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${stat.size}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': mime,
              })
              fs.createReadStream(filePath, { start, end }).pipe(res)
            } else {
              res.writeHead(200, {
                'Content-Type': mime,
                'Content-Length': stat.size,
                'Accept-Ranges': 'bytes',
                'Cache-Control': 'public, max-age=3600',
              })
              fs.createReadStream(filePath).pipe(res)
            }
            return
          }
        }
        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), serveParentAssets()],
  server: {
    port: 3002,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})

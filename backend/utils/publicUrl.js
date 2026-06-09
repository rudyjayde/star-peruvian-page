const normalizeBaseUrl = (value) => {
  if (!value) return ''
  return String(value).trim().replace(/\/+$/, '')
}

const getPublicBaseUrl = (req) => {
  const configured = normalizeBaseUrl(
    process.env.PUBLIC_URL ||
    process.env.BACKEND_URL ||
    process.env.API_URL
  )

  if (configured) return configured

  const proto = String(req.headers['x-forwarded-proto'] || req.protocol || 'http').split(',')[0].trim()
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim()

  return host ? `${proto}://${host}` : ''
}

const toPublicUrl = (req, assetPath) => {
  if (!assetPath) return ''
  if (/^(data:|blob:|https?:\/\/|\/\/)/.test(assetPath)) return assetPath
  if (!assetPath.startsWith('/')) return assetPath

  const baseUrl = getPublicBaseUrl(req)
  return baseUrl ? `${baseUrl}${assetPath}` : assetPath
}

module.exports = {
  getPublicBaseUrl,
  toPublicUrl,
}

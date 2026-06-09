const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || ''

export function normalizeImageList(images) {
  if (Array.isArray(images)) return images.filter(Boolean)
  if (typeof images === 'string' && images.trim()) {
    try {
      const parsed = JSON.parse(images)
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [images]
    } catch {
      return [images]
    }
  }
  return []
}

export function normalizeTextList(values) {
  if (Array.isArray(values)) {
    return values.map(item => String(item).trim()).filter(Boolean)
  }

  if (typeof values === 'string' && values.trim()) {
    try {
      const parsed = JSON.parse(values)
      if (Array.isArray(parsed)) {
        return parsed.map(item => String(item).trim()).filter(Boolean)
      }
    } catch {
      return values
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
    }
  }

  return []
}

export function resolveAssetUrl(src) {
  if (!src) return ''
  if (/^(data:|blob:|https?:\/\/|\/\/)/.test(src)) return src
  if (src.startsWith('/img/') || src.startsWith('/video/')) return src
  if (src.startsWith('/uploads/')) {
    return API_BASE_URL ? `${API_BASE_URL}${src}` : src
  }
  return src
}

export function getFirstImageSrc(images) {
  return resolveAssetUrl(normalizeImageList(images)[0])
}

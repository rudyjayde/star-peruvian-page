import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { getFirstImageSrc, normalizeImageList, normalizeTextList } from '../utils/assetUrl'

const EMPTY_FORM = {
  name: '',
  categoryId: '',
  brand: '',
  price: '',
  stock: '',
  minOrder: 12,
  description: '',
  colors: '',
  sizes: '',
  active: true,
}

// Turns the category tree into a flat list for the <select>, prefixing
// children with dashes so the hierarchy stays visible.
const flattenCategories = (nodes, depth = 0) =>
  nodes.flatMap(node => [
    { id: node.id, label: `${'— '.repeat(depth)}${node.name}` },
    ...flattenCategories(node.children || [], depth + 1),
  ])

export default function Admin() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [imageEntries, setImageEntries] = useState([])
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [categoryTree, setCategoryTree] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryParentId, setNewCategoryParentId] = useState('')
  const [showNewCategory, setShowNewCategory] = useState(false)
  const fileRef = useRef()

  const flatCategories = flattenCategories(categoryTree)
  const brandOptions = [...new Set(products.map(product => String(product.brand || '').trim()).filter(Boolean))].sort((left, right) => left.localeCompare(right))
  const getProductId = (product) => product?.id ?? product?._id
  const readFileAsDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories')
      setCategoryTree(res.data)
    } catch {
      setCategoryTree([])
    }
  }

  const addCategory = async () => {
    const name = newCategoryName.trim()
    if (!name) return
    try {
      const res = await axios.post('/api/categories', {
        name,
        parentId: newCategoryParentId || null,
      })
      await fetchCategories()
      setForm(f => ({ ...f, categoryId: res.data.id }))
      setNewCategoryName('')
      setNewCategoryParentId('')
      setShowNewCategory(false)
    } catch (err) {
      alert('Error al crear categoría: ' + (err.response?.data?.message || err.message))
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/products/all')
      setProducts(res.data)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product)
      setForm({
        name: product.name,
        categoryId: product.categoryId,
        brand: product.brand || '',
        price: product.price,
        stock: product.stock,
        minOrder: product.minOrder || 12,
        description: product.description || '',
        colors: normalizeTextList(product.colors).join(', '),
        sizes: normalizeTextList(product.sizes).join(', '),
        active: product.active !== false,
      })
      setImageEntries(normalizeImageList(product.images).map(src => ({ type: 'existing', src })))
    } else {
      setEditingProduct(null)
      setForm(EMPTY_FORM)
      setImageEntries([])
    }
    setShowModal(true)
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    const newEntries = await Promise.all(files.map(async (file) => ({
      type: 'new',
      file,
      src: await readFileAsDataUrl(file),
    })))

    setImageEntries(entries => [...entries, ...newEntries])
    e.target.value = ''
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.categoryId) {
      alert('Selecciona una categoría')
      return
    }
    setSaving(true)
    try {
      const existingImages = imageEntries.filter(entry => entry.type === 'existing').map(entry => entry.src)
      const newEntries = imageEntries.filter(entry => entry.type === 'new')
      const uploadedImages = await Promise.all(newEntries.map(async (entry) => {
        const fd = new FormData()
        fd.append('image', entry.file)
        const res = await axios.post('/api/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        return res.data.url
      }))

      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        price: Number(form.price),
        stock: Number(form.stock),
        minOrder: Number(form.minOrder),
        brand: form.brand.trim(),
        colors: normalizeTextList(form.colors),
        sizes: normalizeTextList(form.sizes),
        images: [...existingImages, ...uploadedImages],
      }

      if (editingProduct) {
        await axios.put(`/api/products/${getProductId(editingProduct)}`, payload)
      } else {
        await axios.post('/api/products', payload)
      }

      await fetchProducts()
      setShowModal(false)
    } catch (err) {
      alert('Error al guardar: ' + (err.response?.data?.message || err.message))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!id) {
      alert('No se pudo eliminar: el producto no tiene ID válido.')
      return
    }
    try {
      await axios.delete(`/api/products/${id}`)
      await fetchProducts()
      setDeleteConfirm(null)
    } catch (err) {
      alert('Error al eliminar: ' + (err.response?.data?.message || err.message))
    }
  }

  const stats = {
    total: products.length,
    active: products.filter(p => p.active !== false).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    categories: [...new Set(products.map(p => p.category))].length,
  }

  const navItems = [
    { id: 'products', icon: '📦', label: 'Productos' },
    { id: 'stats', icon: '📊', label: 'Estadísticas' },
  ]

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <img src="/img/logo ACTUALIZADO.png" alt="STAR PERUVIAN" onError={e => { e.target.style.display = 'none' }} />
          <p>Panel Administrativo</p>
        </div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <Link to="/" className="admin-nav-item" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>🌐</span> Ver Sitio Web
          </Link>
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>
            Sesión: <strong style={{ color: 'rgba(255,255,255,0.7)' }}>{user?.username}</strong>
          </div>
          <button className="admin-nav-item" onClick={logout} style={{ color: 'rgba(239,68,68,0.8)', width: '100%' }}>
            <span>🚪</span> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-title">
            {activeTab === 'products' ? 'Gestión de Productos' : 'Estadísticas'}
          </div>
          <div className="admin-topbar-actions">
            {activeTab === 'products' && (
              <button className="btn btn-red btn-sm" onClick={() => openModal()}>
                + Nuevo Producto
              </button>
            )}
          </div>
        </div>

        <div className="admin-content">
          {/* Stats Row */}
          <div className="admin-stats-row">
            {[
              { label: 'Total Productos', value: stats.total, color: '' },
              { label: 'Activos', value: stats.active, color: '' },
              { label: 'Sin Stock', value: stats.outOfStock, color: 'red' },
              { label: 'Categorías', value: stats.categories, color: '' },
            ].map(s => (
              <div key={s.label} className="admin-stat-card">
                <div className="admin-stat-label">{s.label}</div>
                <div className={`admin-stat-value ${s.color}`}>{loading ? '–' : s.value}</div>
              </div>
            ))}
          </div>

          {/* Products Table */}
          {activeTab === 'products' && (
            <div className="admin-panel-card">
              <div className="admin-panel-header">
                <h3>Productos ({products.length})</h3>
                <button className="btn btn-outline-red btn-sm" onClick={fetchProducts}>
                  ↻ Actualizar
                </button>
              </div>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray-400)' }}>
                  Cargando productos...
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state">
                  <p>No hay productos aún. ¡Agrega el primero!</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Imagen</th>
                        <th>Nombre</th>
                        <th>Marca</th>
                        <th>Categoría</th>
                        <th>Precio/Doc.</th>
                        <th>Stock</th>
                        <th>Mín.</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(p => (
                        <tr key={getProductId(p)}>
                          <td>
                            <img
                              src={getFirstImageSrc(p.images) || '/img/logo ACTUALIZADO.png'}
                              alt={p.name}
                              className="admin-product-img"
                              onError={e => { e.target.src = '/img/logo ACTUALIZADO.png'; e.target.style.objectFit = 'contain'; e.target.style.padding = '4px' }}
                            />
                          </td>
                          <td style={{ fontWeight: 600, maxWidth: 180 }}>{p.name}</td>
                          <td>
                            <span style={{ background: 'var(--off-white)', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                              {p.brand || 'Sin marca'}
                            </span>
                          </td>
                          <td>
                            <span style={{ background: 'var(--off-white)', padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                              {p.category}
                            </span>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--red)' }}>S/ {p.price}</td>
                          <td>
                            <span style={{ fontWeight: 600, color: p.stock > 0 ? 'var(--text)' : 'var(--gray-400)' }}>
                              {p.stock}
                            </span>
                          </td>
                          <td style={{ color: 'var(--gray-600)' }}>{p.minOrder || 12}u</td>
                          <td>
                            <span className={p.active !== false ? 'badge-active' : 'badge-inactive'}>
                              {p.active !== false ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn-icon" onClick={() => openModal(p)} title="Editar">✏️</button>
                              <button className="btn-icon danger" onClick={() => setDeleteConfirm(getProductId(p))} title="Eliminar">🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div style={{ padding: '20px 0' }}>
              <div className="admin-panel-card" style={{ padding: 32 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, marginBottom: 24 }}>
                  Resumen del Negocio
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
                  {[
                    { label: 'Categorías activas', value: stats.categories },
                    { label: 'Productos con stock', value: stats.active - stats.outOfStock },
                    { label: 'Total productos', value: stats.total },
                    { label: 'Productos sin stock', value: stats.outOfStock },
                  ].map(s => (
                    <div key={s.label} style={{ padding: 20, background: 'var(--off-white)', borderRadius: 'var(--radius-lg)' }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>{s.label}</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, color: 'var(--text)' }}>{s.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false) }}>
          <div className="admin-modal">
            <h2 className="admin-modal-title">
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Nombre del producto *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Casaca Invierno Premium"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Marca</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ej: PUMA"
                    list="brand-options"
                    value={form.brand}
                    onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                  />
                  <datalist id="brand-options">
                    {brandOptions.map(brand => (
                      <option key={brand} value={brand} />
                    ))}
                  </datalist>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, brand: '' }))}
                    style={{ marginTop: 6, fontSize: 12, color: 'var(--gray-500)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)' }}
                  >
                    + Limpiar marca
                  </button>
                </div>
                <div className="form-group">
                  <label className="form-label">Categoría *</label>
                  {showNewCategory ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ej: Zapatillas"
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                        autoFocus
                      />
                      <select
                        className="form-select"
                        value={newCategoryParentId}
                        onChange={e => setNewCategoryParentId(e.target.value)}
                      >
                        <option value="">Sin categoría padre (raíz)</option>
                        {flatCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button type="button" className="btn btn-red btn-sm" onClick={addCategory}>
                          Agregar
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => { setShowNewCategory(false); setNewCategoryName(''); setNewCategoryParentId('') }}
                          style={{ border: '1px solid var(--gray-200)' }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <select
                      className="form-select"
                      value={form.categoryId}
                      onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
                      required
                    >
                      <option value="" disabled>Selecciona una categoría</option>
                      {flatCategories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                    </select>
                  )}
                  {!showNewCategory && (
                    <button
                      type="button"
                      onClick={() => setShowNewCategory(true)}
                      style={{ marginTop: 6, fontSize: 12, color: 'var(--blue)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontFamily: 'var(--font-body)' }}
                    >
                      + Crear nueva categoría
                    </button>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={form.active ? 'active' : 'inactive'}
                    onChange={e => setForm(f => ({ ...f, active: e.target.value === 'active' }))}
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Precio por docena (S/) *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="240"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock disponible *</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="120"
                    min="0"
                    value={form.stock}
                    onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Mínimo de compra (unidades)</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="12"
                  min="1"
                  value={form.minOrder}
                  onChange={e => setForm(f => ({ ...f, minOrder: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea
                  className="form-textarea"
                  placeholder="Describe el producto..."
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Colores disponibles</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Negro, Blanco, Rojo"
                    value={form.colors}
                    onChange={e => setForm(f => ({ ...f, colors: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Tallas disponibles</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="S, M, L, XL"
                    value={form.sizes}
                    onChange={e => setForm(f => ({ ...f, sizes: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Imágenes del producto</label>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <div
                  className="upload-zone"
                  onClick={() => fileRef.current?.click()}
                >
                  {imageEntries.length > 0 ? (
                    <div style={{ width: '100%' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: 10, marginBottom: 12 }}>
                        {imageEntries.map((entry, index) => (
                          <div key={`${entry.type}-${index}`} style={{ position: 'relative', border: '1px solid var(--gray-200)', borderRadius: 12, overflow: 'hidden', background: 'white' }}>
                            <img src={entry.src} alt={`preview-${index + 1}`} style={{ width: '100%', height: 96, objectFit: 'cover', display: 'block' }} />
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation()
                                setImageEntries(entries => entries.filter((_, currentIndex) => currentIndex !== index))
                              }}
                              style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: '50%', border: 'none', background: 'rgba(0,0,0,0.72)', color: 'white', cursor: 'pointer' }}
                              aria-label="Quitar imagen"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="upload-zone-text">
                        <strong>Haz clic para agregar más imágenes</strong><br />
                        <span style={{ fontSize: 12 }}>Puedes subir varias fotos para mostrar colores, tallas o vistas del producto</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: 32 }}>📷</div>
                      <div className="upload-zone-text">
                        <strong>Haz clic para subir</strong> o arrastra tus imágenes aquí<br />
                        <span style={{ fontSize: 12 }}>JPG, PNG, WEBP — máx. 5MB</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn-outline-red btn-sm"
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-red" disabled={saving}>
                  {saving ? 'Guardando...' : editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <h2 className="admin-modal-title" style={{ color: 'var(--red)' }}>
              ¿Eliminar producto?
            </h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: 24 }}>
              Esta acción no se puede deshacer. El producto será eliminado permanentemente.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline-red btn-sm" onClick={() => setDeleteConfirm(null)}>
                Cancelar
              </button>
              <button className="btn btn-red btn-sm" onClick={() => handleDelete(deleteConfirm)}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

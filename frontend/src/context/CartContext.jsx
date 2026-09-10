import { createContext, useContext, useState, useEffect } from 'react'

export const CartContext = createContext(null)

const STORAGE_KEY = 'sp_cart'

const readStoredCart = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Server always re-validates price/stock/minOrder at checkout — this is
  // just for a responsive cart UI, never trusted for the actual charge.
  const addItem = (product, quantity) => {
    setItems(current => {
      const existing = current.find(item => item.productId === product.id)
      if (existing) {
        return current.map(item =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      }
      return [...current, {
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || '',
        price: Number(product.price),
        minOrder: product.minOrder || 1,
        quantity,
      }]
    })
  }

  const updateQuantity = (productId, quantity) => {
    setItems(current => current.map(item =>
      item.productId === productId ? { ...item, quantity: Math.max(1, quantity) } : item
    ))
  }

  const removeItem = (productId) => {
    setItems(current => current.filter(item => item.productId !== productId))
  }

  const clear = () => setItems([])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clear, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)

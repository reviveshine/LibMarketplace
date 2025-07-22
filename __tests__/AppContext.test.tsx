import { renderHook, act } from '@testing-library/react'
import { AppProvider, useCart, useWishlist } from '../contexts/AppContext'

// Mock product for testing
const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'Test description',
  price: 29.99,
  stock: 10,
  image: 'test-image.jpg'
}

// Wrapper for hooks that need context
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AppProvider>{children}</AppProvider>
)

describe('Cart Context', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct)
    })

    expect(result.current.cartItems).toHaveLength(1)
    expect(result.current.cartItems[0]).toEqual({ ...mockProduct, quantity: 1 })
    expect(result.current.cartCount).toBe(1)
    expect(result.current.cartTotal).toBe(29.99)
  })

  it('should increase quantity when adding same item', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.addToCart(mockProduct)
    })

    expect(result.current.cartItems).toHaveLength(1)
    expect(result.current.cartItems[0].quantity).toBe(2)
    expect(result.current.cartCount).toBe(2)
    expect(result.current.cartTotal).toBe(59.98)
  })

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.removeFromCart(mockProduct.id)
    })

    expect(result.current.cartItems).toHaveLength(0)
    expect(result.current.cartCount).toBe(0)
    expect(result.current.cartTotal).toBe(0)
  })

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.updateQuantity(mockProduct.id, 5)
    })

    expect(result.current.cartItems[0].quantity).toBe(5)
    expect(result.current.cartCount).toBe(5)
    expect(result.current.cartTotal).toBe(149.95)
  })

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.updateQuantity(mockProduct.id, 0)
    })

    expect(result.current.cartItems).toHaveLength(0)
  })

  it('should clear entire cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper })

    act(() => {
      result.current.addToCart(mockProduct)
      result.current.addToCart({ ...mockProduct, id: 2, name: 'Product 2' })
      result.current.clearCart()
    })

    expect(result.current.cartItems).toHaveLength(0)
    expect(result.current.cartCount).toBe(0)
    expect(result.current.cartTotal).toBe(0)
  })
})

describe('Wishlist Context', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should add item to wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })

    act(() => {
      result.current.addToWishlist(mockProduct)
    })

    expect(result.current.wishlist).toHaveLength(1)
    expect(result.current.wishlist[0]).toEqual(mockProduct)
    expect(result.current.isInWishlist(mockProduct.id)).toBe(true)
  })

  it('should not add duplicate items to wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })

    act(() => {
      result.current.addToWishlist(mockProduct)
      result.current.addToWishlist(mockProduct) // Try to add same item again
    })

    expect(result.current.wishlist).toHaveLength(1)
  })

  it('should remove item from wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })

    act(() => {
      result.current.addToWishlist(mockProduct)
      result.current.removeFromWishlist(mockProduct.id)
    })

    expect(result.current.wishlist).toHaveLength(0)
    expect(result.current.isInWishlist(mockProduct.id)).toBe(false)
  })

  it('should correctly identify if item is in wishlist', () => {
    const { result } = renderHook(() => useWishlist(), { wrapper })

    expect(result.current.isInWishlist(mockProduct.id)).toBe(false)

    act(() => {
      result.current.addToWishlist(mockProduct)
    })

    expect(result.current.isInWishlist(mockProduct.id)).toBe(true)
  })
})
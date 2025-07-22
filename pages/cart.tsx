import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { CartItem } from '../types'

export default function Cart() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    if (!loading) {
      localStorage.setItem('cart', JSON.stringify(cartItems))
    }
  }, [cartItems, loading])

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.id !== productId))
  }

  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      setCartItems([])
    }
  }

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 100 ? 0 : 10 // Free shipping over $100
  const tax = subtotal * 0.08 // 8% tax
  const total = subtotal + shipping + tax

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!')
      return
    }
    router.push('/checkout')
  }

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-liberian-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Head>
        <title>Shopping Cart - LibMarketplace</title>
        <meta name="description" content="Review your shopping cart on LibMarketplace" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🛒 Shopping Cart</h1>
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-liberian-blue">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Shopping Cart</span>
          </nav>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="text-8xl mb-6">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/products" className="btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Cart with Items */
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Cart Items ({cartItems.length})</h2>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>

                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <Link href={`/products/${item.id}`}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-20 h-20 object-cover rounded cursor-pointer hover:opacity-80"
                          />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.id}`}>
                            <h3 className="text-lg font-medium text-gray-900 hover:text-liberian-blue cursor-pointer line-clamp-2">
                              {item.name}
                            </h3>
                          </Link>
                          <div className="flex items-center mt-1">
                            <img 
                              src={item.seller.avatar || '/default-avatar.png'} 
                              alt={item.seller.name}
                              className="w-5 h-5 rounded-full mr-2"
                            />
                            <p className="text-sm text-gray-600">by {item.seller.name}</p>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            Stock: {item.stock}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">
                            ${item.price.toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-16 text-center border rounded px-2 py-1"
                            min="1"
                            max={item.stock}
                          />
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right">
                          <p className="text-lg font-semibold text-liberian-red">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Remove from cart"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continue Shopping */}
              <div className="mt-6">
                <Link href="/products" className="btn-secondary">
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  {subtotal > 100 && (
                    <div className="text-sm text-green-600">
                      🎉 You qualify for free shipping!
                    </div>
                  )}
                  {subtotal <= 100 && (
                    <div className="text-sm text-gray-600">
                      Add ${(100 - subtotal).toFixed(2)} more for free shipping
                    </div>
                  )}
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-liberian-red">${total.toFixed(2)}</span>
                </div>

                <button
                  onClick={proceedToCheckout}
                  className="w-full mt-6 btn-primary text-lg py-3"
                >
                  Proceed to Checkout
                </button>

                {/* Payment Options */}
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">We accept:</p>
                  <div className="flex justify-center space-x-2 text-sm">
                    <span className="px-2 py-1 bg-gray-100 rounded">💳 Cards</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">📱 Mobile Money</span>
                    <span className="px-2 py-1 bg-gray-100 rounded">🏦 Bank Transfer</span>
                  </div>
                </div>

                {/* Security */}
                <div className="mt-4 text-center text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-1">
                    <span>🔒</span>
                    <span>Secure checkout with SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
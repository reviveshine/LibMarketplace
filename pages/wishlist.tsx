import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { User, Product, CartItem } from '../types'
import { mockProducts } from '../data/mockData'

export default function Wishlist() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load wishlist from localStorage (mock)
    const savedWishlist = localStorage.getItem('wishlist')
    if (savedWishlist) {
      const wishlistIds = JSON.parse(savedWishlist)
      const wishlistProducts = mockProducts.filter(product => wishlistIds.includes(product.id))
      setWishlistItems(wishlistProducts)
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    setLoading(false)
  }, [router])

  const addToCart = (product: Product) => {
    const existing = cartItems.find(item => item.id === product.id)
    let updatedCart: CartItem[]

    if (existing) {
      updatedCart = cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }]
    }

    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeFromWishlist = (productId: number) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId)
    setWishlistItems(updatedWishlist)
    
    // Update localStorage
    const wishlistIds = updatedWishlist.map(item => item.id)
    localStorage.setItem('wishlist', JSON.stringify(wishlistIds))
  }

  const addAllToCart = () => {
    const availableItems = wishlistItems.filter(item => item.stock > 0)
    
    if (availableItems.length === 0) {
      alert('No items in your wishlist are currently available.')
      return
    }

    let updatedCart = [...cartItems]
    
    availableItems.forEach(product => {
      const existing = updatedCart.find(item => item.id === product.id)
      if (existing) {
        updatedCart = updatedCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        updatedCart.push({ ...product, quantity: 1 })
      }
    })

    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    
    alert(`Added ${availableItems.length} items to your cart!`)
  }

  const clearWishlist = () => {
    if (confirm('Are you sure you want to clear your entire wishlist?')) {
      setWishlistItems([])
      localStorage.removeItem('wishlist')
    }
  }

  const shareWishlist = () => {
    const wishlistUrl = `${window.location.origin}/wishlist/shared/${user?.userId}`
    navigator.clipboard.writeText(wishlistUrl).then(() => {
      alert('Wishlist link copied to clipboard!')
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = wishlistUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Wishlist link copied to clipboard!')
    })
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const availableItems = wishlistItems.filter(item => item.stock > 0)
  const unavailableItems = wishlistItems.filter(item => item.stock === 0)

  return (
    <Layout>
      <Head>
        <title>My Wishlist - LibMarketplace</title>
        <meta name="description" content="Your saved products on LibMarketplace" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">❤️ My Wishlist</h1>
            <p className="text-gray-600">Keep track of products you love and want to buy later</p>
          </div>

          {wishlistItems.length === 0 ? (
            /* Empty Wishlist */
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-8xl mb-6">❤️</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">
                Discover amazing products and save them to your wishlist for later
              </p>
              <Link href="/products" className="btn-primary text-lg px-8 py-3">
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Wishlist Actions */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
                    </h2>
                    <span className="text-gray-500">|</span>
                    <span className="text-green-600 font-medium">
                      {availableItems.length} available
                    </span>
                    {unavailableItems.length > 0 && (
                      <>
                        <span className="text-gray-500">|</span>
                        <span className="text-red-600 font-medium">
                          {unavailableItems.length} out of stock
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    {availableItems.length > 0 && (
                      <button
                        onClick={addAllToCart}
                        className="btn-success"
                      >
                        🛒 Add All to Cart
                      </button>
                    )}
                    <button
                      onClick={shareWishlist}
                      className="btn-secondary"
                    >
                      📤 Share Wishlist
                    </button>
                    <button
                      onClick={clearWishlist}
                      className="btn-danger"
                    >
                      🗑️ Clear All
                    </button>
                  </div>
                </div>
              </div>

              {/* Cart Button */}
              <div className="flex justify-end mb-6">
                <button 
                  onClick={() => router.push('/cart')}
                  className="relative btn-primary"
                >
                  🛒 Cart ({cartItems.length})
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs cart-badge">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </div>

              {/* Available Items */}
              {availableItems.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Available Items</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {availableItems.map((product) => (
                      <div key={product.id} className="relative">
                        <ProductCard
                          product={product}
                          onAddToCart={addToCart}
                          onAddToWishlist={() => removeFromWishlist(product.id)}
                        />
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                          title="Remove from wishlist"
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Unavailable Items */}
              {unavailableItems.length > 0 && (
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-6">Currently Unavailable</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {unavailableItems.map((product) => (
                      <div key={product.id} className="relative opacity-60">
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                          <div className="relative">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-48 object-cover grayscale" 
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Out of Stock
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-2xl font-bold text-gray-400">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <button 
                                disabled
                                className="flex-1 bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
                              >
                                Out of Stock
                              </button>
                              <button
                                onClick={() => alert('We\'ll notify you when this item is back in stock!')}
                                className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                                title="Notify when available"
                              >
                                🔔
                              </button>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromWishlist(product.id)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                          title="Remove from wishlist"
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Wishlist Tips */}
              <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">💡 Wishlist Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <h4 className="font-medium mb-2">Save for Later:</h4>
                    <ul className="space-y-1">
                      <li>• Click the ❤️ icon on any product to save it</li>
                      <li>• Get notified when items go on sale</li>
                      <li>• Never lose track of products you love</li>
                      <li>• Share your wishlist with friends and family</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Quick Actions:</h4>
                    <ul className="space-y-1">
                      <li>• Add multiple items to cart at once</li>
                      <li>• Get notified when out-of-stock items return</li>
                      <li>• Create a public wishlist for gift-giving</li>
                      <li>• Track price changes on saved items</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}
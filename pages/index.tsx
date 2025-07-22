import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import ProductCard from '../components/ProductCard'
import SearchBar from '../components/SearchBar'
import { Product, CartItem, SearchFilters } from '../types'
import { mockProducts, mockCategories } from '../data/mockData'

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)

  const addToCart = (product: Product) => {
    const existing = cartItems.find(item => item.id === product.id)
    if (existing) {
      setCartItems(cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(cartItems.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    ))
  }

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)

  const checkout = () => {
    alert(`Order placed! Total: $${cartTotal}. You will be redirected to complete registration and verification.`)
    setCartItems([])
    setShowCart(false)
    // TODO: Redirect to auth/register if not logged in
  }

  const handleSearch = (query: string, filters: SearchFilters) => {
    let filtered = mockProducts

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      )
    }

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(product => product.price >= filters.minPrice!)
    }
    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(product => product.price <= filters.maxPrice!)
    }

    // Filter by rating
    if (filters.rating !== undefined) {
      filtered = filtered.filter(product => product.rating >= filters.rating!)
    }

    // Filter by stock
    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0)
    }

    // Sort products
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let comparison = 0
        switch (filters.sortBy) {
          case 'price':
            comparison = a.price - b.price
            break
          case 'rating':
            comparison = a.rating - b.rating
            break
          case 'name':
            comparison = a.name.localeCompare(b.name)
            break
          case 'newest':
            comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            break
        }
        return filters.sortOrder === 'desc' ? -comparison : comparison
      })
    }

    setFilteredProducts(filtered)
  }

  return (
    <Layout>
      <Head>
        <title>LibMarketplace - Where Liberia Buys, Sells, and Connects</title>
        <meta name="description" content="Authentic Liberian products and marketplace for local businesses" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-liberian-blue to-liberian-red text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">🇱🇷 Welcome to LibMarketplace</h2>
          <p className="text-xl md:text-2xl mb-8">Where Liberia Buys, Sells, and Connects</p>
          <div className="mb-8">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search for authentic Liberian products..."
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products" className="bg-white text-liberian-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              🛍️ Start Shopping
            </Link>
            <Link href="/auth/register?type=seller" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-liberian-blue transition-colors">
              🏪 Become a Seller
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">🛍️ Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {mockCategories.map((category) => (
            <Link 
              key={category.id} 
              href={`/categories/${category.id}`}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              <img 
                src={category.image} 
                alt={category.name} 
                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="p-4 text-center">
                <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                <p className="text-xs text-gray-600">{category.productCount} items</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">🇱🇷 Featured Products</h2>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowCart(true)} 
              className="relative btn-primary"
            >
              🛒 Cart ({cartItems.length})
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs cart-badge">
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
            <Link href="/products" className="btn-secondary">
              View All Products
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">❤️ What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b25683ef?w=60&h=60&fit=crop&crop=face" 
                  alt="Customer" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600 italic">"Amazing authentic products! The kente cloth I bought is absolutely beautiful and the quality is exceptional."</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face" 
                  alt="Customer" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Michael Davis</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600 italic">"Fast shipping and excellent customer service. The coffee from Nimba County is the best I've ever tasted!"</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face" 
                  alt="Customer" 
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-semibold">Grace Wilson</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600 italic">"LibMarketplace helps me stay connected to my Liberian heritage. Every product tells a story."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">🛒 Shopping Cart</h3>
                <button 
                  onClick={() => setShowCart(false)} 
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              {cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-gray-600">${item.price}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="bg-gray-200 px-2 py-1 rounded"
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            className="bg-gray-200 px-2 py-1 rounded"
                          >
                            +
                          </button>
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            className="text-red-600 ml-4"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold">Total: ${cartTotal}</span>
                    </div>
                    <button onClick={checkout} className="w-full btn-success">
                      <i className="fas fa-credit-card mr-2"></i>Proceed to Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
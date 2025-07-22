import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import ProductCard from '../../components/ProductCard'
import SearchBar from '../../components/SearchBar'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Product, CartItem, SearchFilters } from '../../types'
import { mockProducts, mockCategories } from '../../data/mockData'

export default function Products() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [loading, setLoading] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, [cartItems])

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

  const addToWishlist = (product: Product) => {
    // TODO: Implement wishlist functionality
    alert(`${product.name} added to wishlist!`)
  }

  const handleSearch = (query: string, filters: SearchFilters) => {
    setLoading(true)
    
    // Simulate API call delay
    setTimeout(() => {
      let filtered = products

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
      setCurrentPage(1)
      setLoading(false)
    }, 500)
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  const goToCart = () => {
    router.push('/cart')
  }

  return (
    <Layout>
      <Head>
        <title>Products - LibMarketplace</title>
        <meta name="description" content="Browse authentic Liberian products on LibMarketplace" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🇱🇷 LibMarketplace Products</h1>
          <p className="text-xl text-gray-600 mb-8">Discover authentic Liberian products from local artisans and businesses</p>
          
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Search for products..."
          />
        </div>

        {/* Category Quick Links */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleSearch('', {})}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              All Products
            </button>
            {mockCategories.map(category => (
              <button
                key={category.id}
                onClick={() => handleSearch('', { category: category.id })}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Cart Button */}
        <div className="flex justify-end mb-6">
          <button 
            onClick={goToCart}
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Searching products...</p>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
              </p>
            </div>

            {currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                    onAddToWishlist={addToWishlist}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={() => handleSearch('', {})}
                  className="btn-primary"
                >
                  Show All Products
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded ${
                        currentPage === i + 1
                          ? 'bg-liberian-blue text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  )
}
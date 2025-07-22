import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import ProductCard from '../../components/ProductCard'
import SearchBar from '../../components/SearchBar'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Product, CartItem, SearchFilters, Category } from '../../types'
import { mockProducts, mockCategories } from '../../data/mockData'

export default function CategoryPage() {
  const router = useRouter()
  const { category } = router.query
  const [categoryData, setCategoryData] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  useEffect(() => {
    if (category) {
      setLoading(true)
      
      // Find category data
      const foundCategory = mockCategories.find(cat => cat.id === category)
      setCategoryData(foundCategory || null)
      
      // Filter products by category
      const categoryProducts = mockProducts.filter(product => product.category === category)
      setProducts(categoryProducts)
      setFilteredProducts(categoryProducts)
      
      setLoading(false)
    }
  }, [category])

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

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

  const addToWishlist = (product: Product) => {
    // TODO: Implement wishlist functionality
    alert(`${product.name} added to wishlist!`)
  }

  const handleSearch = (query: string, filters: SearchFilters) => {
    let filtered = products

    // Filter by search query
    if (query.trim()) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      )
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
  }

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const currentProducts = filteredProducts.slice(startIndex, endIndex)

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading category...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!categoryData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
          <Link href="/products" className="btn-primary">
            Browse All Products
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Head>
        <title>{categoryData.name} - LibMarketplace</title>
        <meta name="description" content={categoryData.description} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-liberian-blue">Home</Link>
            <span>›</span>
            <Link href="/products" className="hover:text-liberian-blue">Products</Link>
            <span>›</span>
            <span className="text-gray-900">{categoryData.name}</span>
          </div>
        </nav>

        {/* Category Header */}
        <div className="relative mb-12">
          <div className="h-64 rounded-lg overflow-hidden">
            <img
              src={categoryData.image}
              alt={categoryData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{categoryData.name}</h1>
                <p className="text-xl md:text-2xl max-w-2xl mx-auto">{categoryData.description}</p>
                <p className="mt-4 text-lg">{categoryData.productCount} products available</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar 
            onSearch={handleSearch}
            placeholder={`Search in ${categoryData.name}...`}
          />
        </div>

        {/* Other Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Other Categories</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/products" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors">
              All Products
            </Link>
            {mockCategories.filter(cat => cat.id !== category).map(cat => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
              >
                {cat.name}
              </Link>
            ))}
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

        {/* Products */}
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
              Show All Products in Category
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
      </div>
    </Layout>
  )
}
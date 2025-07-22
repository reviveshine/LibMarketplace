import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import { Product, CartItem, Review } from '../../types'
import { mockProducts } from '../../data/mockData'

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  })

  useEffect(() => {
    if (id) {
      // Simulate API call
      setTimeout(() => {
        const foundProduct = mockProducts.find(p => p.id === parseInt(id as string))
        setProduct(foundProduct || null)
        setLoading(false)
      }, 500)
    }
  }, [id])

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
  }, [])

  const addToCart = () => {
    if (!product) return

    const existing = cartItems.find(item => item.id === product.id)
    let updatedCart: CartItem[]

    if (existing) {
      updatedCart = cartItems.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    } else {
      updatedCart = [...cartItems, { ...product, quantity }]
    }

    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    
    // Show success message
    alert(`Added ${quantity} ${product.name}(s) to cart!`)
  }

  const buyNow = () => {
    addToCart()
    router.push('/cart')
  }

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement review submission
    alert('Review submitted! (Mock implementation)')
    setShowReviewForm(false)
    setNewReview({ rating: 5, comment: '' })
  }

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return [...Array(5)].map((_, i) => (
      <span 
        key={i} 
        className={`${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'} ${
          interactive ? 'cursor-pointer hover:text-yellow-400' : ''
        }`}
        onClick={() => interactive && onRate?.(i + 1)}
      >
        ⭐
      </span>
    ))
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading product details...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/products" className="btn-primary">
            Browse All Products
          </Link>
        </div>
      </Layout>
    )
  }

  const images = product.images || [product.image]

  return (
    <Layout>
      <Head>
        <title>{product.name} - LibMarketplace</title>
        <meta name="description" content={product.description} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-liberian-blue">Home</Link>
            <span>›</span>
            <Link href="/products" className="hover:text-liberian-blue">Products</Link>
            <span>›</span>
            <span className="text-gray-900">{product.name}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            {images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                      selectedImage === index ? 'border-liberian-blue' : 'border-gray-200'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-500 ml-2">
                ({product.reviews.length} reviews)
              </span>
            </div>

            <div className="text-3xl font-bold text-liberian-red mb-6">
              ${product.price.toFixed(2)}
            </div>

            <div className="prose max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Features:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="text-gray-700">{feature}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Seller Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
              <div className="flex items-center">
                <img 
                  src={product.seller.avatar || '/default-avatar.png'} 
                  alt={product.seller.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <p className="font-medium">{product.seller.name}</p>
                  <p className="text-sm text-gray-600">Verified Seller</p>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center">
                  <span className="text-green-600 font-medium">✓ In Stock</span>
                  <span className="text-gray-500 ml-2">({product.stock} available)</span>
                </div>
              ) : (
                <span className="text-red-600 font-medium">✗ Out of Stock</span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock > 0 && (
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Quantity:</label>
                  <div className="flex items-center border rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-x px-2 py-1"
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={addToCart}
                disabled={product.stock === 0}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🛒 Add to Cart
              </button>
              <button
                onClick={buyNow}
                disabled={product.stock === 0}
                className="flex-1 btn-success disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💳 Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Customer Reviews</h2>
            <button
              onClick={() => setShowReviewForm(true)}
              className="btn-primary"
            >
              Write a Review
            </button>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
              <h3 className="text-lg font-semibold mb-4">Write Your Review</h3>
              <form onSubmit={submitReview}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Rating:</label>
                  <div className="flex items-center space-x-1">
                    {renderStars(newReview.rating, true, (rating) => 
                      setNewReview({...newReview, rating})
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Comment:</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    className="input-field h-24 resize-none"
                    placeholder="Share your experience with this product..."
                    required
                  />
                </div>
                <div className="flex space-x-2">
                  <button type="submit" className="btn-primary">
                    Submit Review
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {product.reviews.length > 0 ? (
              product.reviews.map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-lg shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="font-medium">{review.userName}</div>
                      <div className="flex items-center ml-4">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { useCart, useWishlist, useAuth, Product } from '../../contexts/AppContext'
import { LoadingButton } from '../../components/Loading'
import Modal from '../../components/Modal'

// Mock product data - would be fetched from API
const mockProducts: Record<string, Product & { 
  images: string[]
  seller: string
  sellerId: string
  rating: number
  reviewCount: number
  features: string[]
  specifications: Record<string, string>
  reviews: Array<{
    id: number
    user: string
    rating: number
    comment: string
    date: string
  }>
}> = {
  '1': {
    id: 1,
    name: 'Traditional Kente Cloth',
    description: 'Handwoven authentic kente cloth from Liberian artisans. This beautiful textile represents the rich cultural heritage of Liberia with intricate patterns and vibrant colors.',
    price: 89.99,
    stock: 15,
    category: 'Textiles',
    images: [
      'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=600&h=600&fit=crop'
    ],
    image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=600&h=600&fit=crop',
    seller: 'Kente Weaving Co.',
    sellerId: 'SEL001',
    rating: 4.8,
    reviewCount: 24,
    features: [
      'Handwoven by skilled artisans',
      'Authentic Liberian design',
      'Premium quality fabric',
      'Cultural significance',
      'Perfect for special occasions'
    ],
    specifications: {
      'Material': '100% Cotton',
      'Size': '6 feet x 4 feet',
      'Origin': 'Montserrado County, Liberia',
      'Pattern': 'Traditional Kente',
      'Care': 'Hand wash, air dry'
    },
    reviews: [
      {
        id: 1,
        user: 'Sarah M.',
        rating: 5,
        comment: 'Absolutely beautiful! The craftsmanship is exceptional and the colors are vibrant.',
        date: '2 days ago'
      },
      {
        id: 2,
        user: 'James K.',
        rating: 4,
        comment: 'Great quality kente cloth. Perfect for my cultural event.',
        date: '1 week ago'
      }
    ]
  }
}

export default function ProductDetail() {
  const router = useRouter()
  const { id } = router.query
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showImageModal, setShowImageModal] = useState(false)
  const [activeTab, setActiveTab] = useState('description')
  
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { isAuthenticated } = useAuth()

  const product = id ? mockProducts[id as string] : null

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link href="/" className="btn-primary">
            Back to Marketplace
          </Link>
        </div>
      </Layout>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    // TODO: Show success notification
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fas fa-star ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <Layout>
      <Head>
        <title>{product.name} - LibMarketplace</title>
        <meta name="description" content={product.description} />
      </Head>

      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">Home</Link>
            <i className="fas fa-chevron-right text-gray-400"></i>
            <Link href={`/?category=${product.category}`} className="text-blue-600 hover:text-blue-800">
              {product.category}
            </Link>
            <i className="fas fa-chevron-right text-gray-400"></i>
            <span className="text-gray-600">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="relative mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg cursor-zoom-in"
                onClick={() => setShowImageModal(true)}
              />
              {isAuthenticated && (
                <button
                  onClick={handleWishlistToggle}
                  className={`absolute top-4 right-4 p-3 rounded-full ${
                    isInWishlist(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white text-gray-600 hover:text-red-500'
                  } shadow-lg hover:shadow-xl transition-all`}
                >
                  <i className={`fas fa-heart text-lg`}></i>
                </button>
              )}
            </div>
            
            {/* Image thumbnails */}
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-1 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-2">
                {renderStars(product.rating)}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-blue-600">${product.price}</span>
              <span className="text-sm text-gray-500 ml-2">Free shipping</span>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center text-green-600">
                  <i className="fas fa-check-circle mr-2"></i>
                  <span>{product.stock} in stock</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <i className="fas fa-times-circle mr-2"></i>
                  <span>Out of stock</span>
                </div>
              )}
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Sold by {product.seller}</h3>
                  <p className="text-sm text-gray-600">Verified Seller • {product.sellerId}</p>
                </div>
                <button className="btn-primary">
                  <i className="fas fa-comment mr-2"></i>Message
                </button>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-800"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <LoadingButton
                  onClick={handleAddToCart}
                  isLoading={false}
                  className="flex-1 btn-primary py-3"
                  disabled={product.stock === 0}
                >
                  <i className="fas fa-cart-plus mr-2"></i>
                  Add to Cart
                </LoadingButton>
                
                <button className="btn-success py-3 px-6">
                  <i className="fas fa-bolt mr-2"></i>
                  Buy Now
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <i className="fas fa-check text-green-500 mr-2"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {['description', 'specifications', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">{key}:</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">Customer Reviews</h3>
                  <button className="btn-primary">Write a Review</button>
                </div>

                {product.reviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="flex items-center mr-3">
                          {renderStars(review.rating)}
                        </div>
                        <span className="font-medium text-gray-900">{review.user}</span>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={showImageModal}
        onClose={() => setShowImageModal(false)}
        size="xl"
        className="p-0"
      >
        <img
          src={product.images[selectedImage]}
          alt={product.name}
          className="w-full h-auto max-h-[80vh] object-contain"
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-3 h-3 rounded-full ${
                  selectedImage === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
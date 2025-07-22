import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useWishlist, useCart } from '../contexts/AppContext'
import ProductCard, { ProductGrid } from '../components/ProductCard'
import { ConfirmationModal } from '../components/Modal'

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [showClearModal, setShowClearModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)

  const handleMoveToCart = (productId: number) => {
    const product = wishlist.find(p => p.id === productId)
    if (product) {
      addToCart(product)
      removeFromWishlist(productId)
    }
  }

  const handleClearWishlist = () => {
    wishlist.forEach(product => removeFromWishlist(product.id))
    setShowClearModal(false)
  }

  const handleShareWishlist = () => {
    // TODO: Implement wishlist sharing
    const shareUrl = `${window.location.origin}/wishlist/shared/${Math.random().toString(36).substr(2, 9)}`
    navigator.clipboard.writeText(shareUrl)
    setShowShareModal(false)
    // TODO: Show success notification
  }

  return (
    <Layout>
      <Head>
        <title>My Wishlist - LibMarketplace</title>
        <meta name="description" content="Your saved products on LibMarketplace" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-2">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>

          {wishlist.length > 0 && (
            <div className="flex space-x-3">
              <button
                onClick={() => setShowShareModal(true)}
                className="btn-secondary"
              >
                <i className="fas fa-share mr-2"></i>Share Wishlist
              </button>
              <button
                onClick={() => setShowClearModal(true)}
                className="btn-danger"
              >
                <i className="fas fa-trash mr-2"></i>Clear All
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">💝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save products you love by clicking the heart icon. They'll appear here for easy access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="btn-primary">
                <i className="fas fa-shopping-bag mr-2"></i>Start Shopping
              </Link>
              <Link href="/categories" className="btn-secondary">
                <i className="fas fa-th-large mr-2"></i>Browse Categories
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Wishlist Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => wishlist.forEach(product => addToCart(product))}
                  className="btn-primary flex-1"
                >
                  <i className="fas fa-cart-plus mr-2"></i>
                  Add All to Cart
                </button>
                <button className="btn-secondary flex-1">
                  <i className="fas fa-eye mr-2"></i>
                  Compare Selected
                </button>
                <button className="btn-success flex-1">
                  <i className="fas fa-envelope mr-2"></i>
                  Email Wishlist
                </button>
              </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="relative">
                    <Link href={`/products/${product.id}`}>
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform"
                      />
                    </Link>
                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  
                  <div className="p-4">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600 cursor-pointer line-clamp-2 mb-2">
                        {product.name}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-blue-600">${product.price}</span>
                      <span className="text-sm text-gray-500">
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleMoveToCart(product.id)}
                        className="flex-1 btn-primary text-sm"
                        disabled={product.stock === 0}
                      >
                        <i className="fas fa-cart-plus mr-1"></i>
                        Add to Cart
                      </button>
                      <Link
                        href={`/products/${product.id}`}
                        className="btn-secondary text-sm px-3"
                      >
                        <i className="fas fa-eye"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommended Products */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <p className="text-gray-600">
                  Recommended products based on your wishlist will appear here
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Clear Wishlist Confirmation Modal */}
      <ConfirmationModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearWishlist}
        title="Clear Wishlist"
        message="Are you sure you want to remove all items from your wishlist? This action cannot be undone."
        confirmText="Clear All"
        type="danger"
      />

      {/* Share Wishlist Modal */}
      <ConfirmationModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        onConfirm={handleShareWishlist}
        title="Share Wishlist"
        message="Generate a shareable link for your wishlist? Others will be able to view your saved items."
        confirmText="Generate Link"
        type="info"
      />
    </Layout>
  )
}
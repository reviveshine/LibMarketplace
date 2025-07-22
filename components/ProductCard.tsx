import React from 'react'
import Link from 'next/link'
import { Product, useCart, useWishlist, useAuth } from '../contexts/AppContext'

interface ProductCardProps {
  product: Product
  showActions?: boolean
  variant?: 'default' | 'compact' | 'detailed'
  className?: string
}

export default function ProductCard({ 
  product, 
  showActions = true, 
  variant = 'default',
  className = '' 
}: ProductCardProps) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = () => {
    addToCart(product)
    // TODO: Show toast notification
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleAskSeller = () => {
    // TODO: Open message modal or redirect to message page
    console.log('Ask seller about:', product.name)
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${className}`}>
        <Link href={`/products/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full h-32 object-cover cursor-pointer" />
        </Link>
        <div className="p-3">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-semibold text-sm hover:text-blue-600 cursor-pointer line-clamp-2">
              {product.name}
            </h3>
          </Link>
          <div className="flex justify-between items-center mt-2">
            <span className="text-lg font-bold text-blue-600">${product.price}</span>
            {showActions && (
              <button onClick={handleAddToCart} className="btn-primary text-sm px-2 py-1">
                <i className="fas fa-cart-plus"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'detailed') {
    return (
      <div className={`bg-white rounded-lg shadow-lg overflow-hidden product-card ${className}`}>
        <div className="relative">
          <Link href={`/products/${product.id}`}>
            <img src={product.image} alt={product.name} className="w-full h-64 object-cover cursor-pointer" />
          </Link>
          {isAuthenticated && (
            <button
              onClick={handleWishlistToggle}
              className={`absolute top-2 right-2 p-2 rounded-full ${
                isInWishlist(product.id)
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:text-red-500'
              } shadow-md hover:shadow-lg transition-all`}
            >
              <i className={`fas ${isInWishlist(product.id) ? 'fa-heart' : 'fa-heart'}`}></i>
            </button>
          )}
          {product.stock <= 5 && (
            <div className="absolute top-2 left-2">
              <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Only {product.stock} left!
              </span>
            </div>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <Link href={`/products/${product.id}`}>
              <h3 className="text-xl font-semibold hover:text-blue-600 cursor-pointer">
                {product.name}
              </h3>
            </Link>
            {product.category && (
              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                {product.category}
              </span>
            )}
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-blue-600">${product.price}</span>
            <div className="text-right">
              <div className="text-sm text-gray-500">Stock: {product.stock}</div>
              {product.seller && (
                <div className="text-xs text-gray-400">by {product.seller}</div>
              )}
            </div>
          </div>
          {showActions && (
            <div className="flex space-x-2">
              <button onClick={handleAddToCart} className="flex-1 btn-primary">
                <i className="fas fa-cart-plus mr-2"></i>Add to Cart
              </button>
              <button onClick={handleAskSeller} className="btn-success">
                <i className="fas fa-comment mr-2"></i>Ask
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden product-card ${className}`}>
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <img src={product.image} alt={product.name} className="w-full h-48 object-cover cursor-pointer" />
        </Link>
        {isAuthenticated && (
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              isInWishlist(product.id)
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-600 hover:text-red-500'
            } shadow-md hover:shadow-lg transition-all`}
          >
            <i className={`fas ${isInWishlist(product.id) ? 'fa-heart' : 'fa-heart'}`}></i>
          </button>
        )}
      </div>
      <div className="p-6">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">${product.price}</span>
          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
        </div>
        {showActions && (
          <div className="flex space-x-2">
            <button onClick={handleAddToCart} className="flex-1 btn-primary">
              <i className="fas fa-cart-plus mr-2"></i>Add to Cart
            </button>
            <button onClick={handleAskSeller} className="btn-success">
              <i className="fas fa-comment mr-2"></i>Ask
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Product Grid Component
interface ProductGridProps {
  products: Product[]
  loading?: boolean
  variant?: 'default' | 'compact' | 'detailed'
  columns?: 1 | 2 | 3 | 4 | 6
  className?: string
}

export function ProductGrid({ 
  products, 
  loading = false, 
  variant = 'default',
  columns = 3,
  className = '' 
}: ProductGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  }

  if (loading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-gray-200"></div>
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
              <div className="flex justify-between items-center mb-4">
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex space-x-2">
                <div className="flex-1 h-10 bg-gray-200 rounded"></div>
                <div className="h-10 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📦</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          variant={variant}
        />
      ))}
    </div>
  )
}
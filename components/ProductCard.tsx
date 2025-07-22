import { Product } from '../types'
import Link from 'next/link'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onAddToWishlist?: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ))
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden product-card hover:shadow-xl transition-all duration-300">
      <Link href={`/products/${product.id}`}>
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-48 object-cover cursor-pointer" 
          />
          {product.stock <= 5 && product.stock > 0 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs">
              Only {product.stock} left
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
              Out of Stock
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold mb-2 hover:text-blue-600 cursor-pointer line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            ({product.reviews.length} reviews)
          </span>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-liberian-red">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {product.stock}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <img 
            src={product.seller.avatar || '/default-avatar.png'} 
            alt={product.seller.name}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span>by {product.seller.name}</span>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => onAddToCart?.(product)}
            disabled={product.stock === 0}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🛒 Add to Cart
          </button>
          <button 
            onClick={() => onAddToWishlist?.(product)}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
            title="Add to Wishlist"
          >
            ❤️
          </button>
        </div>
      </div>
    </div>
  )
}
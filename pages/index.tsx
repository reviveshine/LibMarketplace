import Head from 'next/head'
import Layout from '../components/Layout'
import { useCart, useWishlist, Product } from '../contexts/AppContext'

// Mock data - will be replaced with database
const products: Product[] = [
  { id: 1, name: 'Traditional Kente Cloth', description: 'Handwoven authentic kente cloth from Liberian artisans', price: 89.99, stock: 15, image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=300&h=200&fit=crop' },
  { id: 2, name: 'Nimba County Coffee', description: 'Premium arabica coffee beans from Nimba mountains', price: 24.99, stock: 50, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop' },
  { id: 3, name: 'Carved Wooden Elephant', description: 'Beautiful elephant sculpture representing Liberian wildlife', price: 45.00, stock: 8, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
  { id: 4, name: 'Pure Palm Oil', description: 'Authentic red palm oil from Liberian palm trees', price: 19.99, stock: 30, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop' },
  { id: 5, name: 'Traditional Talking Drum', description: 'Authentic talking drum handcrafted by local musicians', price: 125.00, stock: 5, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop' },
  { id: 6, name: 'Liberian Flag Jewelry', description: 'Beautiful jewelry featuring Liberian flag colors', price: 35.99, stock: 20, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop' }
]

export default function Home() {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const handleWishlistToggle = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <Layout>
      <Head>
        <title>LibMarketplace - Where Liberia Buys, Sells, and Connects</title>
        <meta name="description" content="Authentic Liberian products and marketplace for local businesses" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Welcome to LibMarketplace</h2>
          <p className="text-xl md:text-2xl mb-8">Where Liberia Buys, Sells, and Connects</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100">
              🛍️ Start Shopping
            </button>
            <a href="/auth/register?type=seller" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
              🏪 Become a Seller
            </a>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center mb-8">🇱🇷 Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden product-card">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">${product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => addToCart(product)} 
                    className="flex-1 btn-primary"
                  >
                    <i className="fas fa-cart-plus mr-2"></i>Add to Cart
                  </button>
                  <button 
                    onClick={() => handleWishlistToggle(product)}
                    className={`px-3 py-2 rounded ${
                      isInWishlist(product.id) 
                        ? 'bg-red-600 text-white hover:bg-red-700' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <i className={`fas ${isInWishlist(product.id) ? 'fa-heart' : 'fa-heart-o'}`}></i>
                  </button>
                  <button className="btn-success">
                    <i className="fas fa-comment mr-2"></i>Ask
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
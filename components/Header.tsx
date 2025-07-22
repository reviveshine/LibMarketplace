import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth, useCart } from '../contexts/AppContext'
import Modal from './Modal'

export default function Header() {
  const [showCart, setShowCart] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const router = useRouter()
  const { user, logout } = useAuth()
  const { cartItems, cartCount, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart()

  const handleCheckout = () => {
    if (!user) {
      router.push('/auth/login')
      return
    }
    
    alert(`Order placed! Total: $${cartTotal.toFixed(2)}. You will be redirected to complete payment.`)
    clearCart()
    setShowCart(false)
    // TODO: Redirect to checkout page
  }

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <>
      <header className="liberian-gradient shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-3">
              <div className="text-3xl">🇱🇷</div>
              <div>
                <h1 className="text-2xl font-bold text-white">LibMarketplace</h1>
                <p className="text-sm text-gray-200">Where Liberia Buys, Sells, and Connects</p>
              </div>
            </Link>
            
            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  {/* Authenticated user navigation */}
                  <Link href="/wishlist" className="text-white hover:text-gray-200 relative">
                    <i className="fas fa-heart text-2xl"></i>
                    {/* TODO: Add wishlist count badge */}
                  </Link>
                  
                  <button 
                    onClick={() => setShowCart(true)} 
                    className="text-white hover:text-gray-200 relative"
                  >
                    <i className="fas fa-shopping-cart text-2xl"></i>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs cart-badge">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setShowMessages(true)} 
                    className="text-white hover:text-gray-200"
                  >
                    <i className="fas fa-comments text-2xl"></i>
                  </button>
                  
                  <div className="text-white text-center">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs bg-blue-800 px-2 py-1 rounded">{user.userId}</div>
                  </div>
                  
                  <div className="relative group">
                    <button className="text-white hover:text-gray-200">
                      <i className="fas fa-user-circle text-2xl"></i>
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                      <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <i className="fas fa-tachometer-alt mr-2"></i>Dashboard
                      </Link>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <i className="fas fa-user mr-2"></i>Profile
                      </Link>
                      <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <i className="fas fa-heart mr-2"></i>Wishlist
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <i className="fas fa-box mr-2"></i>Orders
                      </Link>
                      <hr className="my-1" />
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <i className="fas fa-sign-out-alt mr-2"></i>Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Guest navigation */}
                  <Link href="/auth/login" className="text-white hover:text-gray-200">
                    <i className="fas fa-sign-in-alt mr-2"></i>Login
                  </Link>
                  <Link href="/auth/register" className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-gray-100">
                    Join LibMarketplace
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Menu */}
      <nav className="bg-white shadow-md sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <Link 
              href="/"
              className={`py-4 px-2 hover:text-blue-600 ${router.pathname === '/' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              🛍️ Marketplace
            </Link>
            <Link 
              href="/about"
              className={`py-4 px-2 hover:text-blue-600 ${router.pathname === '/about' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              ℹ️ About
            </Link>
            <Link 
              href="/contact"
              className={`py-4 px-2 hover:text-blue-600 ${router.pathname === '/contact' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
            >
              📞 Contact
            </Link>
            {user?.type === 'seller' && (
              <Link 
                href="/seller/dashboard"
                className={`py-4 px-2 hover:text-blue-600 ${router.pathname.startsWith('/seller') ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                🏪 Seller Dashboard
              </Link>
            )}
            {user?.type === 'admin' && (
              <Link 
                href="/admin/dashboard"
                className={`py-4 px-2 hover:text-blue-600 ${router.pathname.startsWith('/admin') ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}`}
              >
                ⚙️ Admin Panel
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Modal */}
      <Modal 
        isOpen={showCart} 
        onClose={() => setShowCart(false)} 
        title="🛒 Shopping Cart"
        size="lg"
      >
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link href="/" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-gray-600">${item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button 
                      onClick={() => removeFromCart(item.id)} 
                      className="text-red-600 ml-4 hover:text-red-800"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold">Total: ${cartTotal.toFixed(2)}</span>
                <span className="text-sm text-gray-600">{cartCount} items</span>
              </div>
              <div className="flex space-x-3">
                <button onClick={() => clearCart()} className="btn-secondary flex-1">
                  Clear Cart
                </button>
                <button onClick={handleCheckout} className="btn-success flex-1">
                  <i className="fas fa-credit-card mr-2"></i>Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* Messages Modal */}
      <Modal 
        isOpen={showMessages} 
        onClose={() => setShowMessages(false)} 
        title="💬 Messages"
        size="lg"
      >
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages yet</h3>
          <p className="text-gray-600 mb-6">Start conversations with sellers or buyers</p>
          <button className="btn-primary">
            <i className="fas fa-envelope mr-2"></i>Compose Message
          </button>
        </div>
      </Modal>
    </>
  )
}
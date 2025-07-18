import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header() {
  const [showCart, setShowCart] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const router = useRouter()

  // Mock user state - will be replaced with actual auth
  const [user, setUser] = useState<any>(null)

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
                  <button 
                    onClick={() => setShowCart(true)} 
                    className="text-white hover:text-gray-200 relative"
                  >
                    <i className="fas fa-shopping-cart text-2xl"></i>
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs cart-badge">
                      0
                    </span>
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
                  
                  <div className="relative">
                    <Link href="/dashboard" className="text-white hover:text-gray-200">
                      <i className="fas fa-user-circle text-2xl"></i>
                    </Link>
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
    </>
  )
}
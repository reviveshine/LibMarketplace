import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import LoadingSpinner from '../../components/LoadingSpinner'
import ProductCard from '../../components/ProductCard'
import { User, Order, Product, CartItem } from '../../types'
import { mockProducts } from '../../data/mockData'

export default function BuyerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
    savedItems: 0
  })
  const router = useRouter()

  useEffect(() => {
    // Check authentication and user type
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.type !== 'buyer') {
      router.push('/dashboard')
      return
    }

    setUser(parsedUser)
    loadBuyerData()
    setLoading(false)
  }, [router])

  const loadBuyerData = () => {
    // Mock data - will be replaced with API calls
    const mockOrders: Order[] = [
      {
        id: 'ORD-1234',
        userId: 1,
        items: [{
          id: 1,
          name: 'Traditional Kente Cloth',
          description: 'Handwoven authentic kente cloth from Liberian artisans',
          price: 89.99,
          stock: 15,
          image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=300&h=200&fit=crop',
          images: [],
          category: 'textiles',
          seller: {
            id: 2,
            email: 'mary.johnson@email.com',
            name: 'Mary Johnson',
            type: 'seller',
            userId: 'SEL001',
            verified: true
          },
          rating: 4.8,
          reviews: [],
          features: [],
          createdAt: '2024-01-20T00:00:00Z',
          updatedAt: '2024-07-15T00:00:00Z',
          quantity: 1
        }],
        total: 97.59,
        status: 'shipped',
        shippingAddress: {
          street: '123 Main Street',
          city: 'Monrovia',
          county: 'Montserrado',
          country: 'Liberia'
        },
        paymentMethod: 'Credit Card',
        createdAt: '2024-07-20T10:30:00Z',
        updatedAt: '2024-07-22T14:00:00Z'
      },
      {
        id: 'ORD-1235',
        userId: 1,
        items: [{
          id: 2,
          name: 'Nimba County Coffee',
          description: 'Premium arabica coffee beans from Nimba mountains',
          price: 24.99,
          stock: 50,
          image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
          images: [],
          category: 'food',
          seller: {
            id: 2,
            email: 'mary.johnson@email.com',
            name: 'Mary Johnson',
            type: 'seller',
            userId: 'SEL001',
            verified: true
          },
          rating: 4.6,
          reviews: [],
          features: [],
          createdAt: '2024-02-01T00:00:00Z',
          updatedAt: '2024-07-10T00:00:00Z',
          quantity: 2
        }],
        total: 57.98,
        status: 'delivered',
        shippingAddress: {
          street: '123 Main Street',
          city: 'Monrovia',
          county: 'Montserrado',
          country: 'Liberia'
        },
        paymentMethod: 'Mobile Money',
        createdAt: '2024-07-15T09:15:00Z',
        updatedAt: '2024-07-19T16:45:00Z'
      }
    ]

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist')
    let wishlist: Product[] = []
    if (savedWishlist) {
      const wishlistIds = JSON.parse(savedWishlist)
      wishlist = mockProducts.filter(product => wishlistIds.includes(product.id))
    }

    // Get recommendations (products similar to purchased items)
    const purchasedCategories = mockOrders.flatMap(order => 
      order.items.map(item => item.category)
    )
    const recommendedProducts = mockProducts.filter(product => 
      purchasedCategories.includes(product.category) && 
      !mockOrders.some(order => order.items.some(item => item.id === product.id))
    ).slice(0, 4)

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }

    setOrders(mockOrders)
    setWishlistItems(wishlist)
    setRecommendations(recommendedProducts)
    setStats({
      totalOrders: mockOrders.length,
      pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
      totalSpent: mockOrders.reduce((sum, order) => sum + order.total, 0),
      savedItems: wishlist.length
    })
  }

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
    const savedWishlist = localStorage.getItem('wishlist')
    const currentWishlist = savedWishlist ? JSON.parse(savedWishlist) : []
    
    if (!currentWishlist.includes(product.id)) {
      const updatedWishlist = [...currentWishlist, product.id]
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
      setWishlistItems([...wishlistItems, product])
      setStats({...stats, savedItems: stats.savedItems + 1})
      alert(`${product.name} added to wishlist!`)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading buyer dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null
  }

  return (
    <Layout>
      <Head>
        <title>Buyer Dashboard - LibMarketplace</title>
        <meta name="description" content="Manage your LibMarketplace purchases and orders" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                alt={user.name}
                className="w-16 h-16 rounded-full border-4 border-liberian-blue"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
                <p className="text-gray-600">Buyer ID: {user.userId}</p>
                <div className="flex items-center mt-1">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    ✅ Verified Buyer
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex space-x-2 mb-2">
                <Link href="/products" className="btn-primary">
                  🛍️ Continue Shopping
                </Link>
                <Link href="/cart" className="btn-secondary relative">
                  🛒 Cart ({cartItems.length})
                  {cartItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </Link>
              </div>
              <div className="text-sm text-gray-600">
                Member since: {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="text-3xl text-blue-600">📦</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
              <div className="text-3xl text-yellow-600">⏳</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
              </div>
              <div className="text-3xl text-green-600">💰</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saved Items</p>
                <p className="text-3xl font-bold text-gray-900">{stats.savedItems}</p>
              </div>
              <div className="text-3xl text-purple-600">❤️</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: '🏠 Overview' },
                { id: 'orders', name: '📦 Orders' },
                { id: 'wishlist', name: '❤️ Wishlist' },
                { id: 'recommendations', name: '✨ For You' },
                { id: 'profile', name: '👤 Profile' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-liberian-blue text-liberian-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h2>
                  <div className="text-sm text-gray-600">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Recent Orders */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                      <Link href="/orders" className="text-liberian-blue hover:text-blue-700 text-sm font-medium">
                        View All →
                      </Link>
                    </div>
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <img 
                            src={order.items[0]?.image} 
                            alt={order.items[0]?.name} 
                            className="w-12 h-12 object-cover rounded" 
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">{order.items[0]?.name}</p>
                            <p className="text-sm text-gray-600">Order {order.id}</p>
                            <p className="text-sm text-gray-500">${order.total.toFixed(2)}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      ))}
                      {orders.length === 0 && (
                        <div className="text-center py-8">
                          <div className="text-4xl mb-2">📦</div>
                          <p className="text-gray-600">No orders yet</p>
                          <Link href="/products" className="btn-primary mt-3">
                            Start Shopping
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Link href="/products" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center">
                        <div className="text-2xl mb-2">🛍️</div>
                        <div className="text-sm font-medium text-blue-800">Browse Products</div>
                      </Link>
                      <Link href="/wishlist" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center">
                        <div className="text-2xl mb-2">❤️</div>
                        <div className="text-sm font-medium text-green-800">My Wishlist</div>
                      </Link>
                      <Link href="/messages" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center">
                        <div className="text-2xl mb-2">💬</div>
                        <div className="text-sm font-medium text-purple-800">Messages</div>
                      </Link>
                      <Link href="/profile" className="p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors text-center">
                        <div className="text-2xl mb-2">👤</div>
                        <div className="text-sm font-medium text-yellow-800">My Profile</div>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Account verified successfully</span>
                        <span className="text-xs text-gray-500">2 days ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Profile updated</span>
                        <span className="text-xs text-gray-500">1 week ago</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Joined LibMarketplace</span>
                        <span className="text-xs text-gray-500">1 month ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Orders</h2>
                  <div className="flex space-x-2">
                    <Link href="/orders" className="btn-primary">
                      View All Orders
                    </Link>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={order.items[0]?.image} 
                            alt={order.items[0]?.name} 
                            className="w-16 h-16 object-cover rounded" 
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{order.items[0]?.name}</h3>
                            <p className="text-sm text-gray-600">Order {order.id}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <p className="text-lg font-semibold text-gray-900 mt-1">
                            ${order.total.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link href={`/orders`} className="btn-primary text-sm">
                          View Details
                        </Link>
                        {order.status === 'delivered' && (
                          <button className="btn-secondary text-sm">
                            Leave Review
                          </button>
                        )}
                        <Link href="/messages" className="btn-success text-sm">
                          Message Seller
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Wishlist</h2>
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-600">{wishlistItems.length} items saved</p>
                    <Link href="/wishlist" className="btn-primary">
                      View All
                    </Link>
                  </div>
                </div>
                
                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">❤️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-6">Save products you love for later</p>
                    <Link href="/products" className="btn-primary">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlistItems.slice(0, 6).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                        onAddToWishlist={() => {}}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Recommendations Tab */}
            {activeTab === 'recommendations' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Recommended for You</h2>
                  <p className="text-gray-600">Based on your purchase history and preferences</p>
                </div>
                
                {recommendations.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✨</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No recommendations yet</h3>
                    <p className="text-gray-600 mb-6">Make some purchases to get personalized recommendations</p>
                    <Link href="/products" className="btn-primary">
                      Browse Products
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {recommendations.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={addToCart}
                        onAddToWishlist={addToWishlist}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input type="text" value={user.name} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input type="email" value={user.email} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input type="tel" placeholder="+231 XX XXX XXXX" className="input-field" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Preferences</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Email notifications for new offers</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">SMS notifications for order updates</span>
                        </label>
                      </div>
                      <div>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Marketing emails about new products</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button className="btn-primary mr-4">
                    <i className="fas fa-save mr-2"></i>Save Changes
                  </button>
                  <button className="btn-secondary">
                    <i className="fas fa-key mr-2"></i>Change Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
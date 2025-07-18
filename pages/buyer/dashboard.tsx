import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

interface Order {
  id: number
  productName: string
  sellerName: string
  sellerId: string
  price: number
  quantity: number
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  orderDate: string
  image: string
}

interface WishlistItem {
  id: number
  name: string
  price: number
  sellerName: string
  image: string
}

export default function BuyerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
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
        id: 1, 
        productName: 'Traditional Kente Cloth', 
        sellerName: 'reviveshine', 
        sellerId: 'RSH001', 
        price: 89.99, 
        quantity: 1, 
        status: 'shipped', 
        orderDate: '2 days ago',
        image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=300&h=200&fit=crop'
      },
      { 
        id: 2, 
        productName: 'Nimba County Coffee', 
        sellerName: 'NimbaCoffee', 
        sellerId: 'NCF001', 
        price: 24.99, 
        quantity: 2, 
        status: 'delivered', 
        orderDate: '1 week ago',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop'
      },
      { 
        id: 3, 
        productName: 'Wooden Elephant Sculpture', 
        sellerName: 'LiberianCrafts', 
        sellerId: 'LCR001', 
        price: 45.00, 
        quantity: 1, 
        status: 'pending', 
        orderDate: '3 hours ago',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop'
      }
    ]

    const mockWishlist: WishlistItem[] = [
      { id: 1, name: 'Traditional Talking Drum', price: 125.00, sellerName: 'DrumMaker', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop' },
      { id: 2, name: 'Liberian Flag Jewelry', price: 35.99, sellerName: 'JewelryLR', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop' },
      { id: 3, name: 'Pure Palm Oil', price: 19.99, sellerName: 'PalmOilLR', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop' }
    ]

    setOrders(mockOrders)
    setWishlist(mockWishlist)
    setStats({
      totalOrders: mockOrders.length,
      pendingOrders: mockOrders.filter(o => o.status === 'pending').length,
      totalSpent: mockOrders.reduce((sum, order) => sum + (order.price * order.quantity), 0),
      savedItems: mockWishlist.length
    })
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
            <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
            <p className="text-gray-600">Loading buyer dashboard...</p>
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
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">Buyer ID: {user.userId}</p>
                <div className="flex items-center mt-1">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    ✅ Verified Buyer
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <a href="/" className="btn-primary mb-2">
                <i className="fas fa-shopping-cart mr-2"></i>Continue Shopping
              </a>
              <div className="text-sm text-gray-600">
                Member since: January 2025
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
              {['overview', 'orders', 'wishlist', 'messages', 'profile'].map((tab) => (
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

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <img src={order.image} alt={order.productName} className="w-12 h-12 object-cover rounded" />
                          <div className="flex-1">
                            <p className="font-medium">{order.productName}</p>
                            <p className="text-sm text-gray-600">${order.price} × {order.quantity}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <a href="/" className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 block">
                        <div className="flex items-center">
                          <i className="fas fa-shopping-cart text-blue-600 mr-3"></i>
                          <span>Browse Products</span>
                        </div>
                      </a>
                      <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100">
                        <div className="flex items-center">
                          <i className="fas fa-heart text-green-600 mr-3"></i>
                          <span>View Wishlist</span>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100">
                        <div className="flex items-center">
                          <i className="fas fa-user text-purple-600 mr-3"></i>
                          <span>Update Profile</span>
                        </div>
                      </button>
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
                    <select className="px-3 py-2 border rounded-md text-sm">
                      <option>All Orders</option>
                      <option>Pending</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <img src={order.image} alt={order.productName} className="w-16 h-16 object-cover rounded" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{order.productName}</h3>
                            <p className="text-sm text-gray-600">Seller: {order.sellerName} ({order.sellerId})</p>
                            <p className="text-sm text-gray-600">Order #{order.id.toString().padStart(6, '0')}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Price</p>
                          <p className="font-semibold">${order.price}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Quantity</p>
                          <p className="font-semibold">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="font-semibold">${(order.price * order.quantity).toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Order Date</p>
                          <p className="font-semibold">{order.orderDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button className="btn-primary">
                          <i className="fas fa-eye mr-2"></i>View Details
                        </button>
                        {order.status === 'delivered' && (
                          <button className="btn-secondary">
                            <i className="fas fa-star mr-2"></i>Rate & Review
                          </button>
                        )}
                        <button className="btn-success">
                          <i className="fas fa-comment mr-2"></i>Message Seller
                        </button>
                        {order.status === 'pending' && (
                          <button className="btn-danger">
                            <i className="fas fa-times mr-2"></i>Cancel Order
                          </button>
                        )}
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
                  <p className="text-sm text-gray-600">{wishlist.length} items saved</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">by {item.sellerName}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xl font-bold text-blue-600">${item.price}</span>
                          <button className="text-red-600 hover:text-red-800">
                            <i className="fas fa-heart-broken"></i>
                          </button>
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 btn-primary text-sm">
                            <i className="fas fa-cart-plus mr-2"></i>Add to Cart
                          </button>
                          <button className="btn-secondary text-sm">
                            <i className="fas fa-eye mr-2"></i>View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Messages</h3>
                <p className="text-gray-600 mb-6">Chat with sellers about products and orders</p>
                <button className="btn-primary">
                  <i className="fas fa-envelope mr-2"></i>View All Messages
                </button>
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
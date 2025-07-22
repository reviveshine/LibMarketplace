import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
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

interface Transaction {
  id: string
  type: 'credit' | 'debit' | 'transfer'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  recipient?: string
}

interface WalletData {
  balance: number
  currency: string
  transactions: Transaction[]
}

interface ProductRecommendation {
  id: number
  name: string
  price: number
  image: string
  category: string
  rating: number
  sellerName: string
}

export default function BuyerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [orders, setOrders] = useState<Order[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [wallet, setWallet] = useState<WalletData>({
    balance: 0,
    currency: 'USD',
    transactions: []
  })
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([])
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalSpent: 0,
    savedItems: 0
  })
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [showTransfer, setShowTransfer] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
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

    // Mock wallet data
    const mockWallet: WalletData = {
      balance: 2500.75,
      currency: 'USD',
      transactions: [
        { id: 'TXN001', type: 'credit', amount: 100.00, description: 'Added funds via card', date: '2025-01-13', status: 'completed' },
        { id: 'TXN002', type: 'debit', amount: 89.99, description: 'Purchase: Traditional Kente Cloth', date: '2025-01-12', status: 'completed' },
        { id: 'TXN003', type: 'credit', amount: 500.00, description: 'Bank transfer', date: '2025-01-10', status: 'completed' },
        { id: 'TXN004', type: 'debit', amount: 24.99, description: 'Purchase: Nimba County Coffee', date: '2025-01-08', status: 'completed' },
        { id: 'TXN005', type: 'transfer', amount: 50.00, description: 'Transfer to user@example.com', date: '2025-01-07', status: 'completed', recipient: 'user@example.com' }
      ]
    }

    // Mock product recommendations
    const mockRecommendations: ProductRecommendation[] = [
      { id: 1, name: 'Liberian Batik Fabric', price: 45.99, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop', category: 'Textiles', rating: 4.8, sellerName: 'BatikMaster' },
      { id: 2, name: 'Hand-carved Wooden Mask', price: 85.00, image: 'https://images.unsplash.com/photo-1544970747-6b3b6d4d1b7f?w=300&h=200&fit=crop', category: 'Art', rating: 4.9, sellerName: 'WoodCarver' },
      { id: 3, name: 'Traditional Gele Headwrap', price: 29.99, image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=300&h=200&fit=crop', category: 'Fashion', rating: 4.7, sellerName: 'GeleQueen' },
      { id: 4, name: 'Liberian Pepper Sauce', price: 12.99, image: 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=300&h=200&fit=crop', category: 'Food', rating: 4.6, sellerName: 'SpiceKing' }
    ]

    setOrders(mockOrders)
    setWishlist(mockWishlist)
    setWallet(mockWallet)
    setRecommendations(mockRecommendations)
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

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'credit': return 'text-green-600'
      case 'debit': return 'text-red-600'
      case 'transfer': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  const formatTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit': return '📈'
      case 'debit': return '📉'
      case 'transfer': return '💸'
      default: return '💳'
    }
  }

  const handleAddFunds = (amount: number) => {
    // Mock add funds functionality
    const newTransaction: Transaction = {
      id: `TXN${Date.now()}`,
      type: 'credit',
      amount: amount,
      description: 'Added funds via card',
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    }
    
    setWallet(prev => ({
      ...prev,
      balance: prev.balance + amount,
      transactions: [newTransaction, ...prev.transactions]
    }))
    setShowAddFunds(false)
  }

  const handleTransfer = (amount: number, recipient: string) => {
    // Mock transfer functionality
    const newTransaction: Transaction = {
      id: `TXN${Date.now()}`,
      type: 'transfer',
      amount: amount,
      description: `Transfer to ${recipient}`,
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      recipient: recipient
    }
    
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - amount,
      transactions: [newTransaction, ...prev.transactions]
    }))
    setShowTransfer(false)
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
              <div className="relative group">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg">
                  {user.name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors shadow-lg">
                  <i className="fas fa-camera text-xs"></i>
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">Buyer ID: {user.userId}</p>
                <div className="flex items-center mt-1 space-x-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    ✅ Verified Buyer
                  </span>
                  <button
                    onClick={() => setIsDarkMode(!isDarkMode)}
                    className="bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded-full text-xs font-medium transition-colors"
                  >
                    {isDarkMode ? '☀️ Light' : '🌙 Dark'}
                  </button>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 rounded-lg shadow-lg">
                <div className="text-sm opacity-90">Wallet Balance</div>
                <div className="text-2xl font-bold">${wallet.balance.toFixed(2)}</div>
                <div className="text-xs opacity-80">{wallet.currency}</div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAddFunds(true)}
                  className="btn-primary text-sm"
                >
                  <i className="fas fa-plus mr-1"></i>Add Funds
                </button>
                <Link href="/" className="btn-secondary text-sm">
                  <i className="fas fa-shopping-cart mr-1"></i>Shop
                </Link>
              </div>
              <div className="text-sm text-gray-600">
                Member since: January 2025
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
              <div className="text-3xl text-blue-600">📦</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
              <div className="text-3xl text-yellow-600">⏳</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
              </div>
              <div className="text-3xl text-green-600">💰</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Saved Items</p>
                <p className="text-3xl font-bold text-gray-900">{stats.savedItems}</p>
              </div>
              <div className="text-3xl text-purple-600">❤️</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-lg shadow-lg p-6 text-white hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-90">Wallet Balance</p>
                <p className="text-3xl font-bold">${wallet.balance.toFixed(2)}</p>
              </div>
              <div className="text-3xl opacity-90">💳</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {['overview', 'orders', 'wallet', 'wishlist', 'messages', 'profile', 'security'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab === 'wallet' && <i className="fas fa-wallet mr-2"></i>}
                  {tab === 'security' && <i className="fas fa-shield-alt mr-2"></i>}
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Dashboard Overview</h2>
                  <button className="btn-primary">
                    <i className="fas fa-bell mr-2"></i>View Notifications
                  </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
                      <Link href="/" className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 block transition-colors">
                        <div className="flex items-center">
                          <i className="fas fa-shopping-cart text-blue-600 mr-3"></i>
                          <span>Browse Products</span>
                        </div>
                      </Link>
                      <button 
                        onClick={() => setActiveTab('wishlist')}
                        className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <i className="fas fa-heart text-green-600 mr-3"></i>
                          <span>View Wishlist ({wishlist.length} items)</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => setActiveTab('wallet')}
                        className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <i className="fas fa-wallet text-purple-600 mr-3"></i>
                          <span>Manage Wallet (${wallet.balance.toFixed(2)})</span>
                        </div>
                      </button>
                      <button 
                        onClick={() => setActiveTab('profile')}
                        className="w-full text-left p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                      >
                        <div className="flex items-center">
                          <i className="fas fa-user text-orange-600 mr-3"></i>
                          <span>Update Profile</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Recommendations */}
                <div className="mt-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Recommended for You</h3>
                    <span className="text-sm text-gray-600">Based on your interests</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recommendations.map((product) => (
                      <div key={product.id} className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
                        <div className="p-3">
                          <h4 className="font-medium text-sm text-gray-900 mb-1">{product.name}</h4>
                          <p className="text-xs text-gray-600 mb-2">by {product.sellerName}</p>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-bold text-blue-600">${product.price}</span>
                            <div className="flex items-center text-xs text-yellow-600">
                              <i className="fas fa-star mr-1"></i>
                              {product.rating}
                            </div>
                          </div>
                          <button className="w-full btn-primary text-xs py-1">
                            <i className="fas fa-cart-plus mr-1"></i>Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Wallet Tab */}
            {activeTab === 'wallet' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">My Wallet</h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setShowAddFunds(true)}
                      className="btn-primary"
                    >
                      <i className="fas fa-plus mr-2"></i>Add Funds
                    </button>
                    <button 
                      onClick={() => setShowTransfer(true)}
                      className="btn-secondary"
                    >
                      <i className="fas fa-paper-plane mr-2"></i>Transfer
                    </button>
                  </div>
                </div>

                {/* Wallet Overview */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-500 to-blue-500 text-white p-6 rounded-lg">
                    <h3 className="text-lg font-medium opacity-90 mb-2">Current Balance</h3>
                    <p className="text-3xl font-bold">${wallet.balance.toFixed(2)}</p>
                    <p className="text-sm opacity-80">{wallet.currency}</p>
                  </div>
                  <div className="bg-white border-2 border-green-200 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Available for Spending</h3>
                    <p className="text-2xl font-bold text-green-600">${wallet.balance.toFixed(2)}</p>
                    <p className="text-sm text-gray-600">No holds or pending</p>
                  </div>
                  <div className="bg-white border-2 border-blue-200 p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">This Month</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      ${wallet.transactions
                        .filter(t => t.type === 'debit' && new Date(t.date).getMonth() === new Date().getMonth())
                        .reduce((sum, t) => sum + t.amount, 0)
                        .toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Total spent</p>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
                    <select className="px-3 py-1 border rounded text-sm">
                      <option>All Transactions</option>
                      <option>Credits</option>
                      <option>Debits</option>
                      <option>Transfers</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    {wallet.transactions.slice(0, 8).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="text-2xl">
                            {formatTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            <p className="text-sm text-gray-600">
                              {transaction.date} • {transaction.status}
                              {transaction.recipient && ` • To: ${transaction.recipient}`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${getTransactionColor(transaction.type)}`}>
                            {transaction.type === 'debit' || transaction.type === 'transfer' ? '-' : '+'}
                            ${transaction.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">{transaction.id}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800">
                      View all transactions →
                    </button>
                  </div>
                </div>
              </div>
            )}
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

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Password</h4>
                          <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                        </div>
                        <button className="btn-secondary text-sm">Change</button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Two-Factor Authentication</h4>
                          <p className="text-sm text-gray-600">Add extra security to your account</p>
                        </div>
                        <button className="btn-primary text-sm">Enable</button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Email Verification</h4>
                          <p className="text-sm text-green-600">✅ Verified</p>
                        </div>
                        <span className="text-green-600">✓</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">Phone Verification</h4>
                          <p className="text-sm text-gray-600">Add your phone number</p>
                        </div>
                        <button className="btn-secondary text-sm">Add</button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Login Activity</h3>
                    <div className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Current Session</p>
                            <p className="text-sm text-gray-600">Chrome on Windows</p>
                            <p className="text-xs text-gray-500">IP: 192.168.1.1</p>
                          </div>
                          <span className="text-green-600 text-sm">Active</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Mobile App</p>
                            <p className="text-sm text-gray-600">iPhone • 2 hours ago</p>
                            <p className="text-xs text-gray-500">IP: 192.168.1.2</p>
                          </div>
                          <button className="text-red-600 text-sm">Revoke</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Privacy Settings</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Show profile to other users</span>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Allow sellers to message me</span>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm">Share purchase history for recommendations</span>
                          <input type="checkbox" className="toggle" defaultChecked />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex space-x-4">
                    <button className="btn-primary">
                      <i className="fas fa-save mr-2"></i>Save Security Settings
                    </button>
                    <button className="btn-danger">
                      <i className="fas fa-sign-out-alt mr-2"></i>Sign Out All Devices
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Funds Modal */}
        {showAddFunds && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add Funds to Wallet</h3>
                <button 
                  onClick={() => setShowAddFunds(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input 
                    type="number" 
                    placeholder="Enter amount" 
                    className="input-field"
                    id="addFundsAmount"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                  <select className="input-field">
                    <option>Credit/Debit Card</option>
                    <option>Bank Transfer</option>
                    <option>Mobile Money</option>
                    <option>PayPal</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => {
                      const amount = parseFloat((document.getElementById('addFundsAmount') as HTMLInputElement)?.value || '0')
                      if (amount > 0) handleAddFunds(amount)
                    }}
                    className="flex-1 btn-primary"
                  >
                    Add Funds
                  </button>
                  <button 
                    onClick={() => setShowAddFunds(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transfer Modal */}
        {showTransfer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Transfer Funds</h3>
                <button 
                  onClick={() => setShowTransfer(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email</label>
                  <input 
                    type="email" 
                    placeholder="user@example.com" 
                    className="input-field"
                    id="transferRecipient"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <input 
                    type="number" 
                    placeholder="Enter amount" 
                    className="input-field"
                    id="transferAmount"
                    max={wallet.balance}
                  />
                  <p className="text-sm text-gray-600 mt-1">Available: ${wallet.balance.toFixed(2)}</p>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    onClick={() => {
                      const amount = parseFloat((document.getElementById('transferAmount') as HTMLInputElement)?.value || '0')
                      const recipient = (document.getElementById('transferRecipient') as HTMLInputElement)?.value || ''
                      if (amount > 0 && amount <= wallet.balance && recipient) {
                        handleTransfer(amount, recipient)
                      }
                    }}
                    className="flex-1 btn-primary"
                  >
                    Transfer
                  </button>
                  <button 
                    onClick={() => setShowTransfer(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
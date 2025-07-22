import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  category: string
  status: 'active' | 'inactive' | 'pending'
  image: string
}

interface Offer {
  id: number
  productId: number
  productName: string
  buyerName: string
  buyerId: string
  originalPrice: number
  offerPrice: number
  message: string
  status: 'pending' | 'accepted' | 'declined' | 'countered'
  createdAt: string
}

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    pendingOffers: 0,
    revenue: 0
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
    if (parsedUser.type !== 'seller') {
      router.push('/dashboard')
      return
    }

    setUser(parsedUser)
    loadSellerData()
    setLoading(false)
  }, [router])

  const loadSellerData = () => {
    // Mock data - will be replaced with API calls
    const mockProducts: Product[] = [
      { id: 1, name: 'Traditional Kente Cloth', description: 'Handwoven authentic kente cloth', price: 89.99, stock: 15, category: 'Textiles', status: 'active', image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=300&h=200&fit=crop' },
      { id: 2, name: 'Nimba County Coffee', description: 'Premium arabica coffee beans', price: 24.99, stock: 50, category: 'Food', status: 'active', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop' },
      { id: 3, name: 'Wooden Elephant Sculpture', description: 'Beautiful carved elephant', price: 45.00, stock: 3, category: 'Crafts', status: 'pending', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' }
    ]

    const mockOffers: Offer[] = [
      { id: 1, productId: 1, productName: 'Traditional Kente Cloth', buyerName: 'John Doe', buyerId: 'BUY001', originalPrice: 89.99, offerPrice: 75.00, message: 'Interested in bulk purchase', status: 'pending', createdAt: '2 hours ago' },
      { id: 2, productId: 2, productName: 'Nimba County Coffee', buyerName: 'Jane Smith', buyerId: 'BUY002', originalPrice: 24.99, offerPrice: 22.00, message: 'Regular customer discount?', status: 'pending', createdAt: '1 day ago' }
    ]

    setProducts(mockProducts)
    setOffers(mockOffers)
    setStats({
      totalProducts: mockProducts.length,
      totalSales: 45,
      pendingOffers: mockOffers.filter(o => o.status === 'pending').length,
      revenue: 2450.00
    })
  }

  const handleOfferResponse = (offerId: number, action: 'accept' | 'decline' | 'counter') => {
    // TODO: Implement offer response logic
    console.log(`${action} offer ${offerId}`)
    setOffers(offers.map(offer => 
      offer.id === offerId 
        ? { ...offer, status: action === 'counter' ? 'countered' : action === 'accept' ? 'accepted' : 'declined' }
        : offer
    ))
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
            <p className="text-gray-600">Loading seller dashboard...</p>
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
        <title>Seller Dashboard - LibMarketplace</title>
        <meta name="description" content="Manage your LibMarketplace store" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">Seller ID: {user.userId}</p>
                <div className="flex items-center mt-1">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    ✅ Verified Seller
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <button className="btn-primary mb-2">
                <i className="fas fa-plus mr-2"></i>Add Product
              </button>
              <div className="text-sm text-gray-600">
                Last login: 2 hours ago
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
              <div className="text-3xl text-blue-600">📦</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSales}</p>
              </div>
              <div className="text-3xl text-green-600">📈</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Offers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingOffers}</p>
              </div>
              <div className="text-3xl text-yellow-600">💬</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.revenue}</p>
              </div>
              <div className="text-3xl text-purple-600">💰</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'products', 'offers', 'messages', 'analytics'].map((tab) => (
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
                      {[1, 2, 3].map((order) => (
                        <div key={order} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Order #ORD00{order}</p>
                            <p className="text-sm text-gray-600">Kente Cloth - $89.99</p>
                          </div>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            Completed
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100">
                        <div className="flex items-center">
                          <i className="fas fa-plus text-blue-600 mr-3"></i>
                          <span>Add New Product</span>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100">
                        <div className="flex items-center">
                          <i className="fas fa-chart-line text-green-600 mr-3"></i>
                          <span>View Analytics</span>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100">
                        <div className="flex items-center">
                          <i className="fas fa-cog text-purple-600 mr-3"></i>
                          <span>Store Settings</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">My Products</h2>
                  <button className="btn-primary">
                    <i className="fas fa-plus mr-2"></i>Add Product
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product.id} className="bg-gray-50 rounded-lg overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.status === 'active' ? 'bg-green-100 text-green-800' :
                            product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {product.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-xl font-bold text-blue-600">${product.price}</span>
                          <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="flex-1 btn-primary text-sm">Edit</button>
                          <button className="flex-1 btn-secondary text-sm">View</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offers Tab */}
            {activeTab === 'offers' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Pending Offers</h2>
                
                <div className="space-y-4">
                  {offers.map((offer) => (
                    <div key={offer.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{offer.productName}</h3>
                          <p className="text-sm text-gray-600">From: {offer.buyerName} ({offer.buyerId})</p>
                        </div>
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          {offer.status}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Original Price</p>
                          <p className="font-semibold">${offer.originalPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Offered Price</p>
                          <p className="font-semibold text-blue-600">${offer.offerPrice}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Difference</p>
                          <p className="font-semibold text-red-600">-${(offer.originalPrice - offer.offerPrice).toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Message:</p>
                        <p className="text-gray-900">{offer.message}</p>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleOfferResponse(offer.id, 'accept')}
                          className="btn-success"
                        >
                          <i className="fas fa-check mr-2"></i>Accept
                        </button>
                        <button 
                          onClick={() => handleOfferResponse(offer.id, 'decline')}
                          className="btn-danger"
                        >
                          <i className="fas fa-times mr-2"></i>Decline
                        </button>
                        <button 
                          onClick={() => handleOfferResponse(offer.id, 'counter')}
                          className="btn-secondary"
                        >
                          <i className="fas fa-reply mr-2"></i>Counter Offer
                        </button>
                        <button className="btn-primary">
                          <i className="fas fa-comment mr-2"></i>Message
                        </button>
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
                <p className="text-gray-600 mb-6">Secure communication with buyers</p>
                <button className="btn-primary">
                  <i className="fas fa-envelope mr-2"></i>View All Messages
                </button>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics</h3>
                <p className="text-gray-600 mb-6">Detailed insights about your store performance</p>
                <button className="btn-primary">
                  <i className="fas fa-chart-line mr-2"></i>View Analytics
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
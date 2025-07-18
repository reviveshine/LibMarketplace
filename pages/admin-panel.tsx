import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useAuth } from '../lib/auth'
import { useRouter } from 'next/router'

interface User {
  id: string;
  name: string;
  email: string;
  type: 'seller' | 'buyer' | 'admin';
  status: 'pending' | 'verified' | 'rejected';
  sellerId?: string;
  buyerId?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sellerId: string;
  sellerName: string;
  status: 'active' | 'pending' | 'rejected';
  createdAt: string;
}

interface SystemStats {
  totalUsers: number;
  pendingVerifications: number;
  totalProducts: number;
  totalOffers: number;
  todaySignups: number;
}

export default function AdminPanel() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [users, setUsers] = useState<User[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState<SystemStats | null>(null)

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    if (user.type !== 'admin') {
      router.push('/')
      return
    }

    loadAdminData()
  }, [user, router])

  const loadAdminData = () => {
    // Demo data - in real app, fetch from API
    const demoUsers: User[] = [
      {
        id: '1',
        name: 'reviveshine',
        email: 'reviveshine@mylibmarketplace.com',
        type: 'seller',
        status: 'verified',
        sellerId: 'RSH001',
        phone: '+231-555-0001',
        address: 'Nimba County, Liberia',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        name: 'John Buyer',
        email: 'buyer@test.com',
        type: 'buyer',
        status: 'verified',
        buyerId: 'BUY001',
        phone: '+231-555-0002',
        address: 'Monrovia, Liberia',
        createdAt: '2024-01-16'
      },
      {
        id: '4',
        name: 'New Seller',
        email: 'newseller@example.com',
        type: 'seller',
        status: 'pending',
        sellerId: 'RSH002',
        phone: '+231-555-0003',
        address: 'Bong County, Liberia',
        createdAt: '2024-01-18'
      },
      {
        id: '5',
        name: 'Jane Smith',
        email: 'jane@example.com',
        type: 'buyer',
        status: 'pending',
        buyerId: 'BUY002',
        phone: '+231-555-0004',
        address: 'Grand Bassa County, Liberia',
        createdAt: '2024-01-18'
      }
    ]

    const demoProducts: Product[] = [
      {
        id: 1,
        name: 'Traditional Kente Cloth',
        description: 'Handwoven authentic kente cloth from Liberian artisans',
        price: 89.99,
        sellerId: 'RSH001',
        sellerName: 'reviveshine',
        status: 'active',
        createdAt: '2024-01-16'
      },
      {
        id: 2,
        name: 'Artisan Basket',
        description: 'Handwoven basket made from local materials',
        price: 35.00,
        sellerId: 'RSH002',
        sellerName: 'New Seller',
        status: 'pending',
        createdAt: '2024-01-18'
      }
    ]

    const demoStats: SystemStats = {
      totalUsers: 4,
      pendingVerifications: 2,
      totalProducts: 6,
      totalOffers: 3,
      todaySignups: 2
    }

    setUsers(demoUsers)
    setProducts(demoProducts)
    setStats(demoStats)
  }

  const updateUserStatus = (userId: string, newStatus: 'verified' | 'rejected') => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ))
    
    if (stats) {
      setStats({
        ...stats,
        pendingVerifications: stats.pendingVerifications - 1
      })
    }
  }

  const updateProductStatus = (productId: number, newStatus: 'active' | 'rejected') => {
    setProducts(products.map(product =>
      product.id === productId ? { ...product, status: newStatus } : product
    ))
  }

  if (!user || user.type !== 'admin') {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Admin Panel - LibMarketplace</title>
      </Head>

      {/* Header */}
      <header className="liberian-gradient shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🇱🇷</div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-gray-200">LibMarketplace Administration</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white text-center">
                <div className="text-3xl mb-1">👨‍💼</div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs bg-red-600 px-2 py-1 rounded">ADMIN</div>
              </div>
              <button 
                onClick={() => router.push('/')}
                className="text-white hover:text-gray-200 px-3 py-2 rounded border border-white"
              >
                🏠 Home
              </button>
              <button 
                onClick={logout}
                className="text-white hover:text-gray-200 px-3 py-2 rounded border border-white"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {['dashboard', 'users', 'products', 'analytics', 'settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'dashboard' && '📊'} 
                {tab === 'users' && '👥'} 
                {tab === 'products' && '📦'} 
                {tab === 'analytics' && '📈'} 
                {tab === 'settings' && '⚙️'} 
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div>
            <h2 className="text-2xl font-bold mb-6">📊 System Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">👥</div>
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">⏳</div>
                  <div>
                    <p className="text-sm text-gray-600">Pending Verifications</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.pendingVerifications}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">📦</div>
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">💰</div>
                  <div>
                    <p className="text-sm text-gray-600">Total Offers</p>
                    <p className="text-2xl font-bold">{stats.totalOffers}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="text-3xl mr-4">📅</div>
                  <div>
                    <p className="text-sm text-gray-600">Today's Signups</p>
                    <p className="text-2xl font-bold text-green-600">{stats.todaySignups}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">⏳ Pending Verifications</h3>
                </div>
                <div className="p-6">
                  {users.filter(u => u.status === 'pending').map((user) => (
                    <div key={user.id} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.type} • {user.email}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateUserStatus(user.id, 'verified')}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => updateUserStatus(user.id, 'rejected')}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                        >
                          ❌ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">📦 Recent Products</h3>
                </div>
                <div className="p-6">
                  {products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-600">${product.price} • {product.sellerName}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        product.status === 'active' ? 'bg-green-100 text-green-800' :
                        product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {product.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">👥 User Management</h2>
              <span className="text-gray-600">{users.length} total users</span>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-xs text-gray-400">{user.sellerId || user.buyerId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.type === 'seller' ? 'bg-blue-100 text-blue-800' :
                          user.type === 'buyer' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === 'verified' ? 'bg-green-100 text-green-800' :
                          user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.createdAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateUserStatus(user.id, 'verified')}
                              className="text-green-600 hover:text-green-900"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => updateUserStatus(user.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              ❌ Reject
                            </button>
                          </div>
                        )}
                        {user.status !== 'pending' && (
                          <button className="text-blue-600 hover:text-blue-900">
                            👁️ View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">📦 Product Management</h2>
              <span className="text-gray-600">{products.length} total products</span>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description.substring(0, 60)}...</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${product.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.sellerName}</div>
                        <div className="text-sm text-gray-500">{product.sellerId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          product.status === 'active' ? 'bg-green-100 text-green-800' :
                          product.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {product.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateProductStatus(product.id, 'active')}
                              className="text-green-600 hover:text-green-900"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => updateProductStatus(product.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                            >
                              ❌ Reject
                            </button>
                          </div>
                        )}
                        {product.status !== 'pending' && (
                          <button className="text-blue-600 hover:text-blue-900">
                            👁️ View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">📈 Analytics</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">👥 User Growth</h3>
                <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
                  <p className="text-gray-500">Chart placeholder - User growth over time</p>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">📦 Product Categories</h3>
                <div className="h-48 flex items-center justify-center bg-gray-50 rounded">
                  <p className="text-gray-500">Chart placeholder - Product distribution</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">⚙️ System Settings</h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">🔧 Platform Configuration</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-approve verified sellers</h4>
                      <p className="text-sm text-gray-600">Automatically approve sellers with complete verification</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Require product moderation</h4>
                      <p className="text-sm text-gray-600">All products require admin approval before listing</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Enable real-time notifications</h4>
                      <p className="text-sm text-gray-600">Send push notifications for important events</p>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">📧 Email Templates</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
                    Welcome Email Template
                  </button>
                  <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
                    Verification Approval Template
                  </button>
                  <button className="w-full text-left p-3 border rounded hover:bg-gray-50">
                    Offer Notification Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
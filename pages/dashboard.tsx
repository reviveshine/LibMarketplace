import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setLoading(false)

    // Redirect to appropriate dashboard based on user type
    switch (parsedUser.type) {
      case 'seller':
        router.push('/seller/dashboard')
        break
      case 'buyer':
        router.push('/buyer/dashboard')
        break
      case 'admin':
        router.push('/admin/dashboard')
        break
      default:
        // Stay on general dashboard
        break
    }
  }, [router])

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <Layout>
      <Head>
        <title>Dashboard - LibMarketplace</title>
        <meta name="description" content="Your LibMarketplace dashboard" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🇱🇷</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to LibMarketplace, {user.name}!
            </h1>
            <p className="text-gray-600 mb-8">
              Your account type: <span className="font-semibold capitalize">{user.type}</span> (ID: {user.userId})
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {user.type === 'buyer' && (
                <>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="text-3xl mb-4">🛍️</div>
                    <h3 className="font-semibold mb-2">Browse Products</h3>
                    <p className="text-sm text-gray-600 mb-4">Discover authentic Liberian products</p>
                    <a href="/" className="btn-primary">
                      Shop Now
                    </a>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="text-3xl mb-4">💬</div>
                    <h3 className="font-semibold mb-2">Messages</h3>
                    <p className="text-sm text-gray-600 mb-4">Chat with sellers</p>
                    <button className="btn-primary">
                      View Messages
                    </button>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="text-3xl mb-4">📦</div>
                    <h3 className="font-semibold mb-2">Orders</h3>
                    <p className="text-sm text-gray-600 mb-4">Track your purchases</p>
                    <button className="btn-primary">
                      View Orders
                    </button>
                  </div>
                </>
              )}

              {user.type === 'seller' && (
                <>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="text-3xl mb-4">🏪</div>
                    <h3 className="font-semibold mb-2">My Store</h3>
                    <p className="text-sm text-gray-600 mb-4">Manage your products</p>
                    <a href="/seller/dashboard" className="btn-primary">
                      Open Store
                    </a>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="text-3xl mb-4">📊</div>
                    <h3 className="font-semibold mb-2">Analytics</h3>
                    <p className="text-sm text-gray-600 mb-4">View sales data</p>
                    <button className="btn-primary">
                      View Stats
                    </button>
                  </div>
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <div className="text-3xl mb-4">💰</div>
                    <h3 className="font-semibold mb-2">Earnings</h3>
                    <p className="text-sm text-gray-600 mb-4">Track your income</p>
                    <button className="btn-primary">
                      View Earnings
                    </button>
                  </div>
                </>
              )}

              {user.type === 'admin' && (
                <>
                  <div className="bg-red-50 p-6 rounded-lg">
                    <div className="text-3xl mb-4">👥</div>
                    <h3 className="font-semibold mb-2">User Management</h3>
                    <p className="text-sm text-gray-600 mb-4">Manage users and verification</p>
                    <a href="/admin/dashboard" className="btn-primary">
                      Admin Panel
                    </a>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <div className="text-3xl mb-4">🛡️</div>
                    <h3 className="font-semibold mb-2">Security</h3>
                    <p className="text-sm text-gray-600 mb-4">Monitor platform security</p>
                    <button className="btn-primary">
                      Security Center
                    </button>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <div className="text-3xl mb-4">📈</div>
                    <h3 className="font-semibold mb-2">Analytics</h3>
                    <p className="text-sm text-gray-600 mb-4">Platform statistics</p>
                    <button className="btn-primary">
                      View Analytics
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Account Status</h4>
              <div className="flex items-center justify-center space-x-4">
                <span className="flex items-center text-sm">
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>
                  Email Verified
                </span>
                <span className="flex items-center text-sm">
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>
                  Phone Verified
                </span>
                <span className="flex items-center text-sm">
                  <i className="fas fa-check-circle text-green-500 mr-2"></i>
                  Account Approved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
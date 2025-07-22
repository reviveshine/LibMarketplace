import { useEffect, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

interface User {
  id: number
  name: string
  email: string
  type: 'buyer' | 'seller'
  userId: string
  status: 'pending' | 'verified' | 'rejected'
  joinDate: string
  verificationDocuments: boolean
}

interface VerificationRequest {
  id: number
  userId: string
  userName: string
  userType: 'buyer' | 'seller'
  documents: string[]
  submittedDate: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState<User[]>([])
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedSellers: 0,
    pendingVerifications: 0,
    totalTransactions: 0
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
    if (parsedUser.type !== 'admin') {
      router.push('/dashboard')
      return
    }

    setUser(parsedUser)
    loadAdminData()
    setLoading(false)
  }, [router])

  const loadAdminData = () => {
    // Mock data - will be replaced with API calls
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com', type: 'buyer', userId: 'BUY001', status: 'verified', joinDate: '2 days ago', verificationDocuments: true },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', type: 'seller', userId: 'SEL001', status: 'pending', joinDate: '1 day ago', verificationDocuments: true },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', type: 'seller', userId: 'SEL002', status: 'verified', joinDate: '1 week ago', verificationDocuments: true },
      { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', type: 'buyer', userId: 'BUY002', status: 'pending', joinDate: '3 hours ago', verificationDocuments: false }
    ]

    const mockVerifications: VerificationRequest[] = [
      { id: 1, userId: 'SEL001', userName: 'Jane Smith', userType: 'seller', documents: ['ID Card', 'Business License'], submittedDate: '1 day ago', status: 'pending' },
      { id: 2, userId: 'BUY003', userName: 'Alex Brown', userType: 'buyer', documents: ['ID Card', 'Proof of Address'], submittedDate: '2 hours ago', status: 'pending' }
    ]

    setUsers(mockUsers)
    setVerificationRequests(mockVerifications)
    setStats({
      totalUsers: mockUsers.length,
      verifiedSellers: mockUsers.filter(u => u.type === 'seller' && u.status === 'verified').length,
      pendingVerifications: mockVerifications.filter(v => v.status === 'pending').length,
      totalTransactions: 1250
    })
  }

  const handleVerificationAction = (requestId: number, action: 'approve' | 'reject') => {
    setVerificationRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' }
          : req
      )
    )
    // TODO: Send notification to user
    console.log(`${action} verification request ${requestId}`)
  }

  const handleUserStatusChange = (userId: number, newStatus: 'verified' | 'rejected') => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus }
          : user
      )
    )
    // TODO: Send notification to user
    console.log(`Changed user ${userId} status to ${newStatus}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'verified':
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-blue-600 mb-4"></i>
            <p className="text-gray-600">Loading admin dashboard...</p>
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
        <title>Admin Dashboard - LibMarketplace</title>
        <meta name="description" content="LibMarketplace administration panel" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">LibMarketplace Administration Panel</p>
                <div className="flex items-center mt-1">
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                    🛡️ System Administrator
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <button className="btn-danger mb-2">
                <i className="fas fa-exclamation-triangle mr-2"></i>Emergency Actions
              </button>
              <div className="text-sm text-gray-600">
                Last admin activity: 15 minutes ago
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <div className="text-3xl text-blue-600">👥</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Sellers</p>
                <p className="text-3xl font-bold text-gray-900">{stats.verifiedSellers}</p>
              </div>
              <div className="text-3xl text-green-600">🏪</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingVerifications}</p>
              </div>
              <div className="text-3xl text-yellow-600">📋</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</p>
              </div>
              <div className="text-3xl text-purple-600">💳</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['overview', 'users', 'verifications', 'content', 'analytics'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-red-500 text-red-600'
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
                <h2 className="text-xl font-semibold text-gray-900">System Overview</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">New seller registration</p>
                          <p className="text-sm text-gray-600">Jane Smith (SEL001)</p>
                        </div>
                        <span className="text-xs text-gray-500">1 hour ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">KYC documents submitted</p>
                          <p className="text-sm text-gray-600">Alex Brown (BUY003)</p>
                        </div>
                        <span className="text-xs text-gray-500">2 hours ago</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">Product approved</p>
                          <p className="text-sm text-gray-600">Traditional Drum by SEL002</p>
                        </div>
                        <span className="text-xs text-gray-500">3 hours ago</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">System Health</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <i className="fas fa-check-circle text-green-600 mr-3"></i>
                          <span>Database Status</span>
                        </div>
                        <span className="text-green-600 font-medium">Healthy</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <i className="fas fa-check-circle text-green-600 mr-3"></i>
                          <span>Payment System</span>
                        </div>
                        <span className="text-green-600 font-medium">Online</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center">
                          <i className="fas fa-exclamation-triangle text-yellow-600 mr-3"></i>
                          <span>Email Service</span>
                        </div>
                        <span className="text-yellow-600 font-medium">Delayed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border rounded-md text-sm">
                      <option>All Users</option>
                      <option>Buyers</option>
                      <option>Sellers</option>
                      <option>Pending</option>
                      <option>Verified</option>
                    </select>
                    <button className="btn-primary">
                      <i className="fas fa-download mr-2"></i>Export
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
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
                              <div className="text-xs text-gray-400">{user.userId}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.type === 'seller' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {user.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.joinDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.verificationDocuments ? (
                              <i className="fas fa-check-circle text-green-600"></i>
                            ) : (
                              <i className="fas fa-times-circle text-red-600"></i>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button className="text-blue-600 hover:text-blue-900">View</button>
                            {user.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleUserStatusChange(user.id, 'verified')}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleUserStatusChange(user.id, 'rejected')}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Verifications Tab */}
            {activeTab === 'verifications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">KYC Verifications</h2>
                  <span className="text-sm text-gray-600">{verificationRequests.filter(v => v.status === 'pending').length} pending reviews</span>
                </div>
                
                <div className="space-y-4">
                  {verificationRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.userName}</h3>
                          <p className="text-sm text-gray-600">{request.userId} • {request.userType}</p>
                          <p className="text-xs text-gray-500">Submitted {request.submittedDate}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                          {request.status}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Submitted Documents:</p>
                        <div className="flex flex-wrap gap-2">
                          {request.documents.map((doc, index) => (
                            <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                              📄 {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {request.status === 'pending' && (
                        <div className="flex space-x-3">
                          <button className="btn-primary">
                            <i className="fas fa-eye mr-2"></i>Review Documents
                          </button>
                          <button 
                            onClick={() => handleVerificationAction(request.id, 'approve')}
                            className="btn-success"
                          >
                            <i className="fas fa-check mr-2"></i>Approve
                          </button>
                          <button 
                            onClick={() => handleVerificationAction(request.id, 'reject')}
                            className="btn-danger"
                          >
                            <i className="fas fa-times mr-2"></i>Reject
                          </button>
                          <button className="btn-secondary">
                            <i className="fas fa-comment mr-2"></i>Request More Info
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Content Management</h3>
                <p className="text-gray-600 mb-6">Manage products, policies, and platform content</p>
                <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <button className="btn-primary">
                    <i className="fas fa-boxes mr-2"></i>Product Moderation
                  </button>
                  <button className="btn-secondary">
                    <i className="fas fa-file-alt mr-2"></i>Policies
                  </button>
                  <button className="btn-success">
                    <i className="fas fa-bullhorn mr-2"></i>Announcements
                  </button>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Platform Analytics</h3>
                <p className="text-gray-600 mb-6">Comprehensive insights and reports</p>
                <button className="btn-primary">
                  <i className="fas fa-chart-line mr-2"></i>View Full Analytics
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { User } from '../types'

export default function Profile() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({})

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setFormData(parsedUser)
    setLoading(false)
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      const updatedUser = { ...user, ...formData }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setEditing(false)
      setSaving(false)
      alert('Profile updated successfully!')
    }, 1000)
  }

  const handleCancel = () => {
    setFormData(user || {})
    setEditing(false)
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('user')
      localStorage.removeItem('cart')
      router.push('/')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading your profile...</p>
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
        <title>My Profile - LibMarketplace</title>
        <meta name="description" content="Manage your LibMarketplace profile" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">👤 My Profile</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Avatar Section */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'}
                      alt={user.name}
                      className="w-24 h-24 rounded-full mx-auto border-4 border-liberian-blue"
                    />
                    <button className="absolute bottom-0 right-0 bg-liberian-blue text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-700">
                      📷
                    </button>
                  </div>
                  <h2 className="text-xl font-semibold mt-4">{user.name}</h2>
                  <p className="text-gray-600 capitalize">{user.type} Account</p>
                  <p className="text-sm text-gray-500">ID: {user.userId}</p>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Account Status</span>
                    <span className="text-green-600 text-sm">✓ Verified</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Member Since</span>
                    <span className="text-sm text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Email Verified</span>
                    <span className="text-green-600 text-sm">✓ Yes</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-6 space-y-2">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full btn-primary text-left"
                  >
                    🏠 Go to Dashboard
                  </button>
                  <button
                    onClick={() => router.push('/settings')}
                    className="w-full btn-secondary text-left"
                  >
                    ⚙️ Account Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full btn-danger text-left"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Personal Information</h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="btn-primary"
                    >
                      ✏️ Edit Profile
                    </button>
                  ) : (
                    <div className="space-x-2">
                      <button
                        onClick={handleCancel}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn-success"
                      >
                        {saving ? (
                          <div className="flex items-center">
                            <LoadingSpinner size="sm" color="white" />
                            <span className="ml-2">Saving...</span>
                          </div>
                        ) : (
                          '💾 Save Changes'
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <form className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={!editing}
                        className={`input-field ${!editing ? 'bg-gray-100' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!editing}
                        className={`input-field ${!editing ? 'bg-gray-100' : ''}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!editing}
                        className={`input-field ${!editing ? 'bg-gray-100' : ''}`}
                        placeholder="+231 XXX XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <input
                        type="text"
                        value={user.type}
                        disabled
                        className="input-field bg-gray-100 capitalize"
                      />
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Address Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={formData.address?.street || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            address: {...formData.address, street: e.target.value}
                          })}
                          disabled={!editing}
                          className={`input-field ${!editing ? 'bg-gray-100' : ''}`}
                          placeholder="Enter your street address"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.address?.city || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            address: {...formData.address, city: e.target.value}
                          })}
                          disabled={!editing}
                          className={`input-field ${!editing ? 'bg-gray-100' : ''}`}
                          placeholder="Enter your city"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          County
                        </label>
                        <input
                          type="text"
                          value={formData.address?.county || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            address: {...formData.address, county: e.target.value}
                          })}
                          disabled={!editing}
                          className={`input-field ${!editing ? 'bg-gray-100' : ''}`}
                          placeholder="Enter your county"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.address?.country || 'Liberia'}
                          disabled
                          className="input-field bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={formData.address?.postalCode || ''}
                          onChange={(e) => setFormData({
                            ...formData, 
                            address: {...formData.address, postalCode: e.target.value}
                          })}
                          disabled={!editing}
                          className={`input-field ${!editing ? 'bg-gray-100' : ''}`}
                          placeholder="Enter postal code (optional)"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Account Actions */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Account Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => router.push('/auth/change-password')}
                        className="btn-secondary text-left"
                      >
                        🔒 Change Password
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push('/orders')}
                        className="btn-secondary text-left"
                      >
                        📦 View Order History
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push('/wishlist')}
                        className="btn-secondary text-left"
                      >
                        ❤️ My Wishlist
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push('/messages')}
                        className="btn-secondary text-left"
                      >
                        💬 Messages
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 mb-4">⚠️ Danger Zone</h3>
              <p className="text-red-700 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    alert('Account deletion requested. Please contact support to complete this process.')
                  }
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                🗑️ Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
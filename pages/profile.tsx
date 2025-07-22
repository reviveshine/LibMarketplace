import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AppContext'
import { LoadingButton } from '../components/Loading'
import { PageLoading } from '../components/Loading'

export default function Profile() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    county: '',
    businessName: '',
    businessType: ''
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    // Mock loading user profile data
    setTimeout(() => {
      if (user) {
        setFormData({
          firstName: user.name.split(' ')[0] || '',
          lastName: user.name.split(' ')[1] || '',
          email: user.email,
          phone: '+231 XX XXX XXXX',
          address: '123 Main Street',
          city: 'Monrovia',
          county: 'Montserrado',
          businessName: user.type === 'seller' ? 'My Business' : '',
          businessType: user.type === 'seller' ? 'retail' : ''
        })
      }
      setLoading(false)
    }, 1000)
  }, [user, isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // TODO: Implement actual profile update
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('Profile updated:', formData)
      // TODO: Show success notification
    } catch (error) {
      console.error('Profile update failed:', error)
      // TODO: Show error notification
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return <PageLoading message="Loading your profile..." />
  }

  if (!user) {
    return null
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
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex items-center mt-2">
                  <span className={`badge ${
                    user.type === 'admin' ? 'badge-danger' :
                    user.type === 'seller' ? 'badge-primary' :
                    'badge-success'
                  }`}>
                    {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                  </span>
                  <span className="badge badge-success ml-2">
                    <i className="fas fa-check-circle mr-1"></i>Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {['profile', 'security', 'notifications', 'preferences'].map((tab) => (
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
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        County
                      </label>
                      <select
                        name="county"
                        value={formData.county}
                        onChange={handleChange}
                        className="input-field"
                        required
                      >
                        <option value="">Select County</option>
                        <option value="Montserrado">Montserrado</option>
                        <option value="Nimba">Nimba</option>
                        <option value="Bong">Bong</option>
                        <option value="Lofa">Lofa</option>
                        <option value="Grand Bassa">Grand Bassa</option>
                        <option value="Margibi">Margibi</option>
                        <option value="Maryland">Maryland</option>
                        <option value="Grand Cape Mount">Grand Cape Mount</option>
                        <option value="Sinoe">Sinoe</option>
                        <option value="River Cess">River Cess</option>
                        <option value="Grand Gedeh">Grand Gedeh</option>
                        <option value="Grand Kru">Grand Kru</option>
                        <option value="Gbarpolu">Gbarpolu</option>
                        <option value="Rivercess">Rivercess</option>
                        <option value="Bomi">Bomi</option>
                      </select>
                    </div>

                    {user.type === 'seller' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Name
                          </label>
                          <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            className="input-field"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Type
                          </label>
                          <select
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleChange}
                            className="input-field"
                            required
                          >
                            <option value="">Select Business Type</option>
                            <option value="retail">Retail Store</option>
                            <option value="wholesale">Wholesale</option>
                            <option value="artisan">Artisan/Crafts</option>
                            <option value="agriculture">Agriculture</option>
                            <option value="services">Services</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <LoadingButton
                      type="submit"
                      isLoading={saving}
                      className="btn-primary"
                    >
                      Save Changes
                    </LoadingButton>
                  </div>
                </form>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="input-field"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        className="input-field"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="input-field"
                      />
                      <button className="btn-primary">Update Password</button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <p className="text-gray-600 mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <button className="btn-secondary">Enable 2FA</button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                  
                  <div className="space-y-4">
                    {[
                      { key: 'email_orders', label: 'Order updates', description: 'Get notified about order status changes' },
                      { key: 'email_messages', label: 'New messages', description: 'Receive notifications for new messages' },
                      { key: 'email_promotions', label: 'Promotions', description: 'Special offers and discounts' },
                      { key: 'sms_orders', label: 'SMS order updates', description: 'Text messages for urgent order updates' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{setting.label}</h4>
                          <p className="text-sm text-gray-600">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900">Account Preferences</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select className="input-field">
                        <option>English</option>
                        <option>French</option>
                        <option>Arabic</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency
                      </label>
                      <select className="input-field">
                        <option>USD ($)</option>
                        <option>LRD (L$)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Zone
                      </label>
                      <select className="input-field">
                        <option>GMT (Greenwich Mean Time)</option>
                        <option>WAT (West Africa Time)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Theme
                      </label>
                      <select className="input-field">
                        <option>Light</option>
                        <option>Dark</option>
                        <option>Auto</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button className="btn-primary">Save Preferences</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { User } from '../types'

interface Settings {
  notifications: {
    email: boolean
    sms: boolean
    orderUpdates: boolean
    promotions: boolean
    newMessages: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private'
    showOnlineStatus: boolean
    allowMessages: boolean
  }
  preferences: {
    language: string
    currency: string
    theme: 'light' | 'dark'
    timezone: string
  }
}

export default function Settings() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('notifications')
  
  const [settings, setSettings] = useState<Settings>({
    notifications: {
      email: true,
      sms: false,
      orderUpdates: true,
      promotions: false,
      newMessages: true
    },
    privacy: {
      profileVisibility: 'public',
      showOnlineStatus: true,
      allowMessages: true
    },
    preferences: {
      language: 'English',
      currency: 'USD',
      theme: 'light',
      timezone: 'GMT'
    }
  })

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Load settings from localStorage
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }

    setLoading(false)
  }, [router])

  const handleSave = async () => {
    setSaving(true)
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('userSettings', JSON.stringify(settings))
      setSaving(false)
      alert('Settings saved successfully!')
    }, 1000)
  }

  const resetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings({
        notifications: {
          email: true,
          sms: false,
          orderUpdates: true,
          promotions: false,
          newMessages: true
        },
        privacy: {
          profileVisibility: 'public',
          showOnlineStatus: true,
          allowMessages: true
        },
        preferences: {
          language: 'English',
          currency: 'USD',
          theme: 'light',
          timezone: 'GMT'
        }
      })
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading settings...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const tabs = [
    { id: 'notifications', name: '🔔 Notifications', icon: '🔔' },
    { id: 'privacy', name: '🔒 Privacy', icon: '🔒' },
    { id: 'preferences', name: '⚙️ Preferences', icon: '⚙️' },
    { id: 'account', name: '👤 Account', icon: '👤' }
  ]

  return (
    <Layout>
      <Head>
        <title>Settings - LibMarketplace</title>
        <meta name="description" content="Manage your LibMarketplace account settings" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">⚙️ Settings</h1>
            <p className="text-gray-600">Manage your account preferences and privacy settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-liberian-blue text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.name.replace(/^.+ /, '')}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">🔔 Notification Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Communication Preferences</h3>
                        <div className="space-y-4">
                          <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div>
                              <div className="font-medium">Email Notifications</div>
                              <div className="text-sm text-gray-600">Receive notifications via email</div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.notifications.email}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {...settings.notifications, email: e.target.checked}
                              })}
                              className="w-5 h-5 text-liberian-blue"
                            />
                          </label>
                          
                          <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div>
                              <div className="font-medium">SMS Notifications</div>
                              <div className="text-sm text-gray-600">Receive notifications via SMS</div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.notifications.sms}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {...settings.notifications, sms: e.target.checked}
                              })}
                              className="w-5 h-5 text-liberian-blue"
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Activity Notifications</h3>
                        <div className="space-y-4">
                          <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div>
                              <div className="font-medium">Order Updates</div>
                              <div className="text-sm text-gray-600">Notifications about your orders</div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.notifications.orderUpdates}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {...settings.notifications, orderUpdates: e.target.checked}
                              })}
                              className="w-5 h-5 text-liberian-blue"
                            />
                          </label>
                          
                          <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div>
                              <div className="font-medium">New Messages</div>
                              <div className="text-sm text-gray-600">Notifications for new messages</div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.notifications.newMessages}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {...settings.notifications, newMessages: e.target.checked}
                              })}
                              className="w-5 h-5 text-liberian-blue"
                            />
                          </label>
                          
                          <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div>
                              <div className="font-medium">Promotions & Deals</div>
                              <div className="text-sm text-gray-600">Special offers and promotional content</div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.notifications.promotions}
                              onChange={(e) => setSettings({
                                ...settings,
                                notifications: {...settings.notifications, promotions: e.target.checked}
                              })}
                              className="w-5 h-5 text-liberian-blue"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Tab */}
                {activeTab === 'privacy' && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">🔒 Privacy Settings</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Profile Privacy</h3>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <label className="block font-medium mb-2">Profile Visibility</label>
                            <select
                              value={settings.privacy.profileVisibility}
                              onChange={(e) => setSettings({
                                ...settings,
                                privacy: {...settings.privacy, profileVisibility: e.target.value as 'public' | 'private'}
                              })}
                              className="input-field"
                            >
                              <option value="public">Public - Anyone can view your profile</option>
                              <option value="private">Private - Only you can view your profile</option>
                            </select>
                          </div>
                          
                          <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div>
                              <div className="font-medium">Show Online Status</div>
                              <div className="text-sm text-gray-600">Let others see when you're online</div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.privacy.showOnlineStatus}
                              onChange={(e) => setSettings({
                                ...settings,
                                privacy: {...settings.privacy, showOnlineStatus: e.target.checked}
                              })}
                              className="w-5 h-5 text-liberian-blue"
                            />
                          </label>
                          
                          <label className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                            <div>
                              <div className="font-medium">Allow Messages</div>
                              <div className="text-sm text-gray-600">Allow other users to send you messages</div>
                            </div>
                            <input
                              type="checkbox"
                              checked={settings.privacy.allowMessages}
                              onChange={(e) => setSettings({
                                ...settings,
                                privacy: {...settings.privacy, allowMessages: e.target.checked}
                              })}
                              className="w-5 h-5 text-liberian-blue"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">⚙️ General Preferences</h2>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-medium mb-2">Language</label>
                          <select
                            value={settings.preferences.language}
                            onChange={(e) => setSettings({
                              ...settings,
                              preferences: {...settings.preferences, language: e.target.value}
                            })}
                            className="input-field"
                          >
                            <option value="English">English</option>
                            <option value="French">French</option>
                            <option value="Portuguese">Portuguese</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block font-medium mb-2">Currency</label>
                          <select
                            value={settings.preferences.currency}
                            onChange={(e) => setSettings({
                              ...settings,
                              preferences: {...settings.preferences, currency: e.target.value}
                            })}
                            className="input-field"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="LRD">Liberian Dollar (L$)</option>
                            <option value="EUR">Euro (€)</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block font-medium mb-2">Theme</label>
                          <select
                            value={settings.preferences.theme}
                            onChange={(e) => setSettings({
                              ...settings,
                              preferences: {...settings.preferences, theme: e.target.value as 'light' | 'dark'}
                            })}
                            className="input-field"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block font-medium mb-2">Timezone</label>
                          <select
                            value={settings.preferences.timezone}
                            onChange={(e) => setSettings({
                              ...settings,
                              preferences: {...settings.preferences, timezone: e.target.value}
                            })}
                            className="input-field"
                          >
                            <option value="GMT">GMT (Greenwich Mean Time)</option>
                            <option value="WAT">WAT (West Africa Time)</option>
                            <option value="EST">EST (Eastern Standard Time)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Account Tab */}
                {activeTab === 'account' && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">👤 Account Management</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Account Information</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm text-gray-600">Account Type</span>
                              <p className="font-medium capitalize">{user.type}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">User ID</span>
                              <p className="font-medium">{user.userId}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Email</span>
                              <p className="font-medium">{user.email}</p>
                            </div>
                            <div>
                              <span className="text-sm text-gray-600">Status</span>
                              <p className="font-medium text-green-600">✓ Verified</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            onClick={() => router.push('/profile')}
                            className="btn-secondary text-left"
                          >
                            👤 Edit Profile
                          </button>
                          <button
                            onClick={() => router.push('/auth/change-password')}
                            className="btn-secondary text-left"
                          >
                            🔒 Change Password
                          </button>
                          <button
                            onClick={() => router.push('/orders')}
                            className="btn-secondary text-left"
                          >
                            📦 Order History
                          </button>
                          <button
                            onClick={() => router.push('/messages')}
                            className="btn-secondary text-left"
                          >
                            💬 Messages
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Data Management</h3>
                        <div className="space-y-3">
                          <button
                            onClick={() => alert('Data export feature coming soon!')}
                            className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
                          >
                            📄 Export My Data
                          </button>
                          <button
                            onClick={resetToDefaults}
                            className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
                          >
                            🔄 Reset Settings to Default
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <div className="mt-8 pt-6 border-t">
                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-success px-8"
                    >
                      {saving ? (
                        <div className="flex items-center">
                          <LoadingSpinner size="sm" color="white" />
                          <span className="ml-2">Saving...</span>
                        </div>
                      ) : (
                        '💾 Save Settings'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
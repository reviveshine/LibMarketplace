import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { User, Notification } from '../types'

export default function Notifications() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'order' | 'message' | 'system'>('all')

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: 1,
      userId: 1,
      type: 'order',
      title: 'Order Shipped',
      message: 'Your order #ORD-1234 has been shipped and is on its way to you.',
      read: false,
      createdAt: '2024-07-22T10:30:00Z'
    },
    {
      id: 2,
      userId: 1,
      type: 'message',
      title: 'New Message',
      message: 'Mary Johnson sent you a message about Traditional Kente Cloth.',
      read: false,
      createdAt: '2024-07-22T09:15:00Z'
    },
    {
      id: 3,
      userId: 1,
      type: 'system',
      title: 'Welcome to LibMarketplace!',
      message: 'Thank you for joining our community. Explore authentic Liberian products today.',
      read: true,
      createdAt: '2024-07-21T14:00:00Z'
    },
    {
      id: 4,
      userId: 1,
      type: 'order',
      title: 'Order Confirmed',
      message: 'Your order #ORD-1234 has been confirmed and is being prepared.',
      read: true,
      createdAt: '2024-07-21T11:45:00Z'
    },
    {
      id: 5,
      userId: 1,
      type: 'review',
      title: 'Review Request',
      message: 'Please review your recent purchase of Nimba County Coffee.',
      read: true,
      createdAt: '2024-07-20T16:20:00Z'
    },
    {
      id: 6,
      userId: 1,
      type: 'system',
      title: 'Profile Updated',
      message: 'Your profile information has been successfully updated.',
      read: true,
      createdAt: '2024-07-20T13:10:00Z'
    }
  ]

  useEffect(() => {
    // Check authentication
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/auth/login')
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setNotifications(mockNotifications)
    setLoading(false)
  }, [router])

  const markAsRead = (notificationId: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })))
  }

  const deleteNotification = (notificationId: number) => {
    setNotifications(notifications.filter(notification => notification.id !== notificationId))
  }

  const clearAll = () => {
    if (confirm('Are you sure you want to delete all notifications? This action cannot be undone.')) {
      setNotifications([])
    }
  }

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read)
      case 'order':
        return notifications.filter(n => n.type === 'order')
      case 'message':
        return notifications.filter(n => n.type === 'message')
      case 'system':
        return notifications.filter(n => n.type === 'system')
      default:
        return notifications
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return '📦'
      case 'message': return '💬'
      case 'review': return '⭐'
      case 'system': return '⚙️'
      default: return '🔔'
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order': return 'blue'
      case 'message': return 'green'
      case 'review': return 'yellow'
      case 'system': return 'gray'
      default: return 'blue'
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)
    const diffInDays = diffInHours / 24

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} days ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading notifications...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const filteredNotifications = getFilteredNotifications()
  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <Layout>
      <Head>
        <title>Notifications - LibMarketplace</title>
        <meta name="description" content="View your notifications on LibMarketplace" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              🔔 Notifications
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-gray-600">Stay updated with your latest activities</p>
          </div>

          {/* Filters and Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All', count: notifications.length },
                  { key: 'unread', label: 'Unread', count: unreadCount },
                  { key: 'order', label: 'Orders', count: notifications.filter(n => n.type === 'order').length },
                  { key: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
                  { key: 'system', label: 'System', count: notifications.filter(n => n.type === 'system').length }
                ].map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setFilter(key as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === key
                        ? 'bg-liberian-blue text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="btn-secondary text-sm"
                  >
                    ✓ Mark All Read
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="btn-danger text-sm"
                >
                  🗑️ Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                <div className="text-6xl mb-4">🔔</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications'}
                </h3>
                <p className="text-gray-600">
                  {filter === 'unread'
                    ? 'You\'re all caught up! No new notifications to read.'
                    : 'When you have notifications, they\'ll appear here.'
                  }
                </p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${
                    !notification.read
                      ? `border-l-${getNotificationColor(notification.type)}-500 bg-blue-50`
                      : 'border-l-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Icon */}
                      <div className={`text-2xl p-2 rounded-full ${
                        !notification.read ? 'bg-white shadow-sm' : 'bg-gray-100'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className={`font-semibold ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-gray-600 mb-2">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatTime(notification.createdAt)}</span>
                          <span className="capitalize">
                            {notification.type} notification
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                        title="Delete notification"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons for specific notification types */}
                  {notification.type === 'order' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push('/orders')}
                          className="btn-primary text-sm"
                        >
                          View Order
                        </button>
                        <button
                          onClick={() => router.push('/orders')}
                          className="btn-secondary text-sm"
                        >
                          Track Package
                        </button>
                      </div>
                    </div>
                  )}

                  {notification.type === 'message' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => router.push('/messages')}
                        className="btn-primary text-sm"
                      >
                        View Message
                      </button>
                    </div>
                  )}

                  {notification.type === 'review' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => router.push('/orders')}
                          className="btn-primary text-sm"
                        >
                          Write Review
                        </button>
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="btn-secondary text-sm"
                        >
                          Remind Later
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Notification Settings */}
          <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔧 Notification Settings</h3>
            <p className="text-gray-600 mb-4">
              Manage how you receive notifications and what types of updates you want to see.
            </p>
            <button
              onClick={() => router.push('/settings?tab=notifications')}
              className="btn-primary"
            >
              Manage Settings
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
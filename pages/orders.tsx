import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { User, Order } from '../types'

export default function Orders() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'>('all')

  // Mock orders data
  const mockOrders: Order[] = [
    {
      id: 'ORD-1234',
      userId: 1,
      items: [
        {
          id: 1,
          name: 'Traditional Kente Cloth',
          description: 'Handwoven authentic kente cloth from Liberian artisans',
          price: 89.99,
          stock: 15,
          image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=300&h=200&fit=crop',
          images: [],
          category: 'textiles',
          seller: {
            id: 2,
            email: 'mary.johnson@email.com',
            name: 'Mary Johnson',
            type: 'seller',
            userId: 'SEL001',
            verified: true
          },
          rating: 4.8,
          reviews: [],
          features: [],
          createdAt: '2024-01-20T00:00:00Z',
          updatedAt: '2024-07-15T00:00:00Z',
          quantity: 1
        }
      ],
      total: 97.59,
      status: 'shipped',
      shippingAddress: {
        street: '123 Main Street',
        city: 'Monrovia',
        county: 'Montserrado',
        country: 'Liberia'
      },
      paymentMethod: 'Credit Card',
      createdAt: '2024-07-20T10:30:00Z',
      updatedAt: '2024-07-22T14:00:00Z'
    },
    {
      id: 'ORD-1235',
      userId: 1,
      items: [
        {
          id: 2,
          name: 'Nimba County Coffee',
          description: 'Premium arabica coffee beans from Nimba mountains',
          price: 24.99,
          stock: 50,
          image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop',
          images: [],
          category: 'food',
          seller: {
            id: 2,
            email: 'mary.johnson@email.com',
            name: 'Mary Johnson',
            type: 'seller',
            userId: 'SEL001',
            verified: true
          },
          rating: 4.6,
          reviews: [],
          features: [],
          createdAt: '2024-02-01T00:00:00Z',
          updatedAt: '2024-07-10T00:00:00Z',
          quantity: 2
        }
      ],
      total: 57.98,
      status: 'delivered',
      shippingAddress: {
        street: '123 Main Street',
        city: 'Monrovia',
        county: 'Montserrado',
        country: 'Liberia'
      },
      paymentMethod: 'Mobile Money',
      createdAt: '2024-07-15T09:15:00Z',
      updatedAt: '2024-07-19T16:45:00Z'
    },
    {
      id: 'ORD-1236',
      userId: 1,
      items: [
        {
          id: 3,
          name: 'Carved Wooden Elephant',
          description: 'Beautiful elephant sculpture representing Liberian wildlife',
          price: 45.00,
          stock: 8,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop',
          images: [],
          category: 'crafts',
          seller: {
            id: 3,
            email: 'grace.davis@email.com',
            name: 'Grace Davis',
            type: 'seller',
            userId: 'SEL002',
            verified: true
          },
          rating: 4.9,
          reviews: [],
          features: [],
          createdAt: '2024-01-25T00:00:00Z',
          updatedAt: '2024-07-01T00:00:00Z',
          quantity: 1
        }
      ],
      total: 58.60,
      status: 'confirmed',
      shippingAddress: {
        street: '123 Main Street',
        city: 'Monrovia',
        county: 'Montserrado',
        country: 'Liberia'
      },
      paymentMethod: 'Bank Transfer',
      createdAt: '2024-07-22T08:00:00Z',
      updatedAt: '2024-07-22T10:00:00Z'
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
    setOrders(mockOrders)
    setLoading(false)
  }, [router])

  const getFilteredOrders = () => {
    if (filter === 'all') return orders
    return orders.filter(order => order.status === filter)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow'
      case 'confirmed': return 'blue'
      case 'shipped': return 'purple'
      case 'delivered': return 'green'
      case 'cancelled': return 'red'
      default: return 'gray'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳'
      case 'confirmed': return '✅'
      case 'shipped': return '🚚'
      case 'delivered': return '📦'
      case 'cancelled': return '❌'
      default: return '📋'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const reorderItems = (order: Order) => {
    // Add items to cart
    const cartItems = order.items.map(item => ({ ...item, quantity: item.quantity }))
    localStorage.setItem('cart', JSON.stringify(cartItems))
    router.push('/cart')
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const filteredOrders = getFilteredOrders()

  return (
    <Layout>
      <Head>
        <title>My Orders - LibMarketplace</title>
        <meta name="description" content="View and track your orders on LibMarketplace" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">📦 My Orders</h1>
            <p className="text-gray-600">Track and manage your order history</p>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All Orders', count: orders.length },
                { key: 'pending', label: 'Pending', count: orders.filter(o => o.status === 'pending').length },
                { key: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.status === 'confirmed').length },
                { key: 'shipped', label: 'Shipped', count: orders.filter(o => o.status === 'shipped').length },
                { key: 'delivered', label: 'Delivered', count: orders.filter(o => o.status === 'delivered').length },
                { key: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
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
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No orders yet' : `No ${filter} orders`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all'
                  ? 'Start shopping to see your orders here'
                  : `You don't have any ${filter} orders at the moment`
                }
              </p>
              <Link href="/products" className="btn-primary">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-4 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center space-x-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order {order.id}
                        </h3>
                        <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
                          <span>{getStatusIcon(order.status)}</span>
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </div>
                      <div className="mt-2 sm:mt-0 text-sm text-gray-600">
                        <p>Placed on {formatDate(order.createdAt)}</p>
                        <p>Total: <span className="font-semibold text-liberian-red">${order.total.toFixed(2)}</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <Link href={`/products/${item.id}`}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-80"
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link href={`/products/${item.id}`}>
                              <h4 className="font-medium text-gray-900 hover:text-liberian-blue cursor-pointer line-clamp-2">
                                {item.name}
                              </h4>
                            </Link>
                            <p className="text-sm text-gray-600">by {item.seller.name}</p>
                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">
                              ${item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="bg-gray-50 px-6 py-4 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Shipping Address</h5>
                        <p className="text-gray-600">
                          {order.shippingAddress.street}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.county}<br />
                          {order.shippingAddress.country}
                        </p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Payment Method</h5>
                        <p className="text-gray-600">{order.paymentMethod}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">Last Updated</h5>
                        <p className="text-gray-600">{formatDate(order.updatedAt)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 border-t bg-white">
                    <div className="flex flex-wrap gap-2">
                      {order.status === 'shipped' && (
                        <button className="btn-primary text-sm">
                          🚚 Track Package
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <>
                          <button className="btn-success text-sm">
                            ⭐ Leave Review
                          </button>
                          <button
                            onClick={() => reorderItems(order)}
                            className="btn-secondary text-sm"
                          >
                            🔄 Reorder
                          </button>
                        </>
                      )}
                      {order.status === 'pending' && (
                        <button className="btn-danger text-sm">
                          ❌ Cancel Order
                        </button>
                      )}
                      <button
                        onClick={() => router.push('/messages')}
                        className="btn-secondary text-sm"
                      >
                        💬 Contact Seller
                      </button>
                      <button className="btn-secondary text-sm">
                        📄 View Invoice
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order Summary Stats */}
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Order Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
                <div className="text-sm text-blue-800">Total Orders</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                </div>
                <div className="text-sm text-green-800">Total Spent</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </div>
                <div className="text-sm text-purple-800">Delivered</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {orders.filter(o => ['pending', 'confirmed', 'shipped'].includes(o.status)).length}
                </div>
                <div className="text-sm text-yellow-800">In Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
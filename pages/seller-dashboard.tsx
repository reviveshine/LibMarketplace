import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useAuth } from '../lib/auth'
import { useRouter } from 'next/router'

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  sellerId: string;
}

interface Offer {
  id: number;
  productId: number;
  productName: string;
  buyerName: string;
  buyerId: string;
  originalPrice: number;
  offerPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  message: string;
  createdAt: string;
}

export default function SellerDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('products')
  const [products, setProducts] = useState<Product[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    if (user.type !== 'seller') {
      router.push('/buyer-dashboard')
      return
    }
    if (user.status !== 'verified') {
      router.push('/verification-pending')
      return
    }

    // Load seller's products and offers
    loadSellerData()
  }, [user, router])

  const loadSellerData = () => {
    // Demo data - in real app, fetch from API
    const demoProducts: Product[] = [
      { id: 1, name: 'Traditional Kente Cloth', description: 'Handwoven authentic kente cloth from Liberian artisans', price: 89.99, stock: 15, image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=300&h=200&fit=crop', sellerId: user?.sellerId || '' },
      { id: 2, name: 'Nimba County Coffee', description: 'Premium arabica coffee beans from Nimba mountains', price: 24.99, stock: 50, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop', sellerId: user?.sellerId || '' },
    ]

    const demoOffers: Offer[] = [
      {
        id: 1,
        productId: 1,
        productName: 'Traditional Kente Cloth',
        buyerName: 'John Buyer',
        buyerId: 'BUY001',
        originalPrice: 89.99,
        offerPrice: 75.00,
        status: 'pending',
        message: 'Interested in bulk purchase. Can you do $75?',
        createdAt: '2 hours ago'
      }
    ]

    setProducts(demoProducts)
    setOffers(demoOffers)
  }

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault()
    const product: Product = {
      id: Date.now(),
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      image: newProduct.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
      sellerId: user?.sellerId || ''
    }
    setProducts([...products, product])
    setNewProduct({ name: '', description: '', price: '', stock: '', image: '' })
  }

  const handleOffer = (offerId: number, action: 'accept' | 'reject', counterPrice?: number) => {
    setOffers(offers.map(offer => {
      if (offer.id === offerId) {
        if (action === 'accept') {
          return { ...offer, status: 'accepted' }
        } else if (action === 'reject') {
          return { ...offer, status: 'rejected' }
        }
      }
      return offer
    }))
  }

  if (!user || user.type !== 'seller') {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Seller Dashboard - LibMarketplace</title>
      </Head>

      {/* Header */}
      <header className="liberian-gradient shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🇱🇷</div>
              <div>
                <h1 className="text-2xl font-bold text-white">Seller Dashboard</h1>
                <p className="text-sm text-gray-200">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white text-center">
                <div className="text-3xl mb-1">👤</div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs bg-blue-800 px-2 py-1 rounded">{user.sellerId}</div>
                <div className="text-xs bg-green-600 px-2 py-1 rounded mt-1">{user.status}</div>
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
            {['products', 'offers', 'profile', 'notifications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'products' && '📦'} 
                {tab === 'offers' && '💰'} 
                {tab === 'profile' && '👤'} 
                {tab === 'notifications' && '🔔'} 
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">📦 My Products</h2>
              <span className="text-gray-600">{products.length} products</span>
            </div>

            {/* Add Product Form */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">➕ Add New Product</h3>
              <form onSubmit={addProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="px-3 py-2 border rounded"
                  required
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  placeholder="Price"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  className="px-3 py-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  className="px-3 py-2 border rounded"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  className="px-3 py-2 border rounded md:col-span-2"
                  rows={3}
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 md:col-span-2"
                >
                  ➕ Add Product
                </button>
              </form>
            </div>

            {/* Products List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-2 text-sm">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-green-600">${product.price}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                        ✏️ Edit
                      </button>
                      <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700">
                        🗑️ Delete
                      </button>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">💰 Product Offers</h2>
              <span className="text-gray-600">{offers.length} offers</span>
            </div>

            <div className="space-y-4">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{offer.productName}</h3>
                      <p className="text-gray-600">From: {offer.buyerName} ({offer.buyerId})</p>
                      <p className="text-sm text-gray-500">{offer.createdAt}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {offer.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Original Price:</span>
                      <div className="text-lg font-semibold">${offer.originalPrice}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Offer Price:</span>
                      <div className="text-lg font-semibold text-green-600">${offer.offerPrice}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Message:</span>
                    <p className="text-gray-700">{offer.message}</p>
                  </div>

                  {offer.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleOffer(offer.id, 'accept')}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        ✅ Accept Offer
                      </button>
                      <button
                        onClick={() => handleOffer(offer.id, 'reject')}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                      >
                        ❌ Reject Offer
                      </button>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        💬 Counter Offer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">👤 Seller Profile</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-gray-600">{user.sellerId}</p>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mt-2">
                  ✅ Verified Seller
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full px-3 py-2 border rounded bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={user.phone || ''}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <textarea
                    value={user.address || ''}
                    rows={3}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  💾 Update Profile
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">🔔 Notifications</h2>
            <div className="space-y-4">
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">💰</div>
                  <div>
                    <h3 className="font-semibold">New offer received</h3>
                    <p className="text-gray-600 text-sm">John Buyer made an offer on Traditional Kente Cloth</p>
                    <p className="text-gray-500 text-xs">2 hours ago</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📦</div>
                  <div>
                    <h3 className="font-semibold">Product viewed</h3>
                    <p className="text-gray-600 text-sm">Your Nimba County Coffee was viewed 5 times today</p>
                    <p className="text-gray-500 text-xs">6 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
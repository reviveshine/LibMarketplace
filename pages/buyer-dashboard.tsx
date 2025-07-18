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
  sellerName: string;
}

interface Offer {
  id: number;
  productId: number;
  productName: string;
  sellerId: string;
  sellerName: string;
  originalPrice: number;
  offerPrice: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  message: string;
  createdAt: string;
}

export default function BuyerDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('browse')
  const [products, setProducts] = useState<Product[]>([])
  const [myOffers, setMyOffers] = useState<Offer[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [offerForm, setOfferForm] = useState({
    price: '',
    message: ''
  })

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    if (user.type !== 'buyer') {
      router.push('/seller-dashboard')
      return
    }
    if (user.status !== 'verified') {
      router.push('/verification-pending')
      return
    }

    loadBuyerData()
  }, [user, router])

  const loadBuyerData = () => {
    // Demo data - in real app, fetch from API
    const demoProducts: Product[] = [
      { id: 1, name: 'Traditional Kente Cloth', description: 'Handwoven authentic kente cloth from Liberian artisans', price: 89.99, stock: 15, image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=300&h=200&fit=crop', sellerId: 'RSH001', sellerName: 'reviveshine' },
      { id: 2, name: 'Nimba County Coffee', description: 'Premium arabica coffee beans from Nimba mountains', price: 24.99, stock: 50, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop', sellerId: 'RSH001', sellerName: 'reviveshine' },
      { id: 3, name: 'Carved Wooden Elephant', description: 'Beautiful elephant sculpture representing Liberian wildlife', price: 45.00, stock: 8, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', sellerId: 'RSH001', sellerName: 'reviveshine' },
      { id: 4, name: 'Pure Palm Oil', description: 'Authentic red palm oil from Liberian palm trees', price: 19.99, stock: 30, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop', sellerId: 'RSH001', sellerName: 'reviveshine' },
    ]

    const demoOffers: Offer[] = [
      {
        id: 1,
        productId: 1,
        productName: 'Traditional Kente Cloth',
        sellerId: 'RSH001',
        sellerName: 'reviveshine',
        originalPrice: 89.99,
        offerPrice: 75.00,
        status: 'pending',
        message: 'Interested in bulk purchase. Can you do $75?',
        createdAt: '2 hours ago'
      }
    ]

    setProducts(demoProducts)
    setMyOffers(demoOffers)
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const makeOffer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return

    const newOffer: Offer = {
      id: Date.now(),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      sellerId: selectedProduct.sellerId,
      sellerName: selectedProduct.sellerName,
      originalPrice: selectedProduct.price,
      offerPrice: parseFloat(offerForm.price),
      status: 'pending',
      message: offerForm.message,
      createdAt: 'just now'
    }

    setMyOffers([newOffer, ...myOffers])
    setOfferForm({ price: '', message: '' })
    setSelectedProduct(null)
    alert('Offer sent successfully!')
  }

  if (!user || user.type !== 'buyer') {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Buyer Dashboard - LibMarketplace</title>
      </Head>

      {/* Header */}
      <header className="liberian-gradient shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🇱🇷</div>
              <div>
                <h1 className="text-2xl font-bold text-white">Buyer Dashboard</h1>
                <p className="text-sm text-gray-200">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-white text-center">
                <div className="text-3xl mb-1">👤</div>
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs bg-blue-800 px-2 py-1 rounded">{user.buyerId}</div>
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
            {['browse', 'offers', 'profile', 'notifications'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'browse' && '🛍️'} 
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
        {/* Browse Products Tab */}
        {activeTab === 'browse' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">🛍️ Browse Products</h2>
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border rounded-lg w-64"
                />
                <span className="text-gray-600">{filteredProducts.length} products</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden product-card">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-2 text-sm">{product.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xl font-bold text-green-600">${product.price}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      Seller: {product.sellerName} ({product.sellerId})
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                      >
                        💰 Make Offer
                      </button>
                      <button className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
                        💬 Message
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Offers Tab */}
        {activeTab === 'offers' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">💰 My Offers</h2>
              <span className="text-gray-600">{myOffers.length} offers</span>
            </div>

            <div className="space-y-4">
              {myOffers.map((offer) => (
                <div key={offer.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{offer.productName}</h3>
                      <p className="text-gray-600">To: {offer.sellerName} ({offer.sellerId})</p>
                      <p className="text-sm text-gray-500">{offer.createdAt}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      offer.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      offer.status === 'countered' ? 'bg-blue-100 text-blue-800' :
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
                      <span className="text-sm text-gray-500">My Offer:</span>
                      <div className="text-lg font-semibold text-green-600">${offer.offerPrice}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Message:</span>
                    <p className="text-gray-700">{offer.message}</p>
                  </div>

                  {offer.status === 'accepted' && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-green-800 font-medium">🎉 Offer Accepted!</p>
                      <p className="text-green-700 text-sm">The seller will contact you to complete the purchase.</p>
                    </div>
                  )}

                  {offer.status === 'pending' && (
                    <div className="flex space-x-3">
                      <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                        ❌ Cancel Offer
                      </button>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        💬 Message Seller
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {myOffers.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="text-xl font-semibold text-gray-500 mb-2">No offers yet</h3>
                  <p className="text-gray-400">Browse products and make your first offer!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">👤 Buyer Profile</h2>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-gray-600">{user.buyerId}</p>
                <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm mt-2">
                  ✅ Verified Buyer
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
                  <div className="text-2xl">✅</div>
                  <div>
                    <h3 className="font-semibold">Offer accepted</h3>
                    <p className="text-gray-600 text-sm">Your offer for Traditional Kente Cloth was accepted</p>
                    <p className="text-gray-500 text-xs">1 hour ago</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📦</div>
                  <div>
                    <h3 className="font-semibold">New product available</h3>
                    <p className="text-gray-600 text-sm">Check out the latest Liberian handcrafts</p>
                    <p className="text-gray-500 text-xs">6 hours ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Make Offer Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">💰 Make Offer</h3>
                <button 
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="mb-4">
                <h4 className="font-semibold">{selectedProduct.name}</h4>
                <p className="text-gray-600 text-sm">{selectedProduct.description}</p>
                <p className="text-lg font-bold text-green-600 mt-2">Original Price: ${selectedProduct.price}</p>
              </div>

              <form onSubmit={makeOffer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Offer Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={offerForm.price}
                    onChange={(e) => setOfferForm({...offerForm, price: e.target.value})}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter your offer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message to Seller</label>
                  <textarea
                    value={offerForm.message}
                    onChange={(e) => setOfferForm({...offerForm, message: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Why should the seller accept your offer?"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    💰 Send Offer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
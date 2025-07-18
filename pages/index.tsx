import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../lib/auth'

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Message {
  id: number;
  from: string;
  text: string;
  time: string;
}

export default function Home() {
  const { user, logout } = useAuth()
  const [currentSection, setCurrentSection] = useState('home')
  const [showCart, setShowCart] = useState(false)
  const [showMessages, setShowMessages] = useState(false)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })

  const products: Product[] = [
    { id: 1, name: 'Traditional Kente Cloth', description: 'Handwoven authentic kente cloth from Liberian artisans', price: 89.99, stock: 15, image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=300&h=200&fit=crop' },
    { id: 2, name: 'Nimba County Coffee', description: 'Premium arabica coffee beans from Nimba mountains', price: 24.99, stock: 50, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop' },
    { id: 3, name: 'Carved Wooden Elephant', description: 'Beautiful elephant sculpture representing Liberian wildlife', price: 45.00, stock: 8, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop' },
    { id: 4, name: 'Pure Palm Oil', description: 'Authentic red palm oil from Liberian palm trees', price: 19.99, stock: 30, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop' },
    { id: 5, name: 'Traditional Talking Drum', description: 'Authentic talking drum handcrafted by local musicians', price: 125.00, stock: 5, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop' },
    { id: 6, name: 'Liberian Flag Jewelry', description: 'Beautiful jewelry featuring Liberian flag colors', price: 35.99, stock: 20, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop' }
  ]

  const [messages, setMessages] = useState<Message[]>([
    { id: 1, from: 'reviveshine (RSH001)', text: 'Welcome! How can I help you find authentic Liberian products?', time: '2 hours ago' },
    { id: 2, from: 'System', text: 'Browse products or message RSH001 directly for inquiries.', time: '1 hour ago' }
  ])

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)

  const addToCart = (product: Product) => {
    const existing = cartItems.find(item => item.id === product.id)
    if (existing) {
      setCartItems(items => 
        items.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCartItems(items => [...items, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId: number) => {
    setCartItems(items => items.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(items =>
      items.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const checkout = () => {
    alert(`Order placed! Total: $${cartTotal}. RSH001 will contact you within 24 hours.`)
    setCartItems([])
    setShowCart(false)
  }

  const messageAboutProduct = (product: Product) => {
    setShowMessages(true)
    setMessages(prev => [{
      id: Date.now(),
      from: 'You',
      text: `Hi, I'm interested in the ${product.name}. Can you tell me more?`,
      time: 'just now'
    }, ...prev])
  }

  const sendQuickMessage = () => {
    if (!newMessage.trim()) return
    setMessages(prev => [{
      id: Date.now(),
      from: 'You',
      text: newMessage,
      time: 'just now'
    }, ...prev])
    setNewMessage('')
  }

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Thank you ${contactForm.name}! Message sent to RSH001.`)
    setContactForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="bg-gray-50">
      <Head>
        <title>LibMarketplace - Authentic Liberian Products | RSH001</title>
        <meta name="description" content="Authentic Liberian Products Worldwide" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet" />
      </Head>

      {/* Header */}
      <header className="liberian-gradient shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🇱🇷</div>
              <div>
                <h1 className="text-2xl font-bold text-white">LibMarketplace</h1>
                <p className="text-sm text-gray-200">Authentic Liberian Products Worldwide</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <button onClick={() => setShowCart(true)} className="text-white hover:text-gray-200 relative">
                <i className="fas fa-shopping-cart text-2xl"></i>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs cart-badge">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <button onClick={() => setShowMessages(true)} className="text-white hover:text-gray-200">
                <i className="fas fa-comments text-2xl"></i>
              </button>
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-white text-center">
                    <div className="text-3xl mb-1">👤</div>
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-xs bg-blue-800 px-2 py-1 rounded">{user.sellerId || user.buyerId}</div>
                    <div className="text-xs bg-green-600 px-2 py-1 rounded mt-1">{user.status}</div>
                  </div>
                  {user.type === 'seller' && (
                    <Link href="/seller-dashboard" className="text-white hover:text-gray-200 px-3 py-2 rounded border border-white">
                      📊 Dashboard
                    </Link>
                  )}
                  {user.type === 'buyer' && (
                    <Link href="/buyer-dashboard" className="text-white hover:text-gray-200 px-3 py-2 rounded border border-white">
                      🛍️ Dashboard
                    </Link>
                  )}
                  {user.type === 'admin' && (
                    <Link href="/admin-panel" className="text-white hover:text-gray-200 px-3 py-2 rounded border border-white">
                      👨‍💼 Admin
                    </Link>
                  )}
                  <button 
                    onClick={logout}
                    className="text-white hover:text-gray-200 px-3 py-2 rounded border border-white"
                  >
                    🚪 Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login" className="text-white hover:text-gray-200 px-3 py-2 rounded border border-white">
                    🔑 Login
                  </Link>
                  <Link href="/register" className="text-white hover:text-gray-200 px-3 py-2 rounded bg-white text-blue-600">
                    📝 Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      {currentSection === 'home' && (
        <section className="bg-gradient-to-r from-blue-600 to-red-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Welcome to LibMarketplace</h2>
            <p className="text-xl md:text-2xl mb-8">Authentic Liberian products from Nimba County to the world</p>
            <button 
              onClick={() => setCurrentSection('products')} 
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 mr-4"
            >
              🛍️ Shop Now
            </button>
            <button 
              onClick={() => setCurrentSection('about')} 
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600"
            >
              ℹ️ Learn More
            </button>
          </div>
        </section>
      )}

      {/* Navigation */}
      <nav className="bg-white shadow-md sticky top-20 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-8 py-4">
            <button 
              onClick={() => setCurrentSection('home')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentSection === 'home' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              🏠 Home
            </button>
            <button 
              onClick={() => setCurrentSection('products')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentSection === 'products' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              🛍️ Products
            </button>
            <button 
              onClick={() => setCurrentSection('about')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentSection === 'about' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              ℹ️ About
            </button>
            <button 
              onClick={() => setCurrentSection('contact')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentSection === 'contact' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              📞 Contact
            </button>
            <Link 
              href="/policies"
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-gray-600 hover:text-blue-600`}
            >
              📋 Policies
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Products Section */}
        {currentSection === 'products' && (
          <div>
            <h2 className="text-3xl font-bold text-center mb-8">🛍️ Authentic Liberian Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden product-card">
                  <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-green-600">${product.price}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => addToCart(product)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                      >
                        🛒 Add to Cart
                      </button>
                      <button 
                        onClick={() => messageAboutProduct(product)}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      >
                        💬
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About Section */}
        {currentSection === 'about' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🇱🇷</div>
                <h2 className="text-3xl font-bold mb-4">About reviveshine (RSH001)</h2>
                <div className="bg-blue-100 inline-block px-4 py-2 rounded">
                  <span className="text-blue-800 font-semibold">✅ Verified Seller ID: RSH001</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">🏡 From Nimba County</h3>
                  <p className="text-gray-600 mb-6">Based in Nimba County, Liberia, specializing in authentic Liberian products for global customers.</p>
                  <h3 className="text-xl font-semibold mb-4">🌍 Global Mission</h3>
                  <p className="text-gray-600">Bridging Liberian artisans with worldwide customers, preserving culture while supporting communities.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-4">✅ Quality Guarantee</h3>
                  <ul className="text-gray-600 space-y-2 mb-6">
                    <li>• 100% Authentic Liberian products</li>
                    <li>• Direct sourcing from artisans</li>
                    <li>• Quality inspected before shipping</li>
                    <li>• Worldwide shipping available</li>
                    <li>• Customer satisfaction guaranteed</li>
                  </ul>
                  <h3 className="text-xl font-semibold mb-4">📞 Contact</h3>
                  <p className="text-gray-600">📧 reviveshine@mylibmarketplace.com</p>
                  <p className="text-gray-600">🌐 mylibmarketplace.com</p>
                  <p className="text-gray-600">📍 Nimba County, Liberia</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        {currentSection === 'contact' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-center mb-6">📞 Contact reviveshine</h2>
              <form onSubmit={sendMessage} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Your Name</label>
                  <input 
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    type="text" 
                    required 
                    className="w-full px-3 py-2 border rounded focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                  <input 
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    type="email" 
                    required 
                    className="w-full px-3 py-2 border rounded focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                  <textarea 
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={5} 
                    required 
                    className="w-full px-3 py-2 border rounded focus:border-blue-500"
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
                  📧 Send Message
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">🛒 Shopping Cart</h3>
                <button onClick={() => setShowCart(false)} className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              {cartItems.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-green-600">${item.price}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="bg-gray-200 px-2 py-1 rounded"
                            >
                              -
                            </button>
                            <span>{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="bg-gray-200 px-2 py-1 rounded"
                            >
                              +
                            </button>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 ml-auto"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold">Total: ${cartTotal}</span>
                    </div>
                    <button 
                      onClick={checkout}
                      className="w-full bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
                    >
                      💳 Checkout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages Modal */}
      {showMessages && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-md h-96 flex flex-col">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">💬 Messages</h3>
                <button onClick={() => setShowMessages(false)} className="text-gray-500 hover:text-gray-700">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`${message.from === 'You' ? 'text-right' : 'text-left'}`}>
                  <div className={`inline-block p-3 rounded-lg max-w-xs ${
                    message.from === 'You' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{message.from} • {message.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  type="text" 
                  placeholder="Type a message..." 
                  className="flex-1 px-3 py-2 border rounded"
                  onKeyPress={(e) => e.key === 'Enter' && sendQuickMessage()}
                />
                <button 
                  onClick={sendQuickMessage}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  📤
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-3 mb-4">
            <div className="text-2xl">🇱🇷</div>
            <div>
              <h3 className="text-xl font-bold">LibMarketplace</h3>
              <p className="text-gray-400">Where Liberia Buys, Sells, and Connects.</p>
            </div>
          </div>
          <p className="text-gray-400">&copy; 2024 LibMarketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
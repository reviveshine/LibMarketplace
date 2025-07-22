import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import LoadingSpinner from '../components/LoadingSpinner'
import { CartItem, Address } from '../types'

export default function Checkout() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  // Form data
  const [shippingAddress, setShippingAddress] = useState<Address>({
    street: '',
    city: '',
    county: '',
    country: 'Liberia',
    postalCode: ''
  })
  
  const [billingAddress, setBillingAddress] = useState<Address>({
    street: '',
    city: '',
    county: '',
    country: 'Liberia',
    postalCode: ''
  })
  
  const [sameAsShipping, setSameAsShipping] = useState(true)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardInfo, setCardInfo] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const cart = JSON.parse(savedCart)
      if (cart.length === 0) {
        router.push('/cart')
        return
      }
      setCartItems(cart)
    } else {
      router.push('/cart')
      return
    }
    setLoading(false)
  }, [router])

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const liberianCounties = [
    'Bomi', 'Bong', 'Gbarpolu', 'Grand Bassa', 'Grand Cape Mount',
    'Grand Gedeh', 'Grand Kru', 'Lofa', 'Margibi', 'Maryland',
    'Montserrado', 'Nimba', 'River Cess', 'River Gee', 'Sinoe'
  ]

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return shippingAddress.street && shippingAddress.city && shippingAddress.county
      case 2:
        if (sameAsShipping) return true
        return billingAddress.street && billingAddress.city && billingAddress.county
      case 3:
        if (paymentMethod === 'card') {
          return cardInfo.number && cardInfo.expiry && cardInfo.cvv && cardInfo.name
        }
        return true
      default:
        return false
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    } else {
      alert('Please fill in all required fields')
    }
  }

  const handlePlaceOrder = async () => {
    if (!validateStep(3)) {
      alert('Please complete all required fields')
      return
    }

    setProcessing(true)

    // Simulate order processing
    setTimeout(() => {
      // Clear cart
      localStorage.removeItem('cart')
      
      // Redirect to success page
      router.push('/order-success?orderId=ORD-' + Date.now())
    }, 3000)
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Head>
        <title>Checkout - LibMarketplace</title>
        <meta name="description" content="Complete your purchase on LibMarketplace" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">🛒 Checkout</h1>
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-liberian-blue">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/cart" className="hover:text-liberian-blue">Cart</Link>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Checkout</span>
          </nav>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                  currentStep >= step ? 'bg-liberian-blue' : 'bg-gray-300'
                }`}>
                  {step}
                </div>
                <div className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-liberian-blue' : 'text-gray-500'
                }`}>
                  {step === 1 && 'Shipping'}
                  {step === 2 && 'Billing'}
                  {step === 3 && 'Payment'}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step ? 'bg-liberian-blue' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Step 1: Shipping Address */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">📦 Shipping Address</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.street}
                        onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                        className="input-field"
                        placeholder="Enter your street address"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                        className="input-field"
                        placeholder="Enter your city"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        County *
                      </label>
                      <select
                        value={shippingAddress.county}
                        onChange={(e) => setShippingAddress({...shippingAddress, county: e.target.value})}
                        className="input-field"
                        required
                      >
                        <option value="">Select County</option>
                        {liberianCounties.map(county => (
                          <option key={county} value={county}>{county}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.country}
                        readOnly
                        className="input-field bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})}
                        className="input-field"
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Billing Address */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">💳 Billing Address</h2>
                  
                  <div className="mb-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => {
                          setSameAsShipping(e.target.checked)
                          if (e.target.checked) {
                            setBillingAddress(shippingAddress)
                          }
                        }}
                        className="mr-2"
                      />
                      Same as shipping address
                    </label>
                  </div>

                  {!sameAsShipping && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.street}
                          onChange={(e) => setBillingAddress({...billingAddress, street: e.target.value})}
                          className="input-field"
                          placeholder="Enter billing street address"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={billingAddress.city}
                          onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                          className="input-field"
                          placeholder="Enter billing city"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          County *
                        </label>
                        <select
                          value={billingAddress.county}
                          onChange={(e) => setBillingAddress({...billingAddress, county: e.target.value})}
                          className="input-field"
                          required
                        >
                          <option value="">Select County</option>
                          {liberianCounties.map(county => (
                            <option key={county} value={county}>{county}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">💳 Payment Information</h2>
                  
                  {/* Payment Method Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Payment Method
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">💳</span>
                          <span>Credit/Debit Card</span>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="mobile"
                          checked={paymentMethod === 'mobile'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">📱</span>
                          <span>Mobile Money (Orange Money, MTN)</span>
                        </div>
                      </label>
                      <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          value="bank"
                          checked={paymentMethod === 'bank'}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-3"
                        />
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">🏦</span>
                          <span>Bank Transfer</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Card Details */}
                  {paymentMethod === 'card' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={cardInfo.number}
                          onChange={(e) => setCardInfo({...cardInfo, number: e.target.value})}
                          className="input-field"
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          type="text"
                          value={cardInfo.expiry}
                          onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                          className="input-field"
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVV *
                        </label>
                        <input
                          type="text"
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                          className="input-field"
                          placeholder="123"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={cardInfo.name}
                          onChange={(e) => setCardInfo({...cardInfo, name: e.target.value})}
                          className="input-field"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'mobile' && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-800">
                        📱 You will be redirected to your mobile money provider to complete the payment.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'bank' && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800">
                        🏦 Bank transfer details will be provided after order confirmation.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Back
                </button>
                
                {currentStep < 3 ? (
                  <button
                    onClick={handleNextStep}
                    className="btn-primary"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceOrder}
                    disabled={processing}
                    className="btn-success disabled:opacity-50"
                  >
                    {processing ? (
                      <div className="flex items-center">
                        <LoadingSpinner size="sm" color="white" />
                        <span className="ml-2">Processing...</span>
                      </div>
                    ) : (
                      'Place Order'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <hr className="my-4" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <hr className="my-4" />

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-liberian-red">${total.toFixed(2)}</span>
              </div>

              {/* Security Notice */}
              <div className="mt-4 text-center text-xs text-gray-600">
                <div className="flex items-center justify-center space-x-1 mb-2">
                  <span>🔒</span>
                  <span>Secure SSL Encryption</span>
                </div>
                <p>Your payment information is safe and secure</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
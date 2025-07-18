import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

export default function Register() {
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState('')
  const [formData, setFormData] = useState({
    // Basic Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Address
    address: '',
    city: '',
    county: '',
    country: 'Liberia',
    
    // Business Info (for sellers)
    businessName: '',
    businessType: '',
    taxId: '',
    
    // Agreement
    agreeTerms: false,
    agreePrivacy: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match')
        return
      }

      if (!formData.agreeTerms || !formData.agreePrivacy) {
        setError('Please agree to the terms and privacy policy')
        return
      }

      // TODO: Implement actual registration
      console.log('Registration data:', { ...formData, type: userType })
      
      // Mock registration
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Redirect to verification page
      router.push('/auth/verify?email=' + encodeURIComponent(formData.email))
      
    } catch (err) {
      setError('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateStep = () => {
    switch (step) {
      case 1:
        return userType !== ''
      case 2:
        return formData.firstName && formData.lastName && formData.email && formData.phone && formData.password && formData.confirmPassword
      case 3:
        return formData.address && formData.city && formData.county
      case 4:
        return userType === 'buyer' || (formData.businessName && formData.businessType)
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1)
      setError('')
    } else {
      setError('Please fill in all required fields')
    }
  }

  const prevStep = () => {
    setStep(prev => prev - 1)
    setError('')
  }

  // Get user type from URL if provided
  const { type } = router.query
  if (type && !userType) {
    setUserType(type as string)
    setStep(2)
  }

  return (
    <Layout>
      <Head>
        <title>Join LibMarketplace - Create Your Account</title>
        <meta name="description" content="Create your LibMarketplace account to start buying or selling" />
      </Head>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🇱🇷</div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Join LibMarketplace
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your account to start buying or selling
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {num}
                  </div>
                  {num < 5 && <div className={`w-8 h-1 ${step > num ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
          </div>

          <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Step 1: User Type Selection */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">What brings you to LibMarketplace?</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="userType"
                      value="buyer"
                      checked={userType === 'buyer'}
                      onChange={(e) => setUserType(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="text-xl mb-1">🛍️ I want to buy products</div>
                      <div className="text-sm text-gray-600">Browse and purchase authentic Liberian products</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="userType"
                      value="seller"
                      checked={userType === 'seller'}
                      onChange={(e) => setUserType(e.target.value)}
                      className="mr-3"
                    />
                    <div>
                      <div className="text-xl mb-1">🏪 I want to sell products</div>
                      <div className="text-sm text-gray-600">Set up your store and reach customers worldwide</div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Basic Information */}
            {step === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input-field mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field mt-1"
                    placeholder="+231 XX XXX XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field mt-1"
                    placeholder="At least 8 characters"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Address Information */}
            {step === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Address Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Street Address</label>
                  <input
                    name="address"
                    type="text"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City</label>
                    <input
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      className="input-field mt-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">County</label>
                    <select
                      name="county"
                      required
                      value={formData.county}
                      onChange={handleChange}
                      className="input-field mt-1"
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
                </div>
              </div>
            )}

            {/* Step 4: Business Information (for sellers) */}
            {step === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {userType === 'seller' ? 'Business Information' : 'Account Preferences'}
                </h3>
                
                {userType === 'seller' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Name</label>
                      <input
                        name="businessName"
                        type="text"
                        required
                        value={formData.businessName}
                        onChange={handleChange}
                        className="input-field mt-1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Business Type</label>
                      <select
                        name="businessType"
                        required
                        value={formData.businessType}
                        onChange={handleChange}
                        className="input-field mt-1"
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tax ID (Optional)</label>
                      <input
                        name="taxId"
                        type="text"
                        value={formData.taxId}
                        onChange={handleChange}
                        className="input-field mt-1"
                        placeholder="Business tax identification number"
                      />
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🛍️</div>
                    <p className="text-gray-600">
                      You're almost ready to start shopping on LibMarketplace!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Terms & Conditions */}
            {step === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Terms & Conditions</h3>
                
                <div className="space-y-3">
                  <label className="flex items-start">
                    <input
                      name="agreeTerms"
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="mt-1 mr-3"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the{' '}
                      <Link href="/policies/terms" className="text-blue-600 hover:text-blue-500">
                        Terms of Service
                      </Link>
                    </span>
                  </label>
                  
                  <label className="flex items-start">
                    <input
                      name="agreePrivacy"
                      type="checkbox"
                      checked={formData.agreePrivacy}
                      onChange={handleChange}
                      className="mt-1 mr-3"
                      required
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the{' '}
                      <Link href="/policies/privacy" className="text-blue-600 hover:text-blue-500">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Email verification required</li>
                    <li>• Phone verification required</li>
                    {userType === 'seller' && <li>• Business verification and KYC documents required</li>}
                    <li>• Admin approval required before full access</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="btn-secondary"
                >
                  <i className="fas fa-arrow-left mr-2"></i>Previous
                </button>
              )}
              
              <div className="ml-auto">
                {step < 5 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn-primary"
                  >
                    Next<i className="fas fa-arrow-right ml-2"></i>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading ? (
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                    ) : (
                      <i className="fas fa-user-plus mr-2"></i>
                    )}
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                )}
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
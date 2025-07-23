import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { CountryCode } from 'libphonenumber-js'
import Layout from '../../components/Layout'
import PhoneInput from '../../components/auth/PhoneInput'
import { UserType } from '../../lib/phone-validation'

export default function VerifyPhone() {
  const [step, setStep] = useState(1) // 1: Enter phone, 2: Verify code
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>('LR')
  const [userType, setUserType] = useState<UserType>('buyer')
  const [verificationCode, setVerificationCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [resendDisabled, setResendDisabled] = useState(false)
  const [resendCountdown, setResendCountdown] = useState(0)
  
  const router = useRouter()
  const { email, type } = router.query

  // Set user type from query params
  useEffect(() => {
    if (type && ['buyer', 'seller', 'admin'].includes(type as string)) {
      setUserType(type as UserType)
    }
  }, [type])

  // Countdown timer for resend button
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown(prev => prev - 1)
      }, 1000)
    } else {
      setResendDisabled(false)
    }
    return () => clearInterval(interval)
  }, [resendCountdown])

  const handleSendVerification = async () => {
    if (!phoneNumber || !email) {
      setError('Phone number and email are required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone: phoneNumber,
          userType,
          countryCode: selectedCountry
        }),
      })

      const data = await response.json()

      if (data.success) {
        setVerificationId(data.verificationId || '')
        setSuccess(data.message)
        setStep(2)
        setResendDisabled(true)
        setResendCountdown(60) // 1 minute cooldown
      } else {
        setError(data.message || 'Failed to send verification code')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Mock verification - in production, validate against backend
      console.log('Verifying code:', { email, phone: phoneNumber, code: verificationCode, verificationId })
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock success
      setSuccess('Phone verified successfully!')
      
      // Redirect based on user type
      setTimeout(() => {
        if (userType === 'seller') {
          router.push(`/seller/dashboard?verified=phone&email=${encodeURIComponent(email as string)}`)
        } else if (userType === 'admin') {
          router.push(`/admin/dashboard?verified=phone&email=${encodeURIComponent(email as string)}`)
        } else {
          router.push(`/buyer/dashboard?verified=phone&email=${encodeURIComponent(email as string)}`)
        }
      }, 2000)
      
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = () => {
    setVerificationCode('')
    setStep(1)
    setError('')
    setSuccess('')
  }

  const handleBackToPhone = () => {
    setStep(1)
    setVerificationCode('')
    setError('')
    setSuccess('')
  }

  return (
    <Layout>
      <Head>
        <title>Phone Verification - LibMarketplace</title>
        <meta name="description" content="Verify your phone number to secure your account" />
      </Head>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="text-6xl mb-4">
              {step === 1 ? '📱' : '🔐'}
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {step === 1 ? 'Verify Your Phone' : 'Enter Verification Code'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {step === 1 
                ? `Secure your ${userType} account with phone verification`
                : `We sent a code to ${phoneNumber}`
              }
            </p>
            {email && (
              <p className="text-xs text-gray-500 mt-1">
                Account: {email}
              </p>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-8 h-1 ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
            </div>
          </div>

          <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {success}
              </div>
            )}

            {/* Step 1: Phone Number Input */}
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <PhoneInput
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    userType={userType}
                    selectedCountry={selectedCountry}
                    onCountryChange={setSelectedCountry}
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={loading || !phoneNumber}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-paper-plane mr-2"></i>
                  )}
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </div>
            )}

            {/* Step 2: Verification Code Input */}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    Verification Code
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    maxLength={6}
                    required
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="input-field mt-1 text-center text-2xl tracking-widest"
                    placeholder="000000"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the 6-digit code sent to your phone
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={loading || verificationCode.length !== 6}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <i className="fas fa-check mr-2"></i>
                  )}
                  {loading ? 'Verifying...' : 'Verify Phone'}
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={handleBackToPhone}
                    className="flex-1 btn-secondary"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Change Phone
                  </button>
                  
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendDisabled}
                    className="flex-1 text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400 border border-blue-300 rounded px-4 py-2"
                  >
                    {resendDisabled ? `Resend in ${resendCountdown}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            )}

            {/* User Type Badge */}
            <div className="text-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                userType === 'seller' ? 'bg-green-100 text-green-800' :
                userType === 'admin' ? 'bg-purple-100 text-purple-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {userType === 'seller' ? '🏪' : userType === 'admin' ? '👑' : '🛍️'} {userType.charAt(0).toUpperCase() + userType.slice(1)} Account
              </span>
            </div>
          </form>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Having trouble? <a href="/contact" className="text-blue-600 hover:text-blue-500">Contact support</a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
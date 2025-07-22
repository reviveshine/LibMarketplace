import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

export default function Verify() {
  const [verificationCode, setVerificationCode] = useState('')
  const [resendDisabled, setResendDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [resendAttempts, setResendAttempts] = useState(0)
  const router = useRouter()
  const { email } = router.query
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  
  // Decode email for display
  const decodedEmail = email ? decodeURIComponent(email as string) : ''

  // Handle router query loading state
  useEffect(() => {
    // Router query is populated after hydration
    if (!router.isReady) return
  }, [router.isReady])

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false)
    }
  }, [countdown, resendDisabled])

  // Handle individual digit input with auto-advance
  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste operation
      const digits = value.slice(0, 6).split('')
      const newCode = Array(6).fill('').map((_, i) => digits[i] || '').join('')
      setVerificationCode(newCode)
      
      // Focus the next empty field or the last field
      const nextIndex = Math.min(digits.length, 5)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    // Handle single digit input
    const newCode = verificationCode.split('')
    newCode[index] = value
    setVerificationCode(newCode.join(''))

    // Auto-advance to next field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  // Handle backspace for better UX
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!decodedEmail) {
      setError('Email parameter is missing. Please use a valid verification link.')
      return
    }
    
    setLoading(true)
    setError('')

    try {
      // TODO: Implement actual verification
      console.log('Verification attempt:', { email: decodedEmail, code: verificationCode })
      
      // Mock verification with more realistic patterns
      if (verificationCode.length === 6 && /^\d{6}$/.test(verificationCode)) {
        await new Promise(resolve => setTimeout(resolve, 1500))
        setSuccess('🎉 Email verified successfully! Redirecting to phone verification...')
        
        // Redirect to phone verification or dashboard
        setTimeout(() => {
          router.push('/auth/verify-phone?email=' + encodeURIComponent(decodedEmail))
        }, 2500)
      } else {
        setError('Please enter a valid 6-digit verification code')
      }
    } catch (err) {
      setError('Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    if (resendAttempts >= 3) {
      setError('Too many resend attempts. Please contact support if you continue having issues.')
      return
    }
    
    setResendDisabled(true)
    setError('')
    setResendAttempts(prev => prev + 1)
    setCountdown(60) // Start 60 second countdown
    setSuccess('📧 Verification code sent! Please check your email.')
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccess(''), 3000)
    
    // TODO: Implement actual resend
  }

  return (
    <Layout>
      <Head>
        <title>Verify Email - LibMarketplace</title>
        <meta name="description" content="Verify your email address to continue" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <div className="relative">
              <div className="text-6xl mb-4 animate-pulse">📧</div>
              <div className="absolute -top-2 -right-2 text-2xl">🇱🇷</div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
              Verify Your Email
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              We sent a verification code to
            </p>
            {decodedEmail ? (
              <p className="font-semibold text-liberian-blue bg-blue-50 px-3 py-1 rounded-lg inline-block">
                {decodedEmail}
              </p>
            ) : router.isReady ? (
              <p className="font-medium text-red-600 bg-red-50 px-3 py-1 rounded-lg inline-block">
                Email not provided
              </p>
            ) : (
              <p className="font-medium text-gray-500 bg-gray-50 px-3 py-1 rounded-lg inline-block">
                Loading...
              </p>
            )}
          </div>

          {/* Main Form */}
          <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-xl border border-gray-200" onSubmit={handleSubmit}>
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border-l-4 border-liberian-red text-red-700 px-4 py-3 rounded-r-lg animate-shake">
                <div className="flex items-center">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Success Alert */}
            {success && (
              <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-r-lg animate-bounce">
                <div className="flex items-center">
                  <i className="fas fa-check-circle mr-2"></i>
                  <span>{success}</span>
                </div>
              </div>
            )}

            {/* Code Input Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                Enter 6-Digit Verification Code
              </label>
              
              {/* Individual digit inputs */}
              <div className="flex justify-center space-x-2 mb-4">
                {Array(6).fill(0).map((_, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    value={verificationCode[index] || ''}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg 
                             focus:border-liberian-blue focus:ring-2 focus:ring-blue-200 focus:outline-none
                             transition-all duration-200 hover:border-gray-400"
                    pattern="\d*"
                    inputMode="numeric"
                  />
                ))}
              </div>
              
              <p className="text-xs text-gray-500 text-center">
                Enter the 6-digit code from your email
              </p>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6 || !decodedEmail}
                className="w-full bg-liberian-red hover:bg-red-700 disabled:bg-gray-400 
                         text-white font-bold py-3 px-6 rounded-xl transition-all duration-300
                         transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed
                         shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <i className="fas fa-check mr-2"></i>
                    Verify Email
                  </div>
                )}
              </button>
            </div>

            {/* Resend Section */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              
              {countdown > 0 ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-liberian-blue border-t-transparent animate-spin"></div>
                  <span className="text-liberian-blue font-medium">
                    Resend in {countdown}s
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={resendCode}
                  disabled={resendDisabled || resendAttempts >= 3}
                  className="text-liberian-blue hover:text-blue-700 font-semibold 
                           disabled:text-gray-400 disabled:cursor-not-allowed
                           transition-colors duration-200 underline"
                >
                  {resendAttempts >= 3 ? 'Contact Support' : 'Resend Code'}
                </button>
              )}
              
              {resendAttempts > 0 && resendAttempts < 3 && (
                <p className="text-xs text-gray-500 mt-1">
                  Attempts: {resendAttempts}/3
                </p>
              )}
            </div>
          </form>

          {/* Help Section */}
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              Having trouble? 
              <a href="/contact" className="text-liberian-blue hover:text-blue-700 font-medium ml-1">
                Contact Support
              </a>
            </p>
            <p className="text-xs text-gray-400">
              🇱🇷 Secure verification powered by LibMarketplace
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
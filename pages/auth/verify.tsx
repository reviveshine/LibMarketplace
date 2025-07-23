import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import VerificationForm from '../../components/auth/VerificationForm'
import { getRedirectUrl } from '../../lib/verification'

export default function Verify() {
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  // Get URL parameters
  const { email, phone, type } = router.query

  // Progress tracking
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Calculate initial progress based on URL parameters
    let initialProgress = 0
    if (email) initialProgress += 33
    if (phone) initialProgress += 33
    if (type) initialProgress += 34
    setProgress(initialProgress)
  }, [email, phone, type])

  const handleVerificationSuccess = async (data: { email?: string; phone?: string; type: string }) => {
    setLoading(true)
    setError('')
    
    try {
      setProgress(100)
      setSuccess('🎉 Verification completed successfully! Redirecting to your dashboard...')
      
      // Simulate account activation process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirect to appropriate dashboard
      const redirectUrl = getRedirectUrl(data.type)
      router.push(redirectUrl)
      
    } catch (err) {
      setError('Failed to complete verification. Please try again.')
      setLoading(false)
    }
  }

  const handleVerificationError = (errorMessage: string) => {
    setError(errorMessage)
    setSuccess('')
  }

  return (
    <Layout>
      <Head>
        <title>Account Verification - LibMarketplace</title>
        <meta name="description" content="Verify your email and phone number to access LibMarketplace" />
        <meta name="keywords" content="verification, LibMarketplace, Liberia, marketplace" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Verification Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Account type indicator */}
          {type && (
            <div className="mb-6">
              <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">
                    {type === 'buyer' && '🛍️'}
                    {type === 'seller' && '🏪'}
                    {type === 'admin' && '👨‍💼'}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 capitalize">
                      {type} Account Verification
                    </h3>
                    <p className="text-sm text-gray-600">
                      {type === 'buyer' && 'Complete verification to start shopping on LibMarketplace'}
                      {type === 'seller' && 'Complete verification to start selling on LibMarketplace'}
                      {type === 'admin' && 'Complete enhanced verification for admin access'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Main verification form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Global success message */}
            {success && (
              <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {success}
                </div>
              </div>
            )}

            {/* Global error message */}
            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            {/* Verification form */}
            {!loading && (
              <VerificationForm
                email={email as string}
                phone={phone as string}
                userType={(type as 'buyer' | 'seller' | 'admin') || 'buyer'}
                onSuccess={handleVerificationSuccess}
                onError={handleVerificationError}
              />
            )}

            {/* Loading state */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Completing Verification...
                </h3>
                <p className="text-gray-600">
                  Setting up your LibMarketplace account
                </p>
              </div>
            )}
          </div>

          {/* Help section */}
          <div className="mt-8 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Having trouble with verification? We&apos;re here to help!
              </p>
              <div className="flex justify-center space-x-4 text-sm">
                <Link href="/contact" className="text-blue-600 hover:text-blue-500 font-medium">
                  📧 Contact Support
                </Link>
                <span className="text-gray-300">|</span>
                <a href="tel:+231123456789" className="text-blue-600 hover:text-blue-500 font-medium">
                  📞 Call Us
                </a>
                <span className="text-gray-300">|</span>
                <a href="https://wa.me/231123456789" className="text-green-600 hover:text-green-500 font-medium">
                  📱 WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Security notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              🔒 Your information is encrypted and secure. We never share your personal data with third parties.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'

export default function Verify() {
  const [verificationCode, setVerificationCode] = useState('')
  const [resendDisabled, setResendDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const { email } = router.query

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // TODO: Implement actual verification
      console.log('Verification attempt:', { email, code: verificationCode })
      
      // Mock verification
      if (verificationCode.length === 6) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSuccess('Email verified successfully! Please check your phone for SMS verification.')
        
        // Redirect to phone verification or KYC upload
        setTimeout(() => {
          router.push('/auth/verify-phone?email=' + encodeURIComponent(email as string))
        }, 2000)
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
    setResendDisabled(true)
    setError('')
    setSuccess('Verification code sent! Please check your email.')
    
    // TODO: Implement actual resend
    setTimeout(() => setResendDisabled(false), 60000) // 1 minute cooldown
  }

  return (
    <Layout>
      <Head>
        <title>Verify Email - LibMarketplace</title>
        <meta name="description" content="Verify your email address to continue" />
      </Head>

      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="text-6xl mb-4">📧</div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Verify Your Email
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We sent a verification code to
            </p>
            <p className="font-medium text-blue-600">{email}</p>
          </div>

          <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
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
                onChange={(e) => setVerificationCode(e.target.value)}
                className="input-field mt-1 text-center text-2xl tracking-widest"
                placeholder="000000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the 6-digit code from your email
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                ) : (
                  <i className="fas fa-check mr-2"></i>
                )}
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  type="button"
                  onClick={resendCode}
                  disabled={resendDisabled}
                  className="text-blue-600 hover:text-blue-500 font-medium disabled:text-gray-400"
                >
                  {resendDisabled ? 'Code sent (wait 60s)' : 'Resend code'}
                </button>
              </p>
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
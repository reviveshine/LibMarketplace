import Head from 'next/head'
import Link from 'next/link'
import { useAuth } from '../lib/auth'

export default function VerificationPending() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Head>
        <title>Verification Pending - LibMarketplace</title>
      </Head>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="text-4xl mb-4">🇱🇷</div>
          <h2 className="text-3xl font-bold text-gray-900">LibMarketplace</h2>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Account Created Successfully!
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Your account is pending verification. You'll receive access to the marketplace once approved by our admin team.
            </p>
            
            {user && (
              <div className="bg-blue-50 p-4 rounded-md mb-6">
                <div className="text-sm text-blue-800">
                  <strong>Account Details:</strong><br/>
                  Name: {user.name}<br/>
                  Email: {user.email}<br/>
                  Type: {user.type}<br/>
                  ID: {user.sellerId || user.buyerId}<br/>
                  Status: {user.status}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                <strong>Next Steps:</strong>
                <ul className="mt-2 list-disc list-inside text-left space-y-1">
                  <li>Check your email for verification instructions</li>
                  <li>Admin will review your application</li>
                  <li>You'll be notified once approved</li>
                  <li>Then you can access all marketplace features</li>
                </ul>
              </div>
              
              <div className="pt-4">
                <Link 
                  href="/"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Return to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
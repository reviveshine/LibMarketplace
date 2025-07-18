import Head from 'next/head'
import Link from 'next/link'

export default function Policies() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Policies - LibMarketplace</title>
      </Head>

      {/* Header */}
      <header className="liberian-gradient shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🇱🇷</div>
              <div>
                <h1 className="text-2xl font-bold text-white">LibMarketplace</h1>
                <p className="text-sm text-gray-200">Policies & Terms</p>
              </div>
            </div>
            <Link href="/" className="text-white hover:text-gray-200 px-3 py-2 rounded border border-white">
              🏠 Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Navigation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">📋 Platform Policies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="#privacy" className="p-4 border rounded hover:bg-gray-50 text-center">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold">Privacy Policy</h3>
              </a>
              <a href="#terms" className="p-4 border rounded hover:bg-gray-50 text-center">
                <div className="text-3xl mb-2">📜</div>
                <h3 className="font-semibold">Terms of Service</h3>
              </a>
              <a href="#returns" className="p-4 border rounded hover:bg-gray-50 text-center">
                <div className="text-3xl mb-2">↩️</div>
                <h3 className="font-semibold">Return Policy</h3>
              </a>
            </div>
          </div>

          {/* Privacy Policy */}
          <div id="privacy" className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-3xl mr-3">🔒</span>
              Privacy Policy
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Information We Collect</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Personal information (name, email, phone number, address)</li>
                  <li>Verification documents (ID, proof of address)</li>
                  <li>Transaction data and communication records</li>
                  <li>Usage data and preferences</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">How We Use Your Information</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Account verification and KYC compliance</li>
                  <li>Processing transactions and communications</li>
                  <li>Platform security and fraud prevention</li>
                  <li>Customer support and service improvements</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Data Security</h3>
                <p className="text-gray-700">
                  We implement industry-standard security measures to protect your personal information, 
                  including encryption, secure storage, and access controls. Your verification documents 
                  are stored securely and accessed only by authorized personnel.
                </p>
              </div>
            </div>
          </div>

          {/* Terms of Service */}
          <div id="terms" className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-3xl mr-3">📜</span>
              Terms of Service
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Account Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Users must be 18 years or older</li>
                  <li>Valid identification and contact information required</li>
                  <li>One account per person</li>
                  <li>Account verification mandatory before marketplace access</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Seller Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Provide accurate product descriptions and images</li>
                  <li>Honor accepted offers and maintain stock accuracy</li>
                  <li>Respond to buyer inquiries within 24 hours</li>
                  <li>Ship products promptly and securely</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Buyer Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Make offers in good faith</li>
                  <li>Complete transactions for accepted offers</li>
                  <li>Communicate respectfully with sellers</li>
                  <li>Report any issues promptly</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Prohibited Activities</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Fraudulent or deceptive practices</li>
                  <li>Harassment or abusive behavior</li>
                  <li>Circumventing the platform for direct deals</li>
                  <li>Listing prohibited or illegal items</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Return Policy */}
          <div id="returns" className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-3xl mr-3">↩️</span>
              Return Policy
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">General Return Guidelines</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Returns accepted within 14 days of delivery</li>
                  <li>Items must be in original condition</li>
                  <li>Buyer responsible for return shipping costs</li>
                  <li>Seller approval required for returns</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Non-Returnable Items</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li>Perishable goods (food items, oils)</li>
                  <li>Custom or personalized items</li>
                  <li>Digital products or services</li>
                  <li>Items marked as final sale</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Refund Process</h3>
                <p className="text-gray-700 mb-3">
                  Refunds are processed through the original payment method within 5-10 business days 
                  after the seller confirms receipt of the returned item.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 text-sm">
                    <strong>Note:</strong> LibMarketplace facilitates communication between buyers and sellers 
                    but does not directly process payments. Please contact the seller directly for refund arrangements.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <span className="text-3xl mr-3">📞</span>
              Contact Us
            </h2>
            <p className="text-gray-700 mb-4">
              If you have questions about these policies or need assistance, please contact us:
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Email:</strong> support@mylibmarketplace.com</p>
              <p><strong>Address:</strong> Monrovia, Liberia</p>
              <p><strong>Business Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM GMT</p>
            </div>
          </div>

          {/* Footer Brand Statement */}
          <div className="text-center py-8">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <div className="text-3xl">🇱🇷</div>
              <div>
                <h3 className="text-xl font-bold">LibMarketplace</h3>
                <p className="text-gray-600">Where Liberia Buys, Sells, and Connects.</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm">Last updated: January 2024</p>
          </div>
        </div>
      </main>
    </div>
  )
}
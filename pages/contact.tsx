import { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // TODO: Implement actual form submission
      console.log('Contact form submission:', formData)
      
      // Mock submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(true)
      setFormData({ name: '', email: '', subject: '', message: '', category: '' })
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <Layout>
      <Head>
        <title>Contact Us - LibMarketplace</title>
        <meta name="description" content="Get in touch with LibMarketplace support team" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <section className="text-center mb-12">
          <div className="text-6xl mb-4">📞</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to our support team and we'll get back to you as soon as possible.
          </p>
        </section>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="text-2xl text-blue-600">🏢</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Office</h3>
                    <p className="text-gray-600">
                      Monrovia, Liberia<br />
                      Serving all 15 counties
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-2xl text-blue-600">📧</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">
                      support@libmarketplace.com<br />
                      business@libmarketplace.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-2xl text-blue-600">📱</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">
                      +231 XX XXX XXXX<br />
                      Mon-Fri 8AM-6PM GMT
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="text-2xl text-blue-600">💬</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Live Chat</h3>
                    <p className="text-gray-600">
                      Available 24/7 for urgent issues<br />
                      Login to access live chat
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Business Hours</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {success ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                  <button 
                    onClick={() => setSuccess(false)}
                    className="btn-primary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Your full name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        id="category"
                        name="category"
                        required
                        value={formData.category}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="">Select a category</option>
                        <option value="general">General Inquiry</option>
                        <option value="seller-support">Seller Support</option>
                        <option value="buyer-support">Buyer Support</option>
                        <option value="technical">Technical Issue</option>
                        <option value="verification">Account Verification</option>
                        <option value="payment">Payment Issue</option>
                        <option value="partnership">Business Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        value={formData.message}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Please provide details about your inquiry..."
                      />
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Before contacting us:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Check our <a href="/help" className="text-blue-600 hover:text-blue-500">Help Center</a> for common questions</li>
                        <li>• For urgent account issues, use live chat if logged in</li>
                        <li>• Include relevant order/product IDs if applicable</li>
                      </ul>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-primary disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane mr-2"></i>
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How do I become a verified seller?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Register as a seller, complete email and phone verification, upload KYC documents, and wait for admin approval.
                </p>

                <h3 className="font-semibold text-gray-900 mb-2">Is my payment information secure?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Yes, we use industry-standard encryption and security measures to protect all payment and personal information.
                </p>

                <h3 className="font-semibold text-gray-900 mb-2">How can I track my order?</h3>
                <p className="text-gray-600 text-sm">
                  Once your order is confirmed, you'll receive tracking information via email and can monitor progress in your dashboard.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What products can I sell?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  All legal products are welcome, with emphasis on authentic Liberian goods. Review our seller guidelines for details.
                </p>

                <h3 className="font-semibold text-gray-900 mb-2">How long does verification take?</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Email verification is instant, phone verification takes 2-5 minutes, and KYC approval typically takes 1-3 business days.
                </p>

                <h3 className="font-semibold text-gray-900 mb-2">Can I change my account type?</h3>
                <p className="text-gray-600 text-sm">
                  Contact support to upgrade from buyer to seller. Additional verification will be required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
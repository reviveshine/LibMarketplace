import Head from 'next/head'
import Layout from '../components/Layout'

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About LibMarketplace - Where Liberia Buys, Sells, and Connects</title>
        <meta name="description" content="Learn about LibMarketplace, the trusted platform for authentic Liberian products and services" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="text-6xl mb-4">🇱🇷</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About LibMarketplace</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Where Liberia Buys, Sells, and Connects. Your trusted marketplace for authentic Liberian products and services.
          </p>
        </section>

        {/* Mission Section */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                LibMarketplace is dedicated to empowering Liberian businesses and connecting them with customers worldwide. 
                We believe in the power of authentic Liberian products and the stories behind them.
              </p>
              <p className="text-gray-600">
                Our platform provides a secure, verified environment where buyers can discover genuine Liberian goods 
                while supporting local artisans, farmers, and entrepreneurs.
              </p>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">🌍</div>
              <p className="text-lg font-semibold text-blue-600">Connecting Liberia to the World</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Why Choose LibMarketplace?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-4">Verified & Secure</h3>
              <p className="text-gray-600">
                All sellers undergo KYC verification and admin approval. Secure payments and end-to-end encrypted messaging.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">🏪</div>
              <h3 className="text-xl font-semibold mb-4">Authentic Products</h3>
              <p className="text-gray-600">
                Genuine Liberian products from verified local businesses. From traditional crafts to modern goods.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-4">Direct Communication</h3>
              <p className="text-gray-600">
                Chat directly with sellers, negotiate prices, and build relationships with Liberian entrepreneurs.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-lg p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6">Our Values</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl mb-2">🤝</div>
                <h4 className="font-semibold mb-2">Trust</h4>
                <p className="text-sm">Building trust through verification and transparency</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🌱</div>
                <h4 className="font-semibold mb-2">Growth</h4>
                <p className="text-sm">Supporting business growth and economic development</p>
              </div>
              <div>
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold mb-2">Quality</h4>
                <p className="text-sm">Ensuring high-quality products and service standards</p>
              </div>
              <div>
                <div className="text-3xl mb-2">💡</div>
                <h4 className="font-semibold mb-2">Innovation</h4>
                <p className="text-sm">Using technology to solve real business challenges</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">1,000+</div>
              <p className="text-gray-600">Verified Sellers</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">15</div>
              <p className="text-gray-600">Counties Served</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <p className="text-gray-600">Product Categories</p>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Join LibMarketplace?</h2>
          <p className="text-gray-600 mb-6">
            Whether you're looking to buy authentic Liberian products or start selling your own, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/auth/register?type=buyer" className="btn-primary">
              <i className="fas fa-shopping-cart mr-2"></i>Start Shopping
            </a>
            <a href="/auth/register?type=seller" className="btn-secondary">
              <i className="fas fa-store mr-2"></i>Become a Seller
            </a>
            <a href="/contact" className="btn-success">
              <i className="fas fa-envelope mr-2"></i>Contact Us
            </a>
          </div>
        </section>
      </div>
    </Layout>
  )
}
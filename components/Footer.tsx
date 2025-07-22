export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="text-2xl mr-2">🇱🇷</span>
              LibMarketplace
            </h3>
            <p className="text-gray-300 mb-4">
              Where Liberia Buys, Sells, and Connects. Your trusted marketplace for authentic Liberian products and services.
            </p>
            <p className="text-gray-400 text-sm">
              © 2025 LibMarketplace. All rights reserved.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="/policies" className="hover:text-white">Policies</a></li>
              <li><a href="/help" className="hover:text-white">Help Center</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">For Sellers</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/auth/register?type=seller" className="hover:text-white">Become a Seller</a></li>
              <li><a href="/seller/dashboard" className="hover:text-white">Seller Dashboard</a></li>
              <li><a href="/seller/help" className="hover:text-white">Seller Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            Built with ❤️ for Liberia | Empowering local businesses since 2025
          </p>
        </div>
      </div>
    </footer>
  )
}
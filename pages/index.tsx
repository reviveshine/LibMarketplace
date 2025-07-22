import { useState } from 'react'
import Head from 'next/head'
import Layout from '../components/Layout'
import { Product } from '../contexts/AppContext'
import ProductCard, { ProductGrid } from '../components/ProductCard'
import SearchComponent, { SearchResults } from '../components/Search'
import Pagination, { usePagination } from '../components/Pagination'

// Mock data - will be replaced with database
const products: Product[] = [
  { id: 1, name: 'Traditional Kente Cloth', description: 'Handwoven authentic kente cloth from Liberian artisans', price: 89.99, stock: 15, image: 'https://images.unsplash.com/photo-1515378791036-0648a814c963?w=300&h=200&fit=crop', category: 'Textiles' },
  { id: 2, name: 'Nimba County Coffee', description: 'Premium arabica coffee beans from Nimba mountains', price: 24.99, stock: 50, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=200&fit=crop', category: 'Food' },
  { id: 3, name: 'Carved Wooden Elephant', description: 'Beautiful elephant sculpture representing Liberian wildlife', price: 45.00, stock: 8, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=200&fit=crop', category: 'Crafts' },
  { id: 4, name: 'Pure Palm Oil', description: 'Authentic red palm oil from Liberian palm trees', price: 19.99, stock: 30, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&h=200&fit=crop', category: 'Food' },
  { id: 5, name: 'Traditional Talking Drum', description: 'Authentic talking drum handcrafted by local musicians', price: 125.00, stock: 5, image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop', category: 'Crafts' },
  { id: 6, name: 'Liberian Flag Jewelry', description: 'Beautiful jewelry featuring Liberian flag colors', price: 35.99, stock: 20, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=300&h=200&fit=crop', category: 'Jewelry' },
  { id: 7, name: 'Cassava Flour', description: 'Fresh cassava flour perfect for traditional cooking', price: 12.50, stock: 40, image: 'https://images.unsplash.com/photo-1586201375761-83865001e26c?w=300&h=200&fit=crop', category: 'Food' },
  { id: 8, name: 'Woven Basket Set', description: 'Set of handwoven baskets for storage and decoration', price: 65.00, stock: 12, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop', category: 'Crafts' },
  { id: 9, name: 'Traditional Gele Headwrap', description: 'Colorful traditional headwrap for special occasions', price: 28.99, stock: 25, image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=200&fit=crop', category: 'Textiles' },
  { id: 10, name: 'Liberian Pepper Sauce', description: 'Spicy traditional pepper sauce made from local peppers', price: 8.99, stock: 60, image: 'https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=300&h=200&fit=crop', category: 'Food' }
]

export default function Home() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  
  const {
    currentPage,
    totalPages,
    currentItems: currentProducts,
    setCurrentPage,
    totalItems
  } = usePagination(filteredProducts, 6)

  const handleFilteredProducts = (filtered: Product[]) => {
    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  return (
    <Layout>
      <Head>
        <title>LibMarketplace - Where Liberia Buys, Sells, and Connects</title>
        <meta name="description" content="Authentic Liberian products and marketplace for local businesses" />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Welcome to LibMarketplace</h2>
          <p className="text-xl md:text-2xl mb-8">Where Liberia Buys, Sells, and Connects</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100">
              🛍️ Start Shopping
            </button>
            <a href="/auth/register?type=seller" className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
              🏪 Become a Seller
            </a>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="container mx-auto px-4 py-8">
        <SearchComponent
          products={products}
          onFilteredProducts={handleFilteredProducts}
        />
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">🇱🇷 Featured Products</h2>
          <div className="text-sm text-gray-600">
            {totalItems} products available
          </div>
        </div>

        <SearchResults
          totalResults={filteredProducts.length}
          query={searchQuery}
          category={selectedCategory}
          className="mb-6"
        />

        <ProductGrid
          products={currentProducts}
          variant="default"
          columns={3}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              pageSize={6}
              totalItems={totalItems}
              showInfo={true}
            />
          </div>
        )}
      </section>
    </Layout>
  )
}
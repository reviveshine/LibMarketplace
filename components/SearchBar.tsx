import { useState } from 'react'
import { SearchFilters } from '../types'

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = "Search for products..." }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
    rating: undefined,
    inStock: false,
    sortBy: 'newest',
    sortOrder: 'desc'
  })

  const handleSearch = () => {
    onSearch(query, filters)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'textiles', label: 'Textiles & Clothing' },
    { value: 'food', label: 'Food & Beverages' },
    { value: 'crafts', label: 'Arts & Crafts' },
    { value: 'jewelry', label: 'Jewelry & Accessories' },
    { value: 'music', label: 'Music & Instruments' },
    { value: 'health', label: 'Health & Beauty' }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 px-4 py-3 focus:outline-none text-lg"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-3 bg-gray-100 hover:bg-gray-200 transition-colors border-l"
          title="Filters"
        >
          🔍 Filters
        </button>
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-liberian-blue text-white hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-4 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Filter Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="w-full input-field"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Price ($)
              </label>
              <input
                type="number"
                value={filters.minPrice || ''}
                onChange={(e) => setFilters({...filters, minPrice: e.target.value ? Number(e.target.value) : undefined})}
                className="w-full input-field"
                placeholder="0"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Price ($)
              </label>
              <input
                type="number"
                value={filters.maxPrice || ''}
                onChange={(e) => setFilters({...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined})}
                className="w-full input-field"
                placeholder="1000"
                min="0"
              />
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})}
                className="w-full input-field"
              >
                <option value="newest">Newest First</option>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          <div className="flex items-center mt-4 space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters({...filters, inStock: e.target.checked})}
                className="mr-2"
              />
              In Stock Only
            </label>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-700">Rating:</span>
              {[5, 4, 3, 2, 1].map(rating => (
                <button
                  key={rating}
                  onClick={() => setFilters({...filters, rating: filters.rating === rating ? undefined : rating})}
                  className={`px-3 py-1 rounded text-sm ${
                    filters.rating === rating 
                      ? 'bg-yellow-400 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {rating}⭐+
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => {
                setFilters({
                  category: '',
                  minPrice: undefined,
                  maxPrice: undefined,
                  rating: undefined,
                  inStock: false,
                  sortBy: 'newest',
                  sortOrder: 'desc'
                })
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
            <button
              onClick={handleSearch}
              className="btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
import React, { useState, useCallback, useEffect } from 'react'
import { Product } from '../contexts/AppContext'

interface SearchFilters {
  query: string
  category: string
  minPrice: number
  maxPrice: number
  inStock: boolean
  sortBy: 'name' | 'price' | 'newest' | 'popular'
  sortOrder: 'asc' | 'desc'
}

interface SearchComponentProps {
  products: Product[]
  onFilteredProducts: (filtered: Product[]) => void
  className?: string
}

const CATEGORIES = [
  'All Categories',
  'Textiles',
  'Food',
  'Crafts',
  'Agriculture',
  'Jewelry',
  'Art',
  'Clothing',
  'Electronics',
  'Books',
  'Health & Beauty'
]

export default function SearchComponent({ 
  products, 
  onFilteredProducts, 
  className = '' 
}: SearchComponentProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: 'All Categories',
    minPrice: 0,
    maxPrice: 1000,
    inStock: false,
    sortBy: 'name',
    sortOrder: 'asc'
  })
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Debounced search function
  const debouncedFilter = useCallback(
    debounce((currentFilters: SearchFilters) => {
      let filtered = [...products]

      // Text search
      if (currentFilters.query.trim()) {
        const query = currentFilters.query.toLowerCase()
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query)
        )
      }

      // Category filter
      if (currentFilters.category !== 'All Categories') {
        filtered = filtered.filter(product =>
          product.category === currentFilters.category
        )
      }

      // Price range filter
      filtered = filtered.filter(product =>
        product.price >= currentFilters.minPrice &&
        product.price <= currentFilters.maxPrice
      )

      // Stock filter
      if (currentFilters.inStock) {
        filtered = filtered.filter(product => product.stock > 0)
      }

      // Sorting
      filtered.sort((a, b) => {
        let comparison = 0
        
        switch (currentFilters.sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name)
            break
          case 'price':
            comparison = a.price - b.price
            break
          case 'newest':
            // Assuming newer products have higher IDs
            comparison = b.id - a.id
            break
          case 'popular':
            // Mock popularity based on lower stock (more sold)
            comparison = a.stock - b.stock
            break
        }

        return currentFilters.sortOrder === 'desc' ? -comparison : comparison
      })

      onFilteredProducts(filtered)
    }, 300),
    [products, onFilteredProducts]
  )

  // Effect to filter products when filters change
  useEffect(() => {
    debouncedFilter(filters)
  }, [filters, debouncedFilter])

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      query: '',
      category: 'All Categories',
      minPrice: 0,
      maxPrice: 1000,
      inStock: false,
      sortBy: 'name',
      sortOrder: 'asc'
    })
  }

  const activeFiltersCount = [
    filters.query.trim() !== '',
    filters.category !== 'All Categories',
    filters.minPrice > 0 || filters.maxPrice < 1000,
    filters.inStock
  ].filter(Boolean).length

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Search Bar */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search products, categories, or descriptions..."
          value={filters.query}
          onChange={(e) => handleFilterChange('query', e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        {filters.query && (
          <button
            onClick={() => handleFilterChange('query', '')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          {CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-')
            handleFilterChange('sortBy', sortBy)
            handleFilterChange('sortOrder', sortOrder)
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price-asc">Price Low-High</option>
          <option value="price-desc">Price High-Low</option>
          <option value="newest-desc">Newest First</option>
          <option value="popular-asc">Most Popular</option>
        </select>

        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`px-3 py-2 border rounded-lg flex items-center ${
            showAdvancedFilters 
              ? 'border-blue-500 text-blue-600 bg-blue-50' 
              : 'border-gray-300 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <i className="fas fa-filter mr-2"></i>
          Advanced
          {activeFiltersCount > 0 && (
            <span className="ml-2 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-red-600 hover:text-red-800 flex items-center"
          >
            <i className="fas fa-times mr-2"></i>
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range: ${filters.minPrice} - ${filters.maxPrice}
            </label>
            <div className="flex space-x-4">
              <input
                type="number"
                placeholder="Min Price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', Number(e.target.value) || 0)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                placeholder="Max Price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value) || 1000)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center">
            <input
              id="inStock"
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => handleFilterChange('inStock', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="inStock" className="ml-2 text-sm text-gray-700">
              Only show items in stock
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Search Results Summary Component
interface SearchResultsProps {
  totalResults: number
  query: string
  category: string
  className?: string
}

export function SearchResults({ 
  totalResults, 
  query, 
  category, 
  className = '' 
}: SearchResultsProps) {
  return (
    <div className={`flex items-center justify-between mb-6 ${className}`}>
      <div>
        <p className="text-gray-600">
          {totalResults === 0 ? (
            'No products found'
          ) : (
            <>
              <span className="font-semibold">{totalResults}</span>
              {' '}product{totalResults !== 1 ? 's' : ''} found
              {query && <span> for "<span className="font-medium">{query}</span>"</span>}
              {category !== 'All Categories' && (
                <span> in <span className="font-medium">{category}</span></span>
              )}
            </>
          )}
        </p>
      </div>
    </div>
  )
}
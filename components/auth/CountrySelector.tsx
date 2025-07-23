import React, { useState, useRef, useEffect } from 'react'
import { CountryData, getSortedCountries, getCountryByCode, searchCountries } from '../../lib/country-codes'
import { UserType } from '../../lib/phone-validation'

interface CountrySelectorProps {
  value: string
  onChange: (countryCode: string) => void
  userType: UserType
  disabled?: boolean
  className?: string
}

export default function CountrySelector({ 
  value, 
  onChange, 
  userType, 
  disabled = false,
  className = '' 
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredCountries, setFilteredCountries] = useState<CountryData[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  // Get available countries based on user type
  const getAvailableCountries = (): CountryData[] => {
    const allCountries = getSortedCountries()
    
    if (userType === 'seller') {
      // Sellers can only use Liberian numbers
      return allCountries.filter(country => country.code === 'LR')
    }
    
    return allCountries
  }

  const availableCountries = getAvailableCountries()
  const selectedCountry = getCountryByCode(value as any)

  useEffect(() => {
    if (searchQuery) {
      setFilteredCountries(searchCountries(searchQuery).filter(country =>
        availableCountries.some(available => available.code === country.code)
      ))
    } else {
      setFilteredCountries(availableCountries)
    }
  }, [searchQuery, availableCountries])

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    // Focus search input when dropdown opens
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const handleCountrySelect = (country: CountryData) => {
    onChange(country.code)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          flex items-center justify-between w-full px-3 py-2 border rounded-md
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'}
          ${isOpen ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-300'}
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
        `}
      >
        <div className="flex items-center space-x-2">
          {selectedCountry ? (
            <>
              <span className="text-lg">{selectedCountry.flag}</span>
              <span className="text-sm text-gray-700">{selectedCountry.dialCode}</span>
            </>
          ) : (
            <span className="text-gray-500 text-sm">Select country</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
          {/* Search input for non-seller users */}
          {userType !== 'seller' && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Seller restriction message */}
          {userType === 'seller' && (
            <div className="p-3 bg-blue-50 border-b border-blue-200">
              <p className="text-xs text-blue-800 font-medium">
                📍 Sellers must use Liberian phone numbers for business verification
              </p>
            </div>
          )}

          {/* Countries list */}
          <div className="max-h-48 overflow-y-auto">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100
                    ${selectedCountry?.code === country.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
                  `}
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{country.name}</div>
                    <div className="text-xs text-gray-500">{country.dialCode}</div>
                  </div>
                  {selectedCountry?.code === country.code && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500 text-sm">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
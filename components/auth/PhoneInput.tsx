import React, { useState, useEffect } from 'react'
import { CountryCode } from 'libphonenumber-js'
import CountrySelector from './CountrySelector'
import { 
  validatePhoneInput, 
  formatPhoneNumber, 
  UserType,
  detectLiberianCarrier 
} from '../../lib/phone-validation'
import { getCountryByCode } from '../../lib/country-codes'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  userType: UserType
  selectedCountry?: CountryCode
  onCountryChange?: (countryCode: CountryCode) => void
  disabled?: boolean
  required?: boolean
  className?: string
  placeholder?: string
  name?: string
  id?: string
}

export default function PhoneInput({
  value,
  onChange,
  userType,
  selectedCountry = 'LR',
  onCountryChange,
  disabled = false,
  required = false,
  className = '',
  placeholder,
  name = 'phone',
  id = 'phone'
}: PhoneInputProps) {
  const [currentCountry, setCurrentCountry] = useState<CountryCode>(selectedCountry)
  const [validation, setValidation] = useState<{ isValid: boolean; error?: string; suggestion?: string }>({ isValid: false })
  const [showValidation, setShowValidation] = useState(false)
  const [carrier, setCarrier] = useState<string | undefined>()

  // Auto-set Liberia for sellers
  useEffect(() => {
    if (userType === 'seller' && currentCountry !== 'LR') {
      setCurrentCountry('LR')
      onCountryChange?.('LR')
    }
  }, [userType, currentCountry]) // Removed onCountryChange from dependencies

  // Validate phone number as user types
  useEffect(() => {
    if (value) {
      const result = validatePhoneInput(value, userType, currentCountry)
      setValidation(result)
      
      // Detect carrier for Liberian numbers
      if (userType === 'seller' && currentCountry === 'LR' && result.isValid) {
        const detectedCarrier = detectLiberianCarrier(value)
        setCarrier(detectedCarrier)
      } else {
        setCarrier(undefined)
      }
    } else {
      setValidation({ isValid: false })
      setCarrier(undefined)
    }
  }, [value, userType, currentCountry])

  const handleCountryChange = (countryCode: string) => {
    const newCountry = countryCode as CountryCode
    setCurrentCountry(newCountry)
    onCountryChange?.(newCountry)
    
    // Clear phone input when changing countries to avoid format confusion
    if (value) {
      onChange('')
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    
    // Show validation after user starts typing
    if (newValue && !showValidation) {
      setShowValidation(true)
    }
  }

  const handleBlur = () => {
    setShowValidation(true)
  }

  const getPlaceholder = (): string => {
    if (placeholder) return placeholder
    
    const country = getCountryByCode(currentCountry)
    if (!country) return 'Enter phone number'
    
    if (userType === 'seller' && currentCountry === 'LR') {
      return 'XX XXX XXXX'
    }
    
    // Generic international format
    return 'Phone number'
  }

  const showError = showValidation && validation.error
  const showSuccess = showValidation && validation.isValid && value.length > 0

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex space-x-2">
        {/* Country Selector */}
        <div className="w-32">
          <CountrySelector
            value={currentCountry}
            onChange={handleCountryChange}
            userType={userType}
            disabled={disabled || (userType === 'seller')}
          />
        </div>
        
        {/* Phone Number Input */}
        <div className="flex-1 relative">
          <input
            id={id}
            name={name}
            type="tel"
            value={value}
            onChange={handlePhoneChange}
            onBlur={handleBlur}
            disabled={disabled}
            required={required}
            placeholder={getPlaceholder()}
            className={`
              w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1
              ${showError ? 'border-red-500 focus:ring-red-500' : 
                showSuccess ? 'border-green-500 focus:ring-green-500' : 
                'border-gray-300 focus:ring-blue-500 focus:border-blue-500'}
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            `}
          />
          
          {/* Validation Icons */}
          {showValidation && value && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {validation.isValid ? (
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User type specific messages */}
      {userType === 'seller' && (
        <div className="bg-blue-50 border border-blue-200 rounded p-3">
          <div className="flex items-start space-x-2">
            <span className="text-blue-600 mt-0.5">ℹ️</span>
            <div className="text-sm text-blue-800">
              <p className="font-medium">Seller Phone Requirements:</p>
              <ul className="mt-1 space-y-1 text-xs">
                <li>• Must be a valid Liberian phone number (+231)</li>
                <li>• Required for business verification</li>
                <li>• SMS verification mandatory</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Validation Messages */}
      {showError && (
        <div className="flex items-start space-x-2 text-red-600 text-sm">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p>{validation.error}</p>
            {validation.suggestion && (
              <p className="text-xs text-gray-500 mt-1">{validation.suggestion}</p>
            )}
          </div>
        </div>
      )}

      {/* Success Message with Carrier Info */}
      {showSuccess && (
        <div className="flex items-start space-x-2 text-green-600 text-sm">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <div>
            <p>Valid phone number</p>
            {carrier && (
              <p className="text-xs text-gray-600 mt-1">
                Carrier: {carrier}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Format Helper */}
      {value && validation.isValid && (
        <div className="text-xs text-gray-500">
          International format: {formatPhoneNumber(value, currentCountry)}
        </div>
      )}
    </div>
  )
}
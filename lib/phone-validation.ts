import { parsePhoneNumber, isValidPhoneNumber, CountryCode } from 'libphonenumber-js'

export interface PhoneValidationResult {
  isValid: boolean
  countryCode?: string
  nationalNumber?: string
  internationalFormat?: string
  error?: string
}

export type UserType = 'buyer' | 'seller' | 'admin'

/**
 * Validates a phone number based on user type restrictions
 */
export function validatePhoneNumber(
  phoneNumber: string,
  userType: UserType,
  countryCode?: CountryCode
): PhoneValidationResult {
  try {
    // Parse the phone number
    const parsed = parsePhoneNumber(phoneNumber, countryCode)
    
    if (!parsed) {
      return {
        isValid: false,
        error: 'Invalid phone number format'
      }
    }

    // Check if the phone number is valid
    if (!parsed.isValid()) {
      return {
        isValid: false,
        error: 'Invalid phone number'
      }
    }

    // User type specific validation
    if (userType === 'seller') {
      // Sellers must use Liberian phone numbers (+231)
      if (parsed.country !== 'LR') {
        return {
          isValid: false,
          error: 'Sellers must use a Liberian phone number (+231)'
        }
      }
    }

    return {
      isValid: true,
      countryCode: parsed.country,
      nationalNumber: parsed.nationalNumber,
      internationalFormat: parsed.formatInternational()
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid phone number format'
    }
  }
}

/**
 * Formats a phone number for display
 */
export function formatPhoneNumber(phoneNumber: string, countryCode?: CountryCode): string {
  try {
    const parsed = parsePhoneNumber(phoneNumber, countryCode)
    return parsed?.formatInternational() || phoneNumber
  } catch {
    return phoneNumber
  }
}

/**
 * Checks if a phone number is a valid Liberian number
 */
export function isLiberianPhoneNumber(phoneNumber: string): boolean {
  try {
    const parsed = parsePhoneNumber(phoneNumber)
    return parsed?.country === 'LR' && parsed.isValid()
  } catch {
    return false
  }
}

/**
 * Gets the country code from a phone number
 */
export function getCountryFromPhoneNumber(phoneNumber: string): string | undefined {
  try {
    const parsed = parsePhoneNumber(phoneNumber)
    return parsed?.country
  } catch {
    return undefined
  }
}

/**
 * Validates phone number format in real-time as user types
 */
export function validatePhoneInput(
  input: string,
  userType: UserType,
  selectedCountry?: CountryCode
): { isValid: boolean; error?: string; suggestion?: string } {
  if (!input || input.length < 3) {
    return { isValid: false }
  }

  // Basic format validation
  if (!/^[\+]?[0-9\-\(\)\s]+$/.test(input)) {
    return {
      isValid: false,
      error: 'Phone number can only contain numbers, spaces, hyphens, and parentheses'
    }
  }

  const validation = validatePhoneNumber(input, userType, selectedCountry)
  
  if (!validation.isValid && validation.error) {
    return {
      isValid: false,
      error: validation.error,
      suggestion: userType === 'seller' ? 'Example: +231 77 123 4567' : 'Example: +1 555 123 4567'
    }
  }

  return { isValid: validation.isValid }
}

/**
 * Gets supported carriers for Liberian phone numbers
 */
export function getLiberianCarriers(): string[] {
  return ['MTN Liberia', 'Lonestar Cell', 'Orange Liberia']
}

/**
 * Detects the carrier for a Liberian phone number (basic implementation)
 */
export function detectLiberianCarrier(phoneNumber: string): string | undefined {
  try {
    const parsed = parsePhoneNumber(phoneNumber)
    if (parsed?.country !== 'LR') return undefined
    
    const nationalNumber = parsed.nationalNumber
    
    // Basic carrier detection based on number prefixes (this would need real carrier data)
    if (nationalNumber.startsWith('77') || nationalNumber.startsWith('88')) {
      return 'MTN Liberia'
    } else if (nationalNumber.startsWith('55') || nationalNumber.startsWith('66')) {
      return 'Lonestar Cell'
    } else if (nationalNumber.startsWith('44')) {
      return 'Orange Liberia'
    }
    
    return 'Unknown Carrier'
  } catch {
    return undefined
  }
}
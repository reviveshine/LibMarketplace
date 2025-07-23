import { NextApiRequest, NextApiResponse } from 'next'
import { isLiberianPhoneNumber, detectLiberianCarrier } from '../../../lib/phone-validation'

interface ValidateSellerRequest {
  email: string
  phone: string
  businessName: string
  businessType: string
  taxId?: string
}

interface ValidateSellerResponse {
  success: boolean
  message: string
  validationDetails?: {
    phoneValid: boolean
    carrierInfo?: string
    businessNameAvailable?: boolean
    requiresManualReview: boolean
  }
  error?: string
}

// Mock business registry service
class BusinessRegistryService {
  static async checkBusinessName(name: string): Promise<{ available: boolean; similar?: string[] }> {
    // Mock implementation - in production, integrate with Liberian business registry
    console.log(`Checking business name availability: ${name}`)
    
    // Simulate some unavailable names
    const unavailableNames = ['test business', 'sample store', 'demo shop']
    const isAvailable = !unavailableNames.some(unavailable => 
      name.toLowerCase().includes(unavailable.toLowerCase())
    )
    
    return {
      available: isAvailable,
      similar: isAvailable ? undefined : ['Test Business Ltd', 'Sample Store LLC']
    }
  }
  
  static async validateTaxId(taxId: string): Promise<{ valid: boolean; details?: string }> {
    // Mock tax ID validation
    console.log(`Validating tax ID: ${taxId}`)
    
    // Basic format check (Liberian tax IDs are typically numeric)
    const isValidFormat = /^\d{8,12}$/.test(taxId.replace(/\D/g, ''))
    
    return {
      valid: isValidFormat,
      details: isValidFormat ? 'Tax ID format valid' : 'Invalid tax ID format'
    }
  }
}

// Risk assessment for manual review
function assessSellerRisk(data: ValidateSellerRequest): boolean {
  const riskFactors = []
  
  // Check for suspicious business names
  const suspiciousKeywords = ['test', 'fake', 'sample', 'demo', 'placeholder']
  if (suspiciousKeywords.some(keyword => 
    data.businessName.toLowerCase().includes(keyword)
  )) {
    riskFactors.push('Suspicious business name')
  }
  
  // Check for incomplete information
  if (!data.taxId || data.taxId.length < 5) {
    riskFactors.push('Missing or incomplete tax information')
  }
  
  // Check email domain
  const emailDomain = data.email.split('@')[1]?.toLowerCase()
  const freeEmailProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
  if (freeEmailProviders.includes(emailDomain)) {
    riskFactors.push('Using free email provider')
  }
  
  console.log(`Risk factors for ${data.email}:`, riskFactors)
  
  // Require manual review if 2 or more risk factors
  return riskFactors.length >= 2
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ValidateSellerResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
  }

  try {
    const { email, phone, businessName, businessType, taxId }: ValidateSellerRequest = req.body

    // Validate required fields
    if (!email || !phone || !businessName || !businessType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, phone, businessName, businessType'
      })
    }

    // Validate Liberian phone number requirement
    if (!isLiberianPhoneNumber(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Sellers must provide a valid Liberian phone number (+231)',
        error: 'INVALID_LIBERIAN_PHONE'
      })
    }

    // Get carrier information
    const carrierInfo = detectLiberianCarrier(phone)
    
    // Check business name availability
    const businessCheck = await BusinessRegistryService.checkBusinessName(businessName)
    
    // Validate tax ID if provided
    let taxIdValidation = { valid: true, details: 'No tax ID provided' }
    if (taxId) {
      taxIdValidation = await BusinessRegistryService.validateTaxId(taxId)
    }

    // Assess if manual review is required
    const requiresManualReview = assessSellerRisk({ email, phone, businessName, businessType, taxId })

    // Prepare validation details
    const validationDetails = {
      phoneValid: true,
      carrierInfo: carrierInfo || 'Unknown carrier',
      businessNameAvailable: businessCheck.available,
      requiresManualReview,
      taxIdValid: taxIdValidation.valid,
      taxIdDetails: taxIdValidation.details
    }

    // Check for blocking issues
    if (!businessCheck.available) {
      return res.status(400).json({
        success: false,
        message: `Business name "${businessName}" is not available`,
        validationDetails,
        error: 'BUSINESS_NAME_UNAVAILABLE'
      })
    }

    if (taxId && !taxIdValidation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tax ID format',
        validationDetails,
        error: 'INVALID_TAX_ID'
      })
    }

    // Success response
    let message = 'Seller validation completed successfully'
    if (requiresManualReview) {
      message += '. Application will require manual review before approval.'
    }

    res.status(200).json({
      success: true,
      message,
      validationDetails
    })

  } catch (error) {
    console.error('Seller validation error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}
import { NextApiRequest, NextApiResponse } from 'next'
import { validatePhoneNumber, UserType } from '../../../lib/phone-validation'
import { CountryCode } from 'libphonenumber-js'

interface VerifyPhoneRequest {
  email: string
  phone: string
  userType: UserType
  countryCode?: CountryCode
}

interface VerifyPhoneResponse {
  success: boolean
  message: string
  verificationId?: string
  error?: string
}

// Mock SMS service - in production, integrate with Twilio or local providers
class SMSService {
  static async sendSMS(phone: string, message: string, isLiberian: boolean = false): Promise<{ success: boolean; id?: string; error?: string }> {
    // Mock implementation
    console.log(`Sending SMS to ${phone}: ${message}`)
    
    // Simulate SMS provider selection based on phone number
    const provider = isLiberian ? 'Local Liberian Provider' : 'Twilio International'
    console.log(`Using provider: ${provider}`)
    
    // Mock success/failure
    const success = Math.random() > 0.1 // 90% success rate
    
    if (success) {
      return {
        success: true,
        id: `sms_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      }
    } else {
      return {
        success: false,
        error: 'SMS delivery failed. Please try again.'
      }
    }
  }
}

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string, maxAttempts: number = 3, windowMinutes: number = 15): boolean {
  const now = Date.now()
  const key = identifier
  const existing = rateLimitStore.get(key)
  
  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + (windowMinutes * 60 * 1000) })
    return true
  }
  
  if (existing.count >= maxAttempts) {
    return false
  }
  
  existing.count++
  return true
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<VerifyPhoneResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
  }

  try {
    const { email, phone, userType, countryCode }: VerifyPhoneRequest = req.body

    // Validate required fields
    if (!email || !phone || !userType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, phone, userType'
      })
    }

    // Rate limiting by email and phone
    const emailKey = `email:${email}`
    const phoneKey = `phone:${phone}`
    
    if (!checkRateLimit(emailKey, 5, 15) || !checkRateLimit(phoneKey, 3, 15)) {
      return res.status(429).json({
        success: false,
        message: 'Too many verification attempts. Please try again later.'
      })
    }

    // Validate phone number based on user type
    const validation = validatePhoneNumber(phone, userType, countryCode)
    
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.error || 'Invalid phone number'
      })
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Prepare SMS message
    const smsMessage = `LibMarketplace verification code: ${verificationCode}. Valid for 10 minutes. Do not share this code.`
    
    // Determine if this is a Liberian number for provider selection
    const isLiberian = validation.countryCode === 'LR'
    
    // Send SMS
    const smsResult = await SMSService.sendSMS(
      validation.internationalFormat || phone,
      smsMessage,
      isLiberian
    )
    
    if (!smsResult.success) {
      return res.status(500).json({
        success: false,
        message: smsResult.error || 'Failed to send verification SMS'
      })
    }

    // Store verification data (in production, use database with TTL)
    // For now, we'll just return success
    console.log(`Verification code for ${email} (${phone}): ${verificationCode}`)
    
    // Success response
    res.status(200).json({
      success: true,
      message: `Verification code sent to ${validation.internationalFormat}`,
      verificationId: smsResult.id
    })

  } catch (error) {
    console.error('Phone verification error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}
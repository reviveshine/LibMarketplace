import { NextApiRequest, NextApiResponse } from 'next';
import { 
  validateVerificationParams, 
  getRedirectUrl,
  formatLiberianPhone,
  checkRateLimit 
} from '../../../lib/verification';
import verificationStore from '../../../lib/verificationStore';

interface VerifyCodeRequest {
  email?: string;
  phone?: string;
  code: string;
  type?: 'buyer' | 'seller' | 'admin';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, phone, code, type }: VerifyCodeRequest = req.body;

    // Validate input parameters
    const validation = validateVerificationParams({ email, phone, code, type });
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.errors 
      });
    }

    // Determine the target for verification
    let target = '';
    if (email) {
      target = email;
    } else if (phone) {
      target = formatLiberianPhone(phone);
    } else {
      return res.status(400).json({ 
        error: 'Email or phone number required' 
      });
    }

    // Check rate limiting for verification attempts
    const clientId = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    if (!checkRateLimit(`verify-${clientId}-${target}`, 10, 900000)) { // 10 attempts per 15 minutes
      return res.status(429).json({ 
        error: 'Too many verification attempts. Please try again later.' 
      });
    }

    // Check if verification code exists
    const storedData = verificationStore.get(target);
    if (!storedData) {
      return res.status(404).json({ 
        error: 'No verification code found. Please request a new code.' 
      });
    }

    // Check if code has expired
    if (Date.now() > storedData.expires) {
      verificationStore.delete(target);
      return res.status(410).json({ 
        error: 'Verification code has expired. Please request a new code.' 
      });
    }

    // Check attempt limit
    if (storedData.attempts >= 3) {
      verificationStore.delete(target);
      return res.status(429).json({ 
        error: 'Too many failed attempts. Please request a new verification code.' 
      });
    }

    // Verify the code
    if (storedData.code !== code) {
      storedData.attempts++;
      return res.status(400).json({ 
        error: 'Invalid verification code',
        attemptsRemaining: 3 - storedData.attempts
      });
    }

    // Code is valid - remove from store
    verificationStore.delete(target);

    // Determine redirect URL based on user type
    const redirectUrl = getRedirectUrl(type || 'buyer');

    // In a real application, you would:
    // 1. Mark the user as verified in the database
    // 2. Update user status
    // 3. Send welcome email
    // 4. Log the verification event

    res.status(200).json({ 
      success: true, 
      message: 'Verification successful',
      verified: {
        email: email || null,
        phone: phone ? formatLiberianPhone(phone) : null,
        type: type || 'buyer'
      },
      redirectUrl
    });

  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}
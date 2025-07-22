import { NextApiRequest, NextApiResponse } from 'next';
import { 
  validateVerificationParams, 
  generateVerificationCode, 
  sendVerificationEmail, 
  sendVerificationSMS, 
  sendWhatsAppVerification,
  checkRateLimit,
  formatLiberianPhone 
} from '../../../lib/verification';

interface SendVerificationRequest {
  email?: string;
  phone?: string;
  method: 'email' | 'sms' | 'whatsapp';
  type?: 'buyer' | 'seller' | 'admin';
}

// In-memory store for verification codes (replace with database in production)
const verificationStore = new Map<string, { code: string; expires: number; attempts: number }>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, phone, method, type }: SendVerificationRequest = req.body;

    // Validate input parameters
    const validation = validateVerificationParams({ email, phone, type });
    if (!validation.isValid) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: validation.errors 
      });
    }

    // Determine the target for verification
    let target = '';
    if (method === 'email' && email) {
      target = email;
    } else if ((method === 'sms' || method === 'whatsapp') && phone) {
      target = formatLiberianPhone(phone);
    } else {
      return res.status(400).json({ 
        error: 'Missing target for verification method' 
      });
    }

    // Check rate limiting
    const clientId = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    if (!checkRateLimit(`${clientId}-${target}`, 5, 900000)) { // 5 attempts per 15 minutes
      return res.status(429).json({ 
        error: 'Too many verification attempts. Please try again later.' 
      });
    }

    // Generate verification code
    const code = generateVerificationCode();
    const expires = Date.now() + 600000; // 10 minutes

    // Store verification code
    verificationStore.set(target, { code, expires, attempts: 0 });

    // Send verification based on method
    let success = false;
    switch (method) {
      case 'email':
        success = await sendVerificationEmail(email!, code);
        break;
      case 'sms':
        success = await sendVerificationSMS(target, code);
        break;
      case 'whatsapp':
        success = await sendWhatsAppVerification(target, code);
        break;
    }

    if (!success) {
      return res.status(500).json({ 
        error: 'Failed to send verification code' 
      });
    }

    res.status(200).json({ 
      success: true, 
      message: `Verification code sent via ${method}`,
      target: method === 'email' ? email : target,
      expiresIn: 600 // seconds
    });

  } catch (error) {
    console.error('Send verification error:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}
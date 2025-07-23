// Verification utility functions for LibMarketplace
export interface VerificationData {
  email?: string;
  phone?: string;
  type?: 'buyer' | 'seller' | 'admin';
  code?: string;
}

export interface VerificationResult {
  success: boolean;
  message: string;
  redirectUrl?: string;
}

// Liberian phone number validation
export const validateLiberianPhone = (phone: string): boolean => {
  // Support +231 format and local format
  // Liberian phone numbers are typically 8 digits after country code
  const liberianPhoneRegex = /^(\+231|231|0)[0-9]{8}$/;
  return liberianPhoneRegex.test(phone.replace(/[\s-()]/g, ''));
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Format Liberian phone number to international format
export const formatLiberianPhone = (phone: string): string => {
  const cleaned = phone.replace(/\s+/g, '').replace(/[()-]/g, '');
  if (cleaned.startsWith('+231')) return cleaned;
  if (cleaned.startsWith('231')) return '+' + cleaned;
  if (cleaned.startsWith('0')) return '+231' + cleaned.substring(1);
  return '+231' + cleaned;
};

// Generate 6-digit verification code
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Get redirect URL based on user type
export const getRedirectUrl = (userType: string): string => {
  switch (userType) {
    case 'buyer':
      return '/buyer/dashboard';
    case 'seller':
      return '/seller/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
};

// Validation for verification parameters
export const validateVerificationParams = (params: VerificationData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (params.email && !validateEmail(params.email)) {
    errors.push('Invalid email format');
  }
  
  if (params.phone && !validateLiberianPhone(params.phone)) {
    errors.push('Invalid Liberian phone number format');
  }
  
  if (params.type && !['buyer', 'seller', 'admin'].includes(params.type)) {
    errors.push('Invalid user type');
  }
  
  if (params.code && (params.code.length !== 6 || !/^\d{6}$/.test(params.code))) {
    errors.push('Verification code must be 6 digits');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Simulate sending verification email (to be replaced with actual email service)
export const sendVerificationEmail = async (email: string, code: string): Promise<boolean> => {
  // Mock implementation - replace with actual email service
  console.log(`Sending verification email to ${email} with code: ${code}`);
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000);
  });
};

// Simulate sending verification SMS (to be replaced with actual SMS service)
export const sendVerificationSMS = async (phone: string, code: string): Promise<boolean> => {
  // Mock implementation - replace with actual SMS service
  console.log(`Sending verification SMS to ${phone} with code: ${code}`);
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000);
  });
};

// Simulate WhatsApp verification (Liberian market feature)
export const sendWhatsAppVerification = async (phone: string, code: string): Promise<boolean> => {
  // Mock implementation - replace with actual WhatsApp API
  console.log(`Sending WhatsApp verification to ${phone} with code: ${code}`);
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000);
  });
};

// Rate limiting check (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export const checkRateLimit = (identifier: string, maxAttempts: number = 5, windowMs: number = 900000): boolean => {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  
  if (!entry || now - entry.lastReset > windowMs) {
    rateLimitMap.set(identifier, { count: 1, lastReset: now });
    return true;
  }
  
  if (entry.count >= maxAttempts) {
    return false;
  }
  
  entry.count++;
  return true;
};
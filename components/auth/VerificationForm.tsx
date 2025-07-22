import { useState, useEffect } from 'react';
import { validateEmail, validateLiberianPhone, formatLiberianPhone } from '../../lib/verification';

interface VerificationFormProps {
  email?: string;
  phone?: string;
  userType?: 'buyer' | 'seller' | 'admin';
  onSuccess: (data: { email?: string; phone?: string; type: string }) => void;
  onError: (error: string) => void;
}

interface VerificationStep {
  step: 'input' | 'verify-email' | 'verify-phone' | 'verify-both';
  emailSent: boolean;
  phoneSent: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
}

export default function VerificationForm({ 
  email: initialEmail, 
  phone: initialPhone, 
  userType = 'buyer',
  onSuccess, 
  onError 
}: VerificationFormProps) {
  const [email, setEmail] = useState(initialEmail || '');
  const [phone, setPhone] = useState(initialPhone || '');
  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  
  const [verificationStep, setVerificationStep] = useState<VerificationStep>({
    step: 'input',
    emailSent: false,
    phoneSent: false,
    emailVerified: false,
    phoneVerified: false
  });

  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
    emailCode?: string;
    phoneCode?: string;
    general?: string;
  }>({});

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Real-time validation
  const validateInputs = () => {
    const newErrors: typeof errors = {};
    
    if (email && !validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (phone && !validateLiberianPhone(phone)) {
      newErrors.phone = 'Please enter a valid Liberian phone number (+231)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendVerificationCode = async (method: 'email' | 'sms' | 'whatsapp', target?: string) => {
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: method === 'email' ? email : undefined,
          phone: method !== 'email' ? (target || phone) : undefined,
          method,
          type: userType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setResendCooldown(60); // 1 minute cooldown
      
      if (method === 'email') {
        setVerificationStep(prev => ({ ...prev, emailSent: true }));
      } else {
        setVerificationStep(prev => ({ ...prev, phoneSent: true }));
      }

    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (method: 'email' | 'phone') => {
    setLoading(true);
    setErrors({});

    const code = method === 'email' ? emailCode : phoneCode;

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: method === 'email' ? email : undefined,
          phone: method === 'phone' ? phone : undefined,
          code,
          type: userType
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Verification failed');
      }

      if (method === 'email') {
        setVerificationStep(prev => ({ ...prev, emailVerified: true }));
        setEmailCode('');
      } else {
        setVerificationStep(prev => ({ ...prev, phoneVerified: true }));
        setPhoneCode('');
      }

      // Check if all required verifications are complete
      const { emailVerified, phoneVerified } = verificationStep;
      const allEmailVerified = !email || emailVerified || method === 'email';
      const allPhoneVerified = !phone || phoneVerified || method === 'phone';

      if (allEmailVerified && allPhoneVerified) {
        onSuccess({
          email: email || undefined,
          phone: phone ? formatLiberianPhone(phone) : undefined,
          type: userType
        });
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Verification failed';
      if (method === 'email') {
        setErrors(prev => ({ ...prev, emailCode: errorMessage }));
      } else {
        setErrors(prev => ({ ...prev, phoneCode: errorMessage }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInitialSubmit = () => {
    if (!validateInputs()) return;
    
    if (!email && !phone) {
      setErrors({ general: 'Please provide at least an email or phone number' });
      return;
    }

    // Determine verification step
    if (email && phone) {
      setVerificationStep(prev => ({ ...prev, step: 'verify-both' }));
      sendVerificationCode('email');
      sendVerificationCode('sms');
    } else if (email) {
      setVerificationStep(prev => ({ ...prev, step: 'verify-email' }));
      sendVerificationCode('email');
    } else if (phone) {
      setVerificationStep(prev => ({ ...prev, step: 'verify-phone' }));
      sendVerificationCode('sms');
    }
  };

  // Input step
  if (verificationStep.step === 'input') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Account Verification
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Verify your email and/or phone number to continue
          </p>
        </div>

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errors.general}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateInputs}
              className={`input-field mt-1 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number (Liberian)
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={validateInputs}
              className={`input-field mt-1 ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="+231 XX XXX XXXX"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Format: +231XXXXXXXX or 0XXXXXXXX
            </p>
          </div>

          <button
            onClick={handleInitialSubmit}
            disabled={loading || (!email && !phone)}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Sending Codes...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane mr-2"></i>
                Send Verification Codes
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Verification steps
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">📱</div>
        <h2 className="text-3xl font-extrabold text-gray-900">
          Enter Verification Codes
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We sent verification codes to your provided contact methods
        </p>
      </div>

      {/* Email verification */}
      {email && verificationStep.emailSent && !verificationStep.emailVerified && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-medium text-gray-900 mb-3">📧 Email Verification</h3>
          <p className="text-sm text-gray-600 mb-3">
            Enter the code sent to <span className="font-medium">{email}</span>
          </p>
          
          <div className="space-y-3">
            <input
              type="text"
              maxLength={6}
              value={emailCode}
              onChange={(e) => setEmailCode(e.target.value)}
              className="input-field text-center text-2xl tracking-widest"
              placeholder="000000"
            />
            {errors.emailCode && (
              <p className="text-red-500 text-xs">{errors.emailCode}</p>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={() => verifyCode('email')}
                disabled={loading || emailCode.length !== 6}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                Verify Email
              </button>
              <button
                onClick={() => sendVerificationCode('email')}
                disabled={resendCooldown > 0 || loading}
                className="btn-secondary"
              >
                {resendCooldown > 0 ? `${resendCooldown}s` : 'Resend'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phone verification */}
      {phone && verificationStep.phoneSent && !verificationStep.phoneVerified && (
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="font-medium text-gray-900 mb-3">📱 Phone Verification</h3>
          <p className="text-sm text-gray-600 mb-3">
            Enter the code sent to <span className="font-medium">{formatLiberianPhone(phone)}</span>
          </p>
          
          <div className="space-y-3">
            <input
              type="text"
              maxLength={6}
              value={phoneCode}
              onChange={(e) => setPhoneCode(e.target.value)}
              className="input-field text-center text-2xl tracking-widest"
              placeholder="000000"
            />
            {errors.phoneCode && (
              <p className="text-red-500 text-xs">{errors.phoneCode}</p>
            )}
            
            <div className="flex space-x-2">
              <button
                onClick={() => verifyCode('phone')}
                disabled={loading || phoneCode.length !== 6}
                className="flex-1 btn-primary disabled:opacity-50"
              >
                Verify Phone
              </button>
              <button
                onClick={() => sendVerificationCode('sms')}
                disabled={resendCooldown > 0 || loading}
                className="btn-secondary"
              >
                {resendCooldown > 0 ? `${resendCooldown}s` : 'Resend'}
              </button>
              <button
                onClick={() => sendVerificationCode('whatsapp')}
                disabled={resendCooldown > 0 || loading}
                className="btn-success"
                title="Send via WhatsApp"
              >
                📱
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success indicators */}
      {verificationStep.emailVerified && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ Email verified successfully!
        </div>
      )}

      {verificationStep.phoneVerified && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          ✅ Phone verified successfully!
        </div>
      )}
    </div>
  );
}
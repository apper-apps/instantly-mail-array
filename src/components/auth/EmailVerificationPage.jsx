import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';

const EmailVerificationPage = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  
  const { verifyEmail, resendVerification } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setVerificationCode(value);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }
    
    setLoading(true);
    const result = await verifyEmail(email, verificationCode);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Invalid verification code');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResendLoading(true);
    const result = await resendVerification(email);
    
    if (result.success) {
      setCountdown(60);
      setError('');
    } else {
      setError(result.message || 'Failed to resend verification email');
    }
    setResendLoading(false);
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center mx-auto mb-4"
            >
              <ApperIcon name="Mail" className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600 mb-4">
              We've sent a 6-digit verification code to:
            </p>
            <p className="text-primary-600 font-medium break-all">{email}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-error-50 border border-error-200 rounded-lg p-3"
              >
                <div className="flex items-center">
                  <ApperIcon name="AlertCircle" className="w-4 h-4 text-error-600 mr-2" />
                  <span className="text-sm text-error-700">{error}</span>
                </div>
              </motion.div>
            )}

            <div>
              <Input
                label="Verification Code"
                type="text"
                value={verificationCode}
                onChange={handleChange}
                placeholder="Enter 6-digit code"
                icon="Key"
                className="text-center text-lg font-mono tracking-widest"
                maxLength={6}
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={loading}
              disabled={loading || verificationCode.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </Button>
          </form>

          {/* Resend */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">Didn't receive the code?</p>
            <Button
              variant="ghost"
              onClick={handleResend}
              loading={resendLoading}
              disabled={resendLoading || countdown > 0}
            >
              {countdown > 0 
                ? `Resend in ${countdown}s`
                : resendLoading 
                  ? 'Sending...' 
                  : 'Resend Code'
              }
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Wrong email?{' '}
              <button 
                onClick={() => navigate('/signup')}
                className="text-primary-600 hover:text-primary-500 font-medium transition-colors"
              >
                Go back to signup
              </button>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
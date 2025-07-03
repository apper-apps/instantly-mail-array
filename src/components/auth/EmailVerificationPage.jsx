import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import { emailVerificationService } from '@/services/api/emailVerificationService';

const EmailVerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const email = searchParams.get('email') || '';

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      toast.error('Please enter the verification code');
      return;
    }

    setLoading(true);
    try {
      await emailVerificationService.verifyEmail(email, verificationCode);
      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error('Email address is required');
      return;
    }

    setResendLoading(true);
    try {
      await emailVerificationService.resendVerificationCode(email);
      toast.success('Verification code sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600">
            We've sent a verification code to
          </p>
          <p className="text-primary-600 font-medium">{email}</p>
        </div>

        <form onSubmit={handleVerifyEmail} className="space-y-4">
          <div>
            <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
              Verification Code
            </label>
            <Input
              id="verificationCode"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength="6"
              className="text-center text-lg tracking-wider"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !verificationCode.trim()}
            loading={loading}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>

        <div className="text-center space-y-4">
          <div className="text-sm text-gray-600">
            Didn't receive the code?{' '}
            <button
              onClick={handleResendCode}
              disabled={resendLoading}
              className="text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmailVerificationPage;
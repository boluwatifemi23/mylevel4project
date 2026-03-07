'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle } from 'lucide-react';
import Input from '../shared/Input';
import Button from '../shared/Button';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const loadingToast = toast.loading('Sending reset link...');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error(data.error || 'Something went wrong');
        return;
      }

      toast.success('Check your email for reset instructions! 📧');
      setSuccess(true);
    } catch {
      toast.dismiss(loadingToast);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

 
  if (success) {
    return (
      <div className="text-center">

        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Check Your Email
        </h3>

        <p className="text-gray-600 mb-6">
          If an account exists with <strong>{email}</strong>, we have sent password reset instructions.
        </p>

        <a
          href="/login"
          className="text-pink-600 font-semibold hover:underline"
        >
          Back to Login
        </a>
      </div>
    );
  }

  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <p className="text-gray-600 text-sm mb-4">
        Enter your email address and we will send you a link to reset your password.
      </p>

      <Input
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Send Reset Link
      </Button>

      <p className="text-center text-sm text-gray-600">
        Remember your password?{' '}
        <a href="/login" className="text-pink-600 font-semibold hover:underline">
          Login
        </a>
      </p>

    </form>
  );
}

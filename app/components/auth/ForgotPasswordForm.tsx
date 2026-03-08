'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react';

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

      toast.success('Reset link sent! 📧');
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
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Check your inbox</h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          We sent a reset link to <span className="font-semibold text-gray-700">{email}</span>.
          Check your spam folder if you do not see it.
        </p>
        <a
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-pink-600 font-semibold hover:text-pink-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </a>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Forgot password?</h1>
        <p className="text-gray-500 text-sm mt-1">
          Enter your email and we will send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition bg-gray-50 focus:bg-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-linear-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <p className="text-center text-sm text-gray-500">
          Remember your password?{' '}
          <a href="/login" className="text-pink-600 font-semibold hover:text-pink-700">
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '../shared/Input';
import Button from '../shared/Button';


export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Resetting password...');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      toast.dismiss(loadingToast);

      if (!res.ok) {
        toast.error(data.error || 'Something went wrong');
        return;
      }

      toast.success('Password reset successful! ✅');

      setTimeout(() => {
        router.push('/login');
      }, 1000);
    } catch {
      toast.dismiss(loadingToast);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <Input
        label="New Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Reset Password
      </Button>
    </form>
  );
}

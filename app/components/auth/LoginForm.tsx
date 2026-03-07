'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '../shared/Input';
import Button from '../shared/Button';


export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const loadingToast = toast.loading('Logging in...');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.dismiss(loadingToast);
        toast.error(data.error || 'Login failed');
        setErrors({ general: data.error });
        return;
      }

      toast.dismiss(loadingToast);
      toast.success(`Welcome back, ${data.user.profile.displayName}! 👋`);

      setTimeout(() => {
        router.push('/feed');
        router.refresh();
      }, 500);

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error('Something went wrong. Please try again.');
      setErrors({ general: 'Something went wrong. Please try again.' });

    } finally {
      setIsLoading(false);
    }
  };

 
  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <Input
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="you@example.com"
        error={errors.email}
        required
      />

      <Input
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="••••••••"
        error={errors.password}
        required
      />

      <div className="text-right">
        <a
          href="/forgot-password"
          className="text-sm text-pink-600 hover:underline"
        >
          Forgot password?
        </a>
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Login
      </Button>

      <p className="text-center text-sm text-gray-600">
        Don not have an account?{' '}
        <a href="/signup" className="text-pink-600 font-semibold hover:underline">
          Sign Up
        </a>
      </p>
    </form>
  );
}


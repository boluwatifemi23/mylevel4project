'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Input from '../shared/Input';
import Button from '../shared/Button';

export default function SignupForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: '',
    profileType: 'parent' as 'parent' | 'expert' | 'brand',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    
    const loadingToast = toast.loading('Creating your account...');

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.dismiss(loadingToast);
        if (data.error) {
          toast.error(data.error);
          setErrors({ general: data.error });
        }
        return;
      }

     
      toast.dismiss(loadingToast);
      toast.success('Welcome to CirclaNest! 🎉');

     
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
        label="Username"
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        placeholder="johndoe"
        error={errors.username}
        required
      />

      <Input
        label="Display Name"
        name="displayName"
        type="text"
        value={formData.displayName}
        onChange={handleChange}
        placeholder="John Doe"
        error={errors.displayName}
        required
      />

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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2"
           htmlFor="profileType">
          I am a...
        </label>
        <select
        id="profileType"
          name="profileType"
          value={formData.profileType}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
        >
          <option value="parent">Parent</option>
          <option value="expert">Expert/Professional</option>
          <option value="brand">Brand</option>
        </select>
      </div>

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-pink-600 font-semibold hover:underline">
          Login
        </a>
      </p>
    </form>
  );
}
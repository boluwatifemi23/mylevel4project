import { Suspense } from 'react';
import ResetPasswordForm from '@/app/components/auth/ResetPasswordForm';
import AuthLayout from '@/app/components/auth/AuthLayout';

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className="text-center py-8 text-gray-400 text-sm">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  );
}
import ForgotPasswordForm from '@/app/components/auth/ForgotPasswordForm';
import AuthLayout from '@/app/components/auth/AuthLayout';

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
import LoginForm from '@/app/components/auth/LoginForm';
import AuthLayout from '@/app/components/auth/AuthLayout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
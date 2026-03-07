
import ResetPasswordForm from '@/app/components/auth/ResetPasswordForm';
import { Baby } from 'lucide-react';

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-linear-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Baby className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">Enter your new password</p>
        </div>

        <ResetPasswordForm/>
      </div>
    </div>
  );
}

import SignupForm from '@/app/components/auth/SignupForm';
import { Baby } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
        
       
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-linear-to-br from-pink-400 to-purple-400 flex items-center justify-center mx-auto mb-4">
            <Baby className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join ParentCircle
          </h1>

          <p className="text-gray-600">
            Create your account to get started
          </p>
        </div>

        
        <SignupForm/>

        
        <p className="mt-6 text-xs text-center text-gray-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>

      </div>
    </div>
  );
}

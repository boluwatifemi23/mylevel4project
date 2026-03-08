import { Baby } from 'lucide-react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-linear-to-r from-pink-50 via-white to-purple-50 flex flex-col items-center justify-center p-4">
      
      <Link href="/" className="flex items-center gap-2 mb-6">
        <div className="w-9 h-9 bg-linear-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
          <Baby className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-extrabold bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
          ParentCircle
        </span>
      </Link>

     
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md p-8">
        {children}
      </div>

     
      <p className="text-xs text-gray-400 mt-6 text-center">
        © {new Date().getFullYear()} ParentCircle · 
        <a href="#" className="hover:text-pink-500 ml-1">Privacy</a> · 
        <a href="#" className="hover:text-pink-500 ml-1">Terms</a>
      </p>
    </div>
  );
}
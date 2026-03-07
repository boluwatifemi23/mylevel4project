import { Baby } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid md:grid-cols-4 gap-8">

          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-pink-400 to-purple-400 flex items-center justify-center font-bold">
               <div className="w-10 h-10 bg-linear-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                <Baby className="w-6 h-6 text-white" />
              </div>
              </div>
              <span className="text-xl font-bold">ParentCircle</span>
            </div>
            <p className="text-gray-400 text-sm">
              Connect, share, and grow through parenthood.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="#features" className="hover:text-white">Features</Link></li>
              <li><a className="hover:text-white">Pricing</a></li>
              <li><a className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a className="hover:text-white">About</a></li>
              <li><a className="hover:text-white">Blog</a></li>
              <li><a className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a className="hover:text-white">Privacy</a></li>
              <li><a className="hover:text-white">Terms</a></li>
            </ul>
          </div>

        </div>

        <div className="text-center text-sm text-gray-500 mt-10 border-t border-gray-800 pt-6">
          © {new Date().getFullYear()} ParentCircle. All rights reserved.
        </div>

      </div>
    </footer>
  );
}

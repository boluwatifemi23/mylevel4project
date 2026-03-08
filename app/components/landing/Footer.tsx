import { Baby, Instagram, Twitter, Facebook } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          
          <div className="col-span-2 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-linear-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">ParentCircle</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Connect, share, and grow through every stage of parenthood.
            </p>
            <div className="flex gap-3 mt-5">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-gray-400 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="#features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
            </ul>
          </div>

          
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-gray-400 mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-widest text-gray-400 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} ParentCircle. All rights reserved.
          </p>
          <p className="text-gray-600 text-sm">
            Made with ❤️ for parents everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
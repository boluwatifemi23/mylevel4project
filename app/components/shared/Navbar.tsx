'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Baby, Bell, Menu, X, Search, Home,
  User, LogOut, Settings, LayoutDashboard
} from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Button from '../shared/Button';

interface NavbarProps {
  user?: {
    id: string;
    username: string;
    email?: string;
    profile: {
      displayName: string;
      profileImage?: string;
      bio?: string;
      location?: string;
    };
    stats?: {
      followers: number;
      following: number;
      posts: number;
    };
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    const loadingToast = toast.loading('Logging out...');
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success('Logged out successfully!');
        router.push('/');
        router.refresh();
      }
    } catch {
      toast.dismiss(loadingToast);
      toast.error('Failed to logout');
    }
  };

  const navLinks = [
    { label: 'Feed', icon: Home, href: '/feed' },
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            
            <button
              onClick={() => router.push(user ? '/feed' : '/')}
              className="flex items-center gap-2 shrink-0"
            >
              <div className="w-9 h-9 bg-linear-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent tracking-tight">
                ParentCircle
              </span>
            </button>

            
            {user && (
              <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm mx-6">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search parents, posts..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition"
                  />
                </div>
              </div>
            )}

            
            {user ? (
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => router.push(link.href)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </button>
                ))}

                <button
                  className="relative p-2 rounded-xl text-gray-600 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-pink-500 rounded-full" />
                </button>

               
                <div className="relative ml-1">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Profile menu"
                  >
                    <div className="w-8 h-8 bg-linear-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center overflow-hidden ring-2 ring-white">
                      {user.profile.profileImage ? (
                        <Image
                          src={user.profile.profileImage}
                          alt={user.profile.displayName}
                          width={32}
                          height={32}
                          className="rounded-full object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-white text-sm font-bold">
                          {user.profile.displayName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user.profile.displayName.split(' ')[0]}
                    </span>
                  </button>

                  {showProfileMenu && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowProfileMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-gray-100 bg-linear-to-br from-pink-50 to-purple-50">
                          <p className="font-semibold text-gray-900 text-sm">
                            {user.profile.displayName}
                          </p>
                          <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>

                        <div className="p-1.5">
                          <button
                            onClick={() => { router.push(`/profile/${user.username}`); setShowProfileMenu(false); }}
                            className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-xl transition flex items-center gap-2.5 text-sm text-gray-700"
                          >
                            <User className="w-4 h-4 text-gray-400" />
                            View Profile
                          </button>
                          <button
                            onClick={() => { router.push('/dashboard'); setShowProfileMenu(false); }}
                            className="w-full text-left px-3 py-2.5 hover:bg-gray-50 rounded-xl transition flex items-center gap-2.5 text-sm text-gray-700"
                          >
                            <Settings className="w-4 h-4 text-gray-400" />
                            Settings
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-3 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition flex items-center gap-2.5 text-sm"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <button
                  onClick={() => router.push('/login')}
                  className="text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Login
                </button>
                <Button onClick={() => router.push('/signup')}>
                  Get Started Free
                </Button>
              </div>
            )}

            
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {showMobileMenu
                ? <X className="w-5 h-5 text-gray-700" />
                : <Menu className="w-5 h-5 text-gray-700" />
              }
            </button>
          </div>
        </div>
      </nav>

      
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 md:hidden">
          
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          />

          
          <div className="absolute top-0 right-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-linear-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Baby className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">ParentCircle</span>
              </div>
              <button
              title='o'
                onClick={() => setShowMobileMenu(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {user ? (
                <>
                  
                  <div className="flex items-center gap-3 p-3 bg-linear-to-br from-pink-50 to-purple-50 rounded-2xl mb-4">
                    <div className="w-11 h-11 bg-linear-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                      {user.profile.profileImage ? (
                        <Image
                          src={user.profile.profileImage}
                          alt={user.profile.displayName}
                          width={44}
                          height={44}
                          className="rounded-full object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-white font-bold">
                          {user.profile.displayName.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{user.profile.displayName}</p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                  </div>

                  
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400"
                    />
                  </div>

                  
                  <div className="space-y-1">
                    {[
                      { label: 'Feed', icon: Home, href: '/feed' },
                      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
                      { label: 'Profile', icon: User, href: `/profile/${user.username}` },
                      { label: 'Settings', icon: Settings, href: '/dashboard' },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => { router.push(item.href); setShowMobileMenu(false); }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors text-sm font-medium"
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 mt-4 pt-4">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-3 mt-2">
                  <Button
                    onClick={() => { router.push('/signup'); setShowMobileMenu(false); }}
                    className="w-full"
                  >
                    Get Started Free
                  </Button>
                  <button
                    onClick={() => { router.push('/login'); setShowMobileMenu(false); }}
                    className="w-full py-3 text-center text-sm font-medium text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    Already have an account? Login
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
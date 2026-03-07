"use client";

import { useState} from "react";
import { useRouter } from "next/navigation";
import { Baby, Bell, Menu, X, Search, Home, User, LogOut } from "lucide-react";
import Button from "./Button";
import toast from "react-hot-toast";
import Image from "next/image";

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
      kids?: {
        name: string;
        birthYear: number;
        gender: string;
      }[];
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
    const loadingToast = toast.loading("Logging out...");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success("Logged out successfully!");
        router.push("/");
        router.refresh();
      }
    } catch{
      toast.dismiss(loadingToast);
      toast.error("Failed to logout");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push(user ? "/feed" : "/")}
          >
            <div className="w-10 h-10 bg-linear-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
              <Baby className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              ParentCircle
            </span>
          </div>

          
          {user ? (
            <div className="hidden md:flex items-center space-x-6">
              
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-500 w-64"
                />
              </div>

              
              <button
                onClick={() => router.push("/feed")}
                className="text-gray-600 hover:text-pink-500 transition flex items-center"
              >
                <Home className="w-5 h-5 mr-1" />
                Feed
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-600 hover:text-pink-500 transition"
              >
                Dashboard
              </button>

              <button className="relative">
                <Bell className="w-5 h-5 text-gray-600 hover:text-pink-500" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  3
                </span>
              </button>

              
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2"
                >
                  <div className="w-10 h-10 bg-linear-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center">
                    {user.profile.profileImage ? (
                      <Image
                        src={user.profile.profileImage}
                        alt={user.profile.displayName}
                        width={40}
                        height={40}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold">
                        {user.profile.displayName.charAt(0)}
                      </span>
                    )}
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-semibold text-gray-800">
                        {user.profile.displayName}
                      </p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => router.push(`/profile/${user.username}`)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg transition flex items-center"
                      >
                        <User className="w-4 h-4 mr-2" />
                        View Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => router.push("/login")}
                className="text-gray-600 hover:text-pink-500 transition"
              >
                Login
              </button>
              <Button onClick={() => router.push("/signup")}>
                Get Started Free
              </Button>
            </div>
          )}

          
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2"
          >
            {showMobileMenu ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        
        {showMobileMenu && (
          <div className="md:hidden py-4 space-y-4">
            {user ? (
              <>
                <button
                  onClick={() => router.push("/feed")}
                  className="block w-full text-left text-gray-600 hover:text-pink-500"
                >
                  Feed
                </button>
                <button
                  onClick={() => router.push("/dashboard")}
                  className="block w-full text-left text-gray-600 hover:text-pink-500"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => router.push(`/profile/${user.username}`)}
                  className="block w-full text-left text-gray-600 hover:text-pink-500"
                >
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="block w-full text-left text-gray-600 hover:text-pink-500"
                >
                  Login
                </button>
                <Button
                  onClick={() => router.push("/signup")}
                  className="w-full"
                >
                  Get Started Free
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

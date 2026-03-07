'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader, Plus } from 'lucide-react';
import AddBabyModal from '@/app/components/dashboard/AddBabyModal';
import toast from 'react-hot-toast';

interface BabyType {
  _id: string;
  name: string;
  birthDate: string;
  photo?: string;
  gender: string;
  ageMonths: number;
}

interface UserType {
  profile: {
    displayName: string;
  };
}

export default function DashboardPage() {
  const [showAddBaby, setShowAddBaby] = useState(false);
  const [babies, setBabies] = useState<BabyType[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const fetchBabies = async () => {
    try {
      const res = await fetch('/api/babies');
      if (res.ok) {
        const data = await res.json();
        
        const babiesWithAge = (data.babies || []).map((baby: BabyType) => {
          const birthDate = new Date(baby.birthDate);
          const now = new Date();
          const ageMonths = Math.floor(
            (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
          );
          return {
            ...baby,
            ageMonths,
          };
        });
        
        setBabies(babiesWithAge);
      }
    } catch (error) {
      console.error('Failed to fetch babies:', error);
      toast.error('Failed to load baby profiles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchBabies();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome, {user?.profile.displayName || 'Parent'}! 👋
        </h1>
        <Link
          href="/feed"
          className="px-6 py-3 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition"
        >
          Go to Feed
        </Link>
      </div>

      {babies.length === 0 ? (
        <div className="bg-linear-to-r from-pink-50 to-purple-50 rounded-3xl p-12 text-center">
          <div className="w-20 h-20 bg-linear-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">👶</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Add Your First Baby
          </h2>
          <p className="text-gray-600 mb-6">
            Start tracking your baby beautiful journey today
          </p>
          <button
            onClick={() => setShowAddBaby(true)}
            className="inline-flex items-center gap-2 bg-linear-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Add Baby Profile
          </button>
        </div>
      ) : (
        <>

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Your Babies</h2>
            <button
              onClick={() => setShowAddBaby(true)}
              className="inline-flex items-center gap-2 bg-linear-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition"
            >
              <Plus className="w-5 h-5" />
              Add Another Baby
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {babies.map((baby) => (
              <div
                key={baby._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-linear-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center overflow-hidden">
                    {baby.photo ? (
                      <Image
                        src={baby.photo}
                        alt={baby.name}
                        width={64}
                        height={64}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl">
                        {baby.gender === 'male' ? '👦' : baby.gender === 'female' ? '👧' : '👶'}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {baby.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {baby.ageMonths} month{baby.ageMonths !== 1 ? 's' : ''} old
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                    <span className="text-sm text-gray-700">Latest Milestone</span>
                    <span className="text-sm font-semibold text-green-700">
                      Sitting up!
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                    <span className="text-sm text-gray-700">Next Checkup</span>
                    <span className="text-sm font-semibold text-blue-700">
                      In 5 days
                    </span>
                  </div>
                </div>

                <Link
                  href={`/babies/${baby._id}`}
                  className="block w-full mt-4 bg-linear-to-r from-pink-500 to-purple-600 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition text-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </>
      )}

      
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📝</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Posts</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎉</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Milestones</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Connections</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </div>
      </div>

      <AddBabyModal
        isOpen={showAddBaby}
        onClose={() => setShowAddBaby(false)}
        onSuccess={() => {
          fetchBabies();
          setShowAddBaby(false);
        }}
      />
    </div>
  );
}

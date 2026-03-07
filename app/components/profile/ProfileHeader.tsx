'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MapPin, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import FollowButton from './FollowButton';
import UserStats from './UserStats';
import EditProfileModal from './EditProfileModal';
import { useRouter } from 'next/navigation';

interface ProfileHeaderProps {
  user: {
    id: string;
    username: string;
    profile: {
      displayName: string;
      bio?: string;
      profileImage?: string;
      location?: string;
    };
    stats: {
      followers: number;
      following: number;
      posts: number;
    };
    createdAt: string;
  };
  isOwnProfile: boolean;
  currentUserId?: string;
}

export default function ProfileHeader({
  user,
  isOwnProfile,
  currentUserId,
}: ProfileHeaderProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  const handleUpdate = () => {
    router.refresh();
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Cover Image */}
        <div className="h-48 bg-linear-to-r from-pink-400 via-purple-400 to-blue-400 relative">
          {isOwnProfile && (
            <button
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-white transition"
            >
              Change Cover
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-16 mb-4">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-linear-to-br from-pink-400 to-purple-400 flex items-center justify-center">
                {user.profile.profileImage ? (
                  <Image
                    src={user.profile.profileImage}
                    alt={user.profile.displayName}
                    width={128}
                    height={128}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {user.profile.displayName.charAt(0)}
                  </span>
                )}
              </div>
            </div>

            {/* Follow/Edit Button */}
            {!isOwnProfile && currentUserId && (
              <FollowButton userId={user.id} />
            )}
            {isOwnProfile && (
              <button
                onClick={() => setShowEditModal(true)}
                className="px-6 py-2 border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="space-y-3">
            {/* Name & Username */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.profile.displayName}
              </h1>
              <p className="text-gray-500">@{user.username}</p>
            </div>

            {/* Bio */}
            {user.profile.bio && (
              <p className="text-gray-700">{user.profile.bio}</p>
            )}

            {/* Location + Joined Date */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              {user.profile.location && (
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{user.profile.location}</span>
                </div>
              )}
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {format(new Date(user.createdAt), 'MMMM yyyy')}</span>
              </div>
            </div>

            <UserStats stats={user.stats} username={user.username} />
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onUpdate={handleUpdate}
      />
    </>
  );
}
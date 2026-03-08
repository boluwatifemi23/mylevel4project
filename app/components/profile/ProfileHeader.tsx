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

export default function ProfileHeader({ user, isOwnProfile, currentUserId }: ProfileHeaderProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const router = useRouter();

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="h-40 sm:h-52 bg-linear-to-r from-pink-400 via-purple-400 to-blue-400 relative">
          {isOwnProfile && (
            <button className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-700 text-sm px-3 py-1.5 rounded-full font-medium hover:bg-white transition shadow-sm">
              Change Cover
            </button>
          )}
        </div>

       
        <div className="px-4 sm:px-6 pb-5">
          <div className="flex items-end justify-between -mt-12 mb-4">
           
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white overflow-hidden bg-linear-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-md shrink-0">
              {user.profile.profileImage ? (
                <Image
                  src={user.profile.profileImage}
                  alt={user.profile.displayName}
                  width={112}
                  height={112}
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <span className="text-white text-3xl font-bold">
                  {user.profile.displayName.charAt(0)}
                </span>
              )}
            </div>

          
            <div className="mb-1">
              {!isOwnProfile && currentUserId ? (
                <FollowButton userId={user.id} />
              ) : isOwnProfile ? (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-5 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Edit Profile
                </button>
              ) : null}
            </div>
          </div>

       
          <div className="space-y-2">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">{user.profile.displayName}</h1>
              <p className="text-gray-500 text-sm">@{user.username}</p>
            </div>

            {user.profile.bio && (
              <p className="text-gray-700 text-sm leading-relaxed">{user.profile.bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
              {user.profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {user.profile.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Joined {format(new Date(user.createdAt), 'MMMM yyyy')}
              </span>
            </div>

            <UserStats stats={user.stats} username={user.username} />
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onUpdate={() => router.refresh()}
      />
    </>
  );
}
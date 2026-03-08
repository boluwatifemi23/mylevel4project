'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Post } from '@/app/types';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import {  Sparkles } from 'lucide-react';
// import Image from 'next/image';

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [userData, setUserData] = useState({ profileImage: '', displayName: 'User' });

  useEffect(() => { initialize(); }, []);

  const initialize = async () => {
    try {
      const [userResponse, postsResponse] = await Promise.all([
        fetch('/api/user/me', { credentials: 'include' }),
        fetch('/api/posts', { credentials: 'include' }),
      ]);
      if (userResponse.ok) {
        const d = await userResponse.json();
        setCurrentUserId(d.id);
        setUserData({ profileImage: d.profile?.profileImage || '', displayName: d.profile?.displayName || d.username || 'User' });
      }
      if (postsResponse.ok) {
        const d = await postsResponse.json();
        setPosts(d.posts || []);
      }
    } catch {
      toast.error('Failed to load feed');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts', { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch {
      toast.error('Failed to load posts');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-pink-500 to-purple-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <p className="text-gray-500 text-sm">Loading your feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">

       
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Your Feed
          </h1>
          <p className="text-gray-500 text-sm mt-1">Share your journey and connect with others</p>
        </div>

        
        <div className="mb-5">
          <CreatePost
            onPostCreated={fetchPosts}
            userProfileImage={userData.profileImage}
            userDisplayName={userData.displayName}
          />
        </div>

        
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="text-4xl mb-3">🎉</div>
              <p className="font-semibold text-gray-800 mb-1">No posts yet</p>
              <p className="text-gray-500 text-sm">Be the first to share something!</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={currentUserId}
                onUpdate={fetchPosts}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
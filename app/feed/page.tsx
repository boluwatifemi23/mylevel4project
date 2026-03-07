'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Post } from '@/app/types';
import CreatePost from '../components/feed/CreatePost';
import PostCard from '../components/feed/PostCard';
import { Loader } from 'lucide-react';

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [userData, setUserData] = useState({
    profileImage: '',
    displayName: 'User',
  });

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      // Fetch user data and posts in parallel
      const [userResponse, postsResponse] = await Promise.all([
        fetch('/api/user/me', { credentials: 'include' }),
        fetch('/api/posts', { credentials: 'include' })
      ]);

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setCurrentUserId(userData.id);
        setUserData({
          profileImage: userData.profile?.profileImage || '',
          displayName: userData.profile?.displayName || userData.username || 'User',
        });
      }

      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setPosts(postsData.posts || []);
      }
    } catch (error) {
      console.error('Failed to initialize feed:', error);
      toast.error('Failed to load feed');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-pink-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading feed...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Your Feed
        </h1>
        <p className="text-gray-600 mt-2">
          Share your journey and connect with others
        </p>
      </div>

      {/* Create Post */}
      <div className="mb-6">
        <CreatePost
          onPostCreated={fetchPosts}
          userProfileImage={userData.profileImage}
          userDisplayName={userData.displayName}
        />
      </div>

      {/* Posts */}
      <div className="space-y-6">
        {posts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500">
              No posts yet. Be the first to share something! 🎉
            </p>
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
  );
}
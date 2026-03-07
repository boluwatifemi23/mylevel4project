
'use client';

import { useState, useEffect } from 'react';
import PostCard from './PostCard';

import { Loader } from 'lucide-react';
import { Post } from '@/app/types';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
    try {
      const response = await fetch(`/api/posts?page=${page}&limit=10`);
      const data = await response.json();

      if (response.ok) {
        setPosts(prev => [...prev, ...data.posts]); 
        setHasMore(page < data.pagination.pages);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setIsLoading(false);
    }
  };
    fetchPosts();
  }, [page]);

  

  const loadMore = () => {
    setPage(page + 1);
  };

  if (isLoading && page === 1) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {hasMore && (
        <div className="flex justify-center py-6">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-full hover:shadow-lg transition"
          >
            Load More
          </button>
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="text-center text-gray-500 py-6">
          You have reached the end! 🎉
        </p>
      )}
    </div>
  );
}

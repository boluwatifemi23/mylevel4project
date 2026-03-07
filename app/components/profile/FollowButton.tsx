'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Button from '../shared/Button';

interface FollowButtonProps {
  userId: string;
}

export default function FollowButton({ userId }: FollowButtonProps) {
  const [following, setFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/follow-status`, {
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setFollowing(data.following);
      }
    } catch (error) {
      console.error('Failed to check follow status:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

    checkFollowStatus();
  }, [userId]);

  
  const handleFollow = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to follow/unfollow');
      }

      const data = await response.json();
      setFollowing(data.following);
      toast.success(
        data.following ? 'Following! 👥' : 'Unfollowed'
      );
    } catch{
      toast.error('Failed to follow/unfollow');
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingStatus) {
    return (
      <Button variant="secondary" disabled>
        Loading...
      </Button>
    );
  }

  return (
    <Button
      onClick={handleFollow}
      variant={following ? 'secondary' : 'primary'}
      isLoading={isLoading}
    >
      {following ? 'Following' : 'Follow'}
    </Button>
  );
}
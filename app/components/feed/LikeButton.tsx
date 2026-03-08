"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  initialLiked?: boolean;
  onLikeChange?: (newLikes: number, liked: boolean) => void;
}

export default function LikeButton({ postId, initialLikes, initialLiked = false, onLikeChange }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    setLiked(initialLiked);
    setLikes(initialLikes);
  }, [initialLiked, initialLikes]);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);

    
    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;
    setLiked(newLiked);
    setLikes(newLikes);

    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setLiked(data.liked);
      setLikes(data.likes);
      onLikeChange?.(data.likes, data.liked);
    } catch {
      // Revert
      setLiked(liked);
      setLikes(likes);
      toast.error("Failed to like post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-1.5 transition-colors ${
        liked ? "text-pink-500" : "text-gray-500 hover:text-pink-500"
      }`}
      aria-label={liked ? "Unlike post" : "Like post"}
    >
      <Heart className={`w-5 h-5 transition-transform active:scale-125 ${liked ? "fill-current" : ""}`} />
      <span className="text-sm font-medium">{likes}</span>
    </button>
  );
}
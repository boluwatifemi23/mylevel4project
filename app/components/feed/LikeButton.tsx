"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import toast from "react-hot-toast";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  onLikeChange?: (newLikes: number) => void;
}

export default function LikeButton({
  postId,
  initialLikes,
  onLikeChange,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
        credentials: "include", 
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
       const errText = await response.text();
    throw new Error(`Failed to like post: ${response.status} ${errText}`);
      }

      const data = await response.json();

      setLiked(data.liked);
      setLikes(data.likes);

      if (onLikeChange) {
        onLikeChange(data.likes);
      }
    } catch{
      toast.error("Failed to like post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center space-x-2 transition ${
        liked ? "text-red-500" : "text-gray-600 hover:text-red-500"
      }`}
    >
      <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
      <span>{likes}</span>
    </button>
  );
}

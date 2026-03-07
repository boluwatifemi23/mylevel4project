"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Share2, MoreVertical, Trash2, Edit, Globe, Users, Lock } from "lucide-react";
import CommentSection from "./CommentSection";
import { Post } from "@/app/types";
import toast from "react-hot-toast";

interface PostCardProps {
  post: Post;
  onUpdate?: () => void;
  currentUserId?: string;
}

export default function PostCard({ post, onUpdate, currentUserId }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [localLikes, setLocalLikes] = useState(post.engagement.likes);
  const [localComments, setLocalComments] = useState(post.engagement.comments);
  const [liked, setLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwnPost = currentUserId === post.authorId._id;

  const visibilityIcons = {
    public: Globe,
    followers: Users,
    private: Lock,
  };

  const VisibilityIcon = visibilityIcons[post.visibility as keyof typeof visibilityIcons] || Globe;

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    const previousLikes = localLikes;
    const previousLiked = liked;

    setLiked(!liked);
    setLocalLikes(liked ? localLikes - 1 : localLikes + 1);

    try {
      const response = await fetch(`/api/posts/${post._id}/like`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to like post");

      const data = await response.json();
      setLiked(data.liked);
      setLocalLikes(data.likes);
      
      if (onUpdate) onUpdate();
    } catch{
      setLiked(previousLiked);
      setLocalLikes(previousLikes);
      toast.error("Failed to like post");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    setIsDeleting(true);
    const deleteToast = toast.loading("Deleting post...");

    try {
      const response = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to delete post");

      toast.dismiss(deleteToast);
      toast.success("Post deleted successfully!");
      if (onUpdate) onUpdate();
    } catch{
      toast.dismiss(deleteToast);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Post by ${post.authorId.profile.displayName}`,
          text: post.content,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-linear-to-br from-pink-400 to-purple-400 rounded-full overflow-hidden flex items-center justify-center shrink-0">
            {post.authorId.profile.profileImage ? (
              <Image
                src={post.authorId.profile.profileImage}
                alt={post.authorId.profile.displayName}
                width={48}
                height={48}
                className="rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-lg">
                {post.authorId.profile.displayName.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {post.authorId.profile.displayName}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>@{post.authorId.username}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
              <span>•</span>
              <VisibilityIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
        
        {isOwnPost && (
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-400 hover:text-gray-600 transition p-2 rounded-full hover:bg-gray-100"
              aria-label="Post options"
              title="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    toast('Edit feature coming soon!', { icon: 'ℹ️' });
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Post</span>
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-50 text-red-600 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{isDeleting ? "Deleting..." : "Delete Post"}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      
      <div className="px-6 pb-4">
        <p className="text-gray-700 whitespace-pre-wrap wrap-break-word">
          {post.content}
        </p>
        {post.type === "milestone" && post.milestoneData && (
          <div className="mt-3 inline-block bg-linear-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full">
            <span className="text-sm font-semibold text-pink-600">
              🎉 Milestone: {post.milestoneData.category}
            </span>
          </div>
        )}
      </div>

     
      {post.images && post.images.length > 0 && (
        <div
          className={`grid gap-2 px-6 ${
            post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {post.images.map((image, index) => (
            <div key={index} className="relative w-full h-64">
              <Image
                src={image}
                alt={`Post image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      )}

     
      {post.videos && post.videos.length > 0 && (
        <div className="space-y-2 px-6 pb-4">
          {post.videos.map((video, index) => (
            <video
              key={index}
              src={video}
              controls
              preload="metadata"
              className="w-full max-h-96 bg-black rounded-lg"
            />
          ))}
        </div>
      )}

      
      <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-600">
        <button 
          type="button"
          onClick={handleLike}
          className="hover:underline"
          aria-label={`${localLikes} likes`}
        >
          {localLikes} {localLikes === 1 ? 'like' : 'likes'}
        </button>
        <button 
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="hover:underline"
          aria-label={`${localComments} comments`}
        >
          {localComments} {localComments === 1 ? 'comment' : 'comments'}
        </button>
      </div>

     
      <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-around">
        <button
          type="button"
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center space-x-2 transition px-4 py-2 rounded-lg ${
            liked 
              ? "text-red-500 bg-red-50" 
              : "text-gray-600 hover:bg-gray-100"
          }`}
          aria-label={liked ? "Unlike post" : "Like post"}
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
          <span>{liked ? "Unlike" : "Like"}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
          aria-label="Comment on post"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Comment</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="flex items-center space-x-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition"
          aria-label="Share post"
        >
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      
      {showComments && (
        <CommentSection
          postId={post._id}
          currentUserId={currentUserId}
          onCommentAdded={() => {
            setLocalComments(localComments + 1);
            if (onUpdate) onUpdate();
          }}
          onCommentDeleted={() => {
            setLocalComments(Math.max(0, localComments - 1));
            if (onUpdate) onUpdate();
          }}
        />
      )}
    </div>
  );
}
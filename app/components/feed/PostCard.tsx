"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import {
  Heart, MessageCircle, Share2, MoreVertical,
  Trash2, Edit, Globe, Users, Lock, X, AlertTriangle,
} from "lucide-react";
import CommentSection from "./CommentSection";
import FollowButton from "@/app/components/profile/FollowButton";
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isOwnPost = currentUserId === post.authorId._id;

  const visibilityIcons = { public: Globe, followers: Users, private: Lock };
  const VisibilityIcon = visibilityIcons[post.visibility as keyof typeof visibilityIcons] || Globe;

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    const prevLikes = localLikes;
    const prevLiked = liked;
    setLiked(!liked);
    setLocalLikes(liked ? localLikes - 1 : localLikes + 1);
    try {
      const res = await fetch(`/api/posts/${post._id}/like`, { method: "POST", credentials: "include" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLiked(data.liked);
      setLocalLikes(data.likes);
      onUpdate?.();
    } catch {
      setLiked(prevLiked);
      setLocalLikes(prevLikes);
      toast.error("Failed to like post");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    const t = toast.loading("Deleting post...");
    try {
      const res = await fetch(`/api/posts/${post._id}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error();
      toast.dismiss(t);
      toast.success("Post deleted");
      onUpdate?.();
    } catch {
      toast.dismiss(t);
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setShowMenu(false);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: `Post by ${post.authorId.profile.displayName}`, text: post.content, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied!");
      }
    } catch {  }
  };

  const images = post.images ?? [];
  const videos = post.videos ?? [];

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">

        
        <div className="p-4 flex items-center justify-between">

         
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 bg-linear-to-br from-pink-400 to-purple-500 rounded-full overflow-hidden flex items-center justify-center shrink-0 ring-2 ring-white shadow-sm">
              {post.authorId.profile.profileImage ? (
                <Image
                  src={post.authorId.profile.profileImage}
                  alt={post.authorId.profile.displayName}
                  width={40}
                  height={40}
                  className="rounded-full object-cover w-full h-full"
                />
              ) : (
                <span className="text-white font-bold text-sm">
                  {post.authorId.profile.displayName.charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm leading-tight truncate">
                {post.authorId.profile.displayName}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5 flex-wrap">
                <span>@{post.authorId.username}</span>
                <span>·</span>
                <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
                <span>·</span>
                <VisibilityIcon className="w-3 h-3" />
              </div>
            </div>
          </div>

         
          <div className="flex items-center gap-2 shrink-0 ml-2">
            {!isOwnPost && currentUserId && (
              <FollowButton userId={post.authorId._id} />
            )}

            {isOwnPost && (
              <div className="relative">
                <button
                title="o"
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1.5 rounded-full hover:bg-gray-100 transition text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                    <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 overflow-hidden">
                      <button
                        onClick={() => { setShowMenu(false); toast("Edit feature coming soon!", { icon: "ℹ️" }); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 text-gray-700 text-sm"
                      >
                        <Edit className="w-4 h-4 text-gray-400" />
                        Edit Post
                      </button>
                      <button
                        onClick={() => { setShowMenu(false); setShowDeleteModal(true); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-red-50 text-red-500 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Post
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

      
        {post.content && post.content.trim() && (
          <div className="px-4 pb-3">
            <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
            {post.type === "milestone" && post.milestoneData && (
              <div className="mt-2 inline-flex items-center gap-1.5 bg-linear-to-r from-pink-100 to-purple-100 px-3 py-1.5 rounded-full">
                <span className="text-xs font-semibold text-pink-600">
                  🎉 {post.milestoneData.category}
                </span>
              </div>
            )}
          </div>
        )}

       
        {images.length > 0 && (
          <div className={`grid gap-0.5 ${images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
            {images.map((image, i) => (
              <div key={i} className={`relative w-full bg-gray-50 ${images.length > 1 ? "h-56" : ""}`}>
                {images.length === 1 ? (
                  <Image
                    src={image}
                    alt={`Post image ${i + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain max-h-[500px]"
                  />
                ) : (
                  <Image
                    src={image}
                    alt={`Post image ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}

      
        {videos.length > 0 && (
          <div className="space-y-1">
            {videos.map((video, i) => (
              <video key={i} src={video} controls preload="metadata" className="w-full max-h-80 bg-black" />
            ))}
          </div>
        )}

       
        <div className="px-4 py-2 flex items-center justify-between text-xs text-gray-400 border-t border-gray-50">
          <button onClick={handleLike} className="hover:text-gray-600 transition">
            {localLikes} {localLikes === 1 ? "like" : "likes"}
          </button>
          <button onClick={() => setShowComments(!showComments)} className="hover:text-gray-600 transition">
            {localComments} {localComments === 1 ? "comment" : "comments"}
          </button>
        </div>

       
        <div className="px-2 py-1 border-t border-gray-50 grid grid-cols-3">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              liked ? "text-pink-500 bg-pink-50" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
            <span>{liked ? "Liked" : "Like"}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Comment</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        
        {showComments && (
          <CommentSection
            postId={post._id}
            currentUserId={currentUserId}
            onCommentAdded={() => { setLocalComments(c => c + 1); onUpdate?.(); }}
            onCommentDeleted={() => { setLocalComments(c => Math.max(0, c - 1)); onUpdate?.(); }}
          />
        )}
      </div>

      
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
            <button
            title="o"
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Post?</h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              This action cannot be undone. Your post will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
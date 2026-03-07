"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Send, Smile, Trash2, MoreVertical, X } from "lucide-react";
import toast from "react-hot-toast";
import { Comment } from "@/app/types";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface CommentSectionProps {
  postId: string;
  currentUserId?: string;
  onCommentAdded?: () => void;
  onCommentDeleted?: () => void;
}

interface EmojiData {
  native: string;
}

export default function CommentSection({
  postId,
  currentUserId,
  onCommentAdded,
  onCommentDeleted,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [menuCommentId, setMenuCommentId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchComments = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/comment`);
      const data: { comments: Comment[] } = await response.json();
      if (response.ok) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsFetching(false);
    }
  };

    fetchComments();
  }, [postId]);

  

  const handleEmojiSelect = (emoji: EmojiData) => {
    const cursorPosition = textareaRef.current?.selectionStart || newComment.length;
    const newContent = newComment.slice(0, cursorPosition) + emoji.native + newComment.slice(cursorPosition);
    setNewComment(newContent);
    setShowEmojiPicker(false);
    
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(cursorPosition + emoji.native.length, cursorPosition + emoji.native.length);
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const data: { comment: Comment } = await response.json();
      setComments((prev) => [data.comment, ...prev]);
      setNewComment("");
      onCommentAdded?.();
      toast.success("Comment added!");
    } catch{
      toast.error("Failed to add comment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setDeletingCommentId(commentId);
    try {
      const response = await fetch(`/api/posts/${postId}/comment/${commentId}`, {
        method: "DELETE",
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      setComments((prev) => prev.filter((c) => c._id !== commentId));
      onCommentDeleted?.();
      toast.success("Comment deleted!");
    } catch{
      toast.error("Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
      setMenuCommentId(null);
    }
  };

  return (
    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-3 mb-4 relative"
      >
        <label htmlFor="new-comment" className="sr-only">Write a comment</label>
        <textarea
          id="new-comment"
          ref={textareaRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          rows={1}
          aria-label="Write a comment"
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 120) + 'px';
          }}
        />
        
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="text-gray-600 hover:text-pink-500 p-2 rounded-full hover:bg-gray-100 transition"
          title="Add emoji"
          aria-label="Add emoji"
        >
          <Smile className="w-5 h-5" />
        </button>

        <button
          type="submit"
          disabled={!newComment.trim() || isLoading}
          className="bg-linear-to-r from-pink-500 to-purple-600 text-white p-2 rounded-full hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send comment"
          aria-label="Send comment"
        >
          <Send className="w-5 h-5" />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-full right-0 mb-2 z-50">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(false)}
                className="absolute -top-2 -right-2 bg-gray-800 text-white rounded-full p-1 z-10"
                aria-label="Close emoji picker"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
              <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
            </div>
          </div>
        )}
      </form>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {isFetching ? (
          <p className="text-gray-500 text-sm">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No comments yet. Be the first!
          </p>
        ) : (
          comments.map((comment: Comment) => {
            const isOwnComment = currentUserId === comment.authorId._id;
            
            return (
              <div key={comment._id} className="flex items-start space-x-3 group">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-linear-to-br from-pink-400 to-purple-400 shrink-0">
                  {comment.authorId.profile.profileImage ? (
                    <Image
                      src={comment.authorId.profile.profileImage}
                      alt={comment.authorId.profile.displayName}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {comment.authorId.profile.displayName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 bg-white rounded-2xl p-3 relative">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-gray-800">
                        {comment.authorId.profile.displayName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    
                    {isOwnComment && (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setMenuCommentId(menuCommentId === comment._id ? null : comment._id)}
                          className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition p-1 rounded-full hover:bg-gray-100"
                          aria-label="Comment options"
                          title="More options"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        
                        {menuCommentId === comment._id && (
                          <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">
                            <button
                              type="button"
                              onClick={() => handleDelete(comment._id)}
                              disabled={deletingCommentId === comment._id}
                              className="w-full flex items-center space-x-2 px-3 py-2 hover:bg-red-50 text-red-600 text-sm disabled:opacity-50"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>{deletingCommentId === comment._id ? "Deleting..." : "Delete"}</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-700 wrap-break-word whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
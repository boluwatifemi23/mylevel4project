"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { Send, Smile, Trash2, MoreVertical, X, AlertTriangle } from "lucide-react";
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

interface EmojiData { native: string }

export default function CommentSection({ postId, currentUserId, onCommentAdded, onCommentDeleted }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [menuCommentId, setMenuCommentId] = useState<string | null>(null);
  const [deleteModalCommentId, setDeleteModalCommentId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/comment`);
        const d: { comments: Comment[] } = await response.json();
        if (response.ok) setComments(d.comments);
      } catch { /* silent */ }
      finally { setIsFetching(false); }
    };
    fetchComments();
  }, [postId]);

  const handleEmojiSelect = (emoji: EmojiData) => {
    const pos = textareaRef.current?.selectionStart || newComment.length;
    setNewComment(newComment.slice(0, pos) + emoji.native + newComment.slice(pos));
    setShowEmojiPicker(false);
    setTimeout(() => {
      textareaRef.current?.focus();
      const np = pos + emoji.native.length;
      textareaRef.current?.setSelectionRange(np, np);
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      if (!res.ok) throw new Error();
      const d: { comment: Comment } = await res.json();
      setComments(prev => [d.comment, ...prev]);
      setNewComment("");
      onCommentAdded?.();
      toast.success("Comment added!");
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    setDeletingCommentId(commentId);
    try {
      const res = await fetch(`/api/posts/${postId}/comment/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      setComments(prev => prev.filter(c => c._id !== commentId));
      onCommentDeleted?.();
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    } finally {
      setDeletingCommentId(null);
      setDeleteModalCommentId(null);
      setMenuCommentId(null);
    }
  };

  return (
    <>
      <div className="px-4 py-4 border-t border-gray-50 bg-gray-50/50">
       
        <form onSubmit={handleSubmit} className="flex items-end gap-2 mb-4 relative">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={1}
              className="w-full px-3 py-2.5 pr-9 text-sm border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none bg-white"
              onInput={(e) => {
                const t = e.target as HTMLTextAreaElement;
                t.style.height = 'auto';
                t.style.height = Math.min(t.scrollHeight, 100) + 'px';
              }}
            />
            <button
            title="o"
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="absolute right-2.5 bottom-2.5 text-gray-400 hover:text-pink-500 transition"
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>
          <button
          title="o"
            type="submit"
            disabled={!newComment.trim() || isLoading}
            className="w-9 h-9 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center hover:shadow-md transition disabled:opacity-50 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-full right-0 mb-2 z-50">
              <div className="relative">
                <button
                title="o"
                  type="button"
                  onClick={() => setShowEmojiPicker(false)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center z-10"
                >
                  <X className="w-3 h-3" />
                </button>
                <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
              </div>
            </div>
          )}
        </form>

        
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {isFetching ? (
            <p className="text-gray-400 text-xs text-center py-2">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-400 text-xs text-center py-2">No comments yet. Be the first!</p>
          ) : (
            comments.map((comment) => {
              const isOwn = currentUserId === comment.authorId._id;
              return (
                <div key={comment._id} className="flex items-start gap-2 group">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-linear-to-br from-pink-400 to-purple-400 shrink-0 flex items-center justify-center">
                    {comment.authorId.profile.profileImage ? (
                      <Image src={comment.authorId.profile.profileImage} alt={comment.authorId.profile.displayName} width={28} height={28} className="rounded-full object-cover w-full h-full" />
                    ) : (
                      <span className="text-white text-xs font-bold">{comment.authorId.profile.displayName.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 bg-white rounded-2xl px-3 py-2 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-gray-900">{comment.authorId.profile.displayName}</span>
                        <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                      </div>
                      {isOwn && (
                        <div className="relative">
                          <button
                          title="o"
                            onClick={() => setMenuCommentId(menuCommentId === comment._id ? null : comment._id)}
                            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 opacity-0 group-hover:opacity-100 transition"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>
                          {menuCommentId === comment._id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setMenuCommentId(null)} />
                              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20">
                                <button
                                  onClick={() => { setMenuCommentId(null); setDeleteModalCommentId(comment._id); }}
                                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 text-red-500 text-xs"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-gray-700 mt-0.5 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      
      {deleteModalCommentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteModalCommentId(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 z-10">
            <button
            title="o" onClick={() => setDeleteModalCommentId(null)} className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400">
              <X className="w-4 h-4" />
            </button>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Delete Comment?</h3>
            <p className="text-gray-500 text-sm text-center mb-6">This comment will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModalCommentId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModalCommentId)}
                disabled={deletingCommentId === deleteModalCommentId}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-60"
              >
                {deletingCommentId === deleteModalCommentId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Image as ImageIcon, Video as VideoIcon, X, Loader, Smile, Globe, Users, Lock } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../shared/Button";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface CreatePostProps {
  onPostCreated?: () => void;
  userProfileImage?: string;
  userDisplayName: string;
}

interface MediaItem {
  url: string;
  type: "image" | "video";
}

interface EmojiData {
  native: string;
}

type VisibilityType = "public" | "followers" | "private";

export default function CreatePost({
  onPostCreated,
  userProfileImage,
  userDisplayName,
}: CreatePostProps) {
  const [content, setContent] = useState<string>("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [visibility, setVisibility] = useState<VisibilityType>("public");
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const visibilityOptions = [
    { value: "public" as VisibilityType, icon: Globe, label: "Public", description: "Anyone can see this" },
    { value: "followers" as VisibilityType, icon: Users, label: "Followers", description: "Only your followers" },
    { value: "private" as VisibilityType, icon: Lock, label: "Private", description: "Only you can see this" },
  ];

  const handleEmojiSelect = (emoji: EmojiData) => {
    const cursorPosition = textareaRef.current?.selectionStart || content.length;
    const newContent = content.slice(0, cursorPosition) + emoji.native + content.slice(cursorPosition);
    setContent(newContent);
    setShowEmojiPicker(false);
    
    
    setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(cursorPosition + emoji.native.length, cursorPosition + emoji.native.length);
    }, 100);
  };

  const handleMediaUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const uploadToast = toast.loading(`Uploading ${type}s...`);

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          credentials: 'include',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        const data: { url: string } = await response.json();
        return { url: data.url, type };
      });

      const uploadedMedia = await Promise.all(uploadPromises);
      setMedia((prev) => [...prev, ...uploadedMedia]);
      toast.dismiss(uploadToast);
      toast.success(`${type === "image" ? "Images" : "Videos"} uploaded!`);
    } catch (error) {
      toast.dismiss(uploadToast);
      toast.error(`Failed to upload ${type}s`);
      console.error(error);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim() && media.length === 0) {
      toast.error("Please add some content or media");
      return;
    }

    setIsPosting(true);
    const postingToast = toast.loading("Creating post...");

    try {
      const images = media.filter((m) => m.type === "image").map((m) => m.url);
      const videos = media.filter((m) => m.type === "video").map((m) => m.url);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
          content,
          images,
          videos,
          type: "update",
          visibility,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create post");
      }

      toast.dismiss(postingToast);
      toast.success("Post created! 🎉");
      setContent("");
      setMedia([]);
      setVisibility("public");
      onPostCreated?.();
    } catch (error) {
      toast.dismiss(postingToast);
      toast.error("Failed to create post");
      console.error(error);
    } finally {
      setIsPosting(false);
    }
  };

  const currentVisibility = visibilityOptions.find(v => v.value === visibility);
  const VisibilityIcon = currentVisibility?.icon || Globe;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 relative">
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 bg-linear-to-br from-pink-400 to-purple-400 rounded-full overflow-hidden shrink-0">
          {userProfileImage ? (
            <Image
              src={userProfileImage}
              alt={userDisplayName}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {userDisplayName.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <label htmlFor="post-content" className="sr-only">Post content</label>
          <textarea
            id="post-content"
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border-none outline-none resize-none text-gray-700 placeholder-gray-400 text-lg"
            rows={3}
            aria-label="Post content"
          />

          {media.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {media.map((item: MediaItem, index: number) => (
                <div key={`${item.url}-${index}`} className="relative group">
                  {item.type === "image" ? (
                    <Image
                      src={item.url}
                      alt={`Upload ${index + 1}`}
                      width={300}
                      height={200}
                      className="w-full h-32 object-cover rounded-xl"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-32 object-cover rounded-xl"
                      controls
                    />
                  )}
                  <button
                    type="button"
                    aria-label={`Remove ${item.type} ${index + 1}`}
                    title="Remove media"
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleMediaUpload(e, "image")}
                className="hidden"
                aria-label="Upload photos"
              />
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                title="Add photos"
                aria-label="Add photos"
              >
                {isUploading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <ImageIcon className="w-5 h-5" />
                )}
              </button>

             
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => handleMediaUpload(e, "video")}
                className="hidden"
                aria-label="Upload videos"
              />
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                title="Add videos"
                aria-label="Add videos"
              >
                <VideoIcon className="w-5 h-5" />
              </button>

              
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  title="Add emoji"
                  aria-label="Add emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>
                {showEmojiPicker && (
                  <div className="absolute bottom-full left-0 mb-2 z-50">
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
              </div>

             
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                  title={`Post visibility: ${currentVisibility?.label}`}
                  aria-label={`Post visibility: ${currentVisibility?.label}`}
                >
                  <VisibilityIcon className="w-5 h-5" />
                  <span className="text-sm">{currentVisibility?.label}</span>
                </button>
                
                {showVisibilityMenu && (
                  <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 min-w-64 z-50">
                    {visibilityOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => {
                            setVisibility(option.value);
                            setShowVisibilityMenu(false);
                          }}
                          className={`w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition ${
                            visibility === option.value ? 'bg-pink-50' : ''
                          }`}
                          aria-label={`Set visibility to ${option.label}`}
                        >
                          <Icon className={`w-5 h-5 mt-0.5 ${visibility === option.value ? 'text-pink-600' : 'text-gray-600'}`} />
                          <div className="text-left">
                            <p className={`font-semibold ${visibility === option.value ? 'text-pink-600' : 'text-gray-900'}`}>
                              {option.label}
                            </p>
                            <p className="text-xs text-gray-500">{option.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              isLoading={isPosting}
              disabled={(content.trim() === "" && media.length === 0) || isPosting || isUploading}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
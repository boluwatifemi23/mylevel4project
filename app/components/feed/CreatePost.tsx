"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Image as ImageIcon, Video as VideoIcon, X,
  Loader, Smile, Globe, Users, Lock, ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface CreatePostProps {
  onPostCreated?: () => void;
  userProfileImage?: string;
  userDisplayName: string;
}

interface MediaItem { url: string; type: "image" | "video" }
interface EmojiData { native: string }
type VisibilityType = "public" | "followers" | "private";

const visibilityOptions = [
  { value: "public" as VisibilityType, icon: Globe, label: "Public", desc: "Anyone can see this" },
  { value: "followers" as VisibilityType, icon: Users, label: "Followers", desc: "Only your followers" },
  { value: "private" as VisibilityType, icon: Lock, label: "Private", desc: "Only you" },
];

export default function CreatePost({ onPostCreated, userProfileImage, userDisplayName }: CreatePostProps) {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [visibility, setVisibility] = useState<VisibilityType>("public");
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [focused, setFocused] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentVis = visibilityOptions.find(v => v.value === visibility)!;
  const VisIcon = currentVis.icon;

  const handleEmojiSelect = (emoji: EmojiData) => {
    const pos = textareaRef.current?.selectionStart || content.length;
    setContent(content.slice(0, pos) + emoji.native + content.slice(pos));
    setShowEmojiPicker(false);
    setTimeout(() => {
      textareaRef.current?.focus();
      const newPos = pos + emoji.native.length;
      textareaRef.current?.setSelectionRange(newPos, newPos);
    }, 100);
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const files = e.target.files;
    if (!files?.length) return;
    setIsUploading(true);
    const t = toast.loading(`Uploading ${type}s...`);
    try {
      const uploads = await Promise.all(
        Array.from(files).map(async (file) => {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/upload", { method: "POST", credentials: "include", body: fd });
          if (!res.ok) throw new Error((await res.json()).error || "Upload failed");
          const d: { url: string } = await res.json();
          return { url: d.url, type };
        })
      );
      setMedia(prev => [...prev, ...uploads]);
      toast.dismiss(t);
      toast.success(`${type === "image" ? "Images" : "Videos"} uploaded!`);
    } catch {
      toast.dismiss(t);
      toast.error(`Failed to upload ${type}`);
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() && media.length === 0) { toast.error("Add some content or media"); return; }
    setIsPosting(true);
    const t = toast.loading("Creating post...");
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          content,
          images: media.filter(m => m.type === "image").map(m => m.url),
          videos: media.filter(m => m.type === "video").map(m => m.url),
          type: "update",
          visibility,
        }),
      });
      if (!res.ok) throw new Error();
      toast.dismiss(t);
      toast.success("Post created! 🎉");
      setContent(""); setMedia([]); setVisibility("public"); setFocused(false);
      onPostCreated?.();
    } catch {
      toast.dismiss(t);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 ${focused ? "border-pink-200 shadow-md" : "border-gray-100 shadow-sm"}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
         
          <div className="w-9 h-9 bg-linear-to-br from-pink-400 to-purple-500 rounded-full overflow-hidden shrink-0 flex items-center justify-center ring-2 ring-white shadow-sm">
            {userProfileImage ? (
              <Image src={userProfileImage} alt={userDisplayName} width={36} height={36} className="rounded-full object-cover w-full h-full" />
            ) : (
              <span className="text-white font-bold text-sm">{userDisplayName.charAt(0)}</span>
            )}
          </div>

          
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setFocused(true)}
              placeholder="What's on your mind?"
              className="w-full border-none outline-none resize-none text-gray-800 placeholder-gray-400 text-sm leading-relaxed bg-transparent"
              rows={focused || content ? 3 : 1}
            />
          </div>
        </div>

        {/* Media preview */}
        {media.length > 0 && (
          <div className={`grid gap-1.5 mt-3 ${media.length === 1 ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3"}`}>
            {media.map((item, i) => (
              <div key={i} className="relative group rounded-xl overflow-hidden bg-gray-100">
                {item.type === "image" ? (
                  <Image src={item.url} alt={`Upload ${i + 1}`} width={300} height={200} className="w-full h-28 object-cover" />
                ) : (
                  <video src={item.url} className="w-full h-28 object-cover" controls />
                )}
                <button
                title="o"
                  onClick={() => setMedia(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1">
            
            <input
            title="o"
             ref={imageInputRef} type="file" accept="image/*" multiple onChange={e => handleMediaUpload(e, "image")} className="hidden" />
            <button
              onClick={() => imageInputRef.current?.click()}
              disabled={isUploading}
              className="p-2 rounded-xl text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition disabled:opacity-40"
              title="Add photos"
            >
              {isUploading ? <Loader className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
            </button>

            
            <input
            title="o"
             ref={videoInputRef} type="file" accept="video/*" multiple onChange={e => handleMediaUpload(e, "video")} className="hidden" />
            <button
              onClick={() => videoInputRef.current?.click()}
              disabled={isUploading}
              className="p-2 rounded-xl text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition disabled:opacity-40"
              title="Add video"
            >
              <VideoIcon className="w-5 h-5" />
            </button>

           
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 rounded-xl text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition"
                title="Add emoji"
              >
                <Smile className="w-5 h-5" />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full left-0 mb-2 z-50">
                  <div className="relative">
                    <button
                    title="o"
                     onClick={() => setShowEmojiPicker(false)} className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center z-10">
                      <X className="w-3 h-3" />
                    </button>
                    <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" />
                  </div>
                </div>
              )}
            </div>

            
            <div className="relative">
              <button
                onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-gray-500 hover:bg-gray-100 transition text-xs font-medium"
              >
                <VisIcon className="w-4 h-4" />
                <span className="hidden sm:inline">{currentVis.label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {showVisibilityMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowVisibilityMenu(false)} />
                  <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 w-52 z-20">
                    {visibilityOptions.map(opt => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => { setVisibility(opt.value); setShowVisibilityMenu(false); }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition ${visibility === opt.value ? "text-pink-600" : "text-gray-700"}`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <div className="text-left">
                            <p className="text-sm font-medium leading-tight">{opt.label}</p>
                            <p className="text-xs text-gray-400">{opt.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>

         
          <button
            onClick={handleSubmit}
            disabled={(content.trim() === "" && media.length === 0) || isPosting || isUploading}
            className="px-5 py-2 bg-linear-to-r from-pink-500 to-purple-600 text-white text-sm font-semibold rounded-xl hover:shadow-md hover:shadow-pink-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
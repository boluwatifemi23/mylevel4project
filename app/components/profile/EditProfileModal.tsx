'use client';

import { useState, useRef } from 'react';
import { X, Camera, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Button from '../shared/Button';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    profile: {
      displayName: string;
      bio?: string;
      profileImage?: string;
      location?: string;
    };
  };
  onUpdate: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  user,
  onUpdate,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    displayName: user.profile.displayName,
    bio: user.profile.bio || '',
    location: user.profile.location || '',
  });
  const [profileImage, setProfileImage] = useState(user.profile.profileImage || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadToast = toast.loading('Uploading image...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setProfileImage(data.url);
      toast.dismiss(uploadToast);
      toast.success('Image uploaded!');
    } catch {
      toast.dismiss(uploadToast);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const saveToast = toast.loading('Saving profile...');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          profileImage,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast.dismiss(saveToast);
      toast.success('Profile updated successfully!');
      onUpdate();
      onClose();
    } catch {
      toast.dismiss(saveToast);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
       
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
          <button
          title='n'
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-linear-to-br from-pink-400 to-purple-400 flex items-center justify-center">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Profile"
                    width={128}
                    height={128}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {formData.displayName.charAt(0)}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition disabled:opacity-50"
              >
                {isUploading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
              </button>
              <input
              placeholder='n'
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500">Click the camera to upload a new photo</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
            placeholder='n'
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              required
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition resize-none"
              rows={4}
              placeholder="Tell us about yourself..."
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              placeholder="City, Country"
            />
          </div>

          
          <div className="flex items-center space-x-4 pt-4">
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={isSaving || isUploading}
              className="flex-1"
            >
              Save Changes
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
'use client';

import { useState, useRef } from 'react';
import { X, Camera, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import Button from '../shared/Button';

interface AddBabyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type GenderType = 'male' | 'female' | 'other';

export default function AddBabyModal({
  isOpen,
  onClose,
  onSuccess,
}: AddBabyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    gender: 'other' as GenderType,
  });
  const [photo, setPhoto] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const uploadToast = toast.loading('Uploading photo...');

    try {
      const formDataObj = new FormData();
      formDataObj.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formDataObj,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setPhoto(data.url);
      toast.dismiss(uploadToast);
      toast.success('Photo uploaded!');
    } catch{
      toast.dismiss(uploadToast);
      toast.error('Failed to upload photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.birthDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    const saveToast = toast.loading('Adding baby profile...');

    try {
      const response = await fetch('/api/babies', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          photo: photo || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add baby');
      }

      toast.dismiss(saveToast);
      toast.success('Baby profile added successfully! 🎉');
      onSuccess();
      onClose();
      
      
      setFormData({ name: '', birthDate: '', gender: 'other' });
      setPhoto('');
    } catch (error) {
      toast.dismiss(saveToast);
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to add baby profile';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add Baby Profile</h2>
          <button
            type="button"
            title="Close"
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
                {photo ? (
                  <Image
                    src={photo}
                    alt="Baby photo"
                    width={128}
                    height={128}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-6xl">👶</span>
                )}
              </div>
              <button
                type="button"
                title="Upload photo"
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
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                aria-label="Upload baby photo"
              />
            </div>
            <p className="text-sm text-gray-500">Add a photo (optional)</p>
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Baby Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              placeholder="Enter baby's name"
              required
            />
          </div>

         
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birth Date <span className="text-red-500">*</span>
            </label>
            <input
            placeholder='j'
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition"
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'male' as GenderType, label: 'Boy', emoji: '👦' },
                { value: 'female' as GenderType, label: 'Girl', emoji: '👧' },
                { value: 'other' as GenderType, label: 'Other', emoji: '👶' },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: option.value })}
                  className={`p-4 border-2 rounded-xl transition ${
                    formData.gender === option.value
                      ? 'border-pink-500 bg-pink-50'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{option.emoji}</div>
                  <div className="text-sm font-semibold">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          
          <div className="flex items-center space-x-4 pt-4">
            <Button
              type="submit"
              isLoading={isSaving}
              disabled={isSaving || isUploading}
              className="flex-1"
            >
              Add Baby
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
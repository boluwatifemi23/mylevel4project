
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session'; 
import { AppError, handleError } from '@/lib/utils/error';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse, UploadApiOptions } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type VideoUploadOptions = UploadApiOptions & {
  resource_type: 'video';
  transformation?: Array<Record<string, unknown>>;
};

type ImageUploadOptions = UploadApiOptions & {
  resource_type: 'image';
  transformation?: Array<Record<string, unknown>>;
};

type UploadOptions = ImageUploadOptions | VideoUploadOptions;

export async function POST(request: NextRequest) {
  try {
    
    const session = await getSession();
    if (!session) throw new AppError(401, 'Not authenticated');

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) throw new AppError(400, 'No file provided');

    const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/avi'];

    const isImage = validImageTypes.includes(file.type);
    const isVideo = validVideoTypes.includes(file.type);

    if (!isImage && !isVideo) {
      throw new AppError(400, 'Invalid file type. Only JPEG, PNG, JPG, WebP images and MP4, MOV, AVI videos allowed.');
    }

    const maxSize = isVideo ? 100 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new AppError(400, `File too large. Maximum size is ${isVideo ? '100MB' : '5MB'}.`);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadOptions: UploadOptions = {
      folder: 'CirlaNest',
      resource_type: isVideo ? 'video' : 'image',
    };

    if (isImage) {
      uploadOptions.transformation = [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' },
      ];
    } else {
      uploadOptions.transformation = [
        { width: 1280, height: 720, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'mp4' },
      ];
    }

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) reject(error as UploadApiErrorResponse);
          else resolve(result as UploadApiResponse);
        })
        .end(buffer);
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      duration: result.duration ?? null,
      format: result.format,
      resourceType: result.resource_type,
    });
  } catch (error) {
    return handleError(error);
  }
}
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  buffer: Buffer,
  folder: string = "CirlaNest"
): Promise<UploadApiResponse> {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            { width: 1200, height: 1200, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error as UploadApiErrorResponse);
          } else if (!result) {
            reject(new Error("Cloudinary upload returned no result"));
          } else {
            resolve(result as UploadApiResponse);
          }
        }
      )
      .end(buffer);
  });
}

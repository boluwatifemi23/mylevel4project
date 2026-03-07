import { z } from 'zod';

export const signupSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  profileType: z.enum(['parent', 'expert', 'brand']).default('parent'),
});

export const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const createPostSchema = z.object({
  content: z.string().min(1, 'Content is required').max(5000, 'Content is too long'),
  type: z.enum(['milestone', 'update', 'question', 'review']).default('update'),
  images: z.array(z.string()).optional(),
  visibility: z.enum(['public', 'followers', 'group', 'private']).default('public'),
});
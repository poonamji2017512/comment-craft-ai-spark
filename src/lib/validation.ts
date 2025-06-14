
import { z } from 'zod';
import DOMPurify from 'dompurify';

// Input validation schemas
export const commentGenerationSchema = z.object({
  originalPost: z.string()
    .min(1, 'Original post cannot be empty')
    .max(10000, 'Original post is too long')
    .refine((text) => text.trim().length > 0, 'Original post cannot be just whitespace'),
  platform: z.enum(['twitter', 'linkedin', 'facebook', 'instagram', 'reddit', 'youtube']),
  tone: z.enum(['friendly', 'professional', 'casual', 'enthusiastic', 'thoughtful', 'humorous', 'gen-z', 'thanks']),
  maxLength: z.number().min(50).max(10000).optional()
});

export const userSettingsSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
  aiTone: z.string().max(50).optional(),
  customApiKey: z.string().max(200).optional(),
  useCustomApiKey: z.boolean().optional()
});

// Sanitization functions
export const sanitizeText = (text: string): string => {
  // Remove any HTML tags and dangerous characters
  return DOMPurify.sanitize(text, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  }).trim();
};

export const sanitizeHtml = (html: string): string => {
  // Allow only safe HTML elements
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};

// Error message sanitization
export const sanitizeErrorMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return sanitizeText(error);
  }
  if (error instanceof Error) {
    return sanitizeText(error.message);
  }
  return 'An unexpected error occurred';
};

export type CommentGenerationInput = z.infer<typeof commentGenerationSchema>;
export type UserSettingsInput = z.infer<typeof userSettingsSchema>;

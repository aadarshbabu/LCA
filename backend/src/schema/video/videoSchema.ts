import { z } from "zod";

// Schema to create a video
export const createVideoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
  price: z.number().min(0, "Price must be non-negative"),
  categoryId: z.string().min(1),
  duration: z.string().min(1, "Duration is required"),
  description: z.string().default(""),
  url: z.string().url("Invalid URL").optional(),
  resolutions: z
    .record(z.string().regex(/^\d{3,4}p$/), z.string().url())
    .optional(), // Example: { "720p": "url" }
  isYoutubeUrl: z.boolean().default(false),
});

// Schema to update a video (partial)
export const updateVideoSchema = createVideoSchema.partial();

// Full schema (e.g., for internal use or validation before DB insert)
export const fullVideoSchema = createVideoSchema.extend({
  id: z.string(),
  views: z.number().default(0),
  isApproved: z.boolean().default(false),
  rejectReason: z.string().default(""),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type CreateVideoDto = z.infer<typeof createVideoSchema>;
export type UpdateVideoDto = z.infer<typeof updateVideoSchema>;
export type FullVideo = z.infer<typeof fullVideoSchema>;

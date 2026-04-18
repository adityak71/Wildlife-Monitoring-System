import { z } from 'zod'

export const uploadResponseSchema = z.object({
  url: z.string().url(),
  publicId: z.string(),
  format: z.string().optional(),
  size: z.number().optional(),
  width: z.number().optional(),
  height: z.number().optional()
})

export const multipleUploadResponseSchema = z.object({
  uploaded: z.array(z.object({
    url: z.string().url(),
    publicId: z.string()
  })),
  failed: z.number(),
  total: z.number()
})

export const activityImageUploadSchema = z.object({
  activityId: z.string().cuid().optional(),
  images: z.array(z.string().url()).max(10)
})
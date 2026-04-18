import { z } from 'zod'

export const createActivitySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().nullable(),
  type: z.string().min(1, 'Type is required'),
  date: z.string().datetime().optional().nullable(),
  locationId: z.string().min(1, 'Location is required'),
  participantId: z.string().optional().nullable(),
  findings: z.string().optional().nullable(),
  actionTaken: z.string().optional().nullable(),
  images: z.array(z.string()).optional().default([]),
  speciesReports: z.array(
    z.object({
      speciesId: z.string().min(1, 'Species ID is required'),
      count: z.number().int().min(1).default(1),
      notes: z.string().optional().nullable(),
      location: z.string().optional().nullable(),
      behavior: z.string().optional().nullable()
    })
  ).optional().default([])
})

export const updateActivityStatusSchema = z.object({
  status: z.enum(['PENDING', 'VERIFIED', 'REJECTED']),
  notes: z.string().optional()
})

export const filterActivitiesSchema = z.object({
  type: z.string().optional(),
  status: z.string().optional(),
  locationId: z.string().optional(),
  speciesId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  reportedById: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().default('date'),
  sortOrder: z.string().default('desc')
})
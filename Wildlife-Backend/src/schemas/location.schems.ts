import { z } from 'zod'

export const createLocationSchema = z.object({
  name: z.string()
    .min(3, 'Location name must be at least 3 characters')
    .max(100, 'Location name must be less than 100 characters'),
  
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional(),
  
  latitude: z.number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),
  
  longitude: z.number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
  
  area: z.number()
    .positive('Area must be positive')
    .optional(),
  
  forestType: z.string()
    .max(50, 'Forest type must be less than 50 characters')
    .optional(),
  
  altitude: z.number()
    .optional(),
  
  climate: z.string()
    .max(100, 'Climate must be less than 100 characters')
    .optional(),
  
  biodiversity: z.string()
    .max(500, 'Biodiversity info must be less than 500 characters')
    .optional(),
  
  threats: z.array(z.string())
    .max(20, 'Maximum 20 threats allowed')
    .optional()
})

export const updateLocationSchema = createLocationSchema.partial()

export const filterLocationsSchema = z.object({
  search: z.string().optional(),
  forestType: z.string().optional(),
  minArea: z.coerce.number().positive().optional(),
  maxArea: z.coerce.number().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.enum(['name', 'area', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
})
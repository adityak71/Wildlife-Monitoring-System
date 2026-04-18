import { z } from 'zod'

const conservationStatuses = [
  'CRITICALLY_ENDANGERED',
  'ENDANGERED',
  'VULNERABLE',
  'NEAR_THREATENED',
  'LEAST_CONCERN',
  'DATA_DEFICIENT'
] as const

export const createSpeciesSchema = z.object({
  name: z.string()
    .min(2, 'Species name must be at least 2 characters')
    .max(100, 'Species name must be less than 100 characters'),
  
  scientificName: z.string()
    .min(2, 'Scientific name must be at least 2 characters')
    .max(150, 'Scientific name must be less than 150 characters'),
  
  commonName: z.string()
    .max(100, 'Common name must be less than 100 characters')
    .optional(),
  
  category: z.string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must be less than 50 characters')
    .describe('Mammal, Bird, Reptile, Amphibian, Fish, Plant, etc.'),
  
  conservationStatus: z.enum(conservationStatuses),
  
  population: z.number()
    .int()
    .min(0, 'Population cannot be negative')
    .optional(),
  
  habitat: z.string()
    .max(500, 'Habitat description must be less than 500 characters')
    .optional(),
  
  threats: z.array(z.string())
    .max(20, 'Maximum 20 threats allowed')
    .optional(),
  
  imageUrl: z.string()
    .url('Invalid image URL')
    .optional(),
  
  description: z.string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
})

export const updateSpeciesSchema = createSpeciesSchema.partial()

export const filterSpeciesSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  conservationStatus: z.enum(conservationStatuses).optional(),
  minPopulation: z.coerce.number().int().min(0).optional(),
  maxPopulation: z.coerce.number().int().min(0).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.enum(['name', 'scientificName', 'conservationStatus', 'population', 'createdAt']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
})
import { z } from 'zod'

const verificationStatuses = ['PENDING', 'VERIFIED', 'REJECTED'] as const

export const createParticipantSchema = z.object({
  name: z.string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must be less than 100 characters'),
  
  email: z.string()
    .email('Invalid email address'),
  
  phone: z.string()
    .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  
  address: z.string()
    .max(500, 'Address must be less than 500 characters')
    .optional(),
  
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters'),
  
  state: z.string()
    .min(2, 'State must be at least 2 characters')
    .max(100, 'State must be less than 100 characters'),
  
  pincode: z.string()
    .regex(/^[0-9]{6}$/, 'Pincode must be 6 digits')
    .optional(),
  
  organizationType: z.string()
    .min(2, 'Organization type must be at least 2 characters')
    .max(50, 'Organization type must be less than 50 characters'),
  
  registrationNumber: z.string()
    .max(50, 'Registration number must be less than 50 characters')
    .optional(),
  
  documents: z.array(z.string().url())
    .max(10, 'Maximum 10 documents allowed')
    .optional(),
  
  notes: z.string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional()
})

export const updateParticipantSchema = createParticipantSchema.partial().extend({
  status: z.enum(verificationStatuses).optional(),
  verifiedBy: z.string().optional()
})

export const filterParticipantsSchema = z.object({
  search: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  organizationType: z.string().optional(),
  status: z.enum(verificationStatuses).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.enum(['name', 'city', 'registeredAt', 'status']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc')
})

export const verifyParticipantSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED']),
  notes: z.string().max(500, 'Notes must be less than 500 characters').optional()
})
import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  
  email: z.string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(100, 'Email must be less than 100 characters'),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  role: z.enum(['ADMIN', 'CONSERVATIONIST', 'RESEARCHER']).optional(),
  
  phone: z.string()
    .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .optional(),
  
  organization: z.string().optional()
})

export const loginSchema = z.object({
  email: z.string()
    .email('Invalid email address'),
  
  password: z.string()
    .min(1, 'Password is required')
})

export const updateProfileSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .optional(),
  
  phone: z.string()
    .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits')
    .optional(),
  
  organization: z.string().optional(),
  
  avatar: z.string().url('Invalid avatar URL').optional()
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
})
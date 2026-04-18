import { api } from './api'

export interface Participant {
  id: string
  name: string
  email: string
  phone: string
  address?: string
  city: string
  state: string
  pincode?: string
  organizationType: string
  registrationNumber?: string
  verifiedBy?: string
  status: 'PENDING' | 'VERIFIED' | 'REJECTED'
  documents: string[]
  notes?: string
  registeredAt: string
  verifiedAt?: string
  _count?: {
    activities: number
  }
}

export const participantService = {
  getAll: async (params?: {
    page?: number
    limit?: number
    search?: string
    status?: string
    city?: string
    state?: string
  }) => {
    const cleanParams: Record<string, string | number> = {}
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'all') {
          cleanParams[key] = value
        }
      })
    }
    const response = await api.get('/participants', { params: cleanParams })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/participants/${id}`)
    return response.data
  },

  create: async (data: Partial<Participant>) => {
    const response = await api.post('/participants/register', data)
    return response.data
  },

  update: async (id: string, data: Partial<Participant>) => {
    const response = await api.put(`/participants/${id}`, data)
    return response.data
  },

  verify: async (id: string, status: string, notes?: string) => {
    const response = await api.patch(`/participants/${id}/verify`, { status, notes })
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/participants/${id}`)
    return response.data
  },
}
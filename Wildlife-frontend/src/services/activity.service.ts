import { api } from './api'

export interface Activity {
  id: string
  title: string
  description?: string
  type: string
  date: string
  locationId: string
  location?: { id: string; name: string }
  reportedById: string
  reportedBy?: { id: string; name: string; avatar?: string }
  participantId?: string
  participant?: { id: string; name: string }
  status: 'PENDING' | 'VERIFIED' | 'REJECTED'
  images: string[]
  findings?: string
  actionTaken?: string
  verifiedBy?: string
  verifiedAt?: string
  createdAt: string
  updatedAt: string
  speciesReports?: Array<{
    id: string
    speciesId: string
    species?: { id: string; name: string; conservationStatus: string }
    count: number
    notes?: string
    location?: string
    behavior?: string
  }>
}

export interface CreateActivityData {
  title: string
  description?: string
  type: string
  date?: string
  locationId: string
  participantId?: string
  findings?: string
  actionTaken?: string
  images?: string[]
  speciesReports?: Array<{
    speciesId: string
    count: number
    notes?: string
    location?: string
    behavior?: string
  }>
}

export const activityService = {
  getAll: async (params?: {
    page?: number
    limit?: number
    type?: string
    status?: string
    locationId?: string
    speciesId?: string
    startDate?: string
    endDate?: string
    search?: string
  }) => {
    const response = await api.get('/activities', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/activities/${id}`)
    return response.data
  },

  create: async (data: CreateActivityData) => {
    const response = await api.post('/activities', data)
    return response.data
  },

  update: async (id: string, data: Partial<CreateActivityData>) => {
    const response = await api.put(`/activities/${id}`, data)
    return response.data
  },

  updateStatus: async (id: string, status: string, notes?: string) => {
    const response = await api.patch(`/activities/${id}/status`, { status, notes })
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/activities/${id}`)
    return response.data
  },

  getStats: async () => {
    const response = await api.get('/activities/stats')
    return response.data
  },
}
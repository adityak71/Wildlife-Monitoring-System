import { api } from './api'

export interface Location {
  id: string
  name: string
  latitude: number
  longitude: number
  area?: number
  forestType?: string
  description?: string
  threats?: string[]
  _count?: {
    activities: number
    locationReports: number
  }
}

export const locationService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await api.get('/locations', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/locations/${id}`)
    return response.data
  },

  create: async (data: Partial<Location>) => {
    const response = await api.post('/locations', data)
    return response.data
  },

  update: async (id: string, data: Partial<Location>) => {
    const response = await api.put(`/locations/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/locations/${id}`)
    return response.data
  },
}
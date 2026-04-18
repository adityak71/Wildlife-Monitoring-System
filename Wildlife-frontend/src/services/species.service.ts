import { api } from './api'

export interface Species {
    id: string
  name: string
  scientificName: string
  commonName?: string
  category: string|null
  conservationStatus: string|null
  population?: number
  habitat?: string
  threats: string[]
  imageUrl?: string
  description?: string
  createdAt: string
  updatedAt: string
  _count?: {
    reports: number
  }
}

export const speciesService = {
  getAll: async (params?: { page?: number; limit?: number; search?: string; category?: string; conservationStatus?: string }) => {
    const response = await api.get('/species', { params })
    return response.data
  },

  getById: async (id: string) => {
    const response = await api.get(`/species/${id}`)
    return response.data
  },

  create: async (data: Partial<Species>) => {
    const response = await api.post('/species', data)
    return response.data
  },

  update: async (id: string, data: Partial<Species>) => {
    const response = await api.put(`/species/${id}`, data)
    return response.data
  },

  delete: async (id: string) => {
    const response = await api.delete(`/species/${id}`)
    return response.data
  },
}
import { api } from './api'

export interface DashboardStats {
  overview: {
    totalActivities: number
    totalLocations: number
    totalSpecies: number
    totalParticipants: number
    totalUsers: number
  }
  activities: {
    byType: Array<{ type: string; count: number }>
    byStatus: Array<{ status: string; count: number }>
    byMonth: Array<{ month: string; count: number }>
  }
  species: {
    byConservationStatus: Array<{ status: string; count: number }>
  }
  recent: {
    activities: Array<{
      id: string
      title: string
      type: string
      status: string
      date: string
      location: { name: string }
      reportedBy: { name: string; avatar?: string }
    }>
    participants: Array<{
      id: string
      name: string
      city: string
      status: string
      registeredAt: string
    }>
  }
  mapData: Array<{
    id: string
    name: string
    latitude: number
    longitude: number
    activityCount: number
  }>
}

export const dashboardService = {
  getDashboardData: async (): Promise<{ success: boolean; data: DashboardStats }> => {
    const response = await api.get('/dashboard')
    return response.data
  },

  getActivityTimeline: async (days: number = 30) => {
    const response = await api.get(`/dashboard/timeline?days=${days}`)
    return response.data
  },
}
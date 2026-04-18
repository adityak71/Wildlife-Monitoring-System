import { api } from './api'

export interface LoginData {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
  phone?: string
  organization?: string
}

export interface AuthResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: string
      name: string
      email: string
      role: string
      avatar?: string
    }
    token: string
  }
}

export const authService = {
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data)
    return response.data
  },

  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },
}
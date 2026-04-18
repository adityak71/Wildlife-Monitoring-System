import { Request, Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as authService from '../services/auth.service'
import { HTTP_STATUS } from '../utils/constants'

export const signup = async (req: Request, res: Response) => {
  const result = await authService.signup(req.body)
  
  if (result.success && result.data?.token) {
    res.cookie('token', result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
  }
  
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body)
  
  if (result.success && result.data?.token) {
     res.cookie('token', result.data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
  }
  
  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const logout = async (_: Request, res: Response) => {
  res.clearCookie('token')
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Logged out successfully'
  })
}

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Not authenticated'
    })
  }
  
  const result = await authService.getCurrentUser(req.user.id)
  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10
  const role = req.query.role as string
  
  const result = await authService.getAllUsers(page, limit, role)
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}
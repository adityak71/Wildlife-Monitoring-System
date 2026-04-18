import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../utils/prisma.client'
import { HTTP_STATUS } from '../utils/constants'
import logger from '../utils/logger'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const authenticate = async(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void|any> => {
  try {
    let token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token && req.cookies?.token) {
      token = req.cookies.token
    }

    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'Authentication required. Please login.'
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string
      email: string
      role: string
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, isActive: true }
    })

    if (!user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'User no longer exists'
      })
    }

    if (!user.isActive) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'Your account has been deactivated'
      })
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    }

    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'Invalid or expired token'
      })
    }

    logger.error('Auth middleware error:', error)
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message: 'Authentication error'
    })
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void|any => {
    if (!req.user) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        status: 'error',
        message: 'Authentication required'
      })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        status: 'error',
        message: 'You do not have permission to access this resource'
      })
    }

    next()
  }
}
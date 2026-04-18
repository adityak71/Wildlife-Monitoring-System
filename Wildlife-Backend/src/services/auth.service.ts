import bcrypt from 'bcryptjs'
import jwt,{SignOptions} from 'jsonwebtoken'

import prisma from '../utils/prisma.client'
import logger from '../utils/logger'
import { HTTP_STATUS } from '../utils/constants'

export interface SignupData {
  name: string
  email: string
  password: string
  role?: 'ADMIN' | 'CONSERVATIONIST' | 'RESEARCHER'
  phone?: string
  organization?: string
}

export interface LoginData {
  email: string
  password: string
}

export const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign(
    { userId, email, role },
    process.env.JWT_SECRET!,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') }as SignOptions
  )
}

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12)
}

export const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

export const signup = async (data: SignupData) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      return {
        success: false,
        statusCode: HTTP_STATUS.CONFLICT,
        message: 'User with this email already exists'
      }
    }

    const hashedPassword = await hashPassword(data.password)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'CONSERVATIONIST',
        phone: data.phone,
        organization: data.organization
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        organization: true,
        avatar: true,
        isActive: true,
        isVerified: true,
        createdAt: true
      }
    })

    const token = generateToken(user.id, user.email, user.role)

    logger.info(`New user registered: ${user.email} (${user.role})`)

    return {
      success: true,
      statusCode: HTTP_STATUS.CREATED,
      message: 'User registered successfully',
      data: { user, token }
    }
  } catch (error) {
    logger.error('Signup error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error creating user'
    }
  }
}

export const login = async (data: LoginData) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (!user) {
      return {
        success: false,
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        message: 'Invalid email or password'
      }
    }

    if (!user.isActive) {
      return {
        success: false,
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        message: 'Your account has been deactivated. Please contact admin.'
      }
    }

    const isPasswordValid = await verifyPassword(data.password, user.password)

    if (!isPasswordValid) {
      return {
        success: false,
        statusCode: HTTP_STATUS.UNAUTHORIZED,
        message: 'Invalid email or password'
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })

    const token = generateToken(user.id, user.email, user.role)

    const { password: _, ...userWithoutPassword } = user

    logger.info(`User logged in: ${user.email}`)

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: 'Login successful',
      data: { user: userWithoutPassword, token }
    }
  } catch (error) {
    logger.error('Login error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error logging in'
    }
  }
}

export const getCurrentUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        phone: true,
        organization: true,
        isActive: true,
        isVerified: true,
        lastLogin: true,
        createdAt: true
      }
    })

    if (!user) {
      return {
        success: false,
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'User not found'
      }
    }

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: { user }
    }
  } catch (error) {
    logger.error('Get current user error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching user'
    }
  }
}

export const getAllUsers = async (page: number = 1, limit: number = 10, role?: string) => {
  try {
    const skip = (page - 1) * limit
    
    const where:any = {}
    if (role) {
      where.role = role as any
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          phone: true,
          organization: true,
          isActive: true,
          isVerified: true,
          lastLogin: true,
          createdAt: true
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ])
    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }
  } catch (error) {
    logger.error('Get all users error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching users'
    }
  }
}
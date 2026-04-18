import { Request, Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as locationService from '../services/location.service'
import logger from '../utils/logger'
import { HTTP_STATUS } from '../utils/constants'

export const createLocation = async (req: AuthRequest, res: Response) => {
  const result = await locationService.createLocation(req.body)
  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const getAllLocations = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const search = req.query.search as string
    const forestType = req.query.forestType as string
    const minArea = req.query.minArea ? parseFloat(req.query.minArea as string) : undefined
    const maxArea = req.query.maxArea ? parseFloat(req.query.maxArea as string) : undefined
    
    const filters: any = { page, limit }
    if (search && search !== 'undefined') filters.search = search
    if (forestType && forestType !== 'undefined') filters.forestType = forestType
    if (minArea !== undefined) filters.minArea = minArea
    if (maxArea !== undefined) filters.maxArea = maxArea
    
    const result = await locationService.getAllLocations(filters)
    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data
    })
  } catch (error) {
    logger.error('Get all locations error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching locations'
    })
  }
}


export const getLocationById = async (req: Request, res: Response) => {
  const result = await locationService.getLocationById(req.params.id as string)
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const updateLocation = async (req: AuthRequest, res: Response) => {
  const result = await locationService.updateLocation(req.params.id as string, req.body)
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const deleteLocation = async (req: AuthRequest, res: Response) => {
  const result = await locationService.deleteLocation(req.params.id as string)
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message
  })
}

export const getLocationStats = async (_: Request, res: Response) => {
  const result = await locationService.getLocationStats()
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}
import { Request, Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as speciesService from '../services/species.service'
import { HTTP_STATUS } from '../utils/constants'
import { ConservationStatus } from '@prisma/client'
import logger from '../utils/logger'

export const createSpecies = async (req: AuthRequest, res: Response) => {
  const result = await speciesService.createSpecies(req.body)
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const getAllSpecies = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const search = req.query.search as string
    const category = req.query.category as string
    const conservationStatus = req.query.conservationStatus as string
    const minPopulation = req.query.minPopulation ? parseInt(req.query.minPopulation as string) : undefined
    const maxPopulation = req.query.maxPopulation ? parseInt(req.query.maxPopulation as string) : undefined
    
    const filters: any = { page, limit }
    if (search && search !== 'undefined') filters.search = search
    if (category && category !== 'undefined') filters.category = category
    if (conservationStatus && conservationStatus !== 'undefined') filters.conservationStatus = conservationStatus
    if (minPopulation !== undefined) filters.minPopulation = minPopulation
    if (maxPopulation !== undefined) filters.maxPopulation = maxPopulation
    
    const result = await speciesService.getAllSpecies(filters)
    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data
    })
  } catch (error) {
    logger.error('Get all species error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching species'
    })
  }
}

export const getSpeciesById = async (req: Request, res: Response) => {
  const result = await speciesService.getSpeciesById(req.params.id as string)
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const updateSpecies = async (req: AuthRequest, res: Response) => {
  const result = await speciesService.updateSpecies(req.params.id as string, req.body)
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const deleteSpecies = async (req: AuthRequest, res: Response) => {
  const result = await speciesService.deleteSpecies(req.params.id as string)
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message
  })
}

export const getSpeciesStats = async (_: Request, res: Response) => {
  const result = await speciesService.getSpeciesStats()
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const getSpeciesByConservationStatus = async (req: Request, res: Response) => {
  const { status } = req.params
  if (!Object.values(ConservationStatus).includes(status as ConservationStatus)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: 'Invalid conservation status'
    })
  }
  const result = await speciesService.getSpeciesByConservationStatus(status as ConservationStatus)
  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}
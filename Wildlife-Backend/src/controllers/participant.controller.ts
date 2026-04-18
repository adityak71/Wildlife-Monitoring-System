import { Request, Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as participantService from '../services/participant.service'
import logger from '../utils/logger'
import { HTTP_STATUS } from '../utils/constants'

export const createParticipant = async (req: Request, res: Response) => {
  const result = await participantService.createParticipant(req.body)
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const getAllParticipants = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.limit as string) || 10
    const search = req.query.search as string
    const city = req.query.city as string
    const state = req.query.state as string
    const organizationType = req.query.organizationType as string
    const status = req.query.status as string

    const filters: any = { page, limit }
    if (search && search !== 'undefined' && search !== '') filters.search = search
    if (city && city !== 'undefined' && city !== '') filters.city = city
    if (state && state !== 'undefined' && state !== '') filters.state = state
    if (organizationType && organizationType !== 'undefined' && organizationType !== '') filters.organizationType = organizationType
    if (status && status !== 'undefined' && status !== '' && status !== 'all') filters.status = status

    const result = await participantService.getAllParticipants(filters)
    res.status(result.statusCode).json({
      success: result.success,
      message: result.message,
      data: result.data
    })
  } catch (error) {
    logger.error('Get all participants error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error fetching participants'
    })
  }
}

export const getParticipantById = async (req: AuthRequest, res: Response) => {
  const result = await participantService.getParticipantById(req.params.id as string) 
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const updateParticipant = async (req: AuthRequest, res: Response) => {
  const result = await participantService.updateParticipant(
    req.params.id as string,
    req.body,
  )
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const verifyParticipant = async (req: AuthRequest, res: Response) => {
  const result = await participantService.verifyParticipant(
    req.params.id as string,
    req.body.status,
    req.user!.id,
    req.body.notes
  )
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const deleteParticipant = async (req: AuthRequest, res: Response) => {
  const result = await participantService.deleteParticipant(req.params.id as string)
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message
  })
}

export const getParticipantStats = async (_: AuthRequest, res: Response) => {
  const result = await participantService.getParticipantStats()
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}
import { Request, Response } from 'express'
import * as dashboardService from '../services/dashboard.service'

export const getDashboardData = async (_: Request, res: Response) => {
  const result = await dashboardService.getDashboardData()
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}

export const getActivityTimeline = async (req: Request, res: Response) => {
  const days = parseInt(req.query.days as string) || 30
  const result = await dashboardService.getActivityTimeline(days)
  res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data
  })
}
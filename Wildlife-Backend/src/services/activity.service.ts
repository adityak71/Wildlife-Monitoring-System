import { Prisma } from '@prisma/client'
import prisma from '../utils/prisma.client'
import logger from '../utils/logger'
import { HTTP_STATUS } from '../utils/constants'

export const createActivity = async (data: any, userId: string) => {
  try {
    const { speciesReports, images, ...activityData } = data
    
    const activity = await prisma.monitoringActivity.create({
      data: {
        ...activityData,
        reportedById: userId,
        images: images || [],
        speciesReports: speciesReports && speciesReports.length > 0 ? {
          create: speciesReports.map((report: any) => ({
            speciesId: report.speciesId,
            count: report.count,
            notes: report.notes,
            location: report.location,
            behavior: report.behavior
          }))
        } : undefined
      },
      include: {
        location: true,
        reportedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        participant: true,
        speciesReports: {
          include: {
            species: true
          }
        }
      }
    })
    
    logger.info(`New activity created: ${activity.id} with ${images?.length || 0} images`)
    
    return {
      success: true,
      statusCode: HTTP_STATUS.CREATED,
      message: 'Activity created successfully',
      data: { activity }
    }
  } catch (error) {
    logger.error('Create activity error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error creating activity'
    }
  }
}
export const getAllActivities = async (filters: any) => {
  try {
    const {
      type,
      status,
      locationId,
      speciesId,
      startDate,
      endDate,
      reportedById,
      search,
      page = 1,
      limit = 10,
      sortBy = 'date',
      sortOrder = 'desc'
    } = filters
    
    const skip = (page - 1) * limit
    
    const where: Prisma.MonitoringActivityWhereInput = {}
    
    if (type && type !== 'all') where.type = type as any
    if (status && status !== 'all') where.status = status as any
    if (locationId && locationId !== 'undefined') where.locationId = locationId
    if (reportedById) where.reportedById = reportedById
    
    if (search && search !== 'undefined') {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (startDate && startDate !== 'undefined') {
      where.date = { gte: new Date(startDate) }
    }
   if (endDate && endDate !== 'undefined') {
  where.date = { 
    ...(typeof where.date === 'object' ? where.date : {}), 
    lte: new Date(endDate) 
  }
}
    
    if (speciesId && speciesId !== 'undefined') {
      where.speciesReports = {
        some: {
          speciesId: speciesId
        }
      }
    }
    
    const [activities, total] = await Promise.all([
      prisma.monitoringActivity.findMany({
        where,
        include: {
          location: {
            select: { id: true, name: true, latitude: true, longitude: true }
          },
          reportedBy: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          participant: {
            select: { id: true, name: true, city: true }
          },
          speciesReports: {
            include: {
              species: {
                select: { id: true, name: true, scientificName: true, conservationStatus: true }
              }
            }
          }
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.monitoringActivity.count({ where })
    ])
    
    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: {
        activities,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    }
  } catch (error) {
    logger.error('Get all activities error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching activities'
    }
  }
}

export const getActivityById = async (id: string) => {
  try {
    const activity = await prisma.monitoringActivity.findUnique({
      where: { id },
      include: {
        location: true,
        reportedBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            organization: true
          }
        },
        participant: true,
        speciesReports: {
          include: {
            species: true
          }
        }
      }
    })
    
    if (!activity) {
      return {
        success: false,
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Activity not found'
      }
    }
    
    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: { activity }
    }
  } catch (error) {
    logger.error('Get activity by id error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching activity'
    }
  }
}

export const updateActivityStatus = async (id: string, status: string, verifiedBy: string, notes?: string) => {
  try {
    const activity = await prisma.monitoringActivity.update({
      where: { id },
      data: {
        status: status as any,
        verifiedBy,
        verifiedAt: status === 'VERIFIED' || status === 'REJECTED' ? new Date() : null,
        ...(notes && { findings: notes })
      },
      include: {
        location: true,
        reportedBy: {
          select: { id: true, name: true, email: true }
        }
      }
    })
    
    logger.info(`Activity ${id} status updated to ${status} by ${verifiedBy}`)
    
    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: `Activity ${status.toLowerCase()} successfully`,
      data: { activity }
    }
  } catch (error) {
    logger.error('Update activity status error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error updating activity status'
    }
  }
}

export const updateActivity = async (id: string, data: any, userId: string, userRole: string) => {
  try {
    const existingActivity = await prisma.monitoringActivity.findUnique({
      where: { id },
      select: { reportedById: true }
    })
    
    if (!existingActivity) {
      return {
        success: false,
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Activity not found'
      }
    }
    
    if (existingActivity.reportedById !== userId && userRole !== 'ADMIN') {
      return {
        success: false,
        statusCode: HTTP_STATUS.FORBIDDEN,
        message: 'You don\'t have permission to update this activity'
      }
    }
    
    const { speciesReports, ...updateData } = data
    
    const activity = await prisma.monitoringActivity.update({
      where: { id },
      data: updateData,
      include: {
        location: true,
        reportedBy: {
          select: { id: true, name: true, email: true }
        },
        speciesReports: {
          include: { species: true }
        }
      }
    })
    
    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: 'Activity updated successfully',
      data: { activity }
    }
  } catch (error) {
    logger.error('Update activity error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error updating activity'
    }
  }
}

export const deleteActivity = async (id: string) => {
  try {
    await prisma.monitoringActivity.delete({
      where: { id }
    })
    
    logger.info(`Activity ${id} deleted`)
    
    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: 'Activity deleted successfully'
    }
  } catch (error) {
    logger.error('Delete activity error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error deleting activity'
    }
  }
}

export const getActivityStats = async () => {
  try {
    const [total, byType, byStatus, recent] = await Promise.all([
      prisma.monitoringActivity.count(),
      
      prisma.monitoringActivity.groupBy({
        by: ['type'],
        _count: true
      }),
      
      prisma.monitoringActivity.groupBy({
        by: ['status'],
        _count: true
      }),
      
      prisma.monitoringActivity.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          location: true,
          reportedBy: {
            select: { name: true, avatar: true }
          }
        }
      })
    ])
    
    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: {
        total,
        byType: byType.map(item => ({ type: item.type, count: item._count })),
        byStatus: byStatus.map(item => ({ status: item.status, count: item._count })),
        recent
      }
    }
  } catch (error) {
    logger.error('Get activity stats error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching statistics'
    }
  }
}
import { Prisma } from '@prisma/client'
import prisma from '../utils/prisma.client'
import logger from '../utils/logger'
import { HTTP_STATUS } from '../utils/constants'

export const createLocation = async (data: any) => {
  try {
    const existing = await prisma.location.findFirst({
      where: { name: data.name }
    })

    if (existing) {
      return {
        success: false,
        statusCode: HTTP_STATUS.CONFLICT,
        message: 'Location with this name already exists'
      }
    }

    const location = await prisma.location.create({
      data: {
        ...data,
        threats: data.threats || []
      }
    })

    logger.info(`New location created: ${location.name}`)

    return {
      success: true,
      statusCode: HTTP_STATUS.CREATED,
      message: 'Location created successfully',
      data: { location }
    }
  } catch (error) {
    logger.error('Create location error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error creating location'
    }
  }
}

export const getAllLocations = async (filters: any) => {
  try {
    const {
      search,
      forestType,
      minArea,
      maxArea,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc'
    } = filters

    const skip = (page - 1) * limit

    const where: Prisma.LocationWhereInput = {}

    if (search && search !== 'undefined') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (forestType && forestType !== 'undefined') {
      where.forestType = { contains: forestType, mode: 'insensitive' }
    }

    if (minArea !== undefined || maxArea !== undefined) {
      where.area = {}
      if (minArea !== undefined) where.area.gte = minArea
      if (maxArea !== undefined) where.area.lte = maxArea
    }

    const [locations, total] = await Promise.all([
      prisma.location.findMany({
        where,
        include: {
          _count: {
            select: {
              activities: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.location.count({ where })
    ])

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: {
        locations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }
  } catch (error) {
    logger.error('Get all locations error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching locations'
    }
  }
}

export const getLocationById = async (id: string) => {
  try {
    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        activities: {
          take: 10,
          orderBy: { date: 'desc' },
          include: {
            reportedBy: {
              select: { id: true, name: true, avatar: true }
            }
          }
        },
        _count: {
          select: {
            activities: true
          }
        }
      }
    })

    if (!location) {
      return {
        success: false,
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Location not found'
      }
    }

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: { location }
    }
  } catch (error) {
    logger.error('Get location by id error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching location'
    }
  }
}

export const updateLocation = async (id: string, data: any) => {
  try {
    const existing = await prisma.location.findUnique({
      where: { id }
    })

    if (!existing) {
      return {
        success: false,
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Location not found'
      }
    }

    if (data.name && data.name !== existing.name) {
      const duplicate = await prisma.location.findFirst({
        where: { 
          name: data.name,
          NOT: { id: id }
        }
      })
      
      if (duplicate) {
        return {
          success: false,
          statusCode: HTTP_STATUS.CONFLICT,
          message: 'Location with this name already exists'
        }
      }
    }

    const location = await prisma.location.update({
      where: { id },
      data: {
        ...data,
        threats: data.threats
      }
    })

    logger.info(`Location updated: ${location.name}`)

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: 'Location updated successfully',
      data: { location }
    }
  } catch (error) {
    logger.error('Update location error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error updating location'
    }
  }
}

export const deleteLocation = async (id: string) => {
  try {
    const activitiesCount = await prisma.monitoringActivity.count({
      where: { locationId: id }
    })

    if (activitiesCount > 0) {
      return {
        success: false,
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: `Cannot delete location. It has ${activitiesCount} associated activities.`
      }
    }

    await prisma.location.delete({
      where: { id }
    })

    logger.info(`Location deleted: ${id}`)

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: 'Location deleted successfully'
    }
  } catch (error) {
    logger.error('Delete location error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error deleting location'
    }
  }
}

export const getLocationStats = async () => {
  try {
    const [totalLocations, totalArea, topActivities] = await Promise.all([
      prisma.location.count(),
      prisma.location.aggregate({
        _sum: { area: true }
      }),
      prisma.location.findMany({
        take: 5,
        orderBy: {
          activities: {
            _count: 'desc'
          }
        },
        select: {
          id: true,
          name: true,
          area: true,
          _count: {
            select: { activities: true }
          }
        }
      })
    ])

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: {
        totalLocations,
        totalArea: totalArea._sum.area || 0,
        topLocationsByActivity: topActivities
      }
    }
  } catch (error) {
    logger.error('Get location stats error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching location statistics'
    }
  }
}
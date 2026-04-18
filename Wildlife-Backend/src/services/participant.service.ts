import { Prisma, VerificationStatus } from '@prisma/client'
import prisma from '../utils/prisma.client'
import logger from '../utils/logger'
import { HTTP_STATUS } from '../utils/constants'

export const createParticipant = async (data: any) => {
  try {
    const existing = await prisma.participant.findUnique({
      where: { email: data.email }
    })

    if (existing) {
      return {
        success: false,
        statusCode: HTTP_STATUS.CONFLICT,
        message: 'Organization with this email already registered'
      }
    }

    const participant = await prisma.participant.create({
      data: {
        ...data,
        documents: data.documents || [],
        status: 'PENDING'
      }
    })

    logger.info(`New participant registered: ${participant.name} (${participant.email})`)

    return {
      success: true,
      statusCode: HTTP_STATUS.CREATED,
      message: 'Registration submitted successfully. Waiting for admin verification.',
      data: { participant }
    }
  } catch (error) {
    logger.error('Create participant error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error registering organization'
    }
  }
}

export const getAllParticipants = async (filters: any) => {
  try {
    const {
      search,
      city,
      state,
      organizationType,
      status,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc'
    } = filters

    const skip = (page - 1) * limit

    const where: Prisma.ParticipantWhereInput = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' }
    }

    if (state) {
      where.state = { contains: state, mode: 'insensitive' }
    }

    if (organizationType) {
      where.organizationType = { contains: organizationType, mode: 'insensitive' }
    }

    if (status) {
      where.status = status as VerificationStatus
    }

    const [participants, total] = await Promise.all([
      prisma.participant.findMany({
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
      prisma.participant.count({ where })
    ])

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: {
        participants,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }
  } catch (error) {
    logger.error('Get all participants error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching participants'
    }
  }
}

export const getParticipantById = async (id: string) => {
  try {
    const participant = await prisma.participant.findUnique({
      where: { id },
      include: {
        activities: {
          take: 10,
          orderBy: { date: 'desc' },
          include: {
            location: {
              select: { id: true, name: true }
            },
            speciesReports: {
              include: { species: true },
              take: 5
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

    if (!participant) {
      return {
        success: false,
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Participant not found'
      }
    }

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: { participant }
    }
  } catch (error) {
    logger.error('Get participant by id error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching participant'
    }
  }
}

export const updateParticipant = async (id: string, data: any) => {
  try {
    const existing = await prisma.participant.findUnique({
      where: { id }
    })

    if (!existing) {
      return {
        success: false,
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Participant not found'
      }
    }

    if (data.email && data.email !== existing.email) {
      const duplicate = await prisma.participant.findUnique({
        where: { email: data.email }
      })
      if (duplicate) {
        return {
          success: false,
          statusCode: HTTP_STATUS.CONFLICT,
          message: 'Organization with this email already exists'
        }
      }
    }

    const participant = await prisma.participant.update({
      where: { id },
      data
    })

    logger.info(`Participant updated: ${participant.name}`)

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: 'Participant updated successfully',
      data: { participant }
    }
  } catch (error) {
    logger.error('Update participant error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error updating participant'
    }
  }
}

export const verifyParticipant = async (id: string, status: string, verifiedBy: string, notes?: string) => {
  try {
    const participant = await prisma.participant.update({
      where: { id },
      data: {
        status: status as VerificationStatus,
        verifiedBy,
        verifiedAt: new Date(),
        notes: notes || undefined
      }
    })

    logger.info(`Participant ${participant.name} ${status.toLowerCase()} by ${verifiedBy}`)

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: `Organization ${status.toLowerCase()} successfully`,
      data: { participant }
    }
  } catch (error) {
    logger.error('Verify participant error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error verifying participant'
    }
  }
}

export const deleteParticipant = async (id: string) => {
  try {
    const activitiesCount = await prisma.monitoringActivity.count({
      where: { participantId: id }
    })

    if (activitiesCount > 0) {
      return {
        success: false,
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: `Cannot delete participant. They have ${activitiesCount} associated activities.`
      }
    }

    await prisma.participant.delete({
      where: { id }
    })

    logger.info(`Participant deleted: ${id}`)

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: 'Participant deleted successfully'
    }
  } catch (error) {
    logger.error('Delete participant error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error deleting participant'
    }
  }
}

export const getParticipantStats = async () => {
  try {
    const [total, byStatus, byType, pendingCount, verifiedCount] = await Promise.all([
      prisma.participant.count(),
      
      prisma.participant.groupBy({
        by: ['status'],
        _count: true
      }),
      
      prisma.participant.groupBy({
        by: ['organizationType'],
        _count: true,
        orderBy: {
          _count: {
            organizationType: 'desc'
          }
        },
        take: 5
      }),
      
      prisma.participant.count({
        where: { status: 'PENDING' }
      }),
      
      prisma.participant.count({
        where: { status: 'VERIFIED' }
      })
    ])

    const topActive = await prisma.participant.findMany({
      take: 5,
      where: {
        status: 'VERIFIED'
      },
      orderBy: {
        activities: {
          _count: 'desc'
        }
      },
      select: {
        id: true,
        name: true,
        city: true,
        _count: {
          select: { activities: true }
        }
      }
    })

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: {
        total,
        byStatus: byStatus.map(item => ({
          status: item.status,
          count: item._count
        })),
        byType: byType.map(item => ({
          type: item.organizationType,
          count: item._count
        })),
        pending: pendingCount,
        verified: verifiedCount,
        topActive
      }
    }
  } catch (error) {
    logger.error('Get participant stats error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching participant statistics'
    }
  }
}
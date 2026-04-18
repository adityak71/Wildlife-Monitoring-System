import { Prisma, ConservationStatus } from '@prisma/client'
import prisma from '../utils/prisma.client'
import logger from '../utils/logger'
import { HTTP_STATUS } from '../utils/constants'

export const createSpecies = async (data: any) => {
  try {
    const existing = await prisma.species.findUnique({
      where: { name: data.name }
    })

    if (existing) {
      return {
        success: false,
        statusCode: HTTP_STATUS.CONFLICT,
        message: 'Species with this name already exists'
      }
    }

    const existingScientific = await prisma.species.findFirst({
      where: { scientificName: data.scientificName }
    })

    if (existingScientific) {
      return {
        success: false,
        statusCode: HTTP_STATUS.CONFLICT,
        message: 'Species with this scientific name already exists'
      }
    }

    const species = await prisma.species.create({
      data: {
        ...data,
        threats: data.threats || []
      }
    })

    logger.info(`New species added: ${species.name} (${species.scientificName})`)

    return {
      success: true,
      statusCode: HTTP_STATUS.CREATED,
      message: 'Species created successfully',
      data: { species }
    }
  } catch (error) {
    logger.error('Create species error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error creating species'
    }
  }
}
export const getAllSpecies = async (filters: any) => {
  try {
    const {
      search,
      category,
      conservationStatus,
      minPopulation,
      maxPopulation,
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc'
    } = filters

    const skip = (page - 1) * limit

    const where: Prisma.SpeciesWhereInput = {}

    if (search && search !== 'undefined') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { scientificName: { contains: search, mode: 'insensitive' } },
        { commonName: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (category && category !== 'undefined') {
      where.category = { contains: category, mode: 'insensitive' }
    }

    if (conservationStatus && conservationStatus !== 'undefined') {
      where.conservationStatus = conservationStatus as ConservationStatus
    }

    if (minPopulation !== undefined || maxPopulation !== undefined) {
      where.population = {}
      if (minPopulation !== undefined) where.population.gte = minPopulation
      if (maxPopulation !== undefined) where.population.lte = maxPopulation
    }

    const [species, total] = await Promise.all([
      prisma.species.findMany({
        where,
        include: {
          _count: {
            select: {
              reports: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.species.count({ where })
    ])

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: {
        species,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }
  } catch (error) {
    logger.error('Get all species error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching species'
    }
  }
}

export const getSpeciesById = async (id: string) => {
  try {
    const species = await prisma.species.findUnique({
      where: { id },
      include: {
        reports: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: {
            activity: {
              include: {
                location: {
                  select: { id: true, name: true, latitude: true, longitude: true }
                },
                reportedBy: {
                  select: { id: true, name: true, avatar: true }
                }
              }
            }
          }
        },
        _count: {
          select: {
            reports: true
          }
        }
      }
    })

    if (!species) {
      return {
        success: false,
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Species not found'
      }
    }

    const totalSightings = species.reports.reduce((sum, r) => sum + r.count, 0)
    const recentSightings = species.reports.slice(0, 10)
    const locations = [...new Set(species.reports.map(r => r.activity?.location?.name).filter(Boolean))]

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: {
        species,
        statistics: {
          totalSightings,
          totalReports: species._count.reports,
          uniqueLocations: locations.length,
          recentSightings
        }
      }
    }
  } catch (error) {
    logger.error('Get species by id error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching species'
    }
  }
}

export const updateSpecies = async (id: string, data: any) => {
  try {
    const existing = await prisma.species.findUnique({
      where: { id }
    })

    if (!existing) {
      return {
        success: false,
        statusCode: HTTP_STATUS.NOT_FOUND,
        message: 'Species not found'
      }
    }

    if (data.name && data.name !== existing.name) {
      const duplicate = await prisma.species.findUnique({
        where: { name: data.name }
      })
      if (duplicate) {
        return {
          success: false,
          statusCode: HTTP_STATUS.CONFLICT,
          message: 'Species with this name already exists'
        }
      }
    }

    const species = await prisma.species.update({
      where: { id },
      data: {
        ...data,
        threats: data.threats
      }
    })

    logger.info(`Species updated: ${species.name}`)

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: 'Species updated successfully',
      data: { species }
    }
  } catch (error) {
    logger.error('Update species error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error updating species'
    }
  }
}

export const deleteSpecies = async (id: string) => {
  try {
    const reportsCount = await prisma.speciesReport.count({
      where: { speciesId: id }
    })

    if (reportsCount > 0) {
      return {
        success: false,
        statusCode: HTTP_STATUS.BAD_REQUEST,
        message: `Cannot delete species. It has ${reportsCount} associated sighting reports.`
      }
    }

    await prisma.species.delete({
      where: { id }
    })

    logger.info(`Species deleted: ${id}`)

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      message: 'Species deleted successfully'
    }
  } catch (error) {
    logger.error('Delete species error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error deleting species'
    }
  }
}

export const getSpeciesStats = async () => {
  try {
    const [
      totalSpecies,
      byConservationStatus,
      byCategory,
      endangeredCount,
      criticallyEndangeredCount
    ] = await Promise.all([
      prisma.species.count(),
      
      prisma.species.groupBy({
        by: ['conservationStatus'],
        _count: true
      }),
      
      prisma.species.groupBy({
        by: ['category'],
        _count: true,
        orderBy: {
          _count: {
            category: 'desc'
          }
        },
        take: 5
      }),
      
      prisma.species.count({
        where: { conservationStatus: 'ENDANGERED' }
      }),
      
      prisma.species.count({
        where: { conservationStatus: 'CRITICALLY_ENDANGERED' }
      })
    ])

    const topSightedSpecies = await prisma.species.findMany({
      take: 5,
      orderBy: {
        reports: {
          _count: 'desc'
        }
      },
      select: {
        id: true,
        name: true,
        scientificName: true,
        conservationStatus: true,
        _count: {
          select: { reports: true }
        }
      }
    })

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: {
        totalSpecies,
        byConservationStatus: byConservationStatus.map(item => ({
          status: item.conservationStatus,
          count: item._count
        })),
        byCategory: byCategory.map(item => ({
          category: item.category,
          count: item._count
        })),
        endangered: {
          total: endangeredCount,
          critically: criticallyEndangeredCount
        },
        topSightedSpecies
      }
    }
  } catch (error) {
    logger.error('Get species stats error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching species statistics'
    }
  }
}

export const getSpeciesByConservationStatus = async (status: ConservationStatus) => {
  try {
    const species = await prisma.species.findMany({
      where: { conservationStatus: status },
      include: {
        _count: {
          select: { reports: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return {
      success: true,
      statusCode: HTTP_STATUS.OK,
      data: { species, count: species.length }
    }
  } catch (error) {
    logger.error('Get species by status error:', error)
    return {
      success: false,
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
      message: 'Error fetching species by status'
    }
  }
}
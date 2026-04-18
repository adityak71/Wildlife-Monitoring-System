import {  Response } from 'express'
import { AuthRequest } from '../middlewares/auth.middleware'
import * as cloudinaryService from '../services/cloudinary.service'
import { HTTP_STATUS } from '../utils/constants'
import logger from '../utils/logger'

export const uploadSingleImage = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'No file uploaded'
      })
    }
    
    const result = await cloudinaryService.uploadFile(
      req.file.path,
      `forest-wildlife/users/${req.user?.id}`
    )
    
    if (!result.success) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: result.error
      })
    }
    
   return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: result.url,
        publicId: result.publicId,
        format: result.format,
        size: result.size
      }
    })
  } catch (error) {
    logger.error('Upload single image error:', error)
   return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error uploading file'
    })
  }
}

export const uploadMultipleImages = async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[]
    
    if (!files || files.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'No files uploaded'
      })
    }
    
    const filePaths = files.map(file => file.path)
    const result = await cloudinaryService.uploadMultipleFiles(
      filePaths,
      `forest-wildlife/activities/${req.user?.id}`
    )
    
    if (!result.success) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: result.error || 'Failed to upload files'
      })
    }
    
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `${result?.uploaded?.length} files uploaded successfully`,
      data: {
        uploaded: result.uploaded,
        failed: result.failed,
        total: result.total
      }
    })
  } catch (error) {
    logger.error('Upload multiple images error:', error)
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error uploading files'
    })
  }
}

export const uploadActivityImages = async (req: AuthRequest, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[]
    const { activityId } = req.body
    
    if (!files || files.length === 0) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'No files uploaded'
      })
    }
    
    const filePaths = files.map(file => file.path)
    const result = await cloudinaryService.uploadMultipleFiles(
      filePaths,
      `forest-wildlife/activities/${activityId || 'pending'}`
    )
    
    if (!result.success) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: result.error || 'Failed to upload files'
      })
    }
    
    if (activityId) {
      const prisma = (await import('../utils/prisma.client')).default
      const imageUrls = result.uploaded?.map(u => u.url)
      
      await prisma.monitoringActivity.update({
        where: { id: activityId },
        data: {
          images: {
            push: imageUrls as Array<string>
          }
        }
      })
    }
    
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: `${result.uploaded?.length} images uploaded successfully`,
      data: {
        images: result.uploaded,
        failed: result.failed
      }
    })
  } catch (error) {
    logger.error('Upload activity images error:', error)
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error uploading files'
    })
  }
}

export const deleteFile = async (req: AuthRequest, res: Response) => {
  try {
    const { publicId } = req.body
    
    if (!publicId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: 'Public ID is required'
      })
    }
    
    const result = await cloudinaryService.deleteFile(publicId)
    
    if (!result.success) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Failed to delete file'
      })
    }
    
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'File deleted successfully'
    })
  } catch (error) {
    logger.error('Delete file error:', error)
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error deleting file'
    })
  }
}

export const getSignedUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { folder } = req.query
    const signedUrl = cloudinaryService.getSignedUploadUrl(folder as string || 'forest-wildlife')
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: signedUrl
    })
  } catch (error) {
    logger.error('Get signed URL error:', error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Error generating signed URL'
    })
  }
}
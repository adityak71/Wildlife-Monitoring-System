import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import logger from '../utils/logger'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export const uploadFile = async (filePath: string, folder: string = 'forest-wildlife') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    })
    
    fs.unlinkSync(filePath)
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      size: result.bytes,
      width: result.width,
      height: result.height
    }
  } catch (error) {
    logger.error('Cloudinary upload error:', error)
    return {
      success: false,
      error: 'Failed to upload file'
    }
  }
}

export const uploadMultipleFiles = async (filePaths: string[], folder: string = 'forest-wildlife') => {
  try {
    const uploadPromises = filePaths.map(filePath => uploadFile(filePath, folder))
    const results = await Promise.all(uploadPromises)
    
    const successful = results.filter(r => r.success)
    const failed = results.filter(r => !r.success)
    
    return {
      success: successful.length > 0,
      uploaded: successful.map(r => ({ url: r.url, publicId: r.publicId })),
      failed: failed.length,
      total: filePaths.length
    }
  } catch (error) {
    logger.error('Multiple upload error:', error)
    return {
      success: false,
      error: 'Failed to upload files'
    }
  }
}

export const deleteFile = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    return {
      success: result.result === 'ok',
      result
    }
  } catch (error) {
    logger.error('Cloudinary delete error:', error)
    return {
      success: false,
      error: 'Failed to delete file'
    }
  }
}

export const getOptimizedUrl = (publicId: string, options: {
  width?: number
  height?: number
  quality?: number
  format?: string
} = {}) => {
  const { width, height, quality = 80, format = 'auto' } = options
  
  let url = cloudinary.url(publicId, {
    secure: true,
    transformation: []
  })
  
  if (width || height) {
    url = cloudinary.url(publicId, {
      secure: true,
      transformation: [
        { width, height, crop: 'fill', gravity: 'auto' },
        { quality: `auto:${quality}` },
        { fetch_format: format }
      ]
    })
  }
  
  return url
}

export const getSignedUploadUrl = (folder: string = 'forest-wildlife') => {
  const timestamp = Math.round(Date.now() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  )
  
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder
  }
}
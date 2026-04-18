import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Request } from 'express'

const uploadDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, uploadDir)
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`)
  }
})

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|pdf|doc|docx/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)
  
  if (mimetype && extname) {
    cb(null, true)
  } else {
    cb(new Error('Only images, videos, and documents are allowed'))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 
  }
})

export const uploadSingle = (fieldName: string) => upload.single(fieldName)

export const uploadMultiple = (fieldName: string, maxCount: number = 5) => 
  upload.array(fieldName, maxCount)

export const handleUploadError = (err: any, _: Request, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      })
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files.'
      })
    }
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    })
  }
  
  next()
}
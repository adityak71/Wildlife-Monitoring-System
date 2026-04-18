import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware'
import { 
  uploadSingle, 
  uploadMultiple, 
  handleUploadError 
} from '../middlewares/upload.middleware'
import * as uploadController from '../controllers/upload.controller'

const router = Router()

router.use(authenticate)

router.post('/single',
  uploadSingle('image'),
  handleUploadError,
  uploadController.uploadSingleImage
)

router.post('/multiple',
  uploadMultiple('images', 5),
  handleUploadError,
  uploadController.uploadMultipleImages
)

router.post('/activity',
  uploadMultiple('images', 10),
  handleUploadError,
  uploadController.uploadActivityImages
)

router.delete('/file',
  uploadController.deleteFile
)

router.get('/signed-url',
  uploadController.getSignedUrl
)

export default router
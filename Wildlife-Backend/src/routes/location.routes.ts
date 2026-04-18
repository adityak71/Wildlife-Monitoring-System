import { Router } from 'express'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validation.middleware'
import {
  createLocationSchema,
  updateLocationSchema,
} from '../schemas/location.schems'
import * as locationController from '../controllers/location.controller'

const router = Router()

router.get('/',
  authenticate,
  locationController.getAllLocations
)

router.get('/stats',
  authenticate,
  locationController.getLocationStats
)

router.get('/:id',
  authenticate,
  locationController.getLocationById
)

router.post('/',
  authenticate,
  authorize('ADMIN'),
  validate(createLocationSchema),
  locationController.createLocation
)

router.put('/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateLocationSchema),
  locationController.updateLocation
)

router.delete('/:id',
  authenticate,
  authorize('ADMIN'),
  locationController.deleteLocation
)

export default router
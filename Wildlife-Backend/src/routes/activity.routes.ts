import { Router } from 'express'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validation.middleware'
import {
  createActivitySchema,
  updateActivityStatusSchema,
} from '../schemas/activity.schema'
import * as activityController from '../controllers/activity.controller'

const router = Router()

router.use(authenticate)

router.get('/',
  activityController.getAllActivities
)

router.get('/stats',
  activityController.getActivityStats
)

router.get('/:id',
  activityController.getActivityById
)

router.post('/',
  authorize('ADMIN', 'CONSERVATIONIST', 'RESEARCHER'),
  validate(createActivitySchema),
  activityController.createActivity
)

router.put('/:id',
  validate(createActivitySchema.partial()),
  activityController.updateActivity
)

router.patch('/:id/status',
  authorize('ADMIN'),
  validate(updateActivityStatusSchema),
  activityController.updateActivityStatus
)

router.delete('/:id',
  authorize('ADMIN'),
  activityController.deleteActivity
)

export default router
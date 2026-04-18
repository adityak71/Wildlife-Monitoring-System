import { Router } from 'express'
import { authenticate } from '../middlewares/auth.middleware'
import * as dashboardController from '../controllers/dashboard.controller'

const router = Router()

router.use(authenticate)

router.get('/',
  dashboardController.getDashboardData
)

router.get('/timeline',
  dashboardController.getActivityTimeline
)

export default router
import { Router } from 'express'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validation.middleware'
import { signupSchema, loginSchema } from '../schemas/auth.schema'
import * as authController from '../controllers/auth.controller'

const router = Router()

router.post('/signup', validate(signupSchema), authController.signup)
router.post('/login', validate(loginSchema), authController.login)
router.post('/logout', authController.logout)

router.get('/me', authenticate, authController.getCurrentUser)
router.get('/users', authenticate, authorize('ADMIN'), authController.getAllUsers)

export default router
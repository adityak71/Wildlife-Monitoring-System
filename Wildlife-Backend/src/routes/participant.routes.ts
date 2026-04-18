import { Router } from 'express'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import { validate } from '../middlewares/validation.middleware'
import {
  verifyParticipantSchema
} from '../schemas/participant.schema'
import * as participantController from '../controllers/participant.controller'

const router = Router()

router.post('/register',
  participantController.createParticipant
)

router.get('/',
  authenticate,
  authorize('ADMIN'),
  participantController.getAllParticipants
)

router.get('/stats',
  authenticate,
  authorize('ADMIN'),
  participantController.getParticipantStats
)

router.get('/:id',
  authenticate,
  authorize('ADMIN'),
  participantController.getParticipantById
)

router.put('/:id',
  authenticate,
  authorize('ADMIN'),
  participantController.updateParticipant
)

router.patch('/:id/verify',
  authenticate,
  authorize('ADMIN'),
  validate(verifyParticipantSchema),
  participantController.verifyParticipant
)

router.delete('/:id',
  authenticate,
  authorize('ADMIN'),
  participantController.deleteParticipant
)

export default router
import { Router } from 'express'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import * as speciesController from '../controllers/species.controller'

const router = Router()

router.get('/',
  authenticate,
  speciesController.getAllSpecies
)

router.get('/stats',
  authenticate,
  speciesController.getSpeciesStats
)

router.get('/conservation-status/:status',
  authenticate,
  speciesController.getSpeciesByConservationStatus
)

router.get('/:id',
  authenticate,
  speciesController.getSpeciesById
)

router.post('/',
  authenticate,
  authorize('ADMIN'),
  speciesController.createSpecies
)

router.put('/:id',
  authenticate,
  authorize('ADMIN'),
  speciesController.updateSpecies
)

router.delete('/:id',
  authenticate,
  authorize('ADMIN'),
  speciesController.deleteSpecies
)

export default router
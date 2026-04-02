// src/routes/profileRoutes.ts

import { Router } from 'express'
import { profileController } from '../controllers/profileController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

// Todas as rotas de perfil requerem autenticação
router.use(authMiddleware)

router.post('/', (req, res, next) => profileController.createOrUpdateProfile(req, res, next))
router.get('/', (req, res, next) => profileController.getProfile(req, res, next))
router.delete('/', (req, res, next) => profileController.deleteProfile(req, res, next))

// Restrições alimentares
router.post('/restrictions', (req, res, next) =>
  profileController.addFoodRestriction(req, res, next)
)
router.get('/restrictions', (req, res, next) =>
  profileController.getFoodRestrictions(req, res, next)
)
router.delete('/restrictions/:restrictionId', (req, res, next) =>
  profileController.removeFoodRestriction(req, res, next)
)

export default router

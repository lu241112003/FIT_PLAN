// src/routes/authRoutes.ts

import { Router } from 'express'
import { authController } from '../controllers/authController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

// Rotas públicas
router.post('/register', (req, res, next) => authController.register(req, res, next))
router.post('/login', (req, res, next) => authController.login(req, res, next))

// Rotas autenticadas
router.post('/change-password', authMiddleware, (req, res, next) =>
  authController.changePassword(req, res, next)
)
router.get('/me', authMiddleware, (req, res, next) => authController.me(req, res, next))

export default router

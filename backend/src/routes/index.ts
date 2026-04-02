// src/routes/index.ts

import { Router } from 'express'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'
import profileRoutes from './profileRoutes'
import dietRoutes from './dietRoutes'
import workoutRoutes from './workoutRoutes'

const router = Router()

// Registrar todas as sub-rotas
router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/profile', profileRoutes)
router.use('/diet', dietRoutes)
router.use('/workout', workoutRoutes)

export default router

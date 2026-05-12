import { Router } from 'express'
import { userController } from '../controllers/userController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()

// Todas as rotas de usuário requerem autenticação
router.use(authMiddleware)

router.get('/profile', (req, res, next) => userController.getCurrentUser(req, res, next))
router.put('/profile', (req, res, next) => userController.updateUser(req, res, next))
router.delete('/account', (req, res, next) => userController.deleteUser(req, res, next))
router.get('/stats', (req, res, next) => userController.getUserStats(req, res, next))

export default router

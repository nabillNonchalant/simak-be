import { Router } from 'express'
import KepalaSekolahController from '@/controllers/kepsek/KepalaSekolahController'
import { AuthMiddleware } from '@/middleware/AuthMiddleware'

const KepalaSekolahRouter = Router()

// semua endpoint hanya bisa diakses oleh kepala sekolah
KepalaSekolahRouter.get('/pending', AuthMiddleware, KepalaSekolahController.getPendingUsers)
KepalaSekolahRouter.post('/approve/:userId', AuthMiddleware, KepalaSekolahController.approveUser)
KepalaSekolahRouter.post('/reject/:userId', AuthMiddleware, KepalaSekolahController.rejectUser)

export default KepalaSekolahRouter

import { Router } from 'express'
import { authorizeRole } from '../../middleware/AuthorizeRole'
import  KepalaSekolahController  from '@/controllers/kepsek/KepalaSekolahController'

const router = Router()

// hanya role KEPALA_SEKOLAH yang boleh akses
router.get('/pending', authorizeRole(['KEPALA_SEKOLAH']), KepalaSekolahController.getPendingUsers)
router.post('/approve/:id', authorizeRole(['KEPALA_SEKOLAH']), KepalaSekolahController.approveUser)
router.post('/reject/:id', authorizeRole(['KEPALA_SEKOLAH']), KepalaSekolahController.rejectUser)

export default router

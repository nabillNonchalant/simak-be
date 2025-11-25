import AbsensiGuruController from '@/controllers/absensi/AbsensiGuruController'
import { fileUploadMiddleware } from '@/middleware/FileUploadMiddleware'
import { Router } from 'express'

const fileUpload = fileUploadMiddleware.fileUploadHandler('uploads', {
  maxFileSize : 10 * 1024 * 1024, // 10MB
  allowedFileTypes : ['image/gif', 'image/jpeg','image/jpg', 'image/png', 'image/webp'],
  saveToBucket : true,
})

export const AbsensiGuruRouter = (): Router => {
  const router = Router()

  router.get('/', AbsensiGuruController.getAllAbsensiguru)
  router.get('/:id', AbsensiGuruController.getAbsensiGuruById)
  router.post('/create', fileUpload.single('document'), AbsensiGuruController.createAbsensiGuru)
  router.put('/update/:id', AbsensiGuruController.updateAbsensiGuru)
  router.delete('/:id/delete', AbsensiGuruController.deleteAbsensiGuru)

  return router
  
}
import { CONFIG } from '@/config'
import { fileUploadMiddleware } from '@/middleware/FileUploadMiddleware'
import {
  type Express,
  type Request,
  type Response,
} from 'express'
import { AuthRoute } from './auth/AuthRoute'
import { UserRouter } from './master/UserRoute'
import TestController from '@/controllers/master/TestController'
import { ResponseData } from '@/utilities/Response'
import { WebPushNotifRouter } from './WebPushRouter'
import { NotificationRouter } from './notification/NotificationRouter'
import { LogRouter } from './LogRouter'
import { AuthMiddleware } from '@/middleware/AuthMiddleware'
import { getBuildInfo } from '@/utilities/GetBuildInfo'
import { RoleRouter } from './master/RoleRouter'
import { ScheduleTeacherRouter } from './schedule/scheduleTeacherRoutes'
import { generatePermissionList } from '@/middleware/PermissionMidlleware'
import { AbsensiGuruRouter } from './Absensi/AbsensiGuruRoutes'
import { AbsensiMuridRouter } from './Absensi/AbsensiMuridRoute'
import { MasterClassRouter } from './masterclass/MasterClassRoute'
import KepalaSekolahRouter from './kepsek/KepalaSekolahRoutes'
import dashboardRouter from './Dashboard/DasboardRoutes'
import guruRouter from './RekapanGuru/RekapanGuruRoutes'
import getAllRekapanMuridrouter from './RekapanMurid/RekapanMuridRoutes'
import ForgotPasswordRouter from './auth/ForgotPasswordrouter'

const fileUpload = fileUploadMiddleware.fileUploadHandler('uploads', {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/gif', 'image/jpeg','image/jpg', 'image/png', 'image/webp'],
  saveToBucket: true,
})

export const appRouter = async function (app: Express): Promise<void> {

  // ROOT
  app.get('/', (req: Request, res: Response) => {
    const data = {
      buildInfo: getBuildInfo(),
      message: `Welcome to ${CONFIG.appName} for more function use ${CONFIG.apiUrl} as main router`,
    }
    return ResponseData.ok(res, data, 'Welcome to API')
  })

  // TEST ROUTES
  app.post(CONFIG.apiUrl + 'test-up-file', fileUpload.single('gambar'), TestController.testFileUploadToS3)
  app.post(CONFIG.apiUrl + 'test-up-delete', fileUpload.single('images'), TestController.deleteFileFromS3)
  app.post(CONFIG.apiUrl + 'test-notif', TestController.testNotif)


  // ===========================================
  // PUBLIC ROUTES (TANPA TOKEN)
  // ===========================================
  app.use(CONFIG.apiUrl + 'auth', AuthRoute())
  app.use(CONFIG.apiUrl + 'password', ForgotPasswordRouter) // forgot, otp, reset password


  // ===========================================
  // PRIVATE ROUTES (WAJIB TOKEN)
  // ===========================================
  app.use(AuthMiddleware, generatePermissionList)

  app.get(CONFIG.apiUrl + 'generate-permission', async (req: Request, res: Response) => {
    return ResponseData.ok(res, res.locals.permissionList, 'Success')
  })


  // web push
  app.use(CONFIG.apiUrl + 'web-push', WebPushNotifRouter())

  // notification route
  app.use(CONFIG.apiUrl + 'notification', NotificationRouter())

  // log route
  app.use(CONFIG.apiUrl + 'log', LogRouter())

  // master & others
  app.use(CONFIG.apiUrl + 'master/user', UserRouter())
  app.use(CONFIG.apiUrl + 'master/role', RoleRouter())
  app.use(CONFIG.apiUrl + 'schedule', ScheduleTeacherRouter())
  app.use(CONFIG.apiUrl + 'teacher', AbsensiGuruRouter())
  app.use(CONFIG.apiUrl + 'murid', AbsensiMuridRouter())
  app.use(CONFIG.apiUrl + 'class', MasterClassRouter())
  app.use(CONFIG.apiUrl + 'kepsek', KepalaSekolahRouter)
  app.use(CONFIG.apiUrl + 'dashboard', dashboardRouter)
  app.use(CONFIG.apiUrl + 'rekapan', guruRouter)
  app.use(CONFIG.apiUrl + 'rekapan', getAllRekapanMuridrouter)

}

import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { CONFIG } from '../config'

export type AllowedMimeType =
  | 'image/jpeg'
  | 'image/png'
  | 'image/jpg'
  | 'image/gif'
  | 'image/webp'
  | 'application/pdf'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'text/csv'
  | 'application/csv';

type ConfigType = {
  maxFileSize: number;
  allowedFileTypes?: AllowedMimeType[];
  saveToBucket?: boolean;
};

const defaultConfig: ConfigType = {
  maxFileSize: CONFIG.maxFileSize as number,
  allowedFileTypes: [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/csv',
  ],
  saveToBucket: CONFIG.saveToBucket,
}

export const fileUploadMiddleware = {
  fileUploadHandler(folder: string, config: Partial<ConfigType> = {}) {
    const finalConfig: ConfigType = {
      ...defaultConfig,
      ...config,
    }

    const uploadRoot = path.join(process.cwd(), 'public')
    const uploadPath = path.join(uploadRoot, folder)

    // Ensure folder exists
    if (!fs.existsSync(uploadRoot)) fs.mkdirSync(uploadRoot)
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true })

    const storage = multer.diskStorage({
      destination: (_, __, cb) => cb(null, uploadPath),
      filename: (_, file, cb) => {
        const ext = path.extname(file.originalname)
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`
        cb(null, unique)
      },
    })

    return multer({
      storage,
      limits: { fileSize: finalConfig.maxFileSize },
      fileFilter: (_, file, cb) => {
        const mime = file.mimetype.toLowerCase() as AllowedMimeType
        const isAllowed = finalConfig.allowedFileTypes?.includes(mime)

        if (!isAllowed) {
          return cb(new Error(`❌ Unsupported file type: ${mime}`))
        }

        cb(null, true)
      },
    })
  },
}

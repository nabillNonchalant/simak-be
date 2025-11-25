import dotenv from 'dotenv'
dotenv.config()

import express, { Express } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import http from 'http'
import parsingArgs from '@/utilities/ParseArgs'
import { CONFIG } from '@/config'
import { init } from '@/config/socket'
import { ResponseMiddleware } from '@/middleware/ResponseMiddleware'
import { appRouter } from '@/routes/api.route'
import { errorMiddleware, notFoundMiddleware } from '@/middleware/GlobalErrMiddleware'
import handleSocketEvents from '@/socket/EventHandler'
import '@/services/google/GoogelOAuthService'
import passport from 'passport'
import { initWebPush } from '@/config/webPush'
import { MasterClassRouter } from './src/routes/masterclass/MasterClassRoute'
import path from 'path'

process.env.TZ = 'Asia/Jakarta'

// Parse args
const argsObj = parsingArgs(['::port'])
if (argsObj.port) {
  const portNumber = Number(argsObj.port)
  if (isNaN(portNumber) || portNumber < 0 || portNumber > 65535) {
    console.error('Port must be a number between 0-65535')
    process.exit(1)
  }
  CONFIG.port = portNumber
}

const app: Express = express()
const server = http.createServer(app)
const io = init(server)

// === GLOBAL MIDDLEWARE ===
app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(passport.initialize())

// Static Files
app.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')))
app.use('/public', express.static('public'))

// CORS Header Fallback
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  next()
})

// === SOCKET ===
handleSocketEvents(io)

// Web Push Init
if (CONFIG.pushNotif) initWebPush()

// Response Middleware
app.use(ResponseMiddleware)

// Routers
app.use(CONFIG.apiUrl + 'class', MasterClassRouter())
appRouter(app)

// Error Handling
app.all('*', notFoundMiddleware)
app.use(errorMiddleware)

// Start Server
server.listen(CONFIG.port, () => {
  console.log(`🚀 Server running on port ${CONFIG.port}`)
})

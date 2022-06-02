const express = require('express')
const { createServer } = require('http')

const { PrismaClient } = require('@prisma/client')

const app = express()
const httpServer = createServer(app)

// const multer = require('multer')
// const upload = multer({ dest: 'static/uploads' })
const { Server } = require('socket.io')

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
})
const types = [
  'T_Answers',
  'T_Categories',
  'T_Exams',
  'T_Questions',
  'Examiners',
  'Battries',
  'Battary_Exam',
  'Assign',
  'Answers',
  'reception',
]

const prisma = new PrismaClient()
app.use(express.json())
require('./examinerRoutes.js')(app, prisma, types)
require('./examRoutes.js')(app, prisma, types)
require('./userRoutes')(app, prisma, types)
require('./badanyRoutes')(app, prisma, types)
require('./oracleRoutes')(app, prisma, types)
require('./followRoutes')(app, prisma, io, types)
require('./fake')(app, prisma, types)
httpServer.listen(3000)
module.exports = app

const { createServer } = require('http')
const express = require('express')
const { PrismaClient } = require('@prisma/client')
const app = express()
const httpServer = createServer(app)
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
app.use(express.json({ limit: '500mb' }))
app.use(express.urlencoded({ limit: '500mb' }))

require('./examinerRoutes.js')(app, prisma, types)
require('./examRoutes.js')(app, prisma, types)
require('./reportsRoutes')(app, prisma)
require('./plansRoutes')(app, prisma, types)
require('./userRoutes')(app, prisma, types)
require('./badanyRoutes')(app, prisma, types)
require('./oracleRoutes')(app, prisma, types)
require('./followRoutes')(app, prisma, io, types)
require('./logRoute')(app, prisma, types)
require('./interview')(app, prisma, types)
require('./fake')(app, prisma, types)
httpServer.listen(3000)
module.exports = app

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



const prisma = new PrismaClient()
app.use(express.json())

require('./examinerRoutes.js')(app, prisma)
require('./examRoutes.js')(app, prisma)
require('./userRoutes')(app, prisma)
require('./badanyRoutes')(app, prisma)
require('./oracleRoutes')(app, prisma)
require('./followRoutes')(app, prisma, io)
require('./fake')(app, prisma)
httpServer.listen(3000)
module.exports = app

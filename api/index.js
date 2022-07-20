const { createServer } = require('http')
const express = require('express')
const { PrismaClient } = require('@prisma/client')
// const gulp = require('gulp');
// const jsdoc = require('gulp-jsdoc3')

const app = express()
const httpServer = createServer(app)
// gulp.task('doc', function (cb) {
//   gulp.src(['README.md', './store/*.js'], { read: false }).pipe(jsdoc(cb))
// })
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
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))

require('./examinerRoutes.js')(app, prisma, types)
require('./examRoutes.js')(app, prisma, types)
require('./userRoutes')(app, prisma, types)
require('./badanyRoutes')(app, prisma, types)
require('./oracleRoutes')(app, prisma, types)
require('./followRoutes')(app, prisma, io, types)
require('./logRoute')(app, prisma, types)
require('./interview')(app, prisma, types)
require('./fake')(app, prisma, types)
httpServer.listen(3000)
module.exports = app

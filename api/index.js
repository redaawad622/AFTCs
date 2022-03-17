const express = require('express')
const { PrismaClient } = require('@prisma/client')

const app = express()

// const multer = require('multer')
// const upload = multer({ dest: 'static/uploads' })

const prisma = new PrismaClient()
app.use(express.json())


require('./examinerRoutes.js')(app, prisma)
require('./examRoutes.js')(app, prisma)
require('./userRoutes')(app, prisma)
require('./badanyRoutes')(app, prisma)
require('./oracleRoutes')(app, prisma)
require('./fake')(app, prisma)

module.exports = app

const express = require('express')
const { PrismaClient } = require('@prisma/client')
const app = express()
const multer = require('multer')
const upload = multer({ dest: 'static/uploads' })

const prisma = new PrismaClient()
app.use(express.json())
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

app.get('/badany', function () {
  const port = new SerialPort('COM1', {
    baudRate: 9600,
  })
  const parser = new Readline()
  port.pipe(parser)

  parser.on('data', (line) => {
    console.log(line)
  })

  port.write('fwefwe wfwef')

  res.json('fe')
})

require('./examRoutes.js')(app,prisma)
require('./userRoutes')(app,prisma)

module.exports = app

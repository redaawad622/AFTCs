const { PrismaClient } = require('@prisma/client')
const express = require('express')
const reportsRoutes = require('../../api/reportsRoutes')
const app = express()

const prisma = new PrismaClient()
test('Checks', () => {
  const data = reportsRoutes(app, prisma)
  console.log(data)
})

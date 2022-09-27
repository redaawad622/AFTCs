const fs = require('fs')

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const chalk = require('chalk')
// eslint-disable-next-line no-console
const log = console.log

function getDBBak(trainingCenterName) {
  fs.copyFileSync('./prisma/exam.db', `./${trainingCenterName}.db`)
}

async function getTrainingCenterName() {
  return await prisma.t_Categories.findFirst()
}

async function changeBackupValue() {
  await prisma.examiners.updateMany({
    where: {
      toBackup: true,
    },
    data: { toBackup: false },
  })
}

async function orchestrator() {
  const statusMessage = chalk.white.bold(`جاري نسخ قاعدة البيانات`)
  log(statusMessage)
  const centerName = await (await getTrainingCenterName()).Cat_Name
  getDBBak(centerName)
  changeBackupValue()
  const finalMessage = chalk.green.bold(`تم الانتهاء من النسخ`)
  log(finalMessage)
  setTimeout(() => log(''), 3000)
}

orchestrator()

import { execFile } from 'child_process'
const bcrypt = require('bcryptjs')

module.exports = function (app, prisma, types) {
  app.get('/getAllUser', async (req, res) => {
    const users = await prisma.T_Categories.findMany({
      where: {
        NOT: {
          type: {
            equals: 0,
          },
        },
      },
    })
    res.json(users)
  })

  app.post('/saveUser', async (req, res) => {
    const { name, password } = req.body
    try {
      const user = await prisma.T_Categories.create({
        data: {
          Cat_Name: name,
          password: bcrypt.hashSync(password, 8),
        },
      })

      res.json(user)
    } catch (e) {
      if (e.clientVersion && e.code) res.status(422).json(e)
    }
  })

  app.post('/login', async (req, res) => {
    const { name, password } = req.body
    const user = await prisma.T_Categories.findUnique({
      where: {
        Cat_Name: name,
      },
    })
    if (!user) {
      res.status(404).json('المستخدم غير موجود')
    }
    const checkPassword = bcrypt.compareSync(password, user.password)
    if (!checkPassword) res.status(401).json('خطأ في كلمة المرور')

    // const token = 'erfrefgerfg'
    delete user.password
    await prisma.T_Categories.update({
      where: {
        Cat_Name: name,
      },
      data: {
        isLogin: true,
      },
    })
    res.status(200).json(user)
  })

  app.post('/resetPassword', async (req, res) => {
    const { oldPassword, newPassword, name } = req.body
    if (!oldPassword || !newPassword) {
      res.status(401).json('من فضلك ادخل البيانات كاملة')
    }
    const user = await prisma.T_Categories.findUnique({
      where: {
        Cat_Name: name,
      },
    })
    if (!user) {
      res.status(404).json('المستخدم غير موجود')
    }
    const checkPassword = bcrypt.compareSync(oldPassword, user.password)

    if (!checkPassword) res.status(401).json(' خطأ في كلمة المرور القديمه')

    delete user.password
    await prisma.T_Categories.update({
      where: {
        Cat_Name: name,
      },
      data: {
        password: bcrypt.hashSync(newPassword, 8),
      },
    })

    await prisma.Log.create({
      data: {
        user_id: Number(user.Cat_ID),
        operation_type: 'delete',
        description: ' تم تغير كلمة سر' + user.Cat_Name,
        type: types[1],
      },
    })
    res.status(200).json(user)
  })
  app.post('/logout', async (req, res) => {
    await prisma.T_Categories.updateMany({
      data: {
        isLogin: false,
      },
    })
    res.status(200).json('logout')
  })
  app.post('/getCurrentLogin', async (_, res) => {
    const users = await prisma.T_Categories.findMany({
      where: {
        isLogin: true,
      },
    })
    res.status(200).json(users.length > 0 ? users[0] : null)
  })
  app.post('/truncate', async (req, res) => {
    const { table, password, name } = req.body
    const user = await prisma.T_Categories.findUnique({
      where: {
        Cat_Name: name,
      },
    })
    if (!user) {
      res.status(404).json('المستخدم غير موجود')
    }
    const checkPassword = bcrypt.compareSync(password, user.password)
    if (!checkPassword) res.status(401).json('خطأ في كلمة المرور')
    if (table === 'Battries') {
      await prisma.Battary_Exam.deleteMany({})
    }
    await prisma[table].deleteMany({})
    await prisma.Log.create({
      data: {
        user_id: Number(user.Cat_ID),
        operation_type: 'delete',
        description: ' مسح بيانات جدول  ' + table,
        type: table,
      },
    })
    res.status(200).json('done')
  })
  app.post('/setAudio', async (req, res) => {
    await prisma.T_Answers.updateMany({
      data: {
        Ans_audio: null,
      },
    })
    res.status(200).json()
  })
  app.post('/changePageZooming', async (req, res) => {
    const userId = req.headers.id
    const user = await prisma.T_Categories.update({
      where: {
        Cat_ID: Number(userId),
      },
      data: {
        zoom: Number(req.body.zoom),
      },
    })
    res.status(200).json(user)
  })
  app.post('/openFile', (req, res) => {
    const { url } = req.body

    const child = execFile(url, function (error, stdout, stderr) {
      if (error) {
        res.status(404).json()
      }
    })
    child.on('exit', function (code) {
      console.log(code)
    })
    res.status(200).json()
  })
}

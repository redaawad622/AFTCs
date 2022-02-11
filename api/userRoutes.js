const bcrypt = require('bcryptjs')

module.exports = function (app, prisma) {
  app.get('/getAllUser', async (req, res) => {
    const users = await prisma.T_Categories.findMany()
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
    res.status(200).json(user)
  })
}

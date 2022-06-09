const fs = require('fs')

module.exports = function (app, prisma) {
  app.get('/fetchLog', async (req, res) => {
    // Fetch logs data from prisma
    const {
      itemsPerPage,
      page,
      sortBy,
      sortDesc,
      user,
      type,
      operationType,
      date,
    } = req.query
    const option = {
      where: {},
      orderBy: {},
      select: {
        id: true,
        user_id: true,
        user: true,
        description: true,
        operation_type: true,
        type: true,
        created_at: true,
      },
    }
    // eslint-disable-next-line eqeqeq
    if (itemsPerPage != -1) {
      option.skip = (page - 1) * Number(itemsPerPage) || 0
      option.take = Number(itemsPerPage) || 50
    }
    if (type) {
      option.where.type = { equals: type }
    }
    if (operationType) {
      option.where.operationType = { equals: operationType }
    }
    if (user) {
      const getUser = await prisma.T_Categories.findUnique({
        where: {
          Cat_Name: user,
        },
      })
      option.where.user_id = { equals: Number(getUser.Cat_ID) }
    }
    if (date) {
      option.where.created_at = {
        gte: new Date(date),
        lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
      }
    }
    if (sortBy && sortBy.length > 0) {
      option.orderBy[sortBy[0]] = sortDesc[0] === 'false' ? 'asc' : 'desc'
    }
    const logs = await prisma.Log.findMany(option)
    delete option.skip
    delete option.take
    delete option.orderBy
    delete option.select
    const allLogs = await prisma.Log.count(option)
    res.json({ logs, allLogs })
  })

  app.get('/filterQuestionImages', async (_, res) => {
    const questionImages = await prisma.T_Questions.findMany({
      include: {
        T_Answers: true,
      },
    })
    res.json(questionImages)
  })

  app.post('/setImg', async (req, res) => {
    const { image, questionId, ansId } = req.body
    const dir = 'D:/AFTCs/AFTCs/static/images/' + questionId
    if (!fs.existsSync(dir)) {
      await fs.mkdirSync(dir, { recursive: true })

      if (!fs.existsSync(dir + '/Answers')) {
        await fs.mkdirSync(dir + '/Answers', { recursive: true })
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (!fs.existsSync(dir + '/Answers')) {
        await fs.mkdirSync(dir + '/Answers', { recursive: true })
      }
    }
    await fs.writeFile(
      `${dir}/Answers/${ansId}.png`,
      image,
      'base64',
      (err) => {
        console.log(err)
      }
    )
    return res.json('done')
  })
}

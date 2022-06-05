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

  // app.get('/filterImages', async (req, res) => {
  //   // Fetch logs data from prisma
  //   const answers = await prisma.T_Answers.findMany({
  //     where: {
  //       Ans_Is_Pic: true,
  //     },
  //   })
  //   res.json(answers)
  // })
  // app.get('/filterQuestionImages', async (req, res) => {
  //   // Fetch logs data from prisma
  //   const questionImages = await prisma.T_Questions.findMany({
  //     where: {
  //       Qus_Is_Pic: true,
  //       Qus_Exm_ID: req.body,
  //     },
  //   })
  //   res.json(questionImages)
  // })
}

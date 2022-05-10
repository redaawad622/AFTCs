module.exports = function (app, prisma, io) {
  app.get('/guests', async (req, res) => {
    const { date } = req.query
    const option = {
      where: {},
    }

    if (date) {
      option.where.created_at = {
        gte: new Date(date),
        lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000),
      }
    }
    const guests = await prisma.reception.findMany(option)
    res.json({ guests })
  })
  app.post('/guests', async (req, res) => {
    const data = req.body
    Object.keys(data).forEach(
      (k) => (data[k] == null || data[k] === '') && delete data[k]
    )
    try {
      const guest = await prisma.reception.upsert({
        where: {
          id: data.id || 0,
        },
        create: { ...data },
        update: { ...data },
      })
      io.on('connection', (socket) => {
        console.log('a user connected')
        socket.emit('guestSaved', guest)
      })
      io.on('error', (error) => {
        console.log('a user ghrft', error)
      })

      res.json(guest)
    } catch (e) {
      console.log('error', e)
      if (e.clientVersion && e.code) res.status(422).json(e)
    }
  })
  app.post('/setCase', async (req, res) => {
    const data = req.body

    try {
      const guest = await prisma.reception.update({
        where: {
          id: data.id,
        },
        data: { case: data.val, update: 1 },
      })
      res.json(guest)
    } catch (e) {
      if (e.clientVersion && e.code) res.status(422).json(e)
    }
  })

  app.post('/guests/delete', async (req, res) => {
    const { id } = req.body
    await prisma.reception.delete({
      where: {
        id,
      },
    })
    res.json('done')
  })
  app.get('/checkCase', async (req, res) => {
    let { lastIds } = req.query
    lastIds = lastIds || []
    await prisma.reception.updateMany({
      where: {
        id: { in: lastIds.map(Number) },
      },
      data: { update: 0, new: 0 },
    })
    const newRows = await prisma.reception.findMany({
      where: {
        new: 1,
      },
    })
    const updateRows = await prisma.reception.findMany({
      where: {
        update: 1,
      },
    })
    const ids = newRows.map((el) => el.id).concat(updateRows.map((el) => el.id))

    res.json({ newRows, updateRows, ids })
  })
}

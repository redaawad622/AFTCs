module.exports = function (app, prisma) {
  app.get('/getExaminer', async (req, res) => {
    const { id } = req.query
    const examiner = await prisma.Examiners.findFirst({
      where: {
        OR: [
          {
            national_id: {
              equals: id,
            },
          },
          {
            triple_number: {
              equals: id,
            },
          },
          {
            barcode: {
              equals: id,
            },
          },
          {
            sold_id: {
              equals: id,
            },
          },
        ],
      },
    })
    res.json(examiner)
  })
  app.post('/save', async (req, res) => {
    const data = req.body
    Object.keys(data).forEach(
      (k) => (data[k] == null || data[k] === '') && delete data[k]
    )
    try {
      const examiner = await prisma.Examiners.create({
        data: { ...data },
      })
      res.json(examiner)
    } catch (e) {
      if (e.clientVersion && e.code) res.status(422).json(e)
    }
  })
}

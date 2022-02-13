import { readFileSync } from 'fs'
import MDBReader from 'mdb-reader'
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
      include: {
        _count: {
          select: {
            Answers: true,
          },
        },
      },
    })
    res.json(examiner)
  })
  app.get('/getExaminers', async (req, res) => {
    const {
      search,
      qualification,
      examFinish,
      itemsPerPage,
      page,
      sortBy,
      sortDesc,
    } = req.query
    const option = {
      where: {},
      orderBy: {},
    }
    // eslint-disable-next-line eqeqeq
    if (itemsPerPage != -1) {
      option.skip = (page - 1) * Number(itemsPerPage) || 0
      option.take = Number(itemsPerPage) || 50
    }

    if (search) {
      option.where.OR = [
        {
          name: {
            contains: search,
          },
        },
        {
          national_id: {
            contains: search,
          },
        },
        {
          barcode: {
            contains: search,
          },
        },
      ]
    }
    // if (qualification) {
    //   option.where.qualification = { equals: Number(qualification) }
    // }
    if (examFinish) {
      if (Number(examFinish)) {
        option.where.Answers = {
          some: {},
        }
      } else {
        option.where.Answers = {
          none: {},
        }
      }
    }

    if (sortBy && sortBy.length > 0) {
      const sorts = sortBy[0].split('.')
      if (sorts.length > 1) {
        const dir = Boolean(sortDesc[0])
        option.orderBy[sorts[0]] = {
          [sorts[1]]: dir ? 'desc' : 'asc',
        }
      } else {
        const dir = Boolean(sortDesc[0])
        option.orderBy[sortBy[0]] = dir ? 'desc' : 'asc'
      }
    }
    const examiners = await prisma.Examiners.findMany(option)
    const allExaminers = await prisma.Examiners.count()
    res.json({ examiners, allExaminers })
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

  app.get('/readExaminerFromMdb', async (req, res) => {
    const buffer = readFileSync('./prisma/db.mdb')
    const reader = new MDBReader(buffer)
    const table = await reader.getTable('Examiners')
    // table.getColumnNames() // ['id', 'name', 'color']
    const data = await table.getData()
    const exist = await prisma.Examiners.findMany()
    data.filter(
      (q) => exist.findIndex((a) => a.national_id === q.national_id) < 0
    )
    const examiners = []
    await data.forEach(async (e) => {
      const ex = await prisma.Examiners.upsert({
        where: {
          national_id: e.national_id,
        },
        update: {},
        create: e,
      })
      examiners.push(ex)
    })
    res.json(examiners) // [{id: 5, name: 'Ashley', color: 'black'}, ...]
  })
}

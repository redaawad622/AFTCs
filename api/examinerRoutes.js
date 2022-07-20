import { readFileSync } from 'fs'
import MDBReader from 'mdb-reader'
module.exports = function (app, prisma, types) {
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
      battaryId,
      stage,
      withResualt,
      register,
      deleteItems,
      interview,
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
    option.where.isDeleted = { equals: Boolean(false) }

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
        {
          sold_id: {
            contains: search,
          },
        },
        {
          triple_number: {
            contains: search,
          },
        },
      ]
    }
    if (register) {
      const id = req.headers.id
      option.where.user_id = { equals: Number(id) }
    }
    if (qualification) {
      option.where.qualification_code = { equals: Number(qualification) }
    }
    if (battaryId) {
      option.where.battary_id = { equals: Number(battaryId) }
    }
    if (stage) {
      option.where.stage = { equals: stage }
    }
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
    if (interview) {
      if (Number(interview)) {
        option.where.Interview = {
          some: {},
        }
      } else {
        option.where.Interview = {
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
    option.include = {
      _count: {
        select: { Interview: true, Answers: true },
      },
      CustomExam: {
        include: {
          exam: {
            select: {
              Exm_Name: true,
            },
          },
        },
      },
    }
    if (withResualt) {
      option.include.Answers = {
        select: {
          id: true,
          exam_id: true,
          question_id: true,
          answer_id: true,
          examiner_id: true,
          answer: {
            select: {
              Ans_Value: true,
            },
          },
        },
      }
    }

    let examiners = await prisma.Examiners.findMany(option)

    if (examiners && examiners.length > 0) {
      if (examiners[0].Answers) {
        examiners = examiners.map((examiner) => {
          const exm = Object.assign({}, examiner, {
            Answers: examiner.Answers.reduce((r, a) => {
              r[a.exam_id] = [...(r[a.exam_id] || []), a]
              return r
            }, {}),
          })
          Object.keys(exm.Answers).forEach((k) => {
            exm.Answers[k] = exm.Answers[k].reduce((a, b) => {
              return a + b.answer.Ans_Value
            }, 0)
          })
          return exm
        })
      }
    }
    delete option.skip
    delete option.take
    delete option.orderBy
    delete option.include
    if (deleteItems) {
      await prisma.Examiners.deleteMany(option)
    }
    const allExaminers = await prisma.Examiners.count(option)
    res.json({ examiners, allExaminers })
  })
  app.post('/save', async (req, res) => {
    const data = req.body
    const id = req.headers.id
    Object.keys(data).forEach(
      (k) => (data[k] == null || data[k] === '') && delete data[k]
    )
    if (data.sold_id) {
      data.user_id = Number(id)
    }
    try {
      const examiner = await prisma.Examiners.upsert({
        where: {
          national_id: data.national_id,
        },
        create: { ...data },
        update: { ...data },
      })
      await prisma.Log.create({
        data: {
          user_id: Number(id),
          operation_type: 'insertOrUpdate',
          description:
            ' تسجيل او تحديث بيانات ممتحن يحمل رقم قومي ' +
            examiner.national_id,
          type: types[4],
        },
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
    let data = await table.getData()
    const exist = await prisma.Examiners.findMany()
    data = data.filter(
      (q) => exist.findIndex((a) => a.national_id === q.national_id) < 0
    )
    const values = data
      .map(
        (value) =>
          `('${value.national_id}', '${value.name}', '${value.stage}', ${
            value.mohafza_code || null
          }, ${value.qualification_code || null})`
      )
      .join(',\n\t')

    await prisma.$executeRawUnsafe(
      `INSERT INTO \`Examiners\` (national_id, name,stage,mohafza_code,qualification_code) VALUES \n\t${values};`
    )
    res.json(data)
  })
  app.post('/readUnitsFromMdb', async (req, res) => {
    console.log('start')
    try {
      const buffer = readFileSync('./prisma/TNZ_GEHA_CODE.mdb')
      const reader = new MDBReader(buffer)
      const table = await reader.getTable('TNZ_GEHA_CODE')
      // table.getColumnNames() // ['id', 'name', 'color']
      console.log('fetching')
      let data = await table.getData()
      console.log('map data....')

      data = data.map((v) => {
        return prisma.$executeRawUnsafe(
          `UPDATE Examiners SET UNIT_NAME ='${v.UNIT_NAME}',GEHA_NAME ='${
            v.GEHA_NAME
          }',TAMARKZ_NAME ='${v.TAMARKZ_NAME}',UNIT_ARMY_NAME ='${
            v.UNIT_ARMY_NAME
          }',ARMY_TAGNEED_NAME ='${v.ARMY_TAGNEED_NAME}',sold_id ='${
            v.MIL_NO || null
          }' WHERE triple_number = '${v.RAKMSOLASY}'`
        )
      })
      console.log('start update ', data.length)
      const whatDone = await prisma.$transaction(data)
      console.log('done')
      res.json(
        `عدد ما تم تحديثه (${
          whatDone.filter((e) => e === 1).length
        }) عدد الاخطاء و ما لم يتم تحديثه (${
          whatDone.filter((e) => e === 0).length
        })`
      )
    } catch (error) {
      console.log(error)
      return res.status(422).json(error)
    }
  })
  app.post('/deleteExaminer', async (req, res) => {
    const { id } = req.body
    await prisma.Examiners.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    })
    const userId = req.headers.id

    await prisma.Log.create({
      data: {
        user_id: Number(userId),
        operation_type: 'delete',
        description: ' مسح بيانات ممتحن يحمل رقم قومي ' + id,
        type: types[4],
      },
    })
    res.json('done')
  })
  app.post('/writeExaminerToMdb', async (req, res) => {
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

  app.post('/saveExam', async (req, res) => {
    const { barcode, examid, result } = req.body
    const examiner = await prisma.Examiners.findFirst({
      where: {
        OR: [
          {
            national_id: {
              equals: barcode,
            },
          },
          {
            triple_number: {
              equals: barcode,
            },
          },
          {
            barcode: {
              equals: barcode,
            },
          },
          {
            sold_id: {
              equals: barcode,
            },
          },
        ],
      },
    })
    if (examiner) {
      await prisma.CustomExam.upsert({
        where: {
          examiner_id_exam_id: {
            examiner_id: examiner.id,
            exam_id: Number(examid),
          },
        },
        create: {
          examiner_id: examiner.id,
          value: result,
          exam_id: Number(examid),
        },
        update: {},
      })
    }
    res.json(result)
  })
  app.get('/checkIsDone', async (req, res) => {
    const { id, examId } = req.query
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
    let done = 0
    if (examiner) {
      const exam = await prisma.CustomExam.findUnique({
        where: {
          examiner_id_exam_id: {
            examiner_id: examiner.id,
            exam_id: Number(examId),
          },
        },
      })

      if (exam) {
        done = 1
      }
      res.json({ done })
    } else {
      res.json({ done })
    }
    // check if done
  })

  app.get('/saveWeapon', async (req, res) => {
    const buffer = readFileSync('./prisma/selah_cod.mdb')
    const reader = new MDBReader(buffer)
    const table = await reader.getTable('SELAH_COD')
    // table.getColumnNames() // ['id', 'name', 'color']
    const data = await table.getData()
    const values = data
      .map((value) => `('${value.V_SELAH}', '${value.MIL_SELAH}')`)
      .join(',\n\t')

    await prisma.$executeRawUnsafe(
      `INSERT INTO \`Weapons\` (V_SELAH, MIL_SELAH) VALUES \n\t${values};`
    )
    res.json(data)
  })
}

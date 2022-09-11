/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
module.exports = function (app, prisma, types) {
  app.get('/getExaminer', async (req, res) => {
    const { id, search } = req.query
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
        Answers: {
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
        },
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
      withResult,
      newSet,
      register,
      deleteItems,
      transReason,
      recommendation,
      recommendation_res,
      interview,
      interviewEntqaDone,
      final_hospital_result,
      examiner_status,
      user,
      nafsy,
      final_opinion,
      again,
      isNoticed,
      showAll,
      hasUnit,
    } = req.query
    const option = {
      where: {},
      orderBy: {},
    }
    // eslint-disable-next-line
    if (itemsPerPage != -1) {
      option.skip = (page - 1) * Number(itemsPerPage) || 0
      option.take = Number(itemsPerPage) || 50
    }
    option.where.isDeleted = { equals: Boolean(false) }

    if (search) {
      option.where.OR = [
        {
          national_id: {
            contains: search,
          },
        },
        {
          name: {
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
    if (again) {
      option.where.again = { equals: Boolean(Number(again)) }
    }
    if (isNoticed) {
      const noticed = Number(isNoticed)
      switch (noticed) {
        case 1:
          option.where.isNoticed = { equals: true }
          if (newSet) {
            option.where.isNoticedAgain = { equals: false }
          }
          break
        case 2:
          option.where.isNoticedAgain = { equals: true }
          break
        case 3:
          option.where.isNoticed = { equals: false }
          break
      }
    }
    if (user) {
      option.where.user_id = { equals: Number(user) }
    }
    if (qualification || qualification === '0' || qualification === 0) {
      option.where.qualification_code = { equals: Number(qualification) }
    }
    if (battaryId) {
      option.where.battary_id = { equals: Number(battaryId) }
    }
    if (stage) {
      option.where.stage = { equals: stage }
    }

    if (hasUnit) {
      if (Number(hasUnit)) {
        option.where.NOT = [
          {
            UNIT_NAME: null,
          },
        ]
      } else {
        option.where.UNIT_NAME = {
          equals: null,
        }
      }
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

    if (
      final_opinion ||
      transReason ||
      recommendation ||
      recommendation_res ||
      examiner_status ||
      final_hospital_result ||
      interviewEntqaDone
    ) {
      option.where.Interview = {
        some: {},
      }
      option.include.Interview = {}
    }

    if (withResult) {
      option.include.Answers = {}
      if (nafsy) {
        let battary = await prisma.Battries.findUnique({
          where: {
            id: 11, // بطارية النفسي
          },
          include: {
            Battary_Exam: true,
          },
        })
        battary = battary.Battary_Exam.map((ex) => ex.exam_id)
        option.include.Answers.where = { exam_id: { in: battary } }
      }

      option.include.Answers.select = {
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
      }
    }

    let examiners = await prisma.Examiners.findMany(option)

    // after fe

    let showAllExaminers = null
    if (showAll) {
      delete option.skip
      delete option.take
      showAllExaminers = await prisma.Examiners.findMany(option)
    }

    // filter interview
    const interviewFilter = {
      final_opinion,
      transReason,
      recommendation,
      recommendation_res,
      examiner_status,
      final_hospital_result,
    }
    for (const key in interviewFilter) {
      if (
        Object.hasOwnProperty.call(interviewFilter, key) &&
        !interviewFilter[key]
      ) {
        delete interviewFilter[key]
      }
    }

    if (Object.keys(interviewFilter).length > 0) {
      examiners = examiners.filter((elm) => {
        let isTrue = true
        for (const key in interviewFilter) {
          const type = typeof elm.Interview[0][key]
          let filter = interviewFilter[key]

          if (type === 'number') {
            filter = Number(filter)
          }
          if (filter !== elm.Interview[0][key]) {
            isTrue = false
            return false
          }
        }
        return isTrue
      })
    }
    if (interviewEntqaDone) {
      if (Number(interviewEntqaDone)) {
        examiners = examiners.filter((elm) => {
          return elm.Interview[0].recommendation
        })
      } else {
        examiners = examiners.filter((elm) => {
          return !elm.Interview[0].recommendation
        })
      }
    }
    // end filter
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
    if (showAllExaminers && showAllExaminers.length > 0) {
      if (showAllExaminers[0].Answers) {
        showAllExaminers = showAllExaminers.map((examiner) => {
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
    let allExaminers = 0
    // if (Object.keys(interviewFilter).length > 0) {
    //   allExaminers = examiners.length
    // } else {
    delete option.skip
    delete option.take
    delete option.orderBy
    delete option.include
    if (deleteItems) {
      await prisma.Examiners.deleteMany(option)
    }
    allExaminers = await prisma.Examiners.count(option)
    // }
    res.json({ examiners, allExaminers, showAllExaminers })
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
  app.post('/deleteExaminerDataFromLocalServer', async (req, res) => {
    const { ids } = req.body
    await prisma.Examiners.updateMany({
      where: {
        national_id: { in: ids },
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
        description:
          ' مسح بيانات ممتحنين يحملون ارقام قومية ' + ids.join(' , '),
        type: types[4],
      },
    })
    res.json({
      message: 'تم مسح المختبرين  بنجاح',
      examiners: [],
      type: 'delete',
      color: 'success',
    })
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

  app.post('/getDatesByUser', async (req, res) => {
    const { user_id } = req.body
    const dates = await prisma.Examiners.groupBy({
      by: ['update_at'],
      where: {
        user_id: Number(user_id),
      },
      select: {
        update_at: true,
      },
    })

    res.json(dates.map((elm) => elm.update_at))
  })
  app.post('/updateQualification', async (_, res) => {
    let data = await prisma.Examiners.findMany({
      where: {
        AND: [
          {
            NOT: [{ sold_id: null }],
          },
          {
            qualification_code: null,
          },
        ],
      },
      select: {
        sold_id: true,
      },
    })

    // update qualification_code
    if (data.length > 0) {
      data = data.map((v) => {
        return prisma.$executeRawUnsafe(
          `UPDATE Examiners SET qualification_code =${Number(
            v.sold_id[5]
          )} WHERE sold_id = '${v.sold_id}'`
        )
      })
    }
    const whatDone = await prisma.$transaction(data)
    res.json(whatDone)
  })
}

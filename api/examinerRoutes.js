const { examinerFilterOptions } = require('./ExaminerAPI/examinerFilterOptions')

/* eslint-disable camelcase */
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

    const interviewFilter = {
      final_opinion,
      transReason,
      recommendation,
      recommendation_res,
      examiner_status,
      final_hospital_result,
    }
    let examiners = null
    let showAllExaminers = null
    let allExaminers = 0

    if (
      // eslint-disable-next-line
      itemsPerPage == -1 ||
      final_opinion ||
      transReason ||
      recommendation ||
      recommendation_res ||
      examiner_status ||
      final_hospital_result ||
      interviewEntqaDone
    ) {
      delete option.skip
      delete option.take
    } else {
      option.skip = (page - 1) * Number(itemsPerPage) || 0
      option.take = Number(itemsPerPage) || 50
    }
    option.where.isDeleted = { equals: Boolean(false) }

    examinerFilterOptions.searchOptions(search, option)
    examinerFilterOptions.registerOptions(register, option, req.headers.id)
    examinerFilterOptions.againOptions(again, option)
    examinerFilterOptions.isNoticedOptions(isNoticed, option, newSet)
    examinerFilterOptions.userOptions(user, option)
    examinerFilterOptions.qualificationOptions(qualification, option)
    examinerFilterOptions.batteryOptions(battaryId, option)
    examinerFilterOptions.stageOptions(stage, option)
    examinerFilterOptions.hasUnitOptions(hasUnit, option)
    examinerFilterOptions.examFinishedOptions(examFinish, option)
    examinerFilterOptions.doneInterviewOptions(interview, option)
    examinerFilterOptions.sortOptions(sortBy, option, sortDesc)
    examinerFilterOptions.examinerGradesOptions(option)
    examinerFilterOptions.interviewFiltersOptions(
      interviewFilter,
      interviewEntqaDone,
      option
    )
    await examinerFilterOptions.withResultOptions(
      withResult,
      option,
      nafsy,
      prisma
    )
    examiners = await prisma.Examiners.findMany(option)
    showAllExaminers = await examinerFilterOptions.showAllExaminersFilter(
      showAll,
      option,
      prisma
    )
    // Filter interviews locally
    examiners = examinerFilterOptions.filterInterviewDB(
      interviewFilter,
      examiners,
      option
    )
    examiners = examinerFilterOptions.interviewEntqaDoneFilter(
      interviewEntqaDone,
      examiners,
      option
    )

    // End Interview filter
    examiners = examinerFilterOptions.calculateExaminerGrades(examiners)
    showAllExaminers =
      examinerFilterOptions.calculateAllExaminersGrades(showAllExaminers)

    examinerFilterOptions.cleanOptions(option)

    allExaminers = await prisma.Examiners.count(option)
    examinerFilterOptions.deleteExaminersDeveloperOptions(
      option,
      deleteItems,
      prisma
    )
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
        update: { ...data, toBackup: true },
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
        toBackup: true,
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

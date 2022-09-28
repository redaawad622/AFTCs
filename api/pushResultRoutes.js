import axios from 'axios'

module.exports = function (app, prisma, types) {
  // load all examiner data and send it to primary device
  app.post('/loadExaminerDataFromLocalServer', async (req, res) => {
    const ids = req.body.ids || []
    const option = {
      select: {
        national_id: true,
        triple_number: true,
        sold_id: true,
        name: true,
        stage: true,
      },
    }
    if (ids.length > 0) {
      option.where = {
        isDeleted: { equals: Boolean(false) },
        toBackup: { equals: Boolean(true) },
        national_id: { in: ids },
      }
    } else {
      option.where = {
        isDeleted: { equals: Boolean(false) },
        toBackup: { equals: Boolean(true) },
        OR: [
          {
            Answers: {
              some: {},
            },
          },
          {
            CustomExam: {
              some: {},
            },
          },
        ],
      }
    }
    const examiners = await prisma.Examiners.findMany(option)
    try {
      const result = await axios.post(
        'http://192.9.202.154:3000/api/saveDataFromLocalServer',
        {
          examiners: JSON.stringify(examiners),
        },
        {
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      )

      res.json(result.data)
    } catch (error) {
      res.json({
        message: 'لا يمكن الاتصال بالسيرفر',
        examiners: [],
        color: 'error',
      })
    }
  })
  // load all data and send it to primary device
  app.post('/loadAndSendAnswersData', async (_, res) => {
    const answers = await prisma.Examiners.findMany({
      where: {
        isDeleted: { equals: Boolean(false) },
        toBackup: { equals: Boolean(true) },
        Answers: {
          some: {},
        },
      },
      select: {
        national_id: true,
        name: true,
        sold_id: true,
        user_id: true,
        again: true,
        UNIT_NAME: true,
        TAMARKZ_NAME: true,
        UNIT_ARMY_NAME: true,
        Answers: {
          select: {
            exam_id: true,
            question_id: true,
            answer_id: true,
          },
        },
      },
    })
    const interviews = await prisma.Examiners.findMany({
      where: {
        isDeleted: { equals: Boolean(false) },
        toBackup: { equals: Boolean(true) },
        Interview: {
          some: {},
        },
      },
      select: {
        national_id: true,
        name: true,
        sold_id: true,
        user_id: true,
        Interview: true,
      },
    })
    const customExam = await prisma.Examiners.findMany({
      where: {
        isDeleted: { equals: Boolean(false) },
        CustomExam: {
          some: {},
        },
      },
      select: {
        national_id: true,
        name: true,
        sold_id: true,
        user_id: true,
        CustomExam: {
          select: {
            exam_id: true,
            value: true,
          },
        },
      },
    })
    const trainingCenterExaminers = await prisma.Examiners.findMany({
      where: {
        isDeleted: { equals: Boolean(false) },
        toBackup: { equals: Boolean(true) },
      },
      select: {
        id: true,
        national_id: true,
        toBackup: true,
        again: true,
      },
    })

    try {
      const result = await axios.post(
        'http://192.9.202.154:3000/api/checkAndSaveAnswers',
        {
          answers: JSON.stringify(answers),
          trainingCenterExaminers: JSON.stringify(trainingCenterExaminers),
          customExam: JSON.stringify(customExam),
          interviews: JSON.stringify(interviews),
        },
        {
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      )

      res.json(result.data)
    } catch (error) {
      res.json({
        message: 'لا يمكن الاتصال بالسيرفر',
        examiners: [],
        color: 'error',
      })
    }
  })
  // check and save data from another server
  app.post('/checkAndSaveAnswers', async (req, res) => {
    const { customExam, answers, interviews, trainingCenterExaminers } =
      req.body

    const report = {
      customExam: null,
      answers: null,
    }
    if (trainingCenterExaminers) {
      /**
       * Checks if examiner is `not Noticed` but is `again` which means examined again, which is considered
       * @violation
       */
      const parsedTrainingExaminers = JSON.parse(trainingCenterExaminers)
      const nationals = parsedTrainingExaminers.map((elm) => elm.national_id)
      const examiners = await prisma.Examiners.findMany({
        where: {
          national_id: { in: nationals },
        },
        select: {
          id: true,
          national_id: true,
          toBackup: true,
          name: true,
          isNoticed: 1,
        },
      })

      const notNoticed = examiners.filter(
        (examiner) => examiner.isNoticed === 0
      )

      const examinedAgain = parsedTrainingExaminers.filter(
        (examiner) => examiner.again
      )
      const notNoticedExaminedAgain = getArraysIntersection(
        notNoticed,
        examinedAgain
      )
      if (notNoticedExaminedAgain.length > 0) {
        res.json({
          message: 'هؤلاء المختبرين أعادوا الاختبار ولم يكونوا ملحوظين',
          examiners: notNoticedExaminedAgain,
          type: 'notNoticedExaminedAgain',
          color: 'error',
        })
      }
    }
    if (answers) {
      let ans = JSON.parse(answers)
      if (ans.length < 1) {
        res.json({
          message: 'لا يوجد اختبارات لتسجيلها',
          examiners: [],
          type: 'answer',
          color: 'primary',
        })
      } else {
        const nationals = ans.map((elm) => elm.national_id)
        const examiners = await prisma.Examiners.findMany({
          where: {
            national_id: { in: nationals },
          },
          select: {
            id: true,
            national_id: true,
          },
        })

        const exNationals = examiners.map((elm) => elm.national_id)
        const diff = ans.filter((elm) => !exNationals.includes(elm.national_id))

        if (diff.length > 0) {
          res.json({
            message:
              'المختبرين التاليين غير موجودين بالسرفر الرئيسي من فضلك قوم بتصديرهم او تسجيلهم اولا',
            examiners: diff,
            type: 'notRegister',
            color: 'error',
          })
        } else {
          await updateSoldNo(ans, prisma, true)

          ans = ans
            .map((elm) => {
              const examiner = examiners.find(
                (ex) => ex.national_id === elm.national_id
              )
              return elm.Answers.map((custom) => {
                return {
                  question_id: custom.question_id,
                  answer_id: custom.answer_id,
                  exam_id: custom.exam_id,
                  examiner_id: examiner.id,
                }
              })
            })
            .flat()

          const queryToRun = ans.map((elm) =>
            prisma.$executeRawUnsafe(
              `INSERT OR REPLACE INTO \`Answers\` (examiner_id,exam_id,question_id,answer_id)
            select ${Number(elm.examiner_id)},${Number(elm.exam_id)},${Number(
                elm.question_id
              )},${Number(elm.answer_id)}`
            )
          )

          if (queryToRun && queryToRun.length > 0) {
            const out = await prisma.$transaction(queryToRun)
            report.answers = {
              failNum: out.filter((elm) => elm === 0).length,
              successNum: out.filter((elm) => elm === 1).length,
            }
          }
        }
      }
    }

    if (interviews) {
      let examinerInterviews = JSON.parse(interviews)
      if (examinerInterviews.length < 0) {
        report.interview = {
          failNum: 0,
          successNum: 0,
        }
      } else {
        const nationals = examinerInterviews.map((elm) => elm.national_id)
        const examiners = await prisma.Examiners.findMany({
          where: {
            national_id: { in: nationals },
          },
          select: {
            id: true,
            national_id: true,
          },
        })

        const exNationals = examiners.map((elm) => elm.national_id)
        const diff = examinerInterviews.filter(
          (elm) => !exNationals.includes(elm.national_id)
        )
        if (diff.length > 0) {
          res.json({
            message:
              'المختبرين التاليين غير موجودين بالسرفر الرئيسي من فضلك قوم بتصديرهم او تسجيلهم اولا',
            examiners: diff,
            type: 'notRegister',
            color: 'error',
          })
        } else {
          await updateSoldNo(examinerInterviews, prisma)
          examinerInterviews = examinerInterviews
            .map((elm) => {
              const examiner = examiners.find(
                (ex) => ex.national_id === elm.national_id
              )
              return {
                interview: elm.Interview[0],
                examiner_id: examiner.id,
              }
            })
            .flat()

          // SAVE INTERVIEW
          const queryToRunInterview = examinerInterviews.map((elm) => {
            const inter = elm.interview
            return prisma.Interview.upsert({
              create: {
                examiner_id: Number(elm.examiner_id),
                parent_job: inter.parent_job,
                siblings_num: inter.siblings_num || 0,
                family_relation: inter.family_relation,
                complaint: inter.complaint,
                appearance: inter.appearance,
                focus_ability: inter.focus_ability,
                mood: inter.mood,
                speaking_disorder: inter.speaking_disorder,
                medicine_type: inter.medicine_type,
                has_medical_history: inter.has_medical_history,
                hospital_name: inter.hospital_name || '',
                drugs_history: inter.drugs_history,
                drug_type: inter.drug_type || '',
                final_opinion: inter.final_opinion,
                examiner_status: inter.examiner_status,
                final_hospital_result: inter.final_hospital_result,
              },
              update: {
                parent_job: inter.parent_job,
                siblings_num: inter.siblings_num || 0,
                family_relation: inter.family_relation,
                complaint: inter.complaint,
                appearance: inter.appearance,
                focus_ability: inter.focus_ability,
                mood: inter.mood,
                speaking_disorder: inter.speaking_disorder,
                medicine_type: inter.medicine_type,
                has_medical_history: inter.has_medical_history,
                hospital_name: inter.hospital_name || '',
                drugs_history: inter.drugs_history,
                drug_type: inter.drug_type || '',
                final_opinion: inter.final_opinion,
                examiner_status: inter.examiner_status,
                final_hospital_result: inter.final_hospital_result,
              },
              where: {
                examiner_id: Number(elm.examiner_id),
              },
            })
          })
          if (queryToRunInterview && queryToRunInterview.length > 0) {
            const out = await prisma.$transaction(queryToRunInterview)

            report.interview = {
              failNum: queryToRunInterview.length - out.length,
              successNum: out.length,
            }
          }
        }
      }
    }
    if (customExam) {
      let customEx = JSON.parse(customExam)
      if (customEx.length < 1) {
        console.log('no custom exam')
      } else {
        const nationals = customEx.map((elm) => elm.national_id)
        const examiners = await prisma.Examiners.findMany({
          where: {
            national_id: { in: nationals },
          },
          select: {
            id: true,
            national_id: true,
          },
        })
        const exNationals = examiners.map((elm) => elm.national_id)
        const diff = customEx.filter(
          (elm) => !exNationals.includes(elm.national_id)
        )
        if (diff.length > 0) {
          res.json({
            message:
              'المختبرين التاليين غير موجودين بالسرفر الرئيسي من فضلك قوم بتصديرهم او تسجيلهم اولا',
            examiners: diff,
            type: 'notRegister',
            color: 'error',
          })
        } else {
          await updateSoldNo(customEx, prisma)
          customEx = customEx
            .map((elm) => {
              const examiner = examiners.find(
                (ex) => ex.national_id === elm.national_id
              )
              return elm.CustomExam.map((custom) => {
                return {
                  value: custom.value,
                  exam_id: custom.exam_id,
                  examiner_id: examiner.id,
                }
              })
            })
            .flat()

          const queryToRun = customEx.map((elm) =>
            prisma.$executeRawUnsafe(
              `INSERT OR REPLACE INTO \`CustomExam\` (examiner_id,value,exam_id)
              select ${Number(elm.examiner_id)}, '${elm.value}', ${Number(
                elm.exam_id
              )}`
            )
          )
          if (queryToRun && queryToRun.length > 0) {
            const out = await prisma.$transaction(queryToRun)
            report.customExam = {
              failNum: out.filter((elm) => elm === 0).length,
              successNum: out.filter((elm) => elm === 1).length,
            }
          }
        }
      }
    }

    res.json({
      message: 'تم سحب البيانات بنجاح',
      examiners: [],
      report,
      type: 'report',
      color: 'success',
    })
  })

  // save all examiner data in primary device

  app.post('/saveDataFromLocalServer', async (req, res) => {
    const { examiners } = req.body
    const data = JSON.parse(examiners)
    const queryToRun = data.map((value) =>
      prisma.$executeRawUnsafe(
        `INSERT OR ignore INTO \`Examiners\` (national_id,triple_number,sold_id,name,stage) select '${
          value.national_id
        }',${value.triple_number ? `'${value.triple_number}'` : null},${
          value.sold_id ? `'${value.sold_id}'` : null
        }, '${value.name}','${value.stage}'`
      )
    )
    if (queryToRun && queryToRun.length > 0) {
      const out = await prisma.$transaction(queryToRun)
      res.json({
        message: 'تم اضافة المختبرين بنجاح',
        examiners: [],
        report: {
          examiner: {
            failNum: out.filter((elm) => elm === 0).length,
            successNum: out.filter((elm) => elm === 1).length,
          },
        },
        type: 'report',
        color: 'success',
      })
    } else {
      res.json({
        message: 'لا يوجد مختبرين لاضافتهم',
        examiners: [],
        color: 'primary',
      })
    }
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

  app.post('/removeNotNoticedExaminedAgain', async (req, res) => {
    const { ids } = req.body
    await prisma.Examiners.updateMany({
      where: {
        national_id: { in: ids },
      },
      data: {
        again: false,
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
}
async function updateSoldNo(examiners, prisma, again) {
  if (again) {
    const date = new Date().toISOString()
    const examiners1 = examiners
      .filter((elm) => elm.again)
      .map((v) => {
        return prisma.$executeRawUnsafe(
          `UPDATE OR ignore Examiners SET sold_id ='${v.sold_id}',user_id ='${
            v.user_id
          }',again =${v.again},update_at ='${date}' ,UNIT_NAME =${
            v.UNIT_NAME ? `'${v.UNIT_NAME}'` : null
          } ,TAMARKZ_NAME =${
            v.TAMARKZ_NAME ? `'${v.TAMARKZ_NAME}'` : null
          },UNIT_ARMY_NAME =${
            v.UNIT_ARMY_NAME ? `'${v.UNIT_ARMY_NAME}'` : null
          } WHERE national_id = '${v.national_id}'`
        )
      })
    const examiners2 = examiners
      .filter((elm) => !elm.again)
      .map((v) => {
        return prisma.$executeRawUnsafe(
          `UPDATE OR ignore Examiners SET sold_id ='${v.sold_id}',user_id ='${
            v.user_id
          }',update_at ='${date}' ,UNIT_NAME =${
            v.UNIT_NAME ? `'${v.UNIT_NAME}'` : null
          } ,TAMARKZ_NAME =${
            v.TAMARKZ_NAME ? `'${v.TAMARKZ_NAME}'` : null
          },UNIT_ARMY_NAME =${
            v.UNIT_ARMY_NAME ? `'${v.UNIT_ARMY_NAME}'` : null
          } WHERE national_id = '${v.national_id}'`
        )
      })
    examiners = [...examiners1, ...examiners2]
  } else {
    examiners = examiners.map((v) => {
      return prisma.$executeRawUnsafe(
        `UPDATE OR ignore Examiners SET sold_id ='${v.sold_id}',user_id ='${v.user_id}' WHERE national_id = '${v.national_id}'`
      )
    })
  }
  await prisma.$transaction(examiners)
}
function getArraysIntersection(a, b) {
  const results = a.filter(({ national_id: id1 }) =>
    b.some(({ national_id: id2 }) => id2 === id1)
  )
  return results
}

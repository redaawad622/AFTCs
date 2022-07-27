/* eslint-disable camelcase */
import axios from 'axios'
module.exports = function (app, prisma) {
  app.get('/getAssignExams', async (req, res) => {
    const { examinerId } = req.query
    const examiner = await prisma.Examiners.findUnique({
      where: {
        id: Number(examinerId),
      },
      include: {
        Answers: true,
        CustomExam: true,
      },
    })

    if (examiner.battary_id) {
      // step 1 get by assign battary
      let battary = await prisma.Battries.findUnique({
        where: {
          id: examiner.battary_id,
        },
        include: {
          Battary_Exam: {
            include: {
              exam: {
                select: {
                  Exm_ID: true,
                  Exm_Name: true,
                  Exm_Display_Name: false,
                  Exm_Duration_In_Mins: true,
                  category: true,
                  random: true,
                },
              },
            },
          },
        },
      })
      battary = battary.Battary_Exam.map((x) => x.exam)
      res.json({
        battary,
        Answers: examiner.Answers,
        customExam: examiner.CustomExam,
      })
    }
    // step 2 get public assign exam
    let exams = await prisma.Assign.findMany({
      select: {
        exam_id: true,
      },
    })
    if (exams && exams.length > 0) {
      exams = exams.map((x) => x.exam_id)
      const allExam = await prisma.T_Exams.findMany({
        where: {
          Exm_ID: { in: exams },
        },
        select: {
          Exm_ID: true,
          Exm_Name: true,
          Exm_Display_Name: false,
          Exm_Duration_In_Mins: true,
          category: true,
          random: true,
        },
      })
      res.json({
        battary: allExam,
        Answers: examiner.Answers,
        customExam: examiner.CustomExam,
      })
    } else {
      const userId = req.headers.id
      if (userId) {
        // fetch default for current login user
        let battary = await prisma.Battries.findUnique({
          where: {
            user_id: Number(userId),
          },
          include: {
            Battary_Exam: {
              include: {
                exam: {
                  select: {
                    Exm_ID: true,
                    Exm_Name: true,
                    Exm_Display_Name: false,
                    Exm_Duration_In_Mins: true,
                    category: true,
                    random: true,
                  },
                },
              },
            },
          },
        })
        if (battary) {
          battary = battary.Battary_Exam.map((x) => x.exam)

          res.json({
            battary,
            Answers: examiner.Answers,
            customExam: examiner.CustomExam,
          })
        } else {
          // fetch default for current weapon
          let weaponId = examiner.sold_id

          if (weaponId && weaponId.length === 13) {
            // check if عاده

            const qualification = examiner.sold_id[5]
            if (Number(qualification) === 0) {
              let battary = await prisma.Battries.findUnique({
                where: {
                  id: 11, // بطارية النفسي
                },
                include: {
                  Battary_Exam: {
                    include: {
                      exam: {
                        select: {
                          Exm_ID: true,
                          Exm_Name: true,
                          Exm_Display_Name: false,
                          Exm_Duration_In_Mins: true,
                          category: true,
                          random: true,
                        },
                      },
                    },
                  },
                },
              })
              if (battary) {
                battary = battary.Battary_Exam.map((x) => x.exam)
                res.json({
                  battary,
                  Answers: examiner.Answers,
                  customExam: examiner.CustomExam,
                })
              }
            } else {
              weaponId = Number(weaponId[6] + weaponId[7])
              let battary = await prisma.Battries.findUnique({
                where: {
                  weapon_id: weaponId,
                },
                include: {
                  Battary_Exam: {
                    include: {
                      exam: {
                        select: {
                          Exm_ID: true,
                          Exm_Name: true,
                          Exm_Display_Name: false,
                          Exm_Duration_In_Mins: true,
                          category: true,
                          random: true,
                        },
                      },
                    },
                  },
                },
              })
              if (battary) {
                battary = battary.Battary_Exam.map((x) => x.exam)

                res.json({
                  battary,
                  Answers: examiner.Answers,
                  customExam: examiner.CustomExam,
                })
              } else {
                res.status(404).json('لا يوجد امتحانات متوفره')
              }
            }
          } else {
            res.status(404).json('لا يوجد امتحانات متوفره')
          }
        }
      }
    }
  })
  app.get('/getExamsData', async (req, res) => {
    const { examId } = req.query
    if (examId) {
      const allExam = await prisma.T_Exams.findMany({
        where: {
          Exm_ID: { in: JSON.parse(examId) },
        },
        select: {
          Exm_ID: true,
          Exm_Name: true,
          Exm_Display_Name: false,
          Exm_Duration_In_Mins: true,
          category: true,
          random: true,
          Questions: {
            select: {
              Qus_Exm_ID: true,
              Qus_ID: true,
              Qus_Is_Pic: true,
              Qus_Text: true,
              Qus_Pic_UNC: true,
              Qus_audio: false,
              Qus_Order_Cat: true,
              T_Answers: {
                select: {
                  Ans_Qus_ID: true,
                  Ans_ID: true,
                  Ans_Is_Pic: true,
                  Ans_Text: true,
                  Ans_Value: false,
                  Ans_audio: false,
                  Ans_Cat: true,
                },
              },
            },
          },
        },
      })
      res.json(allExam)
    } else {
      res.status(404).json('لا يوجد امتحانات متوفره')
    }
  })
  app.get('/getExams', async (req, res) => {
    const exams = await prisma.T_Exams.findMany({
      where: {
        show: true,
      },
      select: {
        Exm_ID: true,
        Exm_Name: true,
        category: true,
        random: true,
        Exm_Duration_In_Mins: true,
        Questions: {
          include: {
            T_Answers: true,
          },
        },
      },
    })
    exams.forEach((exam) => {
      if (exam.Questions.length > 0) {
        exam.fullMark = exam.Questions.map((q) => {
          if (q.T_Answers.length > 0) {
            return Math.max(...q.T_Answers.map((ans) => ans.Ans_Value))
          } else {
            return 0
          }
        }).reduce((a, b) => {
          return a + b
        }, 0)
      } else return 0
    })
    delete exams.Questions
    let assExams = await prisma.Assign.findMany({
      select: {
        exam_id: true,
      },
    })
    if (assExams && assExams.length > 0) {
      assExams = assExams.map((x) => x.exam_id)
      assExams = await prisma.T_Exams.findMany({
        where: {
          Exm_ID: { in: assExams },
        },
        select: {
          Exm_ID: true,
          Exm_Name: true,
          category: true,
          random: true,
        },
      })
    }

    res.json({ exams, assExams })
  })
  app.post('/saveSetting', async (req, res) => {
    const exams = req.body
    await prisma.Assign.deleteMany({})
    exams.forEach(async (x) => {
      await prisma.Assign.create({
        data: { exam_id: x.Exm_ID },
      })
    })

    res.json('done')
  })
  app.post('/addAsBattary', async (req, res) => {
    const { exams, name } = req.body
    try {
      let battary = await prisma.Battries.findUnique({
        where: { name },
      })
      if (battary) {
        await prisma.Battary_Exam.deleteMany({
          where: {
            battary_id: battary.id,
          },
        })
      } else {
        battary = await prisma.Battries.create({
          data: { name },
        })
      }

      if (battary) {
        exams.forEach(async (x) => {
          await prisma.Battary_Exam.create({
            data: { exam_id: x.Exm_ID, battary_id: battary.id },
          })
        })
      }
    } catch (e) {
      if (e.clientVersion && e.code) res.status(422).json(e)
    }

    res.json('done')
  })
  app.post('/saveAnswers', async (req, res) => {
    const { examinerId, answers, endTime, customExam } = req.body

    if (customExam) {
      const customEx = JSON.parse(customExam)
      const queryToRun = customEx.map((elm) =>
        prisma.$executeRawUnsafe(
          ` INSERT INTO \`CustomExam\` (examiner_id,value,exam_id)
          select ${Number(examinerId)}, '${elm.value}', ${Number(elm.exam_id)}
          where NOT EXISTS (SELECT 1 FROM CustomExam WHERE examiner_id = ${Number(
            examinerId
          )} and exam_id =${Number(elm.exam_id)}  )
          `
        )
      )
      if (queryToRun && queryToRun.length > 0) {
        await prisma.$transaction(queryToRun)
      }
    }
    if (answers) {
      const ans = JSON.parse(answers)
      const queryToRun2 = ans.map((elm) =>
        prisma.$executeRawUnsafe(
          ` INSERT INTO \`Answers\` (examiner_id,exam_id,question_id,answer_id,duration)
          select ${Number(examinerId)},${Number(elm.exam_id)},${Number(
            elm.question_id
          )},${Number(elm.answer_id)}, ${Number(endTime)}
          where NOT EXISTS (SELECT 1 FROM Answers WHERE examiner_id = ${Number(
            examinerId
          )} and exam_id =${Number(elm.exam_id)} and question_id =${Number(
            elm.question_id
          )}  )
          `
        )
      )
      if (queryToRun2 && queryToRun2.length > 0) {
        await prisma.$transaction(queryToRun2)
      }
    }

    res.json('done')
  })
  app.post('/saveFake', async (req, res) => {
    const { examinerId, ans } = req.body
    const ex = await prisma.Examiners.findUnique({
      where: {
        national_id: ans,
      },
    })
    const answers = await prisma.Answers.findMany({
      where: {
        examiner_id: ex.id,
      },
      select: {
        exam_id: true,
        question_id: true,
        answer_id: true,
      },
    })

    answers.forEach(async (x) => {
      await prisma.Answers.create({
        data: { examiner_id: examinerId, ...x, duration: 5 },
      })
    })
    res.json({ ex, answers })
  })

  app.get('/getAndAdd', async (req, res) => {
    const { battaryId } = req.query
    let exams = await prisma.Battries.findUnique({
      where: {
        id: Number(battaryId),
      },
      include: {
        Battary_Exam: {
          select: {
            exam_id: true,
          },
        },
      },
    })
    if (exams && exams.Battary_Exam.length > 0) {
      exams = exams.Battary_Exam.map((x) => x.exam_id)
      exams = await prisma.T_Exams.findMany({
        where: {
          Exm_ID: { in: exams },
        },
        select: {
          Exm_ID: true,
          Exm_Name: true,
          category: true,
          random: true,
        },
      })
      res.json(exams)
    } else {
      res.status(404).json('لا يوجد اختبارات لهذه البطارية')
    }
  })
  app.post('/editExam', async (req, res) => {
    await prisma.T_Exams.updateMany({
      data: { Exm_Description: 'ss' },
    })
    res.json('done')
  })
  app.post('/saveOrEditExam', async (req, res) => {
    const data = req.body
    data.formData.Exm_Duration_In_Mins = Number(
      data.formData.Exm_Duration_In_Mins
    )
    try {
      const exam = await prisma.T_Exams.upsert({
        where: {
          Exm_ID: Number(data.id),
        },
        create: { ...data.formData },
        update: { ...data.formData },
      })
      res.json(exam)
    } catch (e) {
      if (e.clientVersion && e.code) res.status(422).json(e)
    }
  })
  app.post('/softDeleteExam', async (req, res) => {
    const data = req.body
    try {
      const exam = await prisma.T_Exams.update({
        where: {
          Exm_ID: Number(data.id),
        },
        data: {
          show: false,
        },
      })
      res.json(exam)
    } catch (e) {
      if (e.clientVersion && e.code) res.status(422).json(e)
    }
  })
  app.get('/getExamHelpers', async (req, res) => {
    const battaries = await prisma.Battries.findMany()
    const weapons = await prisma.Weapons.findMany()
    const stage = await prisma.Examiners.groupBy({
      by: ['stage'],
      select: {
        stage: true,
      },
    })
    const categories = await prisma.T_Exams.groupBy({
      by: ['category'],
      select: {
        category: true,
      },
    })
    const order = await prisma.T_Exams.groupBy({
      by: ['random'],
      select: {
        random: true,
      },
    })
    res.json({
      battaries,
      weapons,
      stage,
      categories: mapBy(categories, 'category'),
      order: mapBy(order, 'random'),
    })
  })

  app.get('/editableExam', async (req, res) => {
    const { id } = req.query

    const exam = await prisma.T_Exams.findUnique({
      where: {
        Exm_ID: Number(id),
      },
      include: {
        Questions: {
          include: {
            T_Answers: true,
          },
        },
      },
    })
    return res.json(exam)
  })
  app.post('/saveNewQues', async (req, res) => {
    const newQ = req.body
    const q = await prisma.T_Questions.create({
      data: {
        Qus_Text: newQ.Qus_Text,
        Qus_Exm_ID: Number(newQ.Qus_Exm_ID),
      },
    })
    newQ.T_Answers.forEach(async (ans) => {
      await prisma.T_Answers.create({
        data: {
          Ans_Text: ans.Ans_Text,
          Ans_Value: parseFloat(ans.Ans_Value),
          Ans_Qus_ID: +q.Qus_ID,
        },
      })
    })
    return res.json(q)
  })

  app.get('/battaryData', async (req, res) => {
    const { id } = req.query
    const battary = await prisma.Battries.findUnique({
      where: {
        id: Number(id),
      },
    })

    res.json(battary)
  })
  app.post('/saveBattary', async (req, res) => {
    const data = req.body
    const id = data.id
    delete data.id
    if (data.weapon_id && data.weapon_id !== 'null')
      data.weapon_id = Number(data.weapon_id)
    else {
      delete data.weapon_id
    }
    if (data.user_id && data.user_id !== 'null')
      data.user_id = Number(data.user_id)
    else {
      delete data.user_id
    }

    const battary = await prisma.Battries.upsert({
      where: {
        id: Number(id),
      },
      create: data,
      update: data,
    })

    res.json(battary)
  })

  app.post('/saveManualCustomExam', async (req, res) => {
    const { id, exams } = req.body

    const queryToRun = Object.keys(exams).map((key) =>
      prisma.$executeRawUnsafe(
        ` INSERT INTO \`CustomExam\` (examiner_id,value,exam_id)
          select ${Number(id)}, '${exams[key]}', ${Number(key)}
          where NOT EXISTS (SELECT 1 FROM CustomExam WHERE examiner_id = ${Number(
            id
          )} and exam_id =${Number(key)}  )
          `
      )
    )
    if (queryToRun && queryToRun.length > 0) {
      await prisma.$transaction(queryToRun)
    }

    res.json('done')
  })
  app.post('/again', async (req, res) => {
    const { national_id } = req.body
    const examiner = await prisma.Examiners.findUnique({
      where: {
        national_id,
      },
    })
    await prisma.Answers.deleteMany({
      where: {
        examiner_id: examiner.id,
      },
    })
    res.json('done')
  })

  // load all data and send it to primary device
  app.post('/loadAndSendAnswersData', async (_, res) => {
    const answers = await prisma.Examiners.findMany({
      where: {
        Answers: {
          some: {},
        },
      },
      select: {
        national_id: true,
        name: true,
        sold_id: true,
        user_id: true,
        Answers: {
          select: {
            exam_id: true,
            question_id: true,
            answer_id: true,
          },
        },
      },
    })
    const customExam = await prisma.Examiners.findMany({
      where: {
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
    try {
      const result = await axios.post(
        'http://192.9.202.150:3000/api/checkAndSaveAnswers',
        {
          answers: JSON.stringify(answers),
          customExam: JSON.stringify(customExam),
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
    const { customExam, answers } = req.body
    const report = {
      customExam: null,
      answers: null,
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
          await updateSolidNum(ans, prisma)
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
    if (customExam) {
      let customEx = JSON.parse(customExam)
      if (customEx.length < 1) {
        console.log('لا يوجد اختبارات مخصصه')
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
          await updateSolidNum(customEx, prisma)
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
  // load all examiner data and send it to primary device
  app.post('/loadExaminerDataFromLocalServer', async (_, res) => {
    const examiners = await prisma.Examiners.findMany({
      select: {
        national_id: true,
        triple_number: true,
        sold_id: true,
        name: true,
        stage: true,
      },
      where: {
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
      },
    })
    try {
      const result = await axios.post(
        'http://192.9.202.150:3000/api/saveDataFromLocalServer',
        {
          examiners: JSON.stringify(examiners),
        }
      )

      res.json(result.data)
    } catch (error) {
      console.log(error)
      res.json({
        message: 'لا يمكن الاتصال بالسيرفر',
        examiners: [],
        color: 'error',
      })
    }
  })

  // load all examiner data and send it to primary device
  app.post('/saveDataFromLocalServer', async (req, res) => {
    const { examiners } = req.body
    const data = JSON.parse(examiners)
    const queryToRun = data.map((value) =>
      prisma.$executeRawUnsafe(
        `INSERT OR ignore INTO \`Examiners\` (national_id,triple_number,sold_id,name,stage) select '${
          value.national_id
        }','${value.triple_number || ''}','${value.sold_id || ''}', '${
          value.name
        }','${value.stage}'`
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
}
function mapBy(arr, item) {
  return Array.isArray(arr) ? arr.map((elm) => elm[item]) : arr
}
async function updateSolidNum(examiners, prisma) {
  examiners = examiners.map((v) => {
    return prisma.$executeRawUnsafe(
      `UPDATE Examiners SET sold_id ='${v.sold_id}',user_id ='${v.user_id}' WHERE national_id = '${v.national_id}'`
    )
  })
  await prisma.$transaction(examiners)
}

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
    const ArmyNames = await prisma.ArmyNames.findMany()
    const TamarkzNames = await prisma.TamarkzNames.findMany()
    const UnitNames = await prisma.UnitNames.findMany()
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
      ArmyNames: mapBy(ArmyNames, 'name'),
      UnitNames: mapBy(UnitNames, 'name'),
      TamarkzNames: mapBy(TamarkzNames, 'name'),
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
    const examiner = await prisma.Examiners.update({
      where: {
        national_id,
      },
      data: {
        again: true,
      },
    })
    let battary = await prisma.Battries.findUnique({
      where: {
        id: 11, // بطارية النفسي
      },
      include: {
        Battary_Exam: true,
      },
    })
    battary = battary.Battary_Exam.map((ex) => ex.exam_id)
    await prisma.Answers.deleteMany({
      where: {
        examiner_id: examiner.id,
        exam_id: { in: battary },
      },
    })
    res.json(examiner)
  })
  app.post('/setAsAgain', async (req, res) => {
    const { nationals } = req.body
    await prisma.Examiners.updateMany({
      where: {
        national_id: { in: nationals },
      },
      data: {
        again: true,
      },
    })

    res.json('done')
  })
  app.post('/setAsFNoticed', async (req, res) => {
    const { nationals, second } = req.body
    await prisma.Examiners.updateMany({
      where: {
        national_id: { in: nationals },
      },
      data: {
        isNoticed: true,
        isNoticedAgain: Boolean(Number(second)),
      },
    })

    res.json('done')
  })
  app.post('/saveUnit', async (req, res) => {
    const { id, unit } = req.body
    await prisma.Examiners.update({
      where: {
        id: Number(id),
      },
      data: unit,
    })

    res.json('done')
  })

  // load all data and send it to primary device
  app.post('/loadAndSendAnswersData', async (_, res) => {
    const answers = await prisma.Examiners.findMany({
      where: {
        isDeleted: { equals: Boolean(false) },
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
    try {
      const result = await axios.post(
        'http://192.9.202.150:3000/api/checkAndSaveAnswers',
        {
          answers: JSON.stringify(answers),
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
    const { customExam, answers, interviews } = req.body

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
          await updateSolidNum(ans, prisma, true)

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
          await updateSolidNum(examinerInterviews, prisma)
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
            const updateQuery = `Update \`Interview\` SET parent_job='${
              inter.parent_job
            }',siblings_num=${Number(
              inter.siblings_num || 0
            )},family_relation='${inter.family_relation}'
            ,complaint='${inter.complaint}'
            ,appearance='${inter.appearance}',focus_ability='${
              inter.focus_ability
            }',mood='${inter.mood}',speaking_disorder='${
              inter.speaking_disorder
            }',medicine_type='${inter.medicine_type}',has_medical_history='${
              inter.has_medical_history
            }',hospital_name='${inter.hospital_name || ''}',
                drugs_history='${inter.drugs_history}',drug_type='${
              inter.drug_type || ''
            }',final_opinion='${inter.final_opinion}',examiner_status='${
              inter.examiner_status
            }',final_hospital_result='${
              inter.final_hospital_result
            }' WHERE examiner_id = ${Number(elm.examiner_id)}`
            return prisma.$executeRawUnsafe(updateQuery)
          })

          if (queryToRunInterview && queryToRunInterview.length > 0) {
            const out = await prisma.$transaction(queryToRunInterview)
            report.interview = {
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
        national_id: { in: ids },
      }
    } else {
      option.where = {
        isDeleted: { equals: Boolean(false) },
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
        'http://192.9.202.150:3000/api/saveDataFromLocalServer',
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
  app.post('/extractToDevice', async (req, res) => {
    const { nationals, deviceIp } = req.body

    if (nationals.length > 0) {
      const examiners = await prisma.Examiners.findMany({
        where: {
          national_id: { in: nationals },
        },
        select: {
          national_id: true,
          triple_number: true,
          name: true,
          stage: true,
          barcode: true,
          sold_id: true,
          mohafza_code: true,
          qualification_code: true,
          marital_state: true,
          educational_degree: true,
          user_id: true,
          battary_id: true,
          isDeleted: true,
          again: true,
          UNIT_NAME: true,
          GEHA_NAME: true,
          TAMARKZ_NAME: true,
          UNIT_ARMY_NAME: true,
          ARMY_TAGNEED_NAME: true,
          isNoticed: true,
          isNoticedAgain: true,
          nextFollowDate: true,
          numFollowUps: true,
          Answers: {
            select: {
              exam_id: true,
              question_id: true,
              answer_id: true,
            },
          },
          Interview: {
            select: {
              parent_job: true,
              siblings_num: true,
              family_relation: true,
              complaint: true,
              appearance: true,
              focus_ability: true,
              mood: true,
              speaking_disorder: true,
              medicine_type: true,
              has_medical_history: true,
              hospital_name: true,
              drugs_history: true,
              drug_type: true,
              final_opinion: true,
              examiner_status: true,
              final_hospital_result: true,
              order_brothers: true,
              parent_rel: true,
              rel_between_parents: true,
              family_income: true,
              family_medical: true,
              personal_medical: true,
              half_brothers: true,
              complaint_f: true,
              transReason: true,
              moving: true,
              faceExprission: true,
              timeAware: true,
              situationAware: true,
              judgeAbility: true,
              awareDisorder: true,
              thinkDisorder: true,
              appetite: true,
              sleeping: true,
              smoking: true,
              prayer: true,
              interviewer_opinion: true,
              historyDate: true,
              recommendation: true,
              recommendation_res: true,
              recommendation_summary: true,
              interviewer: true,
            },
          },
        },
      })
      try {
        const result = await axios.post(
          `http://${deviceIp}:3000/api/exportToEmptyDb`,
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
        console.log(error)
        res.json({
          message: 'لا يمكن الاتصال بالسيرفر',
          examiners: [],
          color: 'error',
        })
      }
    }
  })
  app.post('/exportToEmptyDb', async (req, res) => {
    const { examiners } = req.body
    const data = JSON.parse(examiners)
    await data.forEach(async (examiner) => {
      const interviews = examiner.Interview
      const answers = examiner.Answers
      delete examiner.Answers
      delete examiner.Interview

      await prisma.examiners.update({
        where: {
          national_id: examiner.national_id,
        },
        data: {
          ...examiner,
          Interview: {
            createMany: {
              data: interviews,
            },
          },
          Answers: {
            createMany: {
              data: answers,
            },
          },
        },
      })
    })
    res.json('done')
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
}
function mapBy(arr, item) {
  return Array.isArray(arr) ? arr.map((elm) => elm[item]) : arr
}
async function updateSolidNum(examiners, prisma, again) {
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

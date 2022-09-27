/* eslint-disable camelcase */

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
        update: { ...data.formData, toBackup: true },
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
          isBackuped: false,
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
    let query = [...newQ.T_Answers]
    query = query.map((ans) => {
      return prisma.T_Answers.create({
        data: {
          Ans_Text: ans.Ans_Text,
          Ans_Value: parseFloat(ans.Ans_Value),
          Ans_Qus_ID: +q.Qus_ID,
        },
      })
    })
    await prisma.$transaction(query)
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
      update: { ...data, isBackuped: false },
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
        toBackup: true,
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
        toBackup: true,
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
        toBackup: true,
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
      data: { ...unit, toBackup: true },
    })

    res.json('done')
  })
  app.post('/updateQ', async (req, res) => {
    const newQ = req.body
    const q = await prisma.T_Questions.update({
      where: { Qus_ID: Number(newQ.Qus_ID) },
      data: {
        Qus_Text: newQ.Qus_Text,
      },
    })
    let query = [...newQ.T_Answers]
    query = query.map((ans) => {
      return prisma.T_Answers.update({
        where: { Ans_ID: Number(ans.Ans_ID) },
        data: {
          Ans_Text: ans.Ans_Text,
          Ans_Value: parseFloat(ans.Ans_Value),
        },
      })
    })
    await prisma.$transaction(query)
    return res.json(q)
  })
  app.post('/deleteQ', async (req, res) => {
    const { id } = req.body
    await prisma.T_Answers.deleteMany({
      where: { Ans_Qus_ID: Number(id) },
    })
    await prisma.T_Questions.delete({
      where: {
        Qus_ID: Number(id),
      },
    })

    res.json('done')
  })
}
function mapBy(arr, item) {
  return Array.isArray(arr) ? arr.map((elm) => elm[item]) : arr
}

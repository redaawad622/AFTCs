module.exports = function (app, prisma) {
  app.get('/getAssignExams', async (req, res) => {
    const { examinerId } = req.query
    const examiner = await prisma.Examiners.findUnique({
      where: {
        id: Number(examinerId),
      },
      include: {
        Answers: true,
      },
    })
    // check if exist
    if (examiner && examiner.Answers.length > 190) {
      res
        .status(404)
        .json(
          `( ${
            examiner.name
          } ) اتم الاختبار من قبل بتاريخ ${examiner.Answers[0].created_at.toLocaleDateString()}`
        )
    }

    // step 1 get by assign battary
    if (examiner.battary_id) {
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
      res.json({ battary, Answers: examiner.Answers })
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
      res.json({ battary: allExam, Answers: examiner.Answers })
    } else {
      const userId = req.headers.id
      console.log(userId)
      if (userId) {
        console.log(userId)
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

          res.json({ battary, Answers: examiner.Answers })
        } else {
          // fetch default for current weapon
          let weaponId = examiner.sold_id

          if (weaponId && weaponId.length === 13) {
            weaponId = weaponId[6] + weaponId[7]
            let battary = await prisma.Battries.findUnique({
              where: {
                weapon_id: Number(weaponId),
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

              res.json({ battary, Answers: examiner.Answers })
            } else {
              res.status(404).json('لا يوجد امتحانات متوفره')
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
              Qus_image: true,
              Qus_Order_Cat: true,
              T_Answers: {
                select: {
                  Ans_Qus_ID: true,
                  Ans_ID: true,
                  Ans_Is_Pic: true,
                  Ans_Text: true,
                  Ans_Pic_UNC: false,
                  Ans_Value: false,
                  Ans_audio: false,
                  Ans_image: true,
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
      },
    })
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
  app.post('/saveAnswers', (req, res) => {
    const { examinerId, answers, endTime } = req.body
    const ans = JSON.parse(answers)
    ans.forEach(async (x) => {
      await prisma.Answers.create({
        data: { examiner_id: examinerId, ...x, duration: Number(endTime) },
      })
    })
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
    console.log(data)
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
}
function mapBy(arr, item) {
  return Array.isArray(arr) ? arr.map((elm) => elm[item]) : arr
}

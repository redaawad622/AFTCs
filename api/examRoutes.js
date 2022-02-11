module.exports = function (app, prisma) {
  app.get('/getAssignExams', async (req, res) => {
    const { examinerId } = req.query
    let exams = await prisma.Assign.findMany({
      select: {
        exam_id: true,
      },
    })
    if (!exams || exams.length < 1) {
      // fetch default
    }
    const examiner = await prisma.Examiners.findUnique({
      where: {
        id: Number(examinerId),
      },
      include: {
        Answers: true,
      },
    })
    if (examiner && examiner.Answers.length < 1) {
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
        res.json(allExam)
      } else {
        res.status(404).json('لا يوجد امتحانات متوفره')
      }
    } else {
      res
        .status(404)
        .json(
          `( ${
            examiner.name
          } ) اتم الاختبار من قبل بتاريخ ${examiner.Answers[0].created_at.toLocaleDateString()}`
        )
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
              Qus_audio: true,
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
      select: {
        Exm_ID: true,
        Exm_Name: true,
        category: true,
        random: true,
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
  app.post('/saveAnswers', (req, res) => {
    const { examinerId, answers } = req.body
    const ans = JSON.parse(answers)
    ans.forEach(async (x) => {
      await prisma.Answers.create({
        data: { examiner_id: examinerId, ...x },
      })
    })
    res.json('done')
  })
  app.post('/editExam', async (req, res) => {
    await prisma.T_Exams.updateMany({
      data: { Exm_Description: 'ss' },
    })
    res.json('done')
  })
}

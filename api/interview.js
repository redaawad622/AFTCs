/* eslint-disable camelcase */
module.exports = function (app, prisma) {
  app.get('/getInterview', async (req, res) => {
    const examinerData = await prisma.Examiners.findUnique({
      where: {
        national_id: req.query.id,
      },
      select: {
        national_id: true,
        name: true,
        stage: true,
        sold_id: true,
        qualification_code: true,
        marital_state: true,
        educational_degree: true,
        Interview: true,
      },
    })
    res.json(examinerData)
  })

  app.post('/saveInterview', async (req, res) => {
    const { id, national_id, marital_state, educational_degree, historyDate } =
      req.body

    const interviewData = { ...req.body }
    for (const key in interviewData) {
      if (
        Object.hasOwnProperty.call(interviewData, key) &&
        !interviewData[key]
      ) {
        delete interviewData[key]
      }
    }
    interviewData.historyDate = new Date(historyDate)
    const examinerData = await prisma.Examiners.update({
      where: {
        national_id,
      },
      data: {
        marital_state,
        educational_degree,
      },
    })

    interviewData.examiner_id = examinerData.id
    delete interviewData.marital_state
    delete interviewData.educational_degree
    delete interviewData.id
    delete interviewData.national_id
    delete interviewData.name
    delete interviewData.stage
    delete interviewData.qualification_code
    delete interviewData.sold_id
    delete interviewData.examiner_id

    const interview = await prisma.Interview.upsert({
      where: {
        id: Number(id),
      },
      create: interviewData,
      update: {
        ...interviewData,
        updated_at: new Date(),
      },
    })
    res.json(interview)
  })
}

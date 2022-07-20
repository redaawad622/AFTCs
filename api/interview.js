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
    const {
      id,
      national_id,
      parent_job,
      siblings_num,
      family_relation,
      complaint,
      appearance,
      focus_ability,
      mood,
      speaking_disorder,
      medicine_type,
      has_medical_history,
      hospital_name,
      drugs_history,
      drug_type,
      final_opinion,
      examiner_status,
      final_hospital_result,
      marital_state,
      educational_degree,
    } = req.body
    const examinerData = await prisma.Examiners.update({
      where: {
        national_id,
      },
      data: {
        marital_state,
        educational_degree,
      },
    })
    const interview = await prisma.Interview.upsert({
      where: {
        id: Number(id),
      },
      create: {
        parent_job,
        siblings_num,
        family_relation,
        complaint,
        appearance,
        focus_ability,
        mood,
        speaking_disorder,
        medicine_type,
        has_medical_history,
        hospital_name,
        drugs_history,
        drug_type,
        final_opinion,
        examiner_status,
        final_hospital_result,
        examiner_id: examinerData.id,
      },
      update: {
        parent_job,
        siblings_num,
        family_relation,
        complaint,
        appearance,
        focus_ability,
        mood,
        speaking_disorder,
        medicine_type,
        has_medical_history,
        hospital_name,
        drugs_history,
        drug_type,
        final_opinion,
        examiner_status,
        final_hospital_result,
      },
    })
    res.json(interview)
  })
}

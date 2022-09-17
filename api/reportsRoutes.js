module.exports = function (app, prisma) {
  app.get('/getReports', async (req, res) => {
    const { examFinish, stage, report, user } = req.query
    let filteredExaminers = []
    let resultReportJson = []
    const examinerOptions = { where: {} }
    reportGeneralFilters(examinerOptions, stage, user, examFinish)

    switch (Number(report)) {
      case 1:
        report1ExaminerFilters(examinerOptions)
        break
      case 2:
        report2Filters(examinerOptions)
        break
      default:
        break
    }

    filteredExaminers = await prisma.Examiners.findMany(examinerOptions)
    const expectedPlan = await prisma.ExpectedPlan.findMany()

    switch (Number(report)) {
      case 1:
        resultReportJson = getReport1(filteredExaminers, expectedPlan)
        break
      case 2:
        resultReportJson = getReport2(filteredExaminers)
        break

      default:
        resultReportJson = getReport1(filteredExaminers)
        break
    }
    res.json(resultReportJson)
  })

  function reportGeneralFilters(option, stage, user, examFinish) {
    option.where.isDeleted = { equals: Boolean(false) }
    if (stage) {
      option.where.stage = { equals: stage }
    }
    if (user) {
      option.where.user_id = { equals: Number(user) }
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
  }

  function report1ExaminerFilters(option) {
    option.where.NOT = [{ user_id: null }]
    option.select = {
      user_id: true,
      again: true,
      isNoticed: true,
      isNoticedAgain: true,
      qualification_code: true,
    }
  }

  function report2Filters(option) {
    option.where.NOT = [{ user_id: null }]
    option.select = {
      user_id: true,
      again: true,
      UNIT_NAME: true,
      isNoticed: true,
      isNoticedAgain: true,
      qualification_code: true,
      Interview: true,
    }
    option.select.Answers = {
      select: {
        id: true,
      },
    }
  }

  function examinerQualification(examiner, qualificationCode) {
    return examiner.qualification_code === qualificationCode
  }

  function getArraysIntersection(a1, a2) {
    return a2.filter((a2elem) => a1.includes(a2elem))
  }

  function getArraysDifference(a1, a2) {
    return a2.filter((a2elem) => !a1.includes(a2elem))
  }

  function getTrainingCenterPlan(expectedPlan, userId) {
    return expectedPlan.filter((plan) => plan.user_id === userId)[0]
  }

  function getReport1(filteredExaminers, expectedPlan) {
    const totalNoticed = filteredExaminers.filter((item) => item.isNoticed)

    let groupedExaminers = filteredExaminers.reduce(
      (groupedByTrainingCenter, nextExaminer) => {
        groupedByTrainingCenter[nextExaminer.user_id] =
          groupedByTrainingCenter[nextExaminer.user_id] ?? []
        groupedByTrainingCenter[nextExaminer.user_id].push(nextExaminer)
        return groupedByTrainingCenter
      },
      {}
    )

    groupedExaminers = Object.keys(groupedExaminers).map((k) => {
      const trainingCenterExaminers = groupedExaminers[k]
      const noticed = trainingCenterExaminers.filter((_) => _.isNoticed)
      const again = trainingCenterExaminers.filter((_) => _.again)
      const noticedAgain = trainingCenterExaminers.filter(
        (_) => _.isNoticedAgain
      )
      const high = trainingCenterExaminers.filter((item) =>
        examinerQualification(item, 2)
      )
      const above = trainingCenterExaminers.filter((item) =>
        examinerQualification(item, 8)
      )
      const middle = trainingCenterExaminers.filter((item) =>
        examinerQualification(item, 1)
      )
      const usually = trainingCenterExaminers.filter((item) =>
        examinerQualification(item, 0)
      )
      const plan = getTrainingCenterPlan(expectedPlan, Number(k))

      return {
        user_id: k,
        total: trainingCenterExaminers.length,
        noticed: noticed.length,
        again: again.length,
        expected_high: plan?.expected_high,
        expected_above: plan?.expected_above,
        expected_middle: plan?.expected_middle,
        expected_usually: plan?.expected_usually,
        actual_arrive_high: plan?.actual_arrive_high,
        actual_arrive_above: plan?.actual_arrive_above,
        actual_arrive_middle: plan?.actual_arrive_middle,
        actual_arrive_usually: plan?.actual_arrive_usually,
        noticedAgain: noticedAgain.length,
        high: high.length,
        above: above.length,
        middle: middle.length,
        usually: usually.length,
        n_high: getArraysIntersection(high, noticed).length,
        n_above: getArraysIntersection(above, noticed).length,
        n_middle: getArraysIntersection(middle, noticed).length,
        n_usually: getArraysIntersection(usually, noticed).length,
        na_high: getArraysIntersection(high, noticedAgain).length,
        na_above: getArraysIntersection(above, noticedAgain).length,
        na_middle: getArraysIntersection(middle, noticedAgain).length,
        na_usually: getArraysIntersection(usually, noticedAgain).length,
        a_high: getArraysIntersection(high, again).length,
        a_above: getArraysIntersection(above, again).length,
        a_middle: getArraysIntersection(middle, again).length,
        a_usually: getArraysIntersection(usually, again).length,
      }
    })
    // Add total row
    groupedExaminers.push({
      user_id: 'الكل',
      total: filteredExaminers.length,
      noticed: totalNoticed.length,
      again: filteredExaminers.filter((item) => item.again).length,
      noticedAgain: filteredExaminers.filter((item) => item.isNoticedAgain)
        .length,
      high: filteredExaminers.filter((item) => item.qualification_code === 2)
        .length,
      middle: filteredExaminers.filter((item) => item.qualification_code === 1)
        .length,
      usually: filteredExaminers.filter((item) => item.qualification_code === 0)
        .length,
      above: filteredExaminers.filter((item) => item.qualification_code === 8)
        .length,
      n_high: totalNoticed.filter((item) => item.qualification_code === 2)
        .length,
      n_middle: totalNoticed.filter((item) => item.qualification_code === 1)
        .length,
      n_usually: totalNoticed.filter((item) => item.qualification_code === 0)
        .length,
      n_above: totalNoticed.filter((item) => item.qualification_code === 8)
        .length,
    })
    return groupedExaminers
  }

  function getReport2(filteredExaminers) {
    const isNoticed = filteredExaminers.filter((_) => _.isNoticed)
    const isNoticedAgain = filteredExaminers.filter((_) => _.isNoticedAgain)
    const allReExamed = filteredExaminers.filter((_) => _.again)
    const interviewDone = filteredExaminers.filter(
      (_) => _.Interview.length > 0
    )
    const interviewEntqaDone = filteredExaminers.filter(
      (_) => _.Interview[0]?.recommendation
    )
    const didntFinishExam = filteredExaminers.filter(
      (_) => _.Answers?.length === 0
    )
    const examinerStatusNafsyMarkaz = filteredExaminers.filter(
      (_) => _.Interview[0]?.examiner_status === 'عرض مست نفسي'
    )
    const examinerStatusTebyMarkaz = filteredExaminers.filter(
      (_) => _.Interview[0]?.examiner_status === 'عرض مست طبي'
    )
    const examinerStatusNafsyEntqa = filteredExaminers.filter(
      (_) => _.Interview[0]?.recommendation === 1
    )
    const examinerStatusTebyEntqa = [
      ...filteredExaminers.filter((_) => _.Interview[0]?.recommendation === 2),
      ...filteredExaminers.filter((_) => _.Interview[0]?.recommendation === 3),
    ]
    const eqtesady = filteredExaminers.filter(
      (_) => _.Interview[0]?.recommendation === 4
    )
    const examinerHasUnit = filteredExaminers.filter(
      (_) => _?.UNIT_NAME !== null
    )

    const reportObject = [
      {
        name: 'كل المختبرين',
        value: filteredExaminers.length,
      },
      {
        name: 'من أنهوا الاختبار',
        value: filteredExaminers.filter(
          (examiner) => examiner.Answers?.length > 0
        ).length,
      },
      {
        name: 'من لم ينهوا الاختبار',
        value: didntFinishExam.length,
      },
      {
        name: 'كل الملحوظين',
        value: isNoticed.length,
      },
      {
        name: 'تم الاعاده عليهم',
        value: allReExamed.length,
      },
      {
        name: 'لم يتم الاعاده عليهم',
        value: isNoticed.length - allReExamed.length,
      },
      {
        name: 'ملحوظ بعد الاعاده',
        value: isNoticedAgain.length,
      },
      {
        name: 'عدد من تم تسجيل وحدته',
        value: examinerHasUnit.length,
      },
      {
        name: 'عدد من تم تسجيل وحدته و تم عرضهم على الفرع',
        value: getArraysIntersection(examinerHasUnit, interviewEntqaDone)
          .length,
      },
      {
        name: 'عدد من تم تسجيل وحدته و تم ترحيلهم قبل الإعادة',
        value: getArraysIntersection(
          examinerHasUnit,
          getArraysDifference(isNoticed, allReExamed)
        ).length,
      },
      {
        name: 'عدد من تم تسجيل وحدته و تم ترحيلهم قبل العرض على الفرع',
        value: getArraysIntersection(
          examinerHasUnit,
          getArraysDifference(isNoticedAgain, interviewEntqaDone)
        ).length,
      },
      {
        name: 'عدد من تم تسجيل وحدته و تم ترحيلهم قبل تطبيق الاختبارات',
        value: getArraysIntersection(examinerHasUnit, didntFinishExam).length,
      },
      {
        name: 'عدد من تم تسجيل وحدته و تم عرضهم على مست نفسي من قبل المركز',
        value: getArraysIntersection(examinerHasUnit, examinerStatusNafsyMarkaz)
          .length,
      },
      {
        name: 'عدد من تم تسجيل وحدته و تم عرضهم على مست طبي من قبل المركز',
        value: getArraysIntersection(examinerHasUnit, examinerStatusTebyMarkaz)
          .length,
      },
      {
        name: 'عدد من تم تسجيل وحدته و لم يتم تطبيق المقابلة الشخصية معهم',
        value: getArraysIntersection(
          examinerHasUnit,
          getArraysDifference(filteredExaminers, interviewDone)
        ).length,
      },
      {
        name: 'عدد من لم يتم تسجيل وحدته',
        value: filteredExaminers.length - examinerHasUnit.length,
      },
      {
        name: 'عدد من تم عمل مقابلة شخصية لهم',
        value: interviewDone.length,
      },

      {
        name: 'عدد من تم عمل مقابلة اكلينيكية لهم',
        value: interviewEntqaDone.length,
      },
      {
        name: 'عدد الملحوظين بعد الاعاده و تم ترحيلهم قبل العرض علي الفرع',
        value: isNoticedAgain.length - interviewEntqaDone.length,
      },
      {
        name: 'عرض مست نفسي من قبل المركز',
        value: examinerStatusNafsyMarkaz.length,
      },
      {
        name: 'عرض مست طبي من قبل المركز',
        value: examinerStatusTebyMarkaz.length,
      },
      {
        name: 'عرض مست نفسي من قبل الفرع',
        value: filteredExaminers.filter(
          (item) => item.Interview[0]?.recommendation === 1
        ).length,
      },
      {
        name: 'عرض مست طبى فرع',
        value: examinerStatusTebyEntqa.length,
      },
      {
        name: 'عرض مست طبى كوبري القبه فرع',
        value: filteredExaminers.filter(
          (item) => item.Interview[0]?.recommendation === 2
        ).length,
      },
      {
        name: 'عرض مست طبى الحلميه فرع',
        value: filteredExaminers.filter(
          (item) => item.Interview[0]?.recommendation === 3
        ).length,
      },
      {
        name: 'موقف إقتصادى /إجتماعى',
        value: eqtesady.length,
      },
      {
        name: 'عودة للوحدة بعد العرض علي الفرع',
        value: filteredExaminers.filter(
          (item) => item.Interview[0]?.recommendation === 5
        ).length,
      },
      {
        name: 'عودة للوحدة بعد العرض علي المست طبي (مركز)',
        value: examinerStatusTebyMarkaz.filter(
          (item) => item.Interview[0]?.final_hospital_result === 'عودة للوحدة'
        ).length,
      },
      {
        name: 'عودة للوحدة بعد العرض علي المست نفسي (مركز)',
        value: examinerStatusNafsyMarkaz.filter(
          (item) => item.Interview[0]?.final_hospital_result === 'عودة للوحدة'
        ).length,
      },
      {
        name: 'نفسى +إقتصادى',
        value: filteredExaminers.filter(
          (item) => item.Interview[0]?.recommendation === 6
        ).length,
      },
      {
        name: 'طبى+إقتصادى',
        value: filteredExaminers.filter(
          (item) => item.Interview[0]?.recommendation === 7
        ).length,
      },
      {
        name: 'رفت نفسي فرع',
        value: examinerStatusNafsyEntqa.filter(
          (item) => item.Interview[0]?.recommendation_res === 3
        ).length,
      },
      {
        name: 'رفت طبي فرع',
        value: examinerStatusTebyEntqa.filter(
          (item) => item.Interview[0]?.recommendation_res === 3
        ).length,
      },
      {
        name: 'رفت نفسي مركز',
        value: filteredExaminers.filter(
          (item) => item.Interview[0]?.final_hospital_result === 'رفت نفسي'
        ).length,
      },
      {
        name: 'رفت طبي مركز',
        value: filteredExaminers.filter(
          (item) => item.Interview[0]?.final_hospital_result === 'رفت طبي'
        ).length,
      },
      {
        name: 'عوده للوحده موقف اقتصادي او اجتماعي',
        value: eqtesady.filter(
          (item) => item.Interview[0]?.recommendation_res === 3
        ).length,
      },
    ]
    return reportObject
  }
}

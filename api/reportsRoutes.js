module.exports = function (app, prisma) {
  app.get('/getReports', async (req, res) => {
    const { examFinish, stage, report, user } = req.query
    let filteredExaminers = []
    const option = { where: {} }
    reportGeneralFilters(option, stage, user, examFinish)
    switch (Number(report)) {
      case 1:
        report1Filters(option)
        break
      case 2:
        report2Filters(option)
        break
      default:
        break
    }

    filteredExaminers = await prisma.Examiners.findMany(option)

    switch (Number(report)) {
      case 1:
        filteredExaminers = getReport1(filteredExaminers)
        break
      case 2:
        filteredExaminers = getReport2(filteredExaminers)
        break

      default:
        filteredExaminers = getReport1(filteredExaminers)
        break
    }
    res.json(filteredExaminers)
  })
}

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

function report1Filters(option) {
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
function getReport1(filteredExaminers) {
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
    const noticed = trainingCenterExaminers.filter((item) => item.isNoticed)
    const again = trainingCenterExaminers.filter((item) => item.again)
    const noticedAgain = trainingCenterExaminers.filter(
      (item) => item.isNoticedAgain
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
    return {
      user_id: k,
      total: trainingCenterExaminers.length,
      noticed: noticed.length,
      again: again.length,
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
    n_high: totalNoticed.filter((item) => item.qualification_code === 2).length,
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
  const isNoticed = filteredExaminers.filter((item) => item.isNoticed).length
  const isNoticedAgain = filteredExaminers.filter(
    (item) => item.isNoticedAgain
  ).length
  const allReExamed = filteredExaminers.filter((item) => item.again).length
  const interviewEntqaDone = filteredExaminers.filter(
    (item) => item.Interview[0]?.recommendation
  ).length
  const examinerStatusNafsyMarkaz = filteredExaminers.filter(
    (item) => item.Interview[0]?.examiner_status === 'عرض مست نفسي'
  )
  const examinerStatusTebyMarkaz = filteredExaminers.filter(
    (item) => item.Interview[0]?.examiner_status === 'عرض مست طبي'
  )
  const examinerStatusNafsyEntqa = filteredExaminers.filter(
    (item) => item.Interview[0]?.recommendation === 1
  )
  const examinerStatusTebyEntqa = [
    ...filteredExaminers.filter(
      (item) => item.Interview[0]?.recommendation === 2
    ),
    ...filteredExaminers.filter(
      (item) => item.Interview[0]?.recommendation === 3
    ),
  ]
  const eqtesady = filteredExaminers.filter(
    (item) => item.Interview[0]?.recommendation === 4
  )
  const examinerHasUnit = filteredExaminers.filter(
    (item) => item?.UNIT_NAME !== null
  ).length

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
      value: filteredExaminers.filter(
        (examiner) => examiner.Answers?.length === 0
      ).length,
    },
    {
      name: 'كل الملحوظين',
      value: isNoticed,
    },
    {
      name: 'تم الاعاده عليهم',
      value: allReExamed,
    },
    {
      name: 'لم يتم الاعاده عليهم',
      value: isNoticed - allReExamed,
    },
    {
      name: 'ملحوظ بعد الاعاده',
      value: isNoticedAgain,
    },
    {
      name: 'عدد من تم تسجيل وحدته',
      value: examinerHasUnit,
    },
    {
      name: 'عدد من لم يتم تسجيل وحدته',
      value: filteredExaminers.length - examinerHasUnit,
    },
    {
      name: 'عدد من تم عمل مقابلة شخصية لهم',
      value: filteredExaminers.filter((item) => item.Interview.length > 0)
        .length,
    },

    {
      name: 'عدد من تم عمل مقابلة اكلينيكية لهم',
      value: interviewEntqaDone,
    },
    {
      name: 'عدد الملحوظين بعد الاعاده و تم ترحيلهم قبل العرض علي الفرع',
      value: isNoticedAgain - interviewEntqaDone,
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
      name: 'عرض مست طبى  فرع',
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
        (item) =>
          item.Interview[0]?.final_hospital_allExaminers === 'عودة للوحدة'
      ).length,
    },
    {
      name: 'عودة للوحدة بعد العرض علي المست نفسي (مركز)',
      value: examinerStatusNafsyMarkaz.filter(
        (item) =>
          item.Interview[0]?.final_hospital_allExaminers === 'عودة للوحدة'
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
        (item) => item.Interview[0]?.final_hospital_allExaminers === 'رفت نفسي'
      ).length,
    },
    {
      name: 'رفت طبي مركز',
      value: filteredExaminers.filter(
        (item) => item.Interview[0]?.final_hospital_allExaminers === 'رفت طبي'
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

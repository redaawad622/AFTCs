/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

module.exports = function (app, prisma) {
  app.get('/getReports', async (req, res) => {
    const { examFinish, stage, report, user } = req.query
    let result = []
    const option = { where: {} }
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
    switch (Number(report)) {
      case 1:
        option.where.NOT = [{ user_id: null }]
        option.select = {
          user_id: true,
          again: true,
          isNoticed: true,
          isNoticedAgain: true,
          qualification_code: true,
        }
        break
      case 2:
        option.where.NOT = [{ user_id: null }]
        option.select = {
          user_id: true,
          again: true,
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
        break

      default:
        break
    }
    result = await prisma.Examiners.findMany(option)

    switch (Number(report)) {
      case 1:
        result = getReport1(result)
        break
      case 2:
        result = getReport2(result)
        break

      default:
        result = getReport1(result)
        break
    }
    res.json(result)
  })
}

function getReport1(result) {
  let groups = result.reduce((g, elm) => {
    g[elm.user_id] = g[elm.user_id] ?? []
    g[elm.user_id].push(elm)
    return g
  }, {})
  groups = Object.keys(groups).map((k) => {
    const elm = groups[k]
    const noticed = elm.filter((item) => item.isNoticed)
    const again = elm.filter((item) => item.again)
    const noticedAgain = elm.filter((item) => item.isNoticedAgain)
    return {
      user_id: k,
      total: elm.length,
      noticed: noticed.length,
      again: again.length,
      noticedAgain: noticedAgain.length,
      high: elm.filter((item) => item.qualification_code === 2).length,
      middle: elm.filter((item) => item.qualification_code === 1).length,
      usually: elm.filter((item) => item.qualification_code === 0).length,
      above: elm.filter((item) => item.qualification_code === 8).length,
      n_high: noticed.filter((item) => item.qualification_code === 2).length,
      n_middle: noticed.filter((item) => item.qualification_code === 1).length,
      n_usually: noticed.filter((item) => item.qualification_code === 0).length,
      n_above: noticed.filter((item) => item.qualification_code === 8).length,
    }
  })
  const totalNoticed = result.filter((item) => item.isNoticed)
  groups.push({
    user_id: 'الكل',
    total: result.length,
    noticed: totalNoticed.length,
    again: result.filter((item) => item.again).length,
    noticedAgain: result.filter((item) => item.isNoticedAgain).length,
    high: result.filter((item) => item.qualification_code === 2).length,
    middle: result.filter((item) => item.qualification_code === 1).length,
    usually: result.filter((item) => item.qualification_code === 0).length,
    above: result.filter((item) => item.qualification_code === 8).length,
    n_high: totalNoticed.filter((item) => item.qualification_code === 2).length,
    n_middle: totalNoticed.filter((item) => item.qualification_code === 1)
      .length,
    n_usually: totalNoticed.filter((item) => item.qualification_code === 0)
      .length,
    n_above: totalNoticed.filter((item) => item.qualification_code === 8)
      .length,
  })
  return groups
}
function getReport2(result) {
  const noticedAfter = result.filter((item) => item.isNoticedAgain).length
  const interviewEntqaDone = result.filter(
    (item) => item.Interview[0]?.recommendation
  ).length
  const nafsy = result.filter(
    (item) => item.Interview[0]?.examiner_status === 'عرض مست نفسي'
  )
  const tepy = [
    ...result.filter((item) => item.Interview[0]?.recommendation === 2),
    ...result.filter((item) => item.Interview[0]?.recommendation === 3),
  ]

  const eqtsdy = result.filter(
    (item) => item.Interview[0]?.recommendation === 4
  )
  const allNoticed = result.filter((item) => item.isNoticed).length

  const allReExamed = result.filter((item) => item.again).length
  const newRes = [
    {
      name: 'كل المختبرين',
      value: result.length,
    },
    {
      name: 'من أنهوا الاختبار',
      value: result.filter((examiner) => examiner.Answers?.length > 0).length,
    },
    {
      name: 'من لم ينهوا الاختبار',
      value: result.filter((examiner) => examiner.Answers?.length === 0).length,
    },
    {
      name: 'كل الملحوظين',
      value: allNoticed,
    },
    {
      name: 'تم الاعاده عليهم',
      value: allReExamed,
    },
    {
      name: 'لم يتم الاعاده عليهم',
      value: allNoticed - allReExamed,
    },
    {
      name: 'ملحوظ بعد الاعاده',
      value: noticedAfter,
    },
    {
      name: 'عدد من تم عمل مقابلة شخصية لهم',
      value: result.filter((item) => item.Interview.length > 0).length,
    },
    {
      name: 'عدد من تم عمل مقابلة اكلينيكية لهم',
      value: interviewEntqaDone,
    },
    {
      name: 'عدد الملحوظين بعد الاعاده و تم ترحيلهم قبل العرض علي الفرع',
      value: noticedAfter - interviewEntqaDone,
    },
    {
      name: 'عرض مست نفسي من قبل المركز',
      value: nafsy.length,
    },
    {
      name: 'عرض مست طبي من قبل المركز',
      value: result.filter(
        (item) => item.Interview[0]?.examiner_status === 'عرض مست طبي'
      ).length,
    },
    {
      name: 'عرض مست نفسي من قبل الفرع',
      value: result.filter((item) => item.Interview[0]?.recommendation === 1)
        .length,
    },
    {
      name: 'عرض مست طبى  فرع',
      value: tepy.length,
    },
    {
      name: 'عرض مست طبى كوبري القبه فرع',
      value: result.filter((item) => item.Interview[0]?.recommendation === 2)
        .length,
    },
    {
      name: 'عرض مست طبى الحلميه فرع',
      value: result.filter((item) => item.Interview[0]?.recommendation === 3)
        .length,
    },
    {
      name: 'موقف إقتصادى /إجتماعى',
      value: eqtsdy.length,
    },
    {
      name: 'عودة للوحدة بعد العرض علي الفرع',
      value: result.filter((item) => item.Interview[0]?.recommendation === 5)
        .length,
    },

    {
      name: 'نفسى +إقتصادى',
      value: result.filter((item) => item.Interview[0]?.recommendation === 6)
        .length,
    },
    {
      name: 'طبى+إقتصادى',
      value: result.filter((item) => item.Interview[0]?.recommendation === 7)
        .length,
    },

    {
      name: 'عودة للوحده بعد العرض علي مست نفسي',
      value: nafsy.filter((item) => item.Interview[0]?.recommendation_res === 2)
        .length,
    },
    {
      name: 'عودة للوحده بعد العرض علي مست طبي',
      value: tepy.filter((item) => item.Interview[0]?.recommendation_res === 2)
        .length,
    },
    {
      name: 'رفت نفسي',
      value: nafsy.filter((item) => item.Interview[0]?.recommendation_res === 3)
        .length,
    },
    {
      name: 'رفت طبي',
      value: tepy.filter((item) => item.Interview[0]?.recommendation_res === 3)
        .length,
    },
    {
      name: 'عوده للوحده موقف اقتصادي او اجتماعي',
      value: eqtsdy.filter(
        (item) => item.Interview[0]?.recommendation_res === 3
      ).length,
    },
  ]
  return newRes
}

export const examinerFilterOptions = {
  /**
   * Checks if user searched by {nat_id,name,barcode,sold_id,triple_no}
   */
  searchOptions(search, option) {
    if (search) {
      option.where.OR = [
        {
          national_id: {
            contains: search,
          },
        },
        {
          name: {
            contains: search,
          },
        },

        {
          barcode: {
            contains: search,
          },
        },
        {
          sold_id: {
            contains: search,
          },
        },
        {
          triple_number: {
            contains: search,
          },
        },
      ]
    }
  },
  /**
   * Checks if examiner is registered with the same user_id and adds query
   */
  registerOptions(register, option, id) {
    if (register) {
      option.where.user_id = { equals: Number(id) }
    }
  },

  /**
   * Checks if examiner is re-examined filter and adds query
   */
  againOptions(again, option) {
    if (again) {
      option.where.again = { equals: Boolean(Number(again)) }
    }
  },
  /**
   * Checks if examiner isNoticed first time
   */
  isNoticedOptions(isNoticed, option, newSet) {
    if (isNoticed) {
      const noticed = Number(isNoticed)
      switch (noticed) {
        case 1:
          option.where.isNoticed = { equals: true }
          if (newSet) {
            option.where.isNoticedAgain = { equals: false }
          }
          break
        case 2:
          option.where.isNoticedAgain = { equals: true }
          break
        case 3:
          option.where.isNoticed = { equals: false }
          break
      }
    }
  },

  /**
   * Query on examiners with same user_id (training center id)
   */
  userOptions(user, option) {
    if (user) {
      option.where.user_id = { equals: Number(user) }
    }
  },
  /**
   * Query on examiners with different qualifications (high,above,middle,usually)
   */
  qualificationOptions(qualification, option) {
    if (qualification || qualification === '0' || qualification === 0) {
      option.where.qualification_code = { equals: Number(qualification) }
    }
  },
  /**
   * Query on examiners with same batteryID
   */
  batteryOptions(battaryId, option) {
    if (battaryId) {
      option.where.battary_id = { equals: Number(battaryId) }
    }
  },
  /**
   * Query on examiners with same stage (i.e 20223 , 20224 , etc..)
   */
  stageOptions(stage, option) {
    if (stage) {
      option.where.stage = { equals: stage }
    }
  },
  /**
   * Query on examiners who have units registered
   */
  hasUnitOptions(hasUnit, option) {
    if (hasUnit) {
      if (Number(hasUnit)) {
        option.where.NOT = [
          {
            UNIT_NAME: null,
          },
        ]
      } else {
        option.where.UNIT_NAME = {
          equals: null,
        }
      }
    }
  },

  examFinishedOptions(examFinish, option) {
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
  },

  /**
   * Query on examiners who have interviews (مقابلة شخصية)
   */

  doneInterviewOptions(interview, option) {
    if (interview) {
      if (Number(interview)) {
        option.where.Interview = {
          some: {},
        }
      } else {
        option.where.Interview = {
          none: {},
        }
      }
    }
  },
  sortOptions(sortBy, option, sortDesc) {
    if (sortBy && sortBy.length > 0) {
      const sorts = sortBy[0].split('.')
      if (sorts.length > 1) {
        const dir = Boolean(sortDesc[0])
        option.orderBy[sorts[0]] = {
          [sorts[1]]: dir ? 'desc' : 'asc',
        }
      } else {
        const dir = Boolean(sortDesc[0])
        option.orderBy[sortBy[0]] = dir ? 'desc' : 'asc'
      }
    }
  },
  examinerGradesOptions(option) {
    option.include = {
      _count: {
        select: { Interview: true, Answers: true },
      },
      CustomExam: {
        include: {
          exam: {
            select: {
              Exm_Name: true,
            },
          },
        },
      },
    }
  },
  interviewFiltersOptions(interviewFilters, interviewEntqaDone, option) {
    if (
      interviewFilters.final_opinion ||
      interviewFilters.transReason ||
      interviewFilters.recommendation ||
      interviewFilters.recommendation_res ||
      interviewFilters.examiner_status ||
      interviewFilters.final_hospital_result ||
      interviewEntqaDone
    ) {
      option.where.Interview = {
        some: {},
      }
      option.include.Interview = {}
    }
  },

  async withResultOptions(withResult, option, nafsy, prisma) {
    if (withResult) {
      option.include.Answers = {}
      if (nafsy) {
        await this.withNafsyResultOptions(option, prisma)
      }
      option.include.Answers.select = {
        id: true,
        exam_id: true,
        question_id: true,
        answer_id: true,
        examiner_id: true,
        answer: {
          select: {
            Ans_Value: true,
          },
        },
      }
    }
  },
  async withNafsyResultOptions(option, prisma) {
    let battary = await prisma.Battries.findUnique({
      where: {
        id: 11, // بطارية النفسي
      },
      include: {
        Battary_Exam: true,
      },
    })
    battary = battary.Battary_Exam.map((ex) => ex.exam_id)
    option.include.Answers.where = { exam_id: { in: battary } }
  },
  async showAllExaminersFilter(showAll, option, prisma) {
    if (showAll) {
      delete option.skip
      delete option.take
      return await prisma.Examiners.findMany(option)
    }
  },
  filterInterviewDB(interviewFilter, examiners) {
    for (const key in interviewFilter) {
      if (
        Object.hasOwnProperty.call(interviewFilter, key) &&
        !interviewFilter[key]
      ) {
        delete interviewFilter[key]
      }
    }
    if (Object.keys(interviewFilter).length > 0) {
      examiners = examiners.filter((elm) => {
        let isTrue = true
        for (const key in interviewFilter) {
          const type = typeof elm.Interview[0][key]
          let filter = interviewFilter[key]

          if (type === 'number') {
            filter = Number(filter)
          }
          if (filter !== elm.Interview[0][key]) {
            isTrue = false
            return false
          }
        }
        return isTrue
      })
    }
    return examiners
  },
  interviewEntqaDoneFilter(interviewEntqaDone, examiners) {
    if (interviewEntqaDone) {
      if (Number(interviewEntqaDone)) {
        examiners = examiners.filter((elm) => {
          return elm.Interview[0].recommendation
        })
      } else {
        examiners = examiners.filter((elm) => {
          return !elm.Interview[0].recommendation
        })
      }
    }
    return examiners
  },
  calculateExaminerGrades(examiners) {
    if (examiners && examiners.length > 0) {
      if (examiners[0].Answers) {
        examiners = this.calculateExamGrades(examiners)
      }
    }
    return examiners
  },
  calculateAllExaminersGrades(showAllExaminers) {
    if (showAllExaminers && showAllExaminers.length > 0) {
      if (showAllExaminers[0].Answers) {
        showAllExaminers = this.calculateExamGrades(showAllExaminers)
      }
    }
    return showAllExaminers
  },
  calculateExamGrades(examiners) {
    examiners = examiners.map((examiner) => {
      const exm = Object.assign({}, examiner, {
        Answers: examiner.Answers.reduce((r, a) => {
          r[a.exam_id] = [...(r[a.exam_id] || []), a]
          return r
        }, {}),
      })
      Object.keys(exm.Answers).forEach((k) => {
        exm.Answers[k] = exm.Answers[k].reduce((a, b) => {
          return a + b.answer.Ans_Value
        }, 0)
      })
      return exm
    })
    return examiners
  },
  async deleteExaminersDeveloperOptions(option, deleteItems, prisma) {
    if (deleteItems) {
      await prisma.Examiners.deleteMany(option)
    }
  },
  cleanOptions(option) {
    delete option.skip
    delete option.take
    delete option.orderBy
    delete option.include
  },
}

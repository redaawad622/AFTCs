/* eslint-disable camelcase */
export const state = () => ({
  assignExams: [],
  examsData: [],
  exams: [],
  currentExamTime: 0,
  answers: [],
  customExam: [],
  audio: null,
  mute: false,
  play: false,
  battaries: [],
  stage: [],
  serials: [],
  categories: [],
  order: [],
  editableExam: null,
  battary: {},
  weapons: [],
  UnitNames: [],
  TamarkzNames: [],
  ArmyNames: [],
})
export const getters = {
  exams(state) {
    return state.exams
  },
  UnitNames(state) {
    return state.UnitNames
  },
  TamarkzNames(state) {
    return state.TamarkzNames
  },
  ArmyNames(state) {
    return state.ArmyNames
  },

  assignExams(state) {
    return state.assignExams
  },
  examsData(state) {
    return state.examsData
  },
  currentExamTime(state) {
    return state.currentExamTime
  },
  answers(state) {
    return state.answers
  },
  customExam(state) {
    return state.customExam
  },
  audio(state) {
    return state.audio
  },
  mute(state) {
    return state.mute
  },
  play(state) {
    return state.play
  },
  battaries(state) {
    return state.battaries
  },
  weapons(state) {
    return state.weapons
  },
  stage(state) {
    return state.stage
  },
  serials(state) {
    return state.serials
  },
  categories(state) {
    return state.categories
  },
  order(state) {
    return state.order
  },
  editableExam(state) {
    return state.editableExam
  },
  battary(state) {
    return state.battary
  },
}
export const mutations = {
  setHelpers(state, payload) {
    state.battaries = payload.battaries
    state.stage = payload.stage
    state.categories = payload.categories
    state.order = payload.order
    state.weapons = payload.weapons
    state.ArmyNames = payload.ArmyNames
    state.TamarkzNames = payload.TamarkzNames
    state.UnitNames = payload.UnitNames
  },
  setExams(state, payload) {
    state.exams = payload.exams
  },

  updateExams(state, exam) {
    const index = state.exams.findIndex((elm) => elm.Exm_ID === exam.Exm_ID)
    if (index === -1) {
      state.exams.push(exam)
    } else {
      exam.delete ? state.exams.splice(index, 1) : (state.exams[index] = exam)
    }
  },
  setAssignExams(state, payload) {
    state.assignExams = payload
  },
  setExamsData(state, payload) {
    state.examsData = payload
  },
  setEditableExam(state, payload) {
    state.editableExam = payload
  },
  setBattaryData(state, payload) {
    state.battary = payload
  },
  setCurrentExamTime(state, payload) {
    state.currentExamTime = payload
  },

  loadAnswers(state, payload) {
    state.answers = this.$getLocal(`answer${payload}`) || []
    state.customExam = this.$getLocal(`customExam${payload}`) || []
  },
  loadAnswersFrom(state, { answers, national_id, customExam }) {
    const localBackup = this.$getLocal(`answer${national_id}`) || []
    const localCustomExam = this.$getLocal(`customExam${national_id}`) || []
    if (customExam && customExam.length > 0) {
      const examiner_ids_c = customExam.map((elm) => elm.examiner_id)
      const filteredLocalBackup_c = localCustomExam.filter(function (obj) {
        return !examiner_ids_c.includes(obj.examiner_id)
      })
      state.customExam = [...customExam, ...filteredLocalBackup_c]
    } else {
      state.customExam = localCustomExam
    }
    this.$setLocal(`customExam${national_id}`, state.customExam)
    if (answers && answers.length > 0) {
      const examiner_ids = answers.map((elm) => elm.examiner_id)
      const filteredLocalBackup = localBackup.filter(function (obj) {
        return !examiner_ids.includes(obj.examiner_id)
      })
      state.answers = [...answers, ...filteredLocalBackup]
    } else {
      state.answers = localBackup
    }
    this.$setLocal(`answer${national_id}`, state.answers)
  },

  reset(state, payload) {
    this.$setLocal(`answer${payload}`, [])
    this.$setLocal(`customExam${payload}`, [])
    state.examsData = []
    state.exams = []
    state.currentExamTime = 0
    state.answers = []
    state.customExam = []
    state.audio = null
    state.mute = false
    state.play = false
  },
  addToAnswers(state, payload) {
    const index = state.answers.findIndex(
      (x) => x.question_id === payload.ans.Ans_Qus_ID
    )
    if (index === -1) {
      const ans = {
        question_id: payload.ans.Ans_Qus_ID,
        answer_id: payload.ans.Ans_ID,
        exam_id: payload.exam_id,
      }
      state.answers.push(ans)
      this.$setLocal(`answer${payload.userId}`, state.answers)
    }
  },
  addToCustomExam(state, payload) {
    const index = state.customExam.findIndex(
      (x) => x.exam_id === payload.ans.exam_id
    )
    if (index === -1) {
      state.customExam.push(payload.ans)
      this.$setLocal(`customExam${payload.userId}`, state.customExam)
    }
  },
  popAns(state, payload) {
    state.answers.pop()
    this.$setLocal(`answer${payload.userId}`, state.answers)
  },
  setAudio(state, payload) {
    state.audio = payload
  },
  setSerials(state, payload) {
    state.serials = payload
  },
  setMute(state, payload) {
    if (state.audio) {
      payload ? state.audio.pause() : state.audio.play()
    }
    state.mute = payload
    state.play = !payload
  },
  setPlay(state, payload) {
    if (state.audio) {
      payload ? state.audio.play() : state.audio.pause()
    }
    state.play = payload
  },
}
export const actions = {
  getAssignExams({ commit }, payload) {
    return this.$axios(`/api/getAssignExams`, {
      params: { examinerId: payload },
    })
  },
  getExamsData(_, payload) {
    return this.$axios(`/api/getExamsData`, {
      params: { examId: JSON.stringify(payload) },
    })
  },
  softDeleteExam(_, payload) {
    return this.$axios.post(`/api/softDeleteExam`, payload)
  },
  getExams() {
    return this.$axios(`/api/getExams`)
  },
  saveSetting(_, payload) {
    return this.$axios.post(`/api/saveSetting`, payload)
  },
  addAsBattary(_, payload) {
    return this.$axios.post(`/api/addAsBattary`, payload)
  },
  getAndAdd(_, payload) {
    return this.$axios.get(`/api/getAndAdd`, { params: payload })
  },
  getHelpers({ commit }) {
    return this.$axios.get(`/api/getExamHelpers`).then((res) => {
      commit('setHelpers', res.data)
    })
  },
  getSerials({ commit }) {
    return this.$axios.get(`/api/getSerials`).then((res) => {
      commit('setSerials', res.data)
    })
  },
  saveAnswers({ state }, payload) {
    let count = 0
    state.answers.forEach((element) => {
      if (Object.prototype.hasOwnProperty.call(element, 'id')) count++
    })
    if (count !== state.answers.length || state.customExam.length > 0)
      return this.$axios.post(`/api/saveAnswers`, {
        answers: JSON.stringify(state.answers),
        customExam: JSON.stringify(state.customExam),
        examinerId: payload.id,
        endTime: payload.endTime,
      })
  },
  saveOrEditExam(_, payload) {
    return this.$axios.post(`/api/saveOrEditExam`, payload)
  },
  getEditableExam({ commit }, payload) {
    this.$axios(`/api/editableExam`, { params: payload }).then((res) => {
      commit('setEditableExam', res.data)
    })
  },
  getBattaryData({ commit }, payload) {
    this.$axios(`/api/battaryData`, { params: payload }).then((res) => {
      commit('setBattaryData', res.data)
    })
  },
  saveNewQues(_, payload) {
    return this.$axios.post(`/api/saveNewQues`, payload)
  },
  saveBattary(_, payload) {
    return this.$axios.post(`/api/saveBattary`, payload)
  },
  saveManualCustomExam(_, payload) {
    return this.$axios.post(`/api/saveManualCustomExam`, payload)
  },
  again(_, payload) {
    return this.$axios.post(`/api/again`, payload)
  },
  setAsAgain(_, payload) {
    return this.$axios.post(`/api/setAsAgain`, payload)
  },
  setAsFNoticed(_, payload) {
    return this.$axios.post(`/api/setAsFNoticed`, payload)
  },
  saveUnit(_, payload) {
    return this.$axios.post(`/api/saveUnit`, payload)
  },
  deleteQ(_, id) {
    return this.$axios.post(`/api/deleteQ`, { id })
  },
  updateQ(_, payload) {
    return this.$axios.post(`/api/updateQ`, payload)
  },
}

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
})
export const getters = {
  exams(state) {
    return state.exams
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
}
export const mutations = {
  setExams(state, payload) {
    state.exams = payload.exams
  },
  setAssignExams(state, payload) {
    state.assignExams = payload
  },
  setExamsData(state, payload) {
    state.examsData = payload
  },
  setCurrentExamTime(state, payload) {
    state.currentExamTime = payload
  },
  loadAnswers(state, payload) {
    state.answers = this.$getLocal(`answer${payload}`) || []
    state.customExam = this.$getLocal(`customExam${payload}`) || []
  },
  reset(state, payload) {
    state.answers = this.$setLocal(`answer${payload}`, [])
    state.examsData = []
    state.exams = []
    state.currentExamTime = 0
    state.answers = []
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
    }).then((res) => {
      commit('setAssignExams', res.data)
    })
  },
  getExamsData(_, payload) {
    return this.$axios(`/api/getExamsData`, {
      params: { examId: JSON.stringify(payload) },
    })
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
  saveAnswers({ state }, payload) {
    return this.$axios.post(`/api/saveAnswers`, {
      answers: JSON.stringify(state.answers),
      examinerId: payload,
    })
  },
}

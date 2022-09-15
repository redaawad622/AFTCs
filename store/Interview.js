export const state = () => ({
  interviewer_opinion: null,
})
export const getters = {
  examiner(state) {
    return state.examiner
  },
  interviewerOpinion(state) {
    return state.interviewerOpinion
  },
}
export const mutations = {
  setinterviewerOpinion(state, payload) {
    state.interviewerOpinion = payload
  },
}

export const actions = {
  getInterview(_, payload) {
    return this.$axios(`/api/getInterview`, {
      params: payload,
    })
  },
  saveInterview(_, payload) {
    return this.$axios.post(`/api/saveInterview`, payload)
  },
}

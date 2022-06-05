/* eslint-disable camelcase */
export const state = () => ({
  logs: [],
  allLogs: 0,
})
export const getters = {
  getLogs(state) {
    return state.logs
  },
  allLogs(state) {
    return state.allLogs
  },
}
export const mutations = {
  setLogs(state, payload) {
    state.logs = payload.logs
    state.allLogs = payload.allLogs
  },
}

export const actions = {
  saveNewQues(_, payload) {
    return this.$axios.post(`/api/saveNewQues`, payload)
  },
  fetchLog({ commit }, payload) {
    return this.$axios.get(`/api/fetchLog`, { params: payload }).then((res) => {
      commit('setLogs', res.data)
    })
  },

  // filterImages(_, payload) {
  //   return this.$axios.get(`/api/filterImages`, { params: payload })
  // },

  // filterQuestionImages(_, payload) {
  //   return this.$axios.get(`/api/filterQuestionImages`, { params: payload })
  // },
}

export const state = () => ({
  examiner: null,
})
export const getters = {
  examiner(state) {
    return state.examiner
  },
}
export const mutations = {
  setExaminer(state, payload) {
    state.examiner = payload
  },
}
export const actions = {
  getExaminer({ commit }, payload) {
    return this.$axios(`/api/getExaminer?id=${payload}`).then((res) => {
      commit('setExaminer', res.data)
    })
  },
  save(_, payload) {
    return this.$axios.post(`/api/save`, payload)
  },
}

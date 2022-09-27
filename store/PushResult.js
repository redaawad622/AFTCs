export const state = () => ({
  previewResult: null,
})
export const getters = {
  previewResult(state) {
    return state.previewResult
  },
}
export const mutations = {
  setPreviewResult(state, payload) {
    state.previewResult = payload
  },
}
export const actions = {
  loadAndSendAnswersData() {
    return this.$axios.post(`/api/loadAndSendAnswersData`)
  },
  loadExaminerDataFromLocalServer(_, payload) {
    return this.$axios.post(`/api/loadExaminerDataFromLocalServer`, {
      ids: payload || [],
    })
  },
  deleteExaminerDataFromLocalServer(_, payload) {
    return this.$axios.post(`/api/deleteExaminerDataFromLocalServer`, payload)
  },
  removeNotNoticedExaminedAgain(_, payload) {
    return this.$axios.post(`/api/removeNotNoticedExaminedAgain`, payload)
  },
}

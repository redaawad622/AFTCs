export const state = () => ({
  report: null,
})
export const getters = {
  report(state) {
    return state.report
  },
}
export const mutations = {
  setReport(state, payload) {
    state.report = payload
  },
}

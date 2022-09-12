export const state = () => ({
  plan: null,
})
export const getters = {
  plan(state) {
    return state.plan
  },
}
export const mutations = {
  setPlan(state, payload) {
    state.plan = payload
  },
}
export const actions = {
  expectedPlanTransaction(_, payload) {
    return this.$axios.post(`/api/expectedPlanTransaction`, payload)
  },
}

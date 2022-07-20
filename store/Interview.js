export const state = () => ({})
// export const getters = {
//   examiner(state) {
//     return state.examiner
//   },
// }
// export const mutations = {

//   },
// }
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

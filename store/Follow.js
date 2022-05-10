export const state = () => ({})
export const getters = {}
export const mutations = {}
export const actions = {
  guests(_, payload) {
    return this.$axios(`/api/guests`, {
      params: payload,
    })
  },
  save(_, payload) {
    return this.$axios.post(`/api/guests`, payload)
  },
  setCase(_, payload) {
    return this.$axios.post(`/api/setCase`, payload)
  },
  deleteGuest(_, payload) {
    return this.$axios.post(`/api/guests/delete`, payload)
  },
  checkCase(_, payload) {
    return this.$axios(`/api/checkCase`, {
      params: payload,
    })
  },
}

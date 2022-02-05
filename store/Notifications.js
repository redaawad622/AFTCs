export const state = () => ({
  notification: null,
})
export const getters = {
  notification(state) {
    return state.notification
  },
}
export const mutations = {
  setNotification(state, payload) {
    state.notification = payload
  },
}

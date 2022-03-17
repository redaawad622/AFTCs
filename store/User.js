export const state = () => ({
  user: process.server ? '' : JSON.parse(sessionStorage.getItem('user')),
  users: [],
  currentLogin: null,
  permissions: {
    developer: [0],
    admin: [0, 3],
    area: [0, 3, 1],
    center: [0, 3, 2],
  },
})
export const getters = {
  user(state) {
    return state.user
  },
  users(state) {
    return state.users
  },
  currentLogin(state) {
    return state.currentLogin
  },
  permissions(state) {
    return state.permissions
  },
}
export const mutations = {
  setUser(state, payload) {
    state.user = payload
    this.$cookiz.set('user', payload)
  },
  setUsers(state, payload) {
    state.users = payload
  },
  setCurrentLogin(state, payload) {
    state.currentLogin = payload
  },
}
export const actions = {
  login({ commit }, payload) {
    return this.$axios.post(`/api/login`, payload).then((res) => {
      commit('setUser', res.data)
    })
  },
  save(_, payload) {
    return this.$axios.post(`/api/saveUser`, payload)
  },
  getUsers({ commit }, payload) {
    return this.$axios(`/api/getAllUser`, payload).then((res) => {
      commit('setUsers', res.data)
    })
  },
  getCurrentLogin({ commit }) {
    return this.$axios.post(`/api/getCurrentLogin`).then((res) => {
      commit('setCurrentLogin', res.data)
    })
  },
  reset(_, payload) {
    return this.$axios.post(`/api/resetPassword`, payload)
  },
}

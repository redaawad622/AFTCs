
export const state = () => ({
  user: process.server ? '' : JSON.parse(sessionStorage.getItem('user')),
  users: [],
})
export const getters = {
  user(state) {
    return state.user
  },
  users(state) {
    return state.users
  },
}
export const mutations = {
  setUser(state, payload) {
    state.user = payload
    this.$cookiz.set('user',payload)
    this.$setLocal('user',payload,true,false);
  },
  setUsers(state, payload) {
    state.users = payload
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
  getUsers({commit}, payload) {
    return this.$axios(`/api/getAllUser`, payload).then((res) => {
      commit('setUsers', res.data)
    })
  },
}

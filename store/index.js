export const state = () => ({
 
})
export const getters = {

}
export const mutations = {
 
}
export const actions = {
  getHelpers({ commit }, payload = true) {
    let helpers = null
    if (payload) {
      helpers = this.$getLocal('helpers')
    }
    if (helpers) {
      commit('setHelpers', helpers)
    } else {
      return this.$axios(`/api/helpers`).then((res) => {
        commit('setHelpers', res.data)
      })
    }
  },
  saveOne(_, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('/api/saveOne', payload, {
          headers: {
            'accept': 'application/json',
            'Content-Type': `multipart/form-data`,
          }
        })
        .then((res) => {
          resolve(res)
        })
        .catch((rej) => {
          reject(rej)
        })
    })
  },
}

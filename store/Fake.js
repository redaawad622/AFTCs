export const actions = {
  examiner() {
    return this.$axios.post(`/api/examinerFake`, { number: 5000 })
  },
}

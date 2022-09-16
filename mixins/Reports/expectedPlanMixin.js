export default {
  methods: {
    expectedTotal(plan) {
      return (
        plan?.expected_high +
        plan?.expected_above +
        plan?.expected_middle +
        plan?.expected_usually
      )
    },
    actualArriveTotal(plan) {
      return (
        plan?.actual_arrive_high +
        plan?.actual_arrive_above +
        plan?.actual_arrive_middle +
        plan?.actual_arrive_usually
      )
    },
  },
}

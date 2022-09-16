<template>
  <font>{{ differenceExpectedActualMessage(item) }}</font>
</template>

<script>
import expectedPlanMixin from '~/mixins/Reports/expectedPlanMixin'

export default {
  name: 'DifferenceExpectedActual',
  mixins: [expectedPlanMixin],
  props: {
    item: {
      type: Object,
      default: null,
    },
    category: {
      type: String,
      default: '',
    },
  },

  methods: {
    differenceExpectedActual(plan) {
      if (this.category === '')
        return this.actualArriveTotal(plan) - this.expectedTotal(plan)
      else if (this.category === 'high') {
        return plan?.actual_arrive_high - plan?.expected_high
      } else if (this.category === 'above') {
        return plan?.actual_arrive_above - plan?.expected_above
      } else if (this.category === 'middle') {
        return plan?.actual_arrive_middle - plan?.expected_middle
      } else if (this.category === 'usually') {
        return plan?.actual_arrive_usually - plan?.expected_usually
      }
    },
    differenceExpectedActualMessage(plan) {
      if (isNaN(this.differenceExpectedActual(plan))) {
        return ''
      } else if (this.differenceExpectedActual(plan) > 0) {
        return `وصول  ${this.differenceExpectedActual(plan)} فوق المخطط`
      } else if (this.differenceExpectedActual(plan) < 0) {
        return `وصول  ${Math.abs(
          this.differenceExpectedActual(plan)
        )} تحت المخطط`
      } else {
        return 'لا يوجد فرق'
      }
    },
  },
}
</script>

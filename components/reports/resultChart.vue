<template>
  <div>
    <ApexChart
      width="500"
      type="bar"
      :options="chartOptions"
      :series="series"
    ></ApexChart>
  </div>
</template>
<script>
export default {
  name: 'ResultChart',
  props: {
    answers: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      chartOptions: {
        chart: {
          id: 'gradesChart',
        },
        xaxis: {
          categories: Object.keys(this.answers),
        },
      },
      series: [
        {
          name: '',
          data: Object.values(this.answers),
        },
      ],
    }
  },
}
</script>

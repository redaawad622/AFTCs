<template>
  <div>
    <vac :end-time="new Date().getTime() + 60000">
      <span slot="process" slot-scope="{ timeObj }">{{
        `وقت الاختبار: ${timeObj.m}:${timeObj.s}`
      }}</span>
      <span slot="finish">انتهي الوقت!</span>
    </vac>
  </div>
</template>

<script>
export default {
  name: 'ExamPage',
  layout: 'examLayout',
  data() {
    return {
      e6: 1,
    }
  },
  timers: {
    log: { time: 1000, autostart: true },
  },
  computed: {
    examiner() {
      return this.$store.getters['Examiner/examiner']
    },
  },
  created() {
    if (!this.examiner) {
      this.$router.replace('/')
    }
  },
  methods: {
    getExaminerData() {
      if (this.id) {
        this.loading = true
        this.$store.dispatch('Examiner/getExaminer', this.id).finally(() => {
          this.loading = false
        })
      }
    },
  },
}
</script>

<style>
</style>
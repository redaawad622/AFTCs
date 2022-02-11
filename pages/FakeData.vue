<template>
  <div>
    <div class="d-flex justify-center">
      <v-btn @click="fakeExaminer">fake examiners</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FakeData',
  methods: {
    fakeExaminer() {
      this.$store.dispatch('Fake/examiner')
    },
  },
}
</script>

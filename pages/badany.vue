<template>
  <div>
    <v-btn color="primary" @click="readData">read</v-btn>
  </div>
</template>

<script>
export default {
  name: 'BadanyPage',
  methods: {
    readData() {
      this.$axios('/api/badany').then((res) => {
        console.log(res)
      })
    },
  },
}
</script>

<style>
</style>
<template>
  <div>
    <v-btn color="secondary" :loading="loading" @click="getStageSold()"
      >سحب بيانات من عند النقيب شريف</v-btn
    >
  </div>
</template>

<script>
export default {
  name: 'NewPage',
  data() {
    return {
      loading: false,
    }
  },
  methods: {
    getStageSold() {
      this.loading = true
      this.$axios('/api/getStageSold').finally(() => {
        this.loading = false
      })
    },
  },
}
</script>

<style></style>

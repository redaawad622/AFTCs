<template>
  <div>
    <v-btn
      color="primary"
      class="mx-1"
      @click="
        openProg(
          'C:/Program Files (x86)/IObit/Driver Booster/8.2.0/DriverBooster.exe'
        )
      "
      >برنامج الفيينا</v-btn
    >
  </div>
</template>

<script>
export default {
  name: 'ExternalPage',

  methods: {
    openProg(url) {
      this.$store.dispatch('User/openProg', url)
    },
  },
}
</script>

<style></style>

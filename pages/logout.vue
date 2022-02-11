<template>
  <v-row style="min-height: 90vh" align="center" justify="center">
    <v-progress-circular size="50" indeterminate></v-progress-circular>
  </v-row>
</template>

<script>
export default {
  name: 'LogoutPage',
  mounted() {
    // logout
    this.$cookiz.remove('user')
    this.$router.replace('/')
  },
}
</script>

<style>
</style>
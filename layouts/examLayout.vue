<template>
  <v-app>
    <v-main>
      <Nuxt />
      <notification></notification>
    </v-main>
  </v-app>
</template>

<script>
import notification from '~/components/notifications/notification.vue'
export default {
  name: 'ExamLayout',
  components: { notification },
  layout: 'empty',
  middleware: 'guest',
  computed: {
    currentLogin() {
      return this.$store.getters['User/currentLogin']
    },
  },
  watch: {
    currentLogin(user) {
      if (user && user.zoom) {
        document.getElementsByTagName('html')[0].style.zoom = user.zoom + '%'
      }
    },
  },
  mounted() {
    this.$store.dispatch('User/getCurrentLogin')
  },
}
</script>

<style></style>

<template>
  <v-snackbar
    v-if="notification"
    v-model="snackbar"
    :timeout="notification.timeout || timeout"
    :color="notification.color"
  >
    <v-icon large class="me-2">{{ icon }}</v-icon>
    <span class="font-weight-bold pa-1">{{ notification.text }}</span>
    <template v-slot:action="{ attrs }">
      <v-btn
        color="#fff"
        class="mx-1"
        icon
        v-bind="attrs"
        @click="snackbar = false"
      >
        <v-icon>mdi-close-circle</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'NotificationPage',

  data: () => ({
    snackbar: true,
    timeout: 200000,
    icons: {
      error: 'mdi-alert-circle-outline ',
      warning: 'mdi-alert-outline ',
      info: 'mdi-information-outline ',
    },
  }),
  computed: {
    notification() {
      return this.$store.getters['Notifications/notification']
    },
    icon() {
      return this.icons[this.notification.color]
    },
  },
  watch: {
    snackbar() {
      this.$store.commit('Notifications/setNotification', null)
      this.snackbar = true
    },
  },
}
</script>

<style>
</style>
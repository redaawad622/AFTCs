<template>
  <v-snackbar
    v-if="notification"
    v-model="snackbar"
    :timeout="notification.timeout || timeout"
    :color="notification.color"
  >
    {{ notification.text }}

    <template v-slot:action="{ attrs }">
      <v-btn
        :color="notification.color"
        class="text--lighten-3 mx-1"
        text
        v-bind="attrs"
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'NotificationPage',

  data: () => ({
    snackbar: true,
    timeout: 2000,
  }),
  computed: {
    notification() {
      return this.$store.getters['Notifications/notification']
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
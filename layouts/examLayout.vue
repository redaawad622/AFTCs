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
}
</script>

<style>
</style>

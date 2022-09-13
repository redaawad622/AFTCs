<template>
  <div>
    <v-row justify="center">
      <v-dialog v-model="extractDialog" persistent max-width="450px">
        <v-card>
          <v-card-title class="grey lighten-2">
            استخراج المختبرين التاليين في exam.db
          </v-card-title>

          <v-card-text class="my-3">
            <v-text-field
              v-model="ip"
              outlined
              color="primary"
              label="ال ip الخاص بالجهاز "
            ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="extractDialog = false">
              الغاء
            </v-btn>
            <v-btn
              color="blue darken-1"
              :loading="extractLoading"
              text
              @click="extractToDevice()"
            >
              استخراج
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
    <v-btn
      v-if="permissions.area.includes(user.type)"
      color="white"
      title="استخراج البيانات الي exam.db"
      class="elevation-0 ms-2"
      @click="extractDialog = true"
    >
      <v-img
        width="24px"
        height="24px"
        contain
        src="/icon/database.png"
      ></v-img>
    </v-btn>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ip: '',
      extractLoading: false,
      extractDialog: false,
    }
  },
  computed: {
    permissions() {
      return this.$store.getters['User/permissions']
    },
    user() {
      return this.$store.getters['User/user']
    },
  },
  methods: {
    extractToDevice() {
      this.extractLoading = true
      this.$store
        .dispatch('Exam/extractToDevice', {
          nationals: this.examiners.map((elm) => elm.national_id),
          deviceIp: this.ip,
        })
        .then(() => {
          this.$store.commit('Notifications/setNotification', {
            text: 'تم استخراج المختبرين بنجاح بنجاح بنجاح',
            color: 'success',
          })
        })
        .catch(() => {
          this.$store.commit('Notifications/setNotification', {
            text: 'هناك مشكلة ',
            color: 'error',
          })
        })
        .finally(() => {
          this.extractLoading = false
        })
    },
  },
}
</script>

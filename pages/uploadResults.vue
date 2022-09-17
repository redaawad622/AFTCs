<template>
  <v-row>
    <v-col
      v-if="permissions.admin.includes(user.type)"
      cols="12"
      sm="6"
      md="4"
      lg="4"
    >
      <v-btn
        color="secondary"
        class="mx-1"
        :loading="loading"
        block
        @click="getStageSold()"
        >سحب بيانات من عند النقيب شريف</v-btn
      >
    </v-col>

    <v-col cols="12" sm="6" md="4" lg="4">
      <v-btn
        color="primary"
        :loading="loadLoading"
        block
        @click="loadAndSendAnswersData()"
        >تصدير بيانات الممتحنين الي فرع الانتقاء</v-btn
      >
    </v-col>
    <v-col
      v-if="permissions.admin.includes(user.type)"
      cols="12"
      sm="6"
      md="4"
      lg="4"
    >
      <v-btn :loading="wLoading" color="primary" block @click="saveWeapon"
        >سحب بيانات الاسلحة</v-btn
      >
    </v-col>
    <v-col
      v-if="permissions.admin.includes(user.type)"
      cols="12"
      sm="6"
      md="4"
      lg="4"
    >
      <v-btn
        :loading="qLoading"
        color="primary"
        block
        @click="updateQualification()"
        >تحديث المؤهلات بالرقم العسكري</v-btn
      >
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'NewPage',
  data() {
    return {
      loading: false,
      wLoading: false,
      loadLoading: false,
      qLoading: false,
    }
  },
  computed: {
    user() {
      return this.$store.getters['User/user']
    },
    permissions() {
      return this.$store.getters['User/permissions']
    },
  },
  methods: {
    getStageSold() {
      this.loading = true
      this.$axios('/api/getStageSold').finally(() => {
        this.loading = false
      })
    },
    saveWeapon() {
      this.wLoading = true
      this.$axios('/api/saveWeapon').finally(() => {
        this.wLoading = false
      })
    },
    loadAndSendAnswersData() {
      this.loadLoading = true
      this.$store
        .dispatch('PushResult/loadAndSendAnswersData')
        .then((res) => {
          this.$store.commit('PushResult/setPreviewResult', res.data)
          this.$router.push('/previewPushResult')
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loadLoading = false
        })
    },
    updateQualification() {
      this.qLoading = true
      this.$store
        .dispatch('Examiner/updateQualification')
        .then(() => {
          this.$store.commit('Notifications/setNotification', {
            text: 'تم التحديث بنجاح بنجاح',
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
          this.qLoading = false
        })
    },
  },
}
</script>

<style></style>

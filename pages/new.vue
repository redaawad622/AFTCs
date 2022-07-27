<template>
  <div>
    <v-btn
      v-if="permissions.admin.includes(user.type)"
      color="secondary"
      class="mx-1"
      :loading="loading"
      @click="getStageSold()"
      >سحب بيانات من عند النقيب شريف</v-btn
    >
    <v-btn color="primary" class="mx-1">سحب بيانات من فرع الانتقاء</v-btn>
    <v-btn
      color="primary"
      :loading="loadLoading"
      :disabled="loadLoading2"
      class="mx-1"
      @click="loadAndSendAnswersData()"
      >تصدير بيانات الممتحنين الي فرع الانتقاء</v-btn
    >
    <v-btn
      color="primary"
      :disabled="loadLoading"
      :loading="loadLoading2"
      class="mx-1"
      @click="loadExaminerDataFromLocalServer()"
      >تسجيل بيانات الممتحنين الي سيرفر فرع الانتقاء</v-btn
    >
    <v-btn
      v-if="permissions.admin.includes(user.type)"
      :loading="wLoading"
      color="primary"
      class="mx-1"
      @click="saveWeapon"
      >سحب بيانات الاسلحة</v-btn
    >
  </div>
</template>

<script>
export default {
  name: 'NewPage',
  data() {
    return {
      loading: false,
      wLoading: false,
      loadLoading: false,
      loadLoading2: false,
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
        .dispatch('Exam/loadAndSendAnswersData')
        .then((res) => {
          this.$store.commit('Exam/setPreviewResult', res.data)
          this.$router.push('/previewPushResult')
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loadLoading = false
        })
    },
    loadExaminerDataFromLocalServer() {
      this.loadLoading2 = true
      this.$store
        .dispatch('Exam/loadExaminerDataFromLocalServer')
        .then((res) => {
          this.$store.commit('Exam/setPreviewResult', res.data)
          this.$router.push('/previewPushResult')
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loadLoading2 = false
        })
    },
  },
}
</script>

<style></style>

<template>
  <v-btn
    v-if="permissions.admin.includes(user.type)"
    title="سحب بيانات المختبرين من ملف الاكسس"
    class="elevation-0 ms-2"
    color="white"
    @click="readExaminerFromMdb()"
  >
    <v-img
      width="24px"
      height="24px"
      contain
      src="/icon/microsoft-access.png"
    ></v-img>
  </v-btn>
</template>


<script>
export default {
  computed: {
    permissions() {
      return this.$store.getters['User/permissions']
    },
    user() {
      return this.$store.getters['User/user']
    },
  },
  methods:{
     readExaminerFromMdb() {
      this.loading = true
      this.$store
        .dispatch(`Examiner/readExaminerFromMdb`)
        .then((res) => {
          this.examiners = res.data
          this.allExaminers = this.examiners.length
        })
        .finally(() => {
          this.loading = false
        })
    },
}
}
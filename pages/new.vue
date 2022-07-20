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
    <v-btn color="primary" class="mx-1"
      >تصدير بيانات الممتحنين الي فرع الانتقاء</v-btn
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
  },
}
</script>

<style></style>

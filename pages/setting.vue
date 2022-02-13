<template>
  <div>
    <div class="pa-5">
      <v-select
        v-model="table"
        :items="tables"
        outlined
        label="اسم الجدول"
      ></v-select>
      <v-text-field
        v-model="password"
        type="password"
        outlined
        label="رقم الدخول"
      ></v-text-field>
      <v-btn :loading="loading" color="primary" @click="deleteTable()"
        >حذف جميع البيانات</v-btn
      >
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingPage',
  data: () => ({
    tables: ['Examiners', 'Assign', 'Answers', 'Battries'],
    table: '',
    password: '',
    loading: false,
  }),
  computed: {
    user() {
      return this.$store.getters['User/user']
    },
  },
  methods: {
    deleteTable() {
      if (this.table) {
        this.loading = true
        this.$axios
          .post('/api/truncate', {
            table: this.table,
            password: this.password,
            name: this.user.Cat_Name,
          })
          .then(() => {
            this.$store.commit('Notifications/setNotification', {
              text: 'تم الحذف بنجاح',
              color: 'success',
            })
          })
          .catch((rej) => {
            const error = rej.response.data
            this.$store.commit('Notifications/setNotification', {
              text: error,
              color: 'error',
            })
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$store.commit('Notifications/setNotification', {
          text: 'من فضلك اختر جدول',
          color: 'error',
        })
      }
    },
  },
}
</script>

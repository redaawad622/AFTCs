<template>
  <div>
    <v-card
      v-if="
        permissions.developer.includes(user.type) &&
        user.Cat_Name == 'redaawad622@gmail.com'
      "
      outlined
      class="mb-4"
    >
      <v-card-title>حذف جميع البيانات</v-card-title>
      <v-card-text>
        <v-combobox
          v-model="table"
          :items="tables"
          outlined
          label="اسم الجدول"
        ></v-combobox>
        <v-text-field
          v-model="password"
          type="password"
          outlined
          label="رقم الدخول"
        ></v-text-field>
        <v-btn :loading="loading" color="primary" @click="deleteTable()"
          >حذف جميع البيانات</v-btn
        >
      </v-card-text>
    </v-card>
    <v-card
     
      outlined
    >
      <v-card-title>تسجيل رقم دخول جديد</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="reset.oldPassword"
          type="password"
          outlined
          label=" رقم الدخول القديم"
        ></v-text-field>

        <v-text-field
          v-model="reset.newPassword"
          type="password"
          outlined
          label="رقم الدخول الجديد"
        ></v-text-field>
        <v-btn :loading="resetLoading" color="primary" @click="changePassword()"
          >تغير الرقم</v-btn
        >
      </v-card-text>
    </v-card>
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
    resetLoading: false,
    reset: {
      newPassword: '',
      oldPassword: '',
    },
  }),
  computed: {
    user() {
      return this.$store.getters['User/user']
    },
    permissions() {
      return this.$store.getters['User/permissions']
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
    changePassword() {
      this.resetLoading = true
      this.$store
        .dispatch('User/reset', { ...this.reset, name: this.user.Cat_Name })
        .then(() => {
          this.$router.replace('/logout')
        })
        .catch((rej) => {
          const error = rej.response.data
          this.$store.commit('Notifications/setNotification', {
            text: error,
            color: 'error',
          })
        })
        .finally(() => {
          this.resetLoading = false
        })
    },
  },
}
</script>

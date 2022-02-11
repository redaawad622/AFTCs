<template>
  <v-sheet width="100%" height="100%" class="d-flex pa-5 flex-column">
    <v-btn
      class="font-weight-bold title"
      width="120px"
      text
      color="primary"
      @click="dialog = true"
      >تسجيل الدخول</v-btn
    >
    <v-spacer></v-spacer>
    <v-sheet
      height="200px"
      max-width="700px"
      width="100%"
      class="d-flex justify-center align-center align-self-center"
    >
      <v-text-field
        v-model="id"
        outlined
        label="ابحث بالرقم القومي-الثلاثي-الباركود "
        placeholder="ابحث بالرقم القومي-الثلاثي-الباركود "
        full-width
        prepend-inner-icon="mdi-search"
        hide-details
        class="me-3 display-1"
      ></v-text-field>
      <v-btn
        :loading="loading"
        class="headline"
        width="100px"
        height="56px"
        color="primary"
        @click="getExaminerData()"
        >بحث</v-btn
      >
    </v-sheet>
    <examiner-data></examiner-data>
    <v-spacer></v-spacer>

    <div class="text-center">
      <v-dialog v-model="dialog" width="500">
        <v-card>
          <v-card-title class="text-h5 grey lighten-2">
            تسجيل الدخول
          </v-card-title>

          <v-card-text class="pa-4">
            <v-combobox
              v-model="form.name"
              outlined
              :items="users"
              item-text="Cat_Name"
              item-value="Cat_Name"
              :return-object="false"
              label="مركز التدريب"
              :error="!!error"
            ></v-combobox>
            <v-text-field
              v-model="form.password"
              type="password"
              outlined
              label="رقم الدخول"
              :error-messages="error"
            ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :loading="logining"
              color="primary"
              class="title"
              text
              @click="login()"
            >
              تسجيل الدخول
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-sheet>
</template>

<script>
import examinerData from '~/components/exam/examinerData.vue'
export default {
  name: 'IndexPage',
  components: { examinerData },
  layout: 'examLayout',

  data() {
    return {
      dialog: false,
      loading: false,
      logining: false,
      id: '',
      error: null,
      form: {
        name: '',
        password: '',
      },
    }
  },
  computed: {
    users() {
      return this.$store.getters['User/users']
    },

    user() {
      return this.$store.getters['User/user']
    },
    examiner() {
      return this.$store.getters['Examiner/examiner']
    },
  },

  beforeMount() {
    this.$store.dispatch('User/getUsers')
  },

  methods: {
    login() {
      this.logining = true
      this.error = null
      this.$store
        .dispatch('User/login', this.form)
        .then(() => {
          this.$router.replace('/ExamsManager')
        })
        .catch((rej) => {
          this.error = rej.response.data
        })
        .finally(() => {
          this.logining = false
        })
    },
    getExaminerData() {
      if (this.id) {
        this.loading = true
        this.message = ''
        this.$store.dispatch('Examiner/getExaminer', this.id).finally(() => {
          this.loading = false
          if (!this.examiner) {
            this.$store.commit('Notifications/setNotification', {
              text: 'الممتحن غير موجود',
              color: 'error',
            })
          }
        })
      }
    },
  },
}
</script>

<style>
</style>
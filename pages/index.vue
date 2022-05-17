<template>
  <v-sheet width="100%" height="100%" class="d-flex pa-5 flex-column">
    <div class="d-flex justify-space-between align-center">
      <v-btn
        class="font-weight-bold title"
        width="120px"
        text
        color="primary"
        @click="dialog = true"
        >تسجيل الدخول</v-btn
      >
      <div v-if="currentLogin">{{ currentLogin.Cat_Name }}</div>
      <div>{{ new Date().toDateString() }}</div>
    </div>

    <v-spacer></v-spacer>
    <v-sheet
      v-if="!dialog"
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
        autofocus
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
      <v-dialog v-model="dialog" width="500" hide-overlay>
        <v-card>
          <v-card-title class="text-h5 grey lighten-2 d-flex">
            <span> تسجيل الدخول </span>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false"
              ><v-icon>mdi-close</v-icon></v-btn
            >
          </v-card-title>

          <v-form class="pa-4">
            <v-combobox
              v-model="form.name"
              outlined
              :items="users"
              item-text="Cat_Name"
              item-value="Cat_Name"
              :return-object="false"
              label="اسم الدخول"
              :error="!!error"
            ></v-combobox>
            <v-text-field
              v-model="form.password"
              type="password"
              outlined
              label="رقم الدخول"
              :error-messages="error"
            ></v-text-field>
          </v-form>
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
    currentLogin() {
      return this.$store.getters['User/currentLogin']
    },

    user() {
      return this.$store.getters['User/user']
    },
    examiner() {
      return this.$store.getters['Examiner/examiner']
    },
    permissions() {
      return this.$store.getters['User/permissions']
    },
  },

  beforeMount() {
    this.$store.dispatch('User/getUsers')
  },
  mounted() {
    if (this.examiner) {
      this.id = this.examiner.national_id || this.examiner.barcode
      this.getExaminerData()
    }
  },

  methods: {
    login() {
      this.logining = true
      this.error = null
      this.$store
        .dispatch('User/login', this.form)
        .then(() => {
          this.$desktopNotify({
            message: 'تم تسجيل الدخول بنجاح باسم ' + this.user.Cat_Name,
            body: 'من فضلك ابقي مسجلا اثناء العمل',
          })
          this.$router.replace('/ExaminerManager')
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

<style></style>

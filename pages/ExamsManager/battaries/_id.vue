<template>
  <v-card>
    <v-card-text>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="obj.name"
          outlined
          color="primary"
          label="الاسم"
        ></v-text-field>
        <v-select
          v-model="obj.user_id"
          outlined
          label="تسجيل بطارية لمستخدم معين"
          item-text="Cat_Name"
          item-value="Cat_ID"
          :items="users"
        ></v-select>
        <v-autocomplete
          v-model="obj.weapon_id"
          outlined
          label="تسجيل بطارية لسلاح معين"
          item-text="V_SELAH"
          item-value="MIL_SELAH"
          :return-object="false"
          :items="weapons"
        ></v-autocomplete>
      </v-form>
      <v-btn class="my-2" color="primary" :loading="loading" @click="save()"
        >حفظ</v-btn
      >
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      valid: true,
      loading: false,
      obj: {
        weapon_id: '',
        user_id: '',
        name: '',
      },
    }
  },

  async fetch({ route, store }) {
    await store.dispatch('Exam/getBattaryData', {
      id: route.params.id,
    })
  },
  computed: {
    battary() {
      return this.$store.getters['Exam/battary']
    },
    users() {
      return this.$store.getters['User/users']
    },
    weapons() {
      return this.$store.getters['Exam/weapons']
    },
  },
  watch: {
    battary: {
      handler(val) {
        this.obj = Object.assign({}, val)
        this.obj.weapon_id = String(this.obj.weapon_id)
        this.obj.user_id = String(this.obj.user_id)
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$store
          .dispatch('Exam/saveBattary', this.obj)
          .then(() => {
            this.$store.commit('Notifications/setNotification', {
              text: 'تم الحفظ بنجاح',
              color: 'success',
            })

            this.form = {
              weapon_id: '',
              user_id: '',
              name: '',
            }
            this.$refs.form.reset()
            this.$refs.form.resetValidation()
          })
          .catch((rej) => {
            this.$store.commit('Notifications/setNotification', {
              text: 'خطأ في الحفظ',
              color: 'error',
            })
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$store.commit('Notifications/setNotification', {
          text: 'أكمل البيانات',
          color: 'error',
        })
      }
    },
  },
}
</script>

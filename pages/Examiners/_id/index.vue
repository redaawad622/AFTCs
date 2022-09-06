<template>
  <v-card class="pa-6">
    <v-form ref="form" v-model="valid" lazy-validation>
      <div class="d-flex">
        <v-text-field
          v-model="form.national_id"
          outlined
          color="primary"
          label="الرقم القومي"
          placeholder="الرقم القومي"
          :rules="national_ru"
          :counter="14"
          maxlength="14"
          :error-messages="serverErr['national_id']"
          append-icon="mdi-star"
          hide-spin-buttons
          type="number"
          @keyup.enter="searchBy('national_id')"
        ></v-text-field>
        <v-btn
          class="primary mr-3"
          style="height: 55px; width: 80px"
          @click="searchBy('national_id')"
          >بحث</v-btn
        >
      </div>
      <v-sheet class="d-flex">
        <v-text-field
          v-model="th_num"
          outlined
          color="primary"
          :rules="minMax4"
          class="me-2"
          hide-spin-buttons
          hint="2010"
          :error-messages="serverErr['triple_number']"
          type="number"
        ></v-text-field>
        <span class="display-1 me-2 mt-2">/</span>

        <v-text-field
          v-model="sec_num"
          outlined
          color="primary"
          :rules="min1Max3"
          hide-spin-buttons
          type="number"
          hint="123"
          class="me-2"
          :error-messages="serverErr['triple_number']"
        ></v-text-field>
        <span class="display-1 me-2 mt-2">/</span>
        <v-text-field
          v-model="f_num"
          outlined
          :rules="min1Max4"
          hide-spin-buttons
          type="number"
          hint="1234"
          color="primary"
          :error-messages="serverErr['triple_number']"
          @keyup.enter="searchBy('triple_number')"
        ></v-text-field>
        <v-btn
          class="primary mr-3"
          style="height: 55px; width: 80px"
          @click="searchBy('triple_number')"
          >بحث</v-btn
        >
      </v-sheet>

      <v-text-field
        v-model="form.sold_id"
        outlined
        color="primary"
        label="الرقم العسكري"
        placeholder="الرقم العسكري"
        :error-messages="serverErr['sold_id']"
        :rules="sold_ru"
        :counter="13"
        maxlength="13"
      ></v-text-field>
      <v-text-field
        v-model="form.name"
        outlined
        append-icon="mdi-star"
        color="primary"
        label="الاسم"
        :rules="required"
        :error-messages="serverErr['name']"
        placeholder="الاسم"
      ></v-text-field>
      <v-select
        v-model="form.stage"
        :items="currentYerars"
        outlined
        color="primary"
        append-icon="mdi-star"
        label="المرحلة"
        placeholder="المرحلة"
      ></v-select>
      <v-text-field
        v-if="permissions.admin.includes(user.type)"
        v-model="form.barcode"
        outlined
        color="primary"
        :error-messages="serverErr['barcode']"
        label="الباركود"
        placeholder="الباركود"
      ></v-text-field>
      <v-select
        v-if="permissions.admin.includes(user.type)"
        v-model="form.battary_id"
        :items="battaries"
        outlined
        color="primary"
        item-text="name"
        item-value="id"
        :return-object="false"
        append-icon="mdi-star"
        label="البطارية"
        placeholder="البطارية"
      ></v-select>
      <v-checkbox
        v-if="
          permissions.center.includes(user.type) && user.Cat_Name == 'المدرعات'
        "
        color="primary"
        label="نفسي"
        @change="setBat"
      ></v-checkbox>
      <v-btn color="primary" class="my-2" @click="save()">حفظ</v-btn>
      <v-row justify="center">
        <v-dialog v-if="examiner" v-model="dialog" persistent max-width="600px">
          <template #activator="{ on, attrs }">
            <v-btn color="error" dark v-bind="attrs" v-on="on">
              تسجيل درجات
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="grey lighten-2">
              <span class="text-h5">تسجيل درجات الاختبارات التالية</span>
            </v-card-title>
            <v-card-text class="my-3">
              <v-text-field
                v-for="item in exams"
                :key="item.Exm_Name"
                v-model.number="examsVal[item.Exm_ID]"
                outlined
                :label="item.Exm_Name"
                type="number"
              ></v-text-field>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn
                :disabled="examLoading"
                color="blue darken-1"
                text
                @click="dialog = false"
              >
                الغاء
              </v-btn>
              <v-btn
                color="blue darken-1"
                :loading="examLoading"
                text
                @click="saveManualCustomExam()"
              >
                حفظ
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-form>
  </v-card>
</template>

<script>
import validation from '~/mixins/validation'

export default {
  name: 'InsertExaminer',
  mixins: [validation],
  middleware: 'center',
  data: () => {
    return {
      dialog: false,
      examLoading: false,
      valid: true,
      exams: [],
      examsVal: {},
      form: {
        national_id: '',
        triple_number: '',
        name: '',
        stage: '',
        barcode: '',
        sold_id: '',
        battary_id: '',
      },
      f_num: '',
      sec_num: '',
      th_num: '',
      serverErr: [],
    }
  },
  fetch() {
    if (this.$route.params.id && this.$route.params.id !== 'new') {
      this.$store.dispatch('Examiner/getExaminer', this.$route.params.id)
    }
  },
  computed: {
    currentYerars() {
      const year = new Date().getFullYear()

      return [year + '1', year + '2', year + '3', year + '4']
    },
    battaries() {
      return this.$store.getters['Exam/battaries']
    },
    examiner() {
      return this.$store.getters['Examiner/examiner']
    },
    user() {
      return this.$store.getters['User/user']
    },
    permissions() {
      return this.$store.getters['User/permissions']
    },
  },
  watch: {
    examiner(val) {
      if (val) {
        Object.keys(this.form).forEach((item) => {
          if (item === 'triple_number') {
            if (val[item]) {
              const tri = val[item].split('/')
              this.f_num = tri[0]
              this.sec_num = tri[1]
              this.th_num = tri[2]
            }
          } else this.form[item] = val[item]
        })
      }
    },
    dialog(val) {
      if (val) {
        this.$store
          .dispatch('Exam/getAssignExams', this.examiner.id)
          .then((res) => {
            const custom = res.data.customExam.map((elm) => elm.exam_id)
            this.exams = res.data.battary.filter(
              (elm) => elm.random === 'جهاز' && !custom.includes(elm.Exm_ID)
            )
          })
      }
    },
  },
  mounted() {
    const year = new Date().getFullYear()
    const month = new Date().getMonth() + 1

    if ([1, 2, 3].includes(month)) {
      this.form.stage = year + '1'
    } else if ([4, 5, 6].includes(month)) {
      this.form.stage = year + '2'
    } else if ([7, 8, 9].includes(month)) {
      this.form.stage = year + '3'
    } else if ([10, 11, 12].includes(month)) {
      this.form.stage = year + '4'
    }
  },
  methods: {
    setBat(val) {
      if (val) {
        this.form.battary_id = 11
      } else {
        this.form.battary_id = ''
      }
    },
    saveManualCustomExam() {
      const exams = Object.fromEntries(
        Object.entries(this.examsVal).filter(([key, elm]) => elm)
      )
      if (Object.keys(exams).length > 0) {
        this.examLoading = true
        this.$store
          .dispatch('Exam/saveManualCustomExam', {
            exams,
            id: this.examiner.id,
          })
          .then(() => {
            this.dialog = false
            this.exams = []
            this.examsVal = []
          })
          .finally(() => {
            this.examLoading = false
          })
      }
    },
    searchBy(item) {
      if (this.f_num && this.sec_num && this.th_num)
        this.form.triple_number =
          this.f_num + '/' + this.sec_num + '/' + this.th_num

      if (this.form[item]) {
        this.$store.dispatch('Examiner/getExaminer', this.form[item])
      }
    },

    save() {
      this.serverErr = []
      if (this.$refs.form.validate()) {
        this.loading = true
        if (this.f_num && this.sec_num && this.th_num)
          this.form.triple_number =
            this.f_num + '/' + this.sec_num + '/' + this.th_num

        this.$store
          .dispatch('Examiner/save', this.form)
          .then(() => {
            this.$store.commit('Notifications/setNotification', {
              text: 'تم الحفظ بنجاح',
              color: 'success',
            })

            this.form = {
              national_id: '',
              triple_number: '',
              name: '',
              stage: '',
              barcode: '',
              sold_id: '',
              battary_id: '',
            }
            this.f_num = ''
            this.sec_num = ''
            this.th_num = ''
            this.$refs.form.reset()
            this.$refs.form.resetValidation()
          })
          .catch((rej) => {
            if (rej instanceof Array) {
              this.serverErr = rej
            }
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

<template>
  <v-sheet>
    <v-row>
      <v-col>
        <v-card
          max-height="500px"
          style="overflow: auto"
          min-height="500px"
          :loading="loading"
          outlined
        >
          <v-card-text>
            <v-menu
              v-model="showMenuList"
              :position-x="x"
              :position-y="y"
              absolute
              offset-y
            >
              <v-list>
                <v-list-item link @click="editExam('add')">
                  <v-list-item-title>اضافة اختبار جديد</v-list-item-title>
                </v-list-item>
                <v-list-item link @click="editExam('edit')">
                  <v-list-item-title v-if="activeExam"
                    >تعديل اختبار ({{ activeExam.Exm_Name }})</v-list-item-title
                  >
                </v-list-item>
                <v-list-item link @click="editExamQ()">
                  <v-list-item-title>تعديل أسئلة الاختبار</v-list-item-title>
                </v-list-item>
                <v-list-item link @click="softDeleteExam()">
                  <v-list-item-title>حذف الاختبار</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-text-field
              v-model="search"
              outlined
              append-icon="mdi-search"
            ></v-text-field>
            <v-divider class="mb-4"></v-divider>
            <div v-for="(group, k) in examGroup(filterExam)" :key="k">
              <v-alert
                border="left"
                colored-border
                dense
                text
                class="font-weight-bold my-2"
                color="grey"
                >{{ k }}</v-alert
              >
              <v-chip
                v-for="exam in group"
                :key="exam.Exm_ID"
                class="ma-1"
                draggable
                @click="addToExam(exam)"
                @contextmenu.prevent="showMenu(exam, $event)"
              >
                {{ exam.Exm_Name }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col>
        <v-card
          max-height="500px"
          style="overflow: auto"
          min-height="500px"
          :loading="loading"
          outlined
        >
          <v-card-text class="d-flex">
            <div style="flex: 1">
              <div v-for="(group, k) in examGroup(examList)" :key="k">
                <v-alert
                  border="left"
                  colored-border
                  dense
                  text
                  class="font-weight-bold my-2"
                  color="grey"
                  >{{ k }}</v-alert
                >
                <v-chip
                  v-for="exam in group"
                  :key="exam.Exm_ID"
                  close
                  class="ma-1"
                  @click="removeFromExam(exam)"
                  @click:close="removeFromExam(exam)"
                >
                  {{ exam.Exm_Name }}
                </v-chip>
              </div>
            </div>
            <v-divider vertical class="mx-2"></v-divider>
            <div style="width: 210px">
              <div class="d-flex flex-column justify-space-between">
                <v-btn color="error" class="mb-2" @click="examList = []"
                  >حذف الكل</v-btn
                >
                <v-btn
                  color="success"
                  class="mb-2"
                  @click="examList = filterExam"
                  >اضافة الكل</v-btn
                >
                <v-dialog v-model="dialog" width="500" class="mb-2">
                  <template #activator="{ on, attrs }">
                    <v-btn
                      color="red lighten-2"
                      :disabled="examList.length < 1"
                      dark
                      v-bind="attrs"
                      v-on="on"
                    >
                      اضافة كبطارية
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                      اكتب اسم
                    </v-card-title>

                    <v-card-text class="pt-2">
                      <v-text-field
                        v-model="name"
                        color="primary"
                        outlined
                      ></v-text-field>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        :loading="addLoading"
                        text
                        @click="addAsBattary()"
                      >
                        اضافة
                      </v-btn>
                      <v-btn color="error" text @click="dialog = false">
                        الغاء
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </div>

              <div v-if="battaries.length > 0" class="d-flex flex-column my-3">
                <v-combobox
                  v-model="battary_id"
                  :items="battaries"
                  item-text="name"
                  item-value="id"
                  dense
                  outlined
                  label="البطاريات"
                  placeholder="البطاريات"
                  class="mb-3"
                  hide-details
                ></v-combobox>
                <v-btn
                  color="primary"
                  :loading="getLoading"
                  @click="getAndAdd()"
                  >اضافة البطارية الي الاختبارات</v-btn
                >
                <v-btn
                  color="primary"
                  class="my-2"
                  :loading="editLoading"
                  @click="addAsBattary(true)"
                  >تعديل البطارية الحالية</v-btn
                >
                <v-btn
                  color="primary"
                  :loading="editLoading"
                  :to="`/examsManager/battaries/${battary_id.id}`"
                  >تعديل بيانات البطارية</v-btn
                >
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-btn class="my-5" :loading="sLoading" color="primary" @click="saveSetting"
      >حفظ الاعدادات</v-btn
    >
    <add-exam-model
      v-model="openAddModel"
      :exam="activeExam"
      :form-type="formType"
      @update="addOrUpdateExam"
    ></add-exam-model>
  </v-sheet>
</template>

<script>
import addExamModel from './addExamModel.vue'

export default {
  components: { addExamModel },
  data() {
    return {
      showMenuList: false,
      x: 0,
      y: 0,
      loading: false,
      openAddModel: false,
      sLoading: false,
      getLoading: false,
      dialog: false,
      addLoading: false,
      editLoading: false,
      search: '',
      filterExam: [],
      examList: [],
      name: '',
      battary_id: '',
      activeExam: null,
      formType: 'add',
    }
  },
  computed: {
    exams() {
      return this.$store.getters['Exam/exams']
    },
    battaries() {
      return this.$store.getters['Exam/battaries']
    },
  },
  watch: {
    search(val) {
      this.filterExam = this.exams.filter((x) => x.Exm_Name.includes(val))
    },
  },
  created() {
    this.getExams()
  },
  methods: {
    editExamQ() {
      if (this.activeExam) {
        this.$router.push('/examsManager/' + this.activeExam.Exm_ID)
      }
    },
    addOrUpdateExam(exam) {
      this.$store.commit('Exam/updateExams', exam)
    },
    softDeleteExam() {
      const exam = { ...this.activeExam }
      this.$store
        .dispatch('Exam/softDeleteExam', { id: exam.Exm_ID })
        .then(() => {
          exam.delete = true
          this.$store.commit('Exam/updateExams', exam)
        })
    },
    editExam(type) {
      this.formType = type
      this.openAddModel = true
    },
    showMenu(item, $event) {
      this.activeExam = item
      this.showMenuList = false
      this.x = $event.clientX
      this.y = $event.clientY
      this.$nextTick(() => {
        this.showMenuList = true
      })
    },
    examGroup(arr) {
      return arr.reduce((r, a) => {
        r[a.category] = [...(r[a.category] || []), a]
        return r
      }, {})
    },
    getExams() {
      this.loading = true
      this.$store
        .dispatch('Exam/getExams')
        .then((res) => {
          this.$store.commit('Exam/setExams', res.data)
          this.filterExam = this.exams
          this.examList = res.data.assExams
        })
        .finally(() => {
          this.loading = false
        })
    },
    saveSetting() {
      this.sLoading = true
      this.$store.dispatch('Exam/saveSetting', this.examList).finally(() => {
        this.sLoading = false
      })
    },
    addAsBattary(edit = false) {
      if (edit) {
        if (!this.battary_id) {
          return
        }
        this.editLoading = true
      } else {
        if (!this.name) {
          return
        }
        this.addLoading = true
      }

      this.$store
        .dispatch('Exam/addAsBattary', {
          exams: this.examList,
          name: edit ? this.battary_id.name : this.name,
        })
        .then(() => {
          this.$store.commit('Notifications/setNotification', {
            text: 'تم اضافة البطارية بنجاح',
            color: 'success',
          })
        })
        .finally(() => {
          this.editLoading = false
          this.addLoading = false
        })
    },

    addToExam(e) {
      const isEx = this.examList.findIndex((x) => x.Exm_ID === e.Exm_ID)
      if (isEx === -1) this.examList.push(e)
    },
    getAndAdd() {
      this.getLoading = true
      this.$store
        .dispatch('Exam/getAndAdd', {
          battaryId: this.battary_id.id,
        })
        .then((res) => {
          res.data.forEach((e) => {
            this.addToExam(e)
          })
          this.$store.commit('Notifications/setNotification', {
            text: 'تم اضافة البطارية بنجاح',
            color: 'success',
          })
        })
        .finally(() => {
          this.getLoading = false
        })
    },
    removeFromExam(exam) {
      const index = this.examList.findIndex((x) => x.Exm_ID === exam.Exm_ID)
      if (index !== -1) {
        this.examList.splice(index, 1)
      }
    },
  },
}
</script>

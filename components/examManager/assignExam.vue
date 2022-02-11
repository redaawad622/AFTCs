<template>
  <v-sheet>
    <v-row>
      <v-col>
        <v-card
          max-height="500px"
          style="overflow: auto"
          min-height="500px"
          :loading="loading"
          hover
          outlined
        >
          <v-card-text>
            <v-text-field
              outlined
              append-icon="mdi-search"
              v-model="search"
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
                draggable
                v-for="exam in group"
                class="ma-1"
                @click="addToExam(exam)"
                :key="exam.Exm_ID"
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
          hover
          outlined
        >
          <v-card-text>
            <v-btn @click="examList = []" color="error">حذف الكل</v-btn>
            <v-btn @click="examList = filterExam" color="success"
              >اضافة الكل</v-btn
            >
            <v-divider class="my-4"></v-divider>
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
                close
                v-for="exam in group"
                class="ma-1"
                @click="removeFromExam(exam)"
                @click:close="removeFromExam(exam)"
                :key="exam.Exm_ID"
              >
                {{ exam.Exm_Name }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-btn class="my-5" @click="saveSetting" :loading="sLoading" color="primary"
      >حفظ الاعدادات</v-btn
    >
  </v-sheet>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      sLoading: false,
      search: '',
      filterExam: [],
      examList: [],
    }
  },
  computed: {
    exams() {
      return this.$store.getters['Exam/exams']
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
    addToExam(e) {
      const isEx = this.examList.findIndex((x) => x.Exm_ID === e.Exm_ID)
      if (isEx === -1) this.examList.push(e)
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

<style>
</style>
<template>
  <v-sheet>
    <v-fade-transition>
      <div v-if="loading">
        <v-container style="height: calc(100vh - 68px); max-width: 200px">
          <v-sheet
            height="100%"
            class="d-flex flex-column align-center justify-center"
          >
            <div class="title text-center mb-4">جاري تجهيز الأسئلة</div>
            <v-progress-linear
              color="primary"
              indeterminate
              rounded
              height="6"
            ></v-progress-linear>
          </v-sheet>
        </v-container>
      </div>
      <template v-else>
        <div v-if="exams && exams.length > 0">
          <ques-exam
            v-if="mcq.includes(random[1])"
            :exam="exams[cursor]"
            @done="nextExam()"
          ></ques-exam>
          <div v-else-if="random[1] === 'شاشة'">
            <component
              :is="`screen${exams[cursor].Exm_ID}`"
              :exam="exams[cursor]"
              @done="nextExam()"
            ></component>
          </div>
          <div v-else-if="random[1] === 'جهاز'" class="font-weight-bold">
            الاختبار يتم علي جهاز مخصص
            {{ nextExam() }}
          </div>
        </div>
        <div v-else>لا يوجد امتحانات</div>
      </template>
    </v-fade-transition>
  </v-sheet>
</template>

<script>
import Screen2 from '../customScreens/screen2.vue'
import quesExam from './quesExam.vue'
export default {
  components: { quesExam, Screen2 },
  props: {
    group: {
      type: Array,
      required: true,
    },
    k: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      exams: [],
      loading: false,
      mcq: ['عشوائي', 'مخصص', 'ترتيب'],
      cursor: 0,
    }
  },
  computed: {
    random() {
      return this.k.split('-')
    },
  },
  watch: {
    group: {
      deep: true,
      handler(val) {
        this.getGroup(val)
      },
    },
  },
  created() {
    this.getGroup(this.group)
  },
  methods: {
    nextExam() {
      if (this.cursor < this.exams.length - 1) {
        this.cursor++
      } else {
        this.$emit('done')
        this.cursor = 0
      }
    },
    calcExamsTime(exam) {
      return exam.reduce((a, b) => a + b.Exm_Duration_In_Mins, 0)
    },
    collectAndRandom(exam) {
      const res = {}
      res.Exm_Duration_In_Mins = this.calcExamsTime(exam)
      res.Questions = exam
        .map((x) => x.Questions)
        .flat(1)
        .sort((x) => Math.random() - 0.5)
      return [res]
    },
    collectAndSort(exam) {
      const res = {}
      res.Exm_Duration_In_Mins = this.calcExamsTime(exam)
      res.Questions = exam
        .map((x) => x.Questions)
        .flat(1)
        .sort((a, b) => a.Qus_Order_Cat - b.Qus_Order_Cat)
      return [res]
    },
    resolveExam(exams) {
      switch (this.random[1]) {
        case 'عشوائي':
          return this.collectAndRandom(exams)
        case 'مخصص':
          return this.collectAndSort(exams)
        case 'ترتيب':
          return exams
        default:
          return exams
      }
    },
    getGroup(val) {
      this.loading = true
      const ids = val.map((elm) => elm.Exm_ID)
      this.$store
        .dispatch('Exam/getExamsData', ids)
        .then((res) => {
          this.exams = this.resolveExam(res.data || [])
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style>
</style>
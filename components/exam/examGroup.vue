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
            @done="nextExam('mcq')"
          ></ques-exam>
          <div
            v-else-if="
              random[1] === 'شاشة' &&
              allCustomScreen.includes(exams[cursor].Exm_ID)
            "
          >
            <component
              :is="`screen${exams[cursor].Exm_ID}`"
              :exam="exams[cursor]"
              @done="nextExam('screen')"
            ></component>
          </div>
          <div
            v-else-if="random[1] === 'جهاز'"
            class="font-weight-bold text-center display-1 mt-8"
          >
            الاختبار يتم علي جهاز مخصص
            {{ callNext(exams[cursor]) }}
          </div>
        </div>
        <div v-else class="font-weight-bold text-center display-1 mt-8">
          لا يوجد امتحانات
          {{ nextExam('لا يوجد') }}
        </div>
      </template>
    </v-fade-transition>
  </v-sheet>
</template>

<script>
import Screen2 from '../customScreens/screen2.vue'
import Screen28 from '../customScreens/screen28.vue'
import Screen29 from '../customScreens/screen29.vue'
import quesExam from './quesExam.vue'
export default {
  components: { quesExam, Screen2, Screen28, Screen29 },
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
      allCustomScreen: [2, 28, 29],
      loading: false,
      mcq: ['عشوائي', 'مخصص', 'ترتيب'],
      cursor: 0,
    }
  },
  computed: {
    random() {
      return this.k.split('-')
    },
    customExam() {
      return this.$store.getters['Exam/customExam']
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
    callNext(exam) {
      this.$desktopNotify(`  الاختبار يتم علي جهاز مخصص (${exam.Exm_Name}) `)
      this.$store.commit('Notifications/setNotification', {
        text: `  الاختبار يتم علي جهاز مخصص (${exam.Exm_Name}) `,
        color: 'info',
      })
      this.nextExam('جهاز')
    },
    nextExam(type) {
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
      let ids = val.map((elm) => elm.Exm_ID)
      const customExam = this.customExam.map((elm) => elm.exam_id)
      ids = ids.filter((id) => !customExam.includes(id))
      if (ids.length > 0) {
        this.$store
          .dispatch('Exam/getExamsData', ids)
          .then((res) => {
            this.exams = this.resolveExam(res.data || [])
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.exams = []
        this.loading = false
      }
    },
  },
}
</script>

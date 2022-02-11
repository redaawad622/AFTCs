
  <template>
  <v-stepper class="ma-5" v-model="cursor" vertical>
    <v-stepper-step :complete="cursor > 1" step="1">
      المقدمه <small>التذكر السمعي</small></v-stepper-step
    >

    <v-stepper-content step="1">
      <v-card flat color="#f1f3f4" class="mb-12">
        <v-card-text class="title text-center"
          >في هذا الاختبار ستسمع تسجيل صوتي لبعض الكلمات ثم سيظهر امامك بعض
          الكلمات اختار منها الكلمات التي سمعتها</v-card-text
        >
        <div class="d-flex justify-center">
          <audio autoplay src="/audio/tzakorIntro.mp3" controls></audio>
        </div>
      </v-card>
      <v-btn color="primary" @click="cursor = 2"> التالي </v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="cursor > 2" step="2">
      سماع الكلمات
    </v-stepper-step>

    <v-stepper-content step="2">
      <v-card flat color="#f1f3f4" class="mb-12">
        <v-card-text class="title text-center"
          >يمكنك سماع الكلمات مره واحد فقظ بمجرد انتهاء التسجيل الصوتي
          سيبدأالامتحان</v-card-text
        >
        <div class="d-flex justify-center">
          <audio
            src="/audio/tzakorIntro.mp3"
            controls
            @ended="cursor = 3"
          ></audio>
        </div>
      </v-card>
    </v-stepper-content>

    <v-stepper-step :complete="cursor > 3" step="3">
      (اختار من الكلمات التالية) الاختبار
    </v-stepper-step>

    <v-stepper-content step="3">
      <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
      <v-btn color="primary" @click="save()"> انهاء </v-btn>
    </v-stepper-content>
  </v-stepper>
</template>



<script>
export default {
  name: 'TazkrSamey',
  props: {
    exam: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cursor: 1,
      results: 0,
    }
  },
  computed: {
    customExam() {
      return this.$store.getters['Exam/customExam']
    },
    examiner() {
      return this.$store.getters['Examiner/examiner']
    },
  },
  created() {
    // eslint-disable-next-line eqeqeq
    if (!this.exam || this.exam.Exm_ID != 2 || this.isExist()) {
      this.$emit('done')
    }
  },
  methods: {
    save() {
      this.$store.commit('Exam/addToCustomExam', {
        userId: this.examiner.national_id,
        ans: {
          exam_id: this.exam.Exm_ID,
          results: this.results,
        },
      })
      this.results = 0
      this.$emit('done')
    },
    isExist() {
      return !!this.customExam.find((x) => x.exam_id === this.exam.Exm_ID)
    },
  },
}
</script>


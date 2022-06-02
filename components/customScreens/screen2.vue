<template>
  <v-stepper v-model="cursor" class="ma-5" vertical>
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
          <audio
            autoplay
            src="/audio/word_intro.mp3"
            controls
            ref="intro"
          ></audio>
        </div>
      </v-card>
      <v-btn color="primary" @click="stopAudioAndNext()"> التالي </v-btn>
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
          <audio src="/audio/words.mp3" controls @ended="cursor = 3"></audio>
        </div>
      </v-card>
    </v-stepper-content>

    <v-stepper-step :complete="cursor > 3" step="3">
      (اختار من الكلمات التالية) الاختبار
    </v-stepper-step>

    <v-stepper-content step="3">
      <v-card class="mb-12" flat>
        <v-chip-group v-model="chosenWords" column multiple>
          <v-chip
            v-for="word in words"
            :key="word"
            class="customChip"
            filter
            x-large
            outlined
          >
            {{ word }}
          </v-chip>
        </v-chip-group>
      </v-card>
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
      chosenWords: [],
      correctWords: [
        'مانجو',
        'باخرة',
        'كمسري',
        'شباك',
        'مسلسل',
        'جمل',
        'انتقام',
        'بدلة',
        'سالب',
        'سيارة',
      ],
      words: [
        'مانجو',
        'باخرة',
        'كمسري',
        'شباك',
        'مسلسل',
        'جمل',
        'انتقام',
        'بدلة',
        'سالب',
        'سيارة',
      ],
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
  watch: {
    chosenWords(val) {
      if (val.length === 10) {
        this.save()
      }
    },
  },
  created() {
    // eslint-disable-next-line eqeqeq
    if (!this.exam || this.exam.Exm_ID != 2 || this.isExist()) {
      this.$emit('done')
    }
  },

  methods: {
    stopAudioAndNext() {
      this.$refs.intro.pause()
      this.cursor = 2
    },
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
<style lang="scss">
.customChip {
  width: 200px;
  font-size: 25px !important;
  justify-content: center;
}
</style>

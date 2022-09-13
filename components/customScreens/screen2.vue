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
            ref="intro"
            autoplay
            src="/audio/word_intro.mp3"
            controls
          ></audio>
        </div>
      </v-card>
      <v-btn color="primary" @click="stopAudioAndNext()"> سماع الكلمات </v-btn>
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
            ref="wordAudio"
            src="/audio/words.mp3"
            @ended="cursor = 3"
          ></audio>
        </div>
      </v-card>
    </v-stepper-content>

    <v-stepper-step :complete="cursor > 3" step="3">
      (اختار من الكلمات التالية) الاختبار
    </v-stepper-step>

    <v-stepper-content step="3">
      <v-card class="mb-12" flat>
        <v-chip-group v-model="chosenWords" column multiple :max="10">
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
        'جدول',
        'مانجو',
        'سرقة',
        'كمسري',
        'معنوية',
        'صيدلية',
        'مكتب',
        'مسلسل',
        'عصفورة',
        'شباك',
        'نافذة',
        'كمثري',
        'باخرة',
        'بدلة',
        'انتقام',
        'بسلة',
        'النص',
        'جمل',
        'قتل',
        'اكتئاب',
        'تليفزيون',
        'قاموس',
        'سيارة',
        'سالب',
        'مجرم',
        'سندات',
        'صانع',
        'دب',
        'طائر',
        'سم',
        'ضباب',
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
    this.$store.commit('Exam/setCurrentExamTime', 10)
    this.words.sort(() => Math.random() - 0.5)
    // eslint-disable-next-line eqeqeq
    if (!this.exam || this.exam.Exm_ID != 2 || this.isExist()) {
      this.$emit('done')
    }
  },

  methods: {
    stopAudioAndNext() {
      this.$refs.intro.pause()
      this.cursor = 2
      this.$store.commit(
        'Exam/setCurrentExamTime',
        this.exam.Exm_Duration_In_Mins
      )
      this.$refs.wordAudio.play()
    },

    save() {
      // calculate the res
      const res = this.getArraysIntersection(
        this.correctWords,
        this.chosenWords
      )
      this.$store.commit('Exam/addToCustomExam', {
        userId: this.examiner.national_id,
        ans: {
          exam_id: this.exam.Exm_ID,
          value: res.length,
        },
      })
      this.chosenWords = []
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

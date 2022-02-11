<template>
  <div v-if="questions && questions.length > 0" @keyup.space="nextQ()">
    <v-sheet class="pa-5 d-flex justify-center align-center flex-column">
      <span class="qCount secondary--text">{{
        cursor + 1 + '/' + questions.length
      }}</span>
      <v-alert
        color="#89714b"
        text
        class="font-weight-bold title text-center py-12 d-flex justify-center"
        min-width="100%"
      >
        <template
          v-if="
            !questions[cursor].Qus_image &&
            typeof questions[cursor].Qus_Text == 'string'
          "
          >{{ questions[cursor].Qus_Text }}</template
        >
        <v-img
          v-else
          contain
          max-width="200px"
          :src="toBase64(questions[cursor].Qus_image)"
        />
      </v-alert>
      <span class="quesIcon white"
        ><v-icon color="secondary" small>mdi-help </v-icon></span
      >

      <div>
        <v-chip-group
          v-if="questions[cursor].T_Answers.length > 0"
          v-model="currentAns"
          color="primary"
          column
        >
          <v-chip
            v-for="(ans, k) in questions[cursor].T_Answers"
            :key="'ans' + k + ans.Ans_ID"
            filter
            class="title"
            :x-large="ans.Ans_Is_Pic"
            :outlined="ans.Ans_Is_Pic"
            :label="ans.Ans_Is_Pic"
            style="height: auto"
          >
            <template
              v-if="!ans.Ans_Is_Pic && typeof ans.Ans_Text == 'string'"
              >{{ ans.Ans_Text }}</template
            >
            <v-img v-else contain :src="toBase64(ans.Ans_image)" />
          </v-chip>
        </v-chip-group>
      </div>
    </v-sheet>
    <v-sheet
      width="100%"
      style="position: fixed; bottom: 0"
      class="d-flex justify-space-between px-5 py-10"
    >
      <v-btn v-show="cursor > 0" color="secondary" @click="prevQ()"
        >السابق</v-btn
      >
      <v-btn
        :disabled="currentAns || currentAns === 0 ? false : true"
        class="ms-auto"
        color="primary"
        @click="nextQ()"
        >التالي</v-btn
      >
    </v-sheet>
  </div>
</template>

<script>
export default {
  props: {
    exam: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      cursor: 0,
      currentAns: '',
      initAnswer: [],
    }
  },
  computed: {
    questions() {
      return this.exam.Questions.filter(
        (q) => this.initAnswer.findIndex((a) => a.question_id === q.Qus_ID) < 0
      )
    },
    examiner() {
      return this.$store.getters['Examiner/examiner']
    },
    answers() {
      return this.$store.getters['Exam/answers']
    },
    mute() {
      return this.$store.getters['Exam/mute']
    },
    audio: {
      get() {
        return this.$store.getters['Exam/audio']
      },
      set(val) {
        this.$store.commit('Exam/setAudio', val)
      },
    },
    play: {
      get() {
        return this.$store.getters['Exam/play']
      },
      set(val) {
        this.$store.commit('Exam/setPlay', val)
      },
    },
  },
  watch: {
    exam() {
      this.initAnswer = [...this.answers]
      this.setTiming()
      if (this.questions.length < 1) {
        this.finished()
      }
    },
  },
  created() {
    this.setTiming()
    this.initAnswer = [...this.answers]
    if (this.questions.length < 1) {
      this.finished()
    }
  },
  methods: {
    toBase64(arr) {
      const base64String = btoa(
        arr.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      return `data:image/png;base64,${base64String}`
    },
    nextQ() {
      if (this.cursor === this.questions.length - 1) {
        if (this.currentAns || this.currentAns === 0) {
          this.$store.commit('Exam/addToAnswers', {
            userId: this.examiner.national_id,
            ans: this.questions[this.cursor].T_Answers[this.currentAns],
            exam_id: this.questions[this.cursor].Qus_Exm_ID,
          })
          this.currentAns = ''
        }
      }

      if (this.cursor < this.questions.length - 1) {
        if (this.currentAns || this.currentAns === 0) {
          this.$store.commit('Exam/addToAnswers', {
            userId: this.examiner.national_id,
            ans: this.questions[this.cursor].T_Answers[this.currentAns],
            exam_id: this.questions[this.cursor].Qus_Exm_ID,
          })
          this.currentAns = ''
          this.cursor++
          this.playAudio()
        }
      } else {
        this.finished()
      }
    },
    finished() {
      this.audio = null
      this.cursor = 0
      this.currentAns = ''
      this.$emit('done')
    },
    playAudio() {
      if (this.audio) {
        this.play = false
      }
      const buffer = this.questions[this.cursor].Qus_audio
      if (buffer) {
        const blob = new Blob([new Uint8Array(buffer.data)], {
          type: 'audio/wav',
        })
        this.audio = new Audio(window.URL.createObjectURL(blob))
        if (!this.mute) {
          this.play = true
          this.audio.addEventListener('ended', () => {
            this.play = false
          })
        }
      } else {
        this.audio = null
      }
    },
    prevQ() {
      if (this.cursor > 0) {
        this.$store.commit('Exam/popAns', {
          userId: this.examiner.national_id,
        })
        this.cursor--
      }
    },
    setTiming() {
      this.$store.commit(
        'Exam/setCurrentExamTime',
        this.exam.Exm_Duration_In_Mins
      )
    },
  },
}
</script>

<style>
.qCount {
  background: #fff;
  width: 65px;
  padding: 5px 10px;
  position: relative;
  top: 17px;
  z-index: 1;
  text-align: center;
  border-radius: 10px;
  font-weight: 500;
}
.quesIcon {
  padding: 5px;
  position: relative;
  bottom: 34px;
  z-index: 1;
  text-align: center;
  border-radius: 17px;
  font-weight: 500;
  width: 34px;
}
</style>
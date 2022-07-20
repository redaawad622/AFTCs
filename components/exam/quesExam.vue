<template>
  <div v-if="questions && questions.length > 0" @keyup.space="nextQ()">
    <img
      v-if="exam.Exm_ID === 3 && !hide"
      class="customImageTa"
      src="/tazakr.png"
    />
    <v-sheet class="pa-5 d-flex justify-center align-center flex-column">
      <span class="qCount secondary--text">{{
        cursor + 1 + '/' + questions.length
      }}</span>
      <v-alert
        color="#89714b"
        text
        class="font-weight-bold display-1 text-center py-12 d-flex justify-center"
        min-width="100%"
      >
        <template
          v-if="
            !questions[cursor].Qus_Is_Pic &&
            typeof questions[cursor].Qus_Text == 'string'
          "
          >{{ questions[cursor].Qus_Text }}</template
        >
        <v-img
          v-else
          contain
          :width="exam.Exm_ID === 4 ? '500px' : '180px'"
          :height="exam.Exm_ID === 4 ? '250px' : 'auto'"
          :src="getImage('question', questions[cursor])"
        />
      </v-alert>
      <span class="quesIcon white"
        ><v-icon color="secondary" small>mdi-help </v-icon></span
      >

      <div>
        <v-chip-group
          v-if="questions[cursor].T_Answers.length > 0"
          v-model="currentAns"
          column
        >
          <v-chip
            v-for="(ans, k) in questions[cursor].T_Answers"
            :key="'ans' + k + ans.Ans_ID"
            filter
            class="headline mx-5 px-2 py-1"
            :x-large="ans.Ans_Is_Pic"
            :outlined="true"
            :label="ans.Ans_Is_Pic"
            style="height: auto"
            large
            @click="playAnsAudio(ans.Ans_ID)"
          >
            <template
              v-if="!ans.Ans_Is_Pic && typeof ans.Ans_Text == 'string'"
              >{{ ans.Ans_Text }}</template
            >
            <v-img v-else contain :src="getImage('ans', ans)" />
            <v-btn v-if="!ans.Ans_Is_Pic" class="mx-2" icon
              ><v-icon v-if="currentPlay == ans.Ans_ID && ansPlay"
                >mdi-pause</v-icon
              ><v-icon v-else>mdi-play</v-icon></v-btn
            >
          </v-chip>
        </v-chip-group>
      </div>
    </v-sheet>
    <v-sheet
      width="100%"
      style="position: fixed; bottom: 0"
      class="d-flex justify-space-between px-5 py-10"
    >
      <v-btn
        v-show="cursor > 0"
        color="secondary"
        x-large
        class="font-weight-bold px-10"
        @click="prevQ()"
        ><v-icon left size="25">mdi-arrow-right</v-icon> السابق
      </v-btn>
      <v-btn
        :disabled="currentAns || currentAns === 0 ? false : true"
        class="ms-auto font-weight-bold px-10"
        color="primary"
        x-large
        @click="nextQ()"
        >التالي <v-icon right size="25">mdi-arrow-left</v-icon></v-btn
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
      hide: false,
      customTime: null,
      ansAudio: null,
      ansPlay: false,
      currentPlay: null,
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
    exam: {
      handler() {
        this.initAnswer = [...this.answers]
        this.setTiming()
        if (this.questions.length < 1) {
          this.finished()
        }
        if (this.exam.Exm_ID === 3) {
          this.autoHide()
        }
      },
      immediate: true,
      deep: true,
    },
    play(val) {
      if (val) this.stopAns()
    },
  },

  methods: {
    stopAns() {
      if (this.ansAudio) {
        this.ansAudio.pause()
        this.ansPlay = false
        this.currentPlay = false
      }
    },
    getImage(type, q) {
      if (type === 'question') {
        return `${this.$imagesPath + q.Qus_ID}/${q.Qus_ID}.png`
      } else {
        return `${this.$imagesPath + q.Ans_Qus_ID}/Answers/${q.Ans_ID}.png`
      }
    },
    toBase64(arr) {
      const base64String = btoa(
        arr.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      return `data:image/png;base64,${base64String}`
    },
    autoHide() {
      this.customTime = setTimeout(() => {
        this.hide = true
        clearTimeout(this.customTime)
      }, 10000)
    },
    nextQ() {
      this.stopAns()
      this.play = false
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
      const ques = this.questions[this.cursor]

      this.audio = new Audio(
        `${this.$audioPath + ques.Qus_ID}/${ques.Qus_ID}.mp3`
      )

      this.audio.addEventListener('canplaythrough', () => {
        /* the audio is now playable; play it if permissions allow */
        if (!this.mute) {
          this.play = true
          this.audio.addEventListener('ended', () => {
            this.play = false
          })
        }
      })
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
    playAnsAudio(id) {
      this.play = false
      if (this.ansAudio) this.ansAudio.pause()

      if (this.currentPlay === id && this.ansPlay) {
        this.ansPlay = false
        this.currentPlay = null
        return
      }
      this.currentPlay = id
      if (this.ansAudio) {
        this.ansPlay = false
      }
      const ques = this.questions[this.cursor]
      this.ansAudio = new Audio(
        `${this.$audioPath + ques.Qus_ID}/Answers/${id}.mp3`
      )

      this.ansAudio.addEventListener('canplaythrough', () => {
        /* the audio is now playable; play it if permissions allow */
        if (!this.mute) {
          this.ansAudio.play()
          this.ansPlay = true
          this.ansAudio.addEventListener('ended', () => {
            this.ansPlay = false
            this.currentPlay = null
          })
        }
      })
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
.customImageTa {
  position: absolute;
  z-index: 2;
  top: 56px;
  left: 0;
  max-width: 100%;
  height: calc(100% - 56px);
}
.v-chip-group .v-chip.v-chip--active.v-chip--outlined,
.v-chip-group .v-chip.v-chip--active {
  background-color: var(--v-secondary-darken3) !important;
  font-weight: bold;
  padding: 0 30px;
}
</style>

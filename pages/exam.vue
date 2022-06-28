<template>
  <div>
    <v-app-bar fixed flat>
      <v-list-item style="flex: unset">
        <v-list-item-avatar>
          <v-img src="/military.png"></v-img>
        </v-list-item-avatar>

        <v-list-item-content v-if="examiner">
          <v-list-item-title
            class="font-weight-bold"
            v-text="examiner.name"
          ></v-list-item-title>
          <v-list-item-subtitle
            v-text="examiner.barcode || examiner.national_id"
          ></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-spacer></v-spacer>
      <div v-if="audio">
        <v-btn icon @click="play = !play">
          <v-icon v-if="!play">mdi-play</v-icon>
          <v-icon v-else>mdi-pause</v-icon>
        </v-btn>
        <v-btn icon @click="mute = !mute">
          <v-icon v-if="!mute">mdi-volume-high</v-icon>
          <v-icon v-else>mdi-volume-off</v-icon>
        </v-btn>
      </div>

      <v-spacer></v-spacer>
      <v-sheet
        class="d-flex flex-column align-center"
        color="transparent"
        min-width="100px"
      >
        <v-icon>mdi-alarm</v-icon>
        <timer :seconds="endTime" @finish="nextGroup()"></timer>
      </v-sheet>
    </v-app-bar>
    <v-sheet v-if="!done" class="pt-16">
      <exam-group
        v-if="groups.length > 0"
        :group="groups[cursor]"
        :k="keys[cursor]"
        @done="nextGroup()"
      ></exam-group>
    </v-sheet>
    <v-sheet v-else class="pt-16">
      <v-container style="height: calc(100vh - 68px)">
        <v-sheet
          height="100%"
          class="d-flex flex-column align-center justify-center"
        >
          <div class="display-1 font-weight-bold text-center mb-4">
            انتهي الاختبار جاري الحفظ ...
          </div>
          <v-progress-circular
            :rotate="-90"
            :size="100"
            :width="15"
            :value="num"
            color="primary"
          >
            {{ num }}
          </v-progress-circular>
        </v-sheet>
      </v-container>
      <v-dialog v-model="openDialog" persistent max-width="290">
        <template #activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">
            حفظ و اعادة التوجيه
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="text-h5">
            تم حفظ الاختبار و جاري اعادة التوجيه الي الصفحة الرئيسية
          </v-card-title>
          <v-card-text class="text-center font-weight-bold title">{{
            timer
          }}</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="timer = 1">
              اعادة التوجيه الآن
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-sheet>
  </div>
</template>

<script>
import Timer from '~/components/common/timer.vue'
import examGroup from '~/components/exam/examGroup.vue'
export default {
  name: 'ExamPage',
  components: { examGroup, Timer },
  layout: 'examLayout',
  data() {
    return {
      groupExams: {},
      cursor: 0,
      done: false,
      openDialog: false,
      num: 0,
      interval: {},
      interval2: {},
      endTime: 0,
      timer: 10,
    }
  },

  computed: {
    groups() {
      return Object.values(this.groupExams)
    },
    keys() {
      return Object.keys(this.groupExams)
    },
    examiner() {
      return this.$store.getters['Examiner/examiner']
    },
    assignExams() {
      return this.$store.getters['Exam/assignExams']
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
    mute: {
      get() {
        return this.$store.getters['Exam/mute']
      },
      set(val) {
        this.$store.commit('Exam/setMute', val)
      },
    },
    currentExamTime() {
      return this.$store.getters['Exam/currentExamTime']
    },
  },
  watch: {
    currentExamTime(val) {
      if (val) {
        this.endTime = this.currentExamTime * 60
      }
    },
    timer(val) {
      if (val < 1) this.$router.replace('/')
    },
  },
  created() {
    if (!this.examiner) {
      this.$router.replace('/')
    } else {
      this.prepare()
    }
  },
  beforeDestroy() {
    clearInterval(this.interval)
    clearInterval(this.interval2)
  },

  methods: {
    nextGroup() {
      console.log(this.groups.length, this.cursor)
      if (this.cursor < this.groups.length - 1) {
        this.cursor++
      } else {
        console.log(this.groups.length, this.cursor)

        this.done = true
        this.interval = setInterval(() => {
          if (this.num < 100) this.num += 20
        }, 500)
        this.$store
          .dispatch('Exam/saveAnswers', {
            id: this.examiner.id,
            endTime: this.endTime,
          })
          .then(() => {
            this.$store.commit('Exam/reset', this.examiner.national_id)
            // this.$store.commit('Examiner/setExaminer', null)
            this.openDialog = true
            this.interval2 = setInterval(() => {
              this.timer--
            }, 1000)
          })
      }
    },
    prepare() {
      const res = {}
      if (this.assignExams && this.assignExams.length > 0) {
        this.assignExams.forEach((element) => {
          if (!res[element.category + '-' + element.random])
            res[element.category + '-' + element.random] = []
          res[element.category + '-' + element.random].push(element)
        })
        this.groupExams = res
      }
    },
  },
}
</script>

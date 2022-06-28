<template>
  <v-stepper v-model="cursor" class="ma-5" vertical>
    <v-stepper-step :complete="cursor > 1" step="1">
      المقدمه <small>رد الفعل</small></v-stepper-step
    >

    <v-stepper-content step="1">
      <v-card flat color="#f1f3f4" class="mb-12">
        <v-card-text class="title text-center"
          >في هذا الاختبار سيتم عرض مجموعة الوان يجب ان تختار اللون المطابق للون
          المربع في المنتصف
          <div>لديك 5 محاولات</div>
          <div>اضغط علي الدائرة المطابقه للون المربع سريعا</div>
          <audio
            ref="coloring"
            autoplay
            src="/audio/coloring.mp3"
            controls
          ></audio>
        </v-card-text>
        <div class="d-flex justify-center">
          <v-btn color="primary" @click="start()">
            عندما تكون مستعد اضغط هنا</v-btn
          >
        </div>
      </v-card>
    </v-stepper-content>

    <v-stepper-step :complete="cursor > 2" step="2">
      اختار لون الدائرة المطابق للون المربع
      <span>عدد المحاولات {{ tries }}/5 </span>
    </v-stepper-step>

    <v-stepper-content step="2">
      <v-card class="mb-12" outlined>
        <v-row>
          <v-col cols="4">
            <colored-box
              v-for="i in 3"
              :key="i - 1"
              class="circle"
              :color="colors[i - 1]"
              @updateColor="setRes(i - 1)"
            ></colored-box>
          </v-col>
          <v-col cols="4" class="align-self-center">
            <colored-box :color="colors[selectedColor]"></colored-box>
          </v-col>
          <v-col cols="4">
            <colored-box
              v-for="i in 3"
              :key="i + 2"
              class="circle"
              :color="colors[i + 2]"
              @updateColor="setRes(i + 2)"
            ></colored-box>
          </v-col>
        </v-row>
      </v-card>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
import correctionObj from '../../assets/28.json'
import coloredBox from './coloredBox.vue'
export default {
  name: 'ReAction',
  components: { coloredBox },
  props: {
    exam: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      timer: 0,
      colors: [],
      correctionObj,
      cursor: 1,
      results: 0,
      selectedColor: null,
      interval: null,
      res: 0,
      tries: 0,
      maxTime: 1998,
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
    if (!this.exam || this.exam.Exm_ID != 28 || this.isExist()) {
      this.$emit('done')
    }
  },
  methods: {
    start() {
      this.$refs.coloring.pause()
      this.cursor = 2
      this.generateColors()
    },
    setRes(index) {
      if (this.colors[index] === this.colors[this.selectedColor]) this.next()
    },
    next() {
      this.res += this.timer
      this.tries += 1
      if (this.tries > 4) {
        this.save()
      } else {
        this.generateColors()
      }
    },
    save() {
      clearInterval(this.interval)
      this.$store.commit('Exam/addToCustomExam', {
        userId: this.examiner.national_id,
        ans: {
          exam_id: this.exam.Exm_ID,
          value: this.correctionObj[Math.floor(this.res)],
        },
      })
      this.res = 0
      this.$emit('done')
    },
    getRandomColor() {
      const letters = '0123456789ABCDEF'
      let color = '#'
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    },
    generateColors() {
      this.stopTime()
      this.colors = []
      for (let index = 0; index < 6; index++) {
        this.colors.push(this.getRandomColor())
      }
      this.selectedColor = Math.floor(Math.random() * (5 - 0 + 1) + 0)
      this.startTime()
    },
    stopTime() {
      this.timer = 0
      if (this.interval) clearInterval(this.interval)
    },
    startTime() {
      this.interval = setInterval(() => {
        this.timer++
        if (this.timer >= this.maxTime - 10 && this.tries < 5) {
          this.next()
        }
      }, 1)
    },
    isExist() {
      return !!this.customExam.find((x) => x.exam_id === this.exam.Exm_ID)
    },
  },
}
</script>

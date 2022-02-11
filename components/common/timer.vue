<template>
  <!--Timer Componenent -->
  <div class="timer">
    <!-- start of the timer section -->
    <div>
      <h4 class="text-9xl pt-0 mt-0 font-bold">
        {{ timerMinutes }}:{{ timerSeconds }}
      </h4>
    </div>
    <!-- end of the timer section -->
  </div>
</template>
<script>
import notificationSound from '@/assets/Stopwatch-sound-effect.mp3'
export default {
  name: 'TimerComponent',
  props: {
    seconds: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      notificationSound,
      isActive: false,
      timerType: 0,
      totalSeconds: 0,
      pomodoroInstance: null,
      audio: null,
    }
  },
  computed: {
    // show minutes
    timerMinutes() {
      const minutes = Math.floor(this.totalSeconds / 60)
      return this.formatTime(minutes)
    },
    // show seconds
    timerSeconds() {
      const sec = this.totalSeconds % 60
      return this.formatTime(sec)
    },
  },
  watch: {
    seconds(val) {
      this.totalSeconds = val
      this.start()
    },
    totalSeconds(val) {
      if (val < 1) {
        this.stop()
        this.$emit('finish')
      }
    },
  },
  methods: {
    // formats time function
    formatTime(time) {
      if (time < 10) {
        return '0' + time
      }
      return time.toString()
    },
    // start the timeer count
    stopAudio() {
      if (this.audio) {
        this.audio.pause()
        this.audio.currentTime = 0
      }
    },
    start() {
      this.pomodoroInstance = setInterval(() => {
        this.totalSeconds -= 1
        if (this.totalSeconds < 15) {
          if (!this.audio) {
            this.audio = new Audio(this.notificationSound)
            this.audio.play()
          }
        }
        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          clearInterval(this.pomodoroInstance)
          this.stopAudio()
          this.audio = null
          ;(this.totalSeconds = 0)((this.isActive = false))
        }
      }, 1000)
      this.isActive = true
    },
    // stop the timer interval
    stop() {
      this.stopAudio()
      clearInterval(this.pomodoroInstance)
      this.isActive = false
      this.pomodoroInstance = null
      this.totalSeconds = 0
    },
  },
}
</script>
<style scoped>
</style>
<template>
  <div>
    <v-combobox
      v-model="path"
      item-text="path"
      item-value="path"
      color="primary"
      :items="serials"
      outlined
      :return-object="false"
    ></v-combobox>
    <div class="d-flex">
      <v-text-field
        v-model="rightHand"
        outlined
        label="قبضة يمين"
        color="primary"
      ></v-text-field>
      <v-btn color="primary" :disabled="!!port" @click="connectPort()"
        >connect</v-btn
      >
      <v-btn color="primary" @click="readData()">read</v-btn>
    </div>
    <div class="d-flex">
      <v-text-field outlined label="قبضة شمال" color="primary"></v-text-field>
      <v-btn color="primary" @click="convertData">read</v-btn>
    </div>
    <div class="d-flex">
      <v-text-field outlined label="ظهر و رجلين" color="primary"></v-text-field>
      <v-btn color="primary" @click="readData">read</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BadanyPage',
  middleware: 'admin',
  data() {
    return {
      path: '',
      streamData: [],
      vv: '',
      kepReading: true,
      reader: null,
      port: null,
      readableStreamClose: null,
      textDecoder: null,
      val: '',
      rightHand: '',
    }
  },

  computed: {
    serials() {
      return this.$store.getters['Exam/serials']
    },
  },
  mounted() {
    // this.readChrom()
  },
  methods: {
    async convertData() {
      this.kepReading = false
      if (this.reader) this.reader.cancel()
      await this.startRead()

      this.vv = ''
    },
    async connectPort() {
      try {
        if ('serial' in navigator) {
          if (!this.port) this.port = await navigator.serial.requestPort()
          navigator.serial.addEventListener('connect', async (e) => {
            if (!this.port) this.port = await navigator.serial.requestPort()
          })

          navigator.serial.addEventListener('disconnect', async (e) => {
            if (this.port) {
              await this.port.close()
              this.port = null
            }
          })
          if (!this.port.readable) this.readChrom()
        }
      } catch (r) {
        alert(r)
      }
    },
    async readChrom() {
      if (this.port) {
        if (!this.port.readable) {
          await this.port.open({ baudRate: 9600 })
        } else {
          console.log('opened')
        }

        class LineBreakerTransformer {
          constructor() {
            this.chunk = ''
          }

          transform(chunk, controller) {
            this.chunk += chunk
            const lines = this.chunk.split('\r\n')
            this.chunk = lines.pop()
            lines.forEach((line) => {
              controller.enqueue(line)
            })
          }

          flush(controller) {
            controller.enqueue(this.chunk)
          }
        }

        while (this.port.readable) {
          this.reader = this.port.readable // eslint-disable-next-line no-undef
            .pipeThrough(new TextDecoderStream())
            // eslint-disable-next-line no-undef
            .pipeThrough(new TransformStream(new LineBreakerTransformer()))
            .getReader()

          try {
            while (true) {
              const { value, done } = await this.reader.read()
              if (done) {
                break
              }
              this.val = value
              console.log(value)
            }
          } catch (error) {
            console.log(error)
          } finally {
            this.reader.releaseLock()
          }
        }
      }
    },

    async readData() {
      if (this.val !== '') {
        const data = this.val.split('max Weight =')
        this.rightHand = +data[data.length - 1]
        // if (this.reader != null) this.reader.cancel()
        // eslint-disable-next-line no-undef
        const textEncoder = new TextEncoderStream()
        textEncoder.readable.pipeTo(this.port.writable)
        const w = textEncoder.writable.getWriter()
        await w.write('#')
        w.releaseLock()
        this.val = ''
        this.reader.releaseLock()
        await this.port.close()
        this.readChrom()
      }
    },
  },
}
</script>

<style></style>

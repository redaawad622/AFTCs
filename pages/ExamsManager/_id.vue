<template>
  <v-card v-if="exam">
    <v-card-title class="d-flex justify-space-between"
      ><div>تعديل اسئلة اختبار ( {{ exam.Exm_Name }} )</div>
      <div>عدد الاسئلة : {{ exam.Questions.length }}</div></v-card-title
    >
    <v-card-text>
      <v-expansion-panels
        v-if="exam.Questions"
        v-model="activeCard"
        focusable
        accordion
      >
        <v-expansion-panel v-for="(item, i) in exam.Questions" :key="i">
          <v-expansion-panel-header>
            <div class="d-flex justify-space-between">
              <div>
                {{ i + 1 }} -
                <template
                  v-if="!item.Qus_image && typeof item.Qus_Text == 'string'"
                >
                  <span> {{ item.Qus_Text }}</span>
                </template>
                <v-img
                  v-else
                  contain
                  :max-width="exam.Exm_ID === 4 ? '200px' : '100px'"
                  :height="exam.Exm_ID === 4 ? '10[0px' : 'auto'"
                  :src="toBase64(item.Qus_image)"
                />
              </div>
              <div>
                <v-btn color="primary" class="mx-2" @click="updateQ(item)"
                  >حفظ</v-btn
                >
                <v-btn color="red" @click="deleteQ(item.Qus_ID)">حذف</v-btn>
              </div>
            </div>
          </v-expansion-panel-header>
          <v-expansion-panel-content class="py-2">
            <v-text-field v-model="item.Qus_Text" outlined dense></v-text-field>
            <v-list>
              <v-list-item v-for="ans in item.T_Answers" :key="ans.Ans_ID">
                <v-list-item-content>
                  <v-list-item-title>
                    <template
                      v-if="!ans.Ans_Is_Pic && typeof ans.Ans_Text == 'string'"
                    >
                      <v-text-field
                        v-model="ans.Ans_Text"
                        solo-inverted
                        flat
                        label="الاجابة"
                      ></v-text-field>
                    </template>
                    <v-img
                      v-else
                      contain
                      :src="toBase64(ans.Ans_image)"
                      max-width="100px"
                    />
                  </v-list-item-title>
                  <v-list-item-subtitle
                    ><v-text-field
                      v-model.number="ans.Ans_Value"
                      solo-inverted
                      flat
                      label="درجة الاجابة"
                    ></v-text-field
                  ></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-icon>
                  <v-btn icon
                    ><v-icon color="red"> mdi-minus-circle</v-icon></v-btn
                  >
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <div class="py-5">
        <v-divider></v-divider>
        <v-divider></v-divider>
        <v-card-title class="justify-center">اضافة أسئلة جديده</v-card-title>
        <v-text-field
          v-model="newQ.Qus_Text"
          outlined
          label="السؤال"
        ></v-text-field>
        <div
          v-for="(item, index) in newQ.T_Answers"
          :key="index + '_list'"
          style="border: 1px solid #aaa"
          class="pa-3 my-2 rounded"
        >
          <v-text-field
            v-model="item.Ans_Text"
            solo-inverted
            flat
            label="الاجابة"
          ></v-text-field>
          <v-text-field
            v-model.number="item.Ans_Value"
            solo-inverted
            flat
            label="درجة الاجابة"
          ></v-text-field>
        </div>
        <v-btn color="secondary" :disabled="saveLoading" @click="addMore()"
          >اضافة المزيد</v-btn
        >
        <v-btn color="primary" :loading="saveLoading" @click="saveNewQues()"
          >حفظ</v-btn
        >
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  data() {
    return {
      saveLoading: false,
      exam: null,
      editList: {},
      activeCard: 0,

      newQ: {
        Qus_Exm_ID: 0,
        Qus_ID: 0,
        Qus_Is_Pic: false,
        Qus_Text: '',
        Qus_Pic_UNC: null,
        Qus_audio: null,
        Qus_image: null,
        Qus_Order_Cat: null,
        T_Answers: [
          {
            Ans_Is_Pic: false,
            Ans_Text: '',
            Ans_Pic_UNC: null,
            Ans_Value: '',
            Ans_audio: null,
            Ans_image: null,
            Ans_Cat: null,
          },
          {
            Ans_Is_Pic: false,
            Ans_Text: '',
            Ans_Pic_UNC: null,
            Ans_Value: '',
            Ans_audio: null,
            Ans_image: null,
            Ans_Cat: null,
          },
        ],
      },
    }
  },
  async fetch({ route, store }) {
    await store.dispatch('Exam/getEditableExam', {
      id: route.params.id,
    })
  },
  computed: {
    initExam() {
      return this.$store.getters['Exam/editableExam']
    },
  },
  watch: {
    initExam: {
      handler(val) {
        this.exam = JSON.parse(JSON.stringify(val))
      },
      immediate: true,
    },
  },
  methods: {
    toBase64(arr) {
      const base64String = btoa(
        arr.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
      )
      return `data:image/png;base64,${base64String}`
    },
    addMore() {
      this.newQ.T_Answers.push({
        Ans_Is_Pic: false,
        Ans_Text: '',
        Ans_Pic_UNC: null,
        Ans_Value: '',
        Ans_audio: null,
        Ans_image: null,
        Ans_Cat: null,
      })
    },
    saveNewQues() {
      this.saveLoading = true
      this.newQ.Qus_Exm_ID = this.exam.Exm_ID
      this.$store
        .dispatch('Exam/saveNewQues', this.newQ)
        .then(() => {
          this.exam.Questions.push(this.newQ)
          this.reset()
        })
        .finally(() => {
          this.saveLoading = false
        })
    },
    updateQ(item) {
      this.$store.dispatch('Exam/updateQ', item)
    },
    deleteQ(id) {
      this.$store.dispatch('Exam/deleteQ', id).then(() => {
        const index = this.exam.Questions.findIndex((elm) => elm.Qus_ID === id)
        this.exam.Questions.splice(index, 1)
      })
    },
    reset() {
      this.newQ = {
        Qus_Exm_ID: 0,
        Qus_ID: 0,
        Qus_Is_Pic: false,
        Qus_Text: '',
        Qus_Pic_UNC: null,
        Qus_audio: null,
        Qus_image: null,
        Qus_Order_Cat: null,
        T_Answers: [
          {
            Ans_Is_Pic: false,
            Ans_Text: '',
            Ans_Pic_UNC: null,
            Ans_Value: '',
            Ans_audio: null,
            Ans_image: null,
            Ans_Cat: null,
          },
          {
            Ans_Is_Pic: false,
            Ans_Text: '',
            Ans_Pic_UNC: null,
            Ans_Value: '',
            Ans_audio: null,
            Ans_image: null,
            Ans_Cat: null,
          },
        ],
      }
    },
  },
}
</script>

<style></style>

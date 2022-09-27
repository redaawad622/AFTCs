<template>
  <v-row justify="center" align="center">
    <v-col v-if="previewResult" cols="12">
      <v-card-title
        :class="`text-center ${previewResult.color}--text headline`"
        v-text="previewResult.message"
      ></v-card-title>
      <v-simple-table class="repTable mb-6">
        <tr>
          <th>الرقم القومي</th>
          <th>الرقم الاسم</th>
        </tr>
        <tbody>
          <tr v-for="row in previewResult.examiners" :key="'preview' + row.id">
            <td>{{ row.national_id }}</td>
            <td>{{ row.name }}</td>
          </tr>
          <tr v-if="previewResult.examiners.length < 1">
            <td colspan="2" class="text-center title">لا يوجد بيانات مخالفة</td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-btn
        v-if="previewResult && previewResult.type == 'notNoticedExaminedAgain'"
        color="error"
        :loading="loadLoading3"
        class="mx-1"
        @click="removeNotNoticedExaminedAgain()"
        >مسح الاعادة</v-btn
      >
      <v-btn
        v-if="previewResult && previewResult.type == 'notRegister'"
        color="error"
        :loading="loadLoading2"
        class="mx-1"
        @click="loadExaminerDataFromLocalServer()"
        >تسجيل بيانات الممتحنين الي سيرفر فرع الانتقاء</v-btn
      >
      <v-btn
        v-if="previewResult && previewResult.type == 'notRegister'"
        color="error"
        :loading="loadLoading3"
        class="mx-1"
        @click="deleteExaminerDataFromLocalServer()"
        >مسح الممتحنين</v-btn
      >

      <v-sheet
        v-if="previewResult.report"
        class="d-flex justify-space-between my-3"
      >
        <v-simple-table
          v-if="previewResult.report.customExam"
          class="repTable ma-1"
        >
          <tr>
            <th colspan="2">العمليات علي الاختبارات البدنية و العملية</th>
          </tr>
          <tbody>
            <tr>
              <td>الناجحة</td>
              <td>{{ previewResult.report.customExam.successNum }}</td>
            </tr>
            <tr>
              <td>الفاشلة</td>
              <td>{{ previewResult.report.customExam.failNum }}</td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-simple-table
          v-if="previewResult.report.answers"
          class="repTable ma-1"
        >
          <tr>
            <th colspan="2">العمليات علي الاختبارات النظرية</th>
          </tr>
          <tbody>
            <tr>
              <td>الناجحة</td>
              <td>{{ previewResult.report.answers.successNum }}</td>
            </tr>
            <tr>
              <td>الفاشلة</td>
              <td>{{ previewResult.report.answers.failNum }}</td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-simple-table
          v-if="previewResult.report.examiner"
          class="repTable ma-1"
        >
          <tr>
            <th colspan="2">العمليات علي تسجيل المختبرين</th>
          </tr>
          <tbody>
            <tr>
              <td>الناجحة</td>
              <td>{{ previewResult.report.examiner.successNum }}</td>
            </tr>
            <tr>
              <td>الفاشلة</td>
              <td>{{ previewResult.report.examiner.failNum }}</td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-simple-table
          v-if="previewResult.report.interview"
          class="repTable ma-1"
        >
          <tr>
            <th colspan="2">العمليات علي تسجيل المقابلة الشخصية</th>
          </tr>
          <tbody>
            <tr>
              <td>الناجحة</td>
              <td>{{ previewResult.report.interview.successNum }}</td>
            </tr>
            <tr>
              <td>الفاشلة</td>
              <td>{{ previewResult.report.interview.failNum }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      loadLoading2: false,
      loadLoading3: false,
    }
  },
  computed: {
    previewResult() {
      return this.$store.getters['PushResult/previewResult']
    },
  },
  methods: {
    loadExaminerDataFromLocalServer() {
      this.loadLoading2 = true
      const ids = this.previewResult.examiners
        ? this.previewResult.examiners.map((elm) => elm.national_id)
        : []
      this.$store
        .dispatch('PushResult/loadExaminerDataFromLocalServer', ids)
        .then((res) => {
          this.$store.commit('PushResult/setPreviewResult', res.data)
          this.$router.push('/previewPushResult')
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loadLoading2 = false
        })
    },
    deleteExaminerDataFromLocalServer() {
      this.loadLoading3 = true
      const ids = this.previewResult.examiners
        ? this.previewResult.examiners.map((elm) => elm.national_id)
        : []
      this.$store
        .dispatch('PushResult/deleteExaminerDataFromLocalServer', { ids })
        .then((res) => {
          this.$store.commit('PushResult/setPreviewResult', res.data)
          this.$router.push('/previewPushResult')
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loadLoading3 = false
        })
    },
    removeNotNoticedExaminedAgain() {
      this.loadLoading3 = true
      const ids = this.previewResult.examiners
        ? this.previewResult.examiners.map((elm) => elm.national_id)
        : []
      this.$store
        .dispatch('PushResult/removeNotNoticedExaminedAgain', { ids })
        .then((res) => {
          this.$store.commit('PushResult/setPreviewResult', res.data)
          this.$router.push('/previewPushResult')
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          this.loadLoading3 = false
        })
    },
  },
}
</script>
<style>
.repTable {
  flex: 1;
}
.repTable th,
.repTable td {
  border: 1px solid #eee;
}
</style>

<template>
  <div>
    <v-card v-if="examiner" flat class="ma-auto" max-width="700px" width="100%">
      <v-simple-table class="my-3 elevation-1">
        <tbody>
          <tr>
            <td class="headline">الرقم القومي</td>
            <td class="title">{{ examiner.national_id }}</td>
          </tr>
          <tr v-if="examiner.sold_id">
            <td class="headline">الرقم العسكري</td>
            <td class="title">{{ examiner.sold_id }}</td>
          </tr>
          <tr v-if="examiner.triple_number">
            <td class="headline">الرقم الثلاثي</td>
            <td class="title">{{ examiner.triple_number }}</td>
          </tr>
          <tr v-if="examiner.name">
            <td class="headline">الاسم</td>
            <td class="title">{{ examiner.name }}</td>
          </tr>
          <tr v-if="examiner.stage">
            <td class="headline">المرحلة</td>
            <td class="title">{{ examiner.stage }}</td>
          </tr>
          <tr v-if="examiner._count.Answers">
            <td class="headline">عدد الاسئلة التي تم الاجابة عليها</td>
            <td class="title">{{ examiner._count.Answers }}</td>
          </tr>
        </tbody>
      </v-simple-table>
      <v-card-actions>
        <v-btn color="primary" :loading="loading" @click="getAssignExams()"
          >ابدأ الاختبار</v-btn
        >
      </v-card-actions>
    </v-card>

  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    examiner() {
      return this.$store.getters['Examiner/examiner']
    },
  },
  methods: {
    getAssignExams() {
      this.loading = true
      this.$store
        .dispatch('Exam/getAssignExams', this.examiner.id)
        .then(() => {
          this.$router.replace('/exam')
          this.$store.commit('Exam/loadAnswers', this.examiner.national_id)
        })
        .catch((rej) => {
          if (rej.response.status === 404) {
            this.$store.commit('Notifications/setNotification', {
              text: rej.response.data,
              color: 'warning',
            })
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
  },
}
</script>

<style>
</style>
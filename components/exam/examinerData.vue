<template>
  <v-card flat v-if="examiner" class="ma-auto" max-width="700px" width="100%">
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
      </tbody>
    </v-simple-table>
    <v-card-actions>
      <v-btn color="primary" to="/exam">ابدأ الاختبار</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  computed: {
    examiner() {
      return this.$store.getters['Examiner/examiner']
    },
  },
}
</script>

<style>
</style>
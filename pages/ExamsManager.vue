<template>
  <div>
    <div class="d-flex justify-center">
      <v-chip-group v-model="examType" color="primary" mandatory>
        <v-chip filter outlined large>تطبيق الاختبارت النفسية</v-chip>
        <v-chip filter outlined large>تطبيق الاختبارات التخصصية</v-chip>
      </v-chip-group>
    </div>
    <assign-exam></assign-exam>
  </div>
</template>

<script>
import assignExam from '~/components/examManager/assignExam.vue'
export default {
  name: 'ExamsManager',
  components: { assignExam },
  data: () => ({
    examType: 0,
  }),
}
</script>

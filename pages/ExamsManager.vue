<template>
  <div class="d-flex justify-center">
    <v-chip-group v-model="examType" color="primary" mandatory>
      <v-chip filter outlined large>تطبيق الاختبارت النفسية</v-chip>
      <v-chip filter outlined large>تطبيق الاختبارات التخصصية</v-chip>
    </v-chip-group>
  </div>
</template>

<script>
export default {
  name: 'ExamsManager',
  data: () => ({
    examType: 0,
  }),
}
</script>

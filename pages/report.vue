<template>
  <div class="pa-5">
    <v-sheet
      color="#eee"
      class="py-3 px-4 d-flex justify-space-between align-center"
    >
    <v-avatar :size="40">
       <v-img src="/logo.webp"></v-img>
    </v-avatar>

      <div contenteditable="true" class="headline pa-2">كشف اسماء</div>
       <div>{{ $localeDate() }}</div>
      <div class="hideOnPrint">
        <v-btn class="primary" @click="print()" text>طباعة</v-btn>
        <v-btn  text to="/"
          ><v-icon>mdi-arrow-left</v-icon></v-btn
        >
      </div>
    </v-sheet>

    <v-simple-table class="printTable">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="">مسلسل</th>
            <th>رقم عسكري</th>
            <th>الاسم</th>
            <th>الدرجة</th>
            <th>الوحدة</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, k) in report" :key="k">
            <td>{{ ++k }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.name }}</td>
            <td>
              <span v-if="item.level">{{ item.level.level }}</span>
            </td>
            <td>
              <span v-if="item && item.unit">{{ item.unit.unitname }}</span>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  name: 'report-page',
  layout: 'printing',
  computed: {
    report() {
      return this.$store.getters.report
    },
  },
  methods:{
    print(){
      print();
    }
  }
}
</script>

<style>
.printTable th,
.printTable td {
  border: 1px solid #eee;
}
@media print {
  .hideOnPrint {
    display: none;
  }
}
</style>

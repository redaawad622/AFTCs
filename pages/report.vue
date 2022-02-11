<template>
  <div class="pa-5" v-if="report">
    <v-sheet
      color="#eee"
      class="py-3 px-4 d-flex justify-space-between align-center"
    >
      <v-avatar :size="40">
        <v-img src="/logo.webp"></v-img>
      </v-avatar>

      <div contenteditable="true" class="headline pa-2">كشف اسماء</div>
      <div>{{ $localeDate() }}</div>
      <div class="hideOnPrint align-center">
        <v-combobox
          v-model="filterColumns"
          :items="columns"
          item-text="text"
          dense
          hide-details
          multiple
          chips
          outlined
          class="mx-2"
          color="primary"
          return-object
        ></v-combobox>
        <v-btn class="primary" @click="print()" text>طباعة</v-btn>
        <v-btn text :to="report.backTo"><v-icon>mdi-arrow-left</v-icon></v-btn>
      </div>
    </v-sheet>

    <v-simple-table class="printTable">
      <template v-slot:default>
        <thead>
          <tr>
            <th class="">مسلسل</th>
            <th v-for="column in filterColumns" :key="column.text">
              {{ column.text }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, k) in reportData" :key="k">
            <td>{{ ++k }}</td>
            <td v-for="column in filterColumns" :key="column.text + k">
              {{ item[column.value] }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  name: 'ReportPage',
  layout: 'printing',
  data() {
    return {
      show: '',
      filterColumns: [],
    }
  },
  computed: {
    report() {
      return this.$store.getters['Report/report']
    },
    reportData() {
      return this.report.data
    },
    columns() {
      return this.report.columns
    },
  },
  mounted() {
    const columns = [...this.columns]
    this.filterColumns = columns.filter((x) => !x.hide)
  },
  methods: {
    print() {
      print()
    },
  },
}
</script>

<style>
.printTable th,
.printTable td {
  border: 1px solid #eee;
}
.hideOnPrint {
  display: flex;
}
@media print {
  .hideOnPrint {
    display: none !important;
  }
}
</style>

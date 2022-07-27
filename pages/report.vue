<template>
  <div v-if="report" class="pa-5">
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
        <v-btn color="primary" @click="print()">طباعة</v-btn>
        <v-dialog v-model="dialog" width="500">
          <template #activator="{ on, attrs }">
            <v-btn color="primary" class="mx-2" dark v-bind="attrs" v-on="on">
              تصدير لملف اكسس
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              تصدير الي ملف أكسس
            </v-card-title>

            <v-card-text class="pt-2">
              <v-text-field
                v-model="fileName"
                color="primary"
                label="اسم الملف"
                outlined
              ></v-text-field>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="exportCsv()"> تصدير </v-btn>

              <v-btn color="error" text @click="dialog = false"> الغاء </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-btn text :to="report.backTo"><v-icon>mdi-arrow-left</v-icon></v-btn>
      </div>
    </v-sheet>

    <v-simple-table id="printTable" class="printTable" dense>
      <template #default>
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
              <template v-if="column.value === 'Answers'">
                {{ item.Answers[column.text] }}
              </template>
              <template v-else>
                {{ item[column.value] }}
              </template>
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
      fileName: 'examiner',
      dialog: false,
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
    exportCsv() {
      const data = []
      const rows = document.querySelectorAll('#printTable tr')
      for (let i = 0; i < rows.length; i++) {
        const row = []
        const cols = rows[i].querySelectorAll('td, th')
        for (let j = 0; j < cols.length; j++) {
          row.push(cols[j].innerText)
        }
        data.push(row.join(','))
      }
      const csv = data.join('\n')
      const elm = document.createElement('a')
      elm.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv)
      elm.target = '_blank'
      elm.download = `${this.fileName}.csv`
      elm.click()
      this.dialog = false
      // this.$store.dispatch('Examiner/Export')
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

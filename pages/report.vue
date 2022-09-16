<template>
  <div v-if="report" class="pa-5">
    <div class="d-flex justify-space-between mb-3">
      <div class="text-justify">
        وزارة الدفاع<br />
        هيئة التنظيم و الادارة<br />
        فرع الانتقاء والتوجيه
        <div class="mt-2">{{ $localeDate() }}</div>
      </div>
      <v-avatar :size="80">
        <v-img src="/logo.png"></v-img>
      </v-avatar>
    </div>
    <v-sheet color="#eee" class="py-3 px-4 d-flex align-center">
      <v-avatar :size="40">
        <v-img src="/logo.png"></v-img>
      </v-avatar>
      <div
        ref="repTitle"
        contenteditable="true"
        class="headline pa-2 text-center"
        style="flex: 1"
        v-text="title"
      ></div>

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
          class="ma-2"
          color="primary"
          return-object
        >
        </v-combobox>

        <v-select
          v-if="report.filterData"
          v-model="centersOrSitesValue"
          multiple
          :return-object="false"
          :items="centersOrSitesDropDown"
          outlined
          color="primary"
          dense
        >
        </v-select>
        <div class="d-flex justify-space-between">
          <v-btn color="primary" @click="print()">طباعة</v-btn>
          <plansTraining v-if="report.filterData" />

          <v-dialog v-model="dialog" width="500">
            <template #activator="{ on, attrs }">
              <v-btn color="primary" class="mx-2" dark v-bind="attrs" v-on="on">
                تصدير لملف excel
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="text-h5 grey lighten-2">
                تصدير الي ملف excel
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

                <v-btn color="error" text @click="dialog = false">
                  الغاء
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="msDialog" width="500">
            <template #activator="{ on, attrs }">
              <v-btn color="primary" class="mx-2" dark v-bind="attrs" v-on="on">
                تصدير لملف word
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="text-h5 grey lighten-2">
                تصدير الي ملف word
              </v-card-title>

              <v-card-text class="pt-2">
                <v-text-field
                  v-model="msFileName"
                  color="primary"
                  label="اسم الملف"
                  outlined
                ></v-text-field>
              </v-card-text>

              <v-divider></v-divider>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="exportWord()">
                  تصدير
                </v-btn>

                <v-btn color="error" text @click="msDialog = false">
                  الغاء
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-btn text :to="report.backTo"
            ><v-icon>mdi-arrow-left</v-icon></v-btn
          >
        </div>
      </div>
    </v-sheet>

    <v-simple-table
      id="printTable"
      class="printTable"
      dense
      :single-select="true"
      :contenteditable="true"
    >
      <template #default>
        <thead>
          <tr>
            <th class="hideOnPrint">اختيار</th>
            <th class="hideOnPrint">م</th>
            <th v-for="column in filterColumns" :key="column.text">
              {{ column.text }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item, k) in filterData"
            :key="k + 'repRow'"
            :class="removedReportData.includes(k) ? `hideOnPrint` : `none`"
          >
            <td class="hideOnPrint">
              <v-checkbox
                class="hideOnPrint"
                dense
                input-value="true"
                @change="onCheckBoxClicked(k - 1)"
              />
            </td>

            <td class="hideOnPrint">{{ ++k }}</td>
            <td
              v-for="column in filterColumns"
              :key="column.text + k + 'repTd'"
            >
              <template v-if="column.value === 'Answers'">
                {{ item.Answers[column.id] }}%
              </template>

              <template v-else-if="column.value == '_count'">
                <v-chip
                  small
                  :to="`/Examiners/${item.national_id}/interview`"
                  :color="item._count['Interview'] > 0 ? 'success' : 'error'"
                >
                  {{ item._count['Interview'] > 0 ? 'نعم' : 'لا' }}
                </v-chip>
              </template>
              <template v-else-if="column.value == '_count.Answers'">
                {{ item._count['Answers'] }}
              </template>
              <template v-else-if="column.value == '_count.id'">
                {{ item._count['id'] }}
              </template>
              <template v-else-if="column.value == 'user_id'">
                {{ getName(item.user_id) }}
              </template>
              <template v-else-if="column.value == 'expected_total'">
                {{ isNaN(expectedTotal(item)) ? '' : expectedTotal(item) }}
              </template>
              <template v-else-if="column.value == 'actual_arrive_total'">
                {{
                  isNaN(actualArriveTotal(item)) ? '' : actualArriveTotal(item)
                }}
              </template>
              <differenceExpectedActual
                v-else-if="column.value == 'difference_expected_actual'"
                :item="item"
              />
              <differenceExpectedActual
                v-else-if="column.value == 'difference_expected_actual_high'"
                :item="item"
                category="high"
              />
              <differenceExpectedActual
                v-else-if="column.value == 'difference_expected_actual_above'"
                :item="item"
                category="above"
              />
              <differenceExpectedActual
                v-else-if="column.value == 'difference_expected_actual_middle'"
                category="middle"
                :item="item"
              />
              <differenceExpectedActual
                v-else-if="column.value == 'difference_expected_actual_usually'"
                :item="item"
                category="usually"
              />

              <template
                v-else-if="column.value == 'difference_actual_examined'"
              >
                {{
                  isNaN(differenceActualExamined(item))
                    ? ''
                    : differenceActualExamined(item)
                }}
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
import plansTraining from '~/components/reports/plansTraining.vue'
import differenceExpectedActual from '~/components/reports/differenceExpectedActual.vue'
import expectedPlanMixin from '~/mixins/Reports/expectedPlanMixin'

export default {
  name: 'ReportPage',
  components: { plansTraining, differenceExpectedActual },
  mixins: [expectedPlanMixin],
  layout: 'printing',
  data() {
    return {
      filterData: [],
      removedReportData: [],
      centersOrSitesValue: [2, 1],
      printedElementsCount: [],
      centersOrSitesDropDown: [
        {
          text: 'مراكز تدريب',
          value: 2,
        },
        {
          text: 'مناطق تجنيد',
          value: 1,
        },
      ],
      title: 'كشف بأسماء',
      filterColumns: [],
      fileName:
        'excel-examiner-' +
        new Date().toLocaleDateString().replaceAll('/', '-'),
      msFileName:
        'word-examiner-' +
        new Date().toLocaleDateString().replaceAll('/', '-') +
        '.doc',
      dialog: false,
      msDialog: false,
    }
  },
  computed: {
    report() {
      return this.$store.getters['Report/report']
    },
    plan() {
      return this.$store.getters['Plans/plan']
    },
    reportData: {
      get() {
        return this.report.data
      },
    },
    columns() {
      return this.report.columns
    },
    users() {
      return this.$store.getters['User/users']
    },
  },
  watch: {
    plan: {
      handler(val) {
        this.filterData = this.filterData.map((data) => {
          if (Number(data.user_id) === val.data.user_id) {
            return { ...data, ...val.data }
          }
          return data
        })
      },
    },
    centersOrSitesValue: {
      deep: true,
      handler(val) {
        this.filterData = this.reportData.filter((x) =>
          val.includes(this.getType(x.user_id) || -1)
        )
      },
    },
  },
  mounted() {
    const columns = [...this.columns]
    this.filterColumns = columns.filter((x) => !x.hide)
    this.title = this.$getLocal('repTitle', false) || 'كشف بأسماء'
    this.filterData = [...this.reportData]
  },
  methods: {
    differenceActualExamined(item) {
      return this.actualArriveTotal(item) - item.total
    },
    removeElementFromArray(array, index) {
      return array.slice(0, index).concat(array.slice(index + 1))
    },
    onCheckBoxClicked(key) {
      if (this.removedReportData.includes(key)) {
        this.removedReportData = this.removeElementFromArray(
          this.removedReportData,
          this.removedReportData.indexOf(key)
        )
      } else {
        this.removedReportData.push(key)
      }
    },
    getName(id) {
      if (!isNaN(id))
        return this.users.find((elm) => elm.Cat_ID === Number(id)).Cat_Name
      else {
        return id
      }
    },
    getType(id) {
      if (!isNaN(id))
        return this.users.find((elm) => elm.Cat_ID === Number(id)).type
      else {
        return id
      }
    },
    print() {
      this.$setLocal('repTitle', this.$refs.repTitle.innerText, false, true)
      print()
    },
    exportWord() {
      const style =
        '<style> table {display: table;border-collapse: separate;box-sizing: border-box;text-indent: initial;border-spacing: 2px;border-color: grey;} th,td { border: 1px solid #000;} </style>'
      const preHtml = `<html> <head> <meta charset='utf-8'/> <title>test</title> ${style} </head> <body>`

      const table = document.getElementById('printTable').innerHTML

      const postHtml = '</body></html>'

      const url =
        'data:application/vnd.ms-word;charset=utf-8,' +
        encodeURIComponent(preHtml + table + postHtml)

      const downloadLink = document.createElement('a')

      document.body.appendChild(downloadLink)

      downloadLink.href = url

      downloadLink.download = this.msFileName

      downloadLink.click()

      document.body.removeChild(downloadLink)
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
    },
  },
}
</script>

<style>
.printTable th,
.printTable td {
  border: 1px solid #eee;
}

@media print {
  .hideOnPrint {
    display: none !important;
  }
}
</style>

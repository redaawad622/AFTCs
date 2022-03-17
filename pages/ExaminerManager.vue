<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <div>
        <div
          class="my-4"
          :class="{
            'd-flex align-center': Object.keys(filtersItems).length < 1,
          }"
        >
          <div class="d-flex align-center" style="flex: 1">
            <v-text-field
              v-model="search"
              prepend-inner-icon="mdi-magnify"
              label="بحث بالاسم او الرقم العسكري ..."
              single-line
              hide-details
              flat
              solo
              clearable
            ></v-text-field>
            <v-badge
              bordered
              color="error"
              :content="examiners.length"
              left
              overlap
            >
              <v-btn class="elevation-0" @click="fetchExaminers(true)"
                >تصفية النتائج</v-btn
              >
            </v-badge>

            <v-btn title="طباعة" @click="printRep()" class="elevation-0 ms-2"
              ><v-icon>mdi-printer-outline</v-icon></v-btn
            >
            <v-btn
              v-if="permissions.area.includes(user.type)"
              title="رفع بيانات من oracle"
              @click="tryConnection()"
              class="elevation-0 ms-2"
              ><v-icon>mdi-database-sync</v-icon></v-btn
            >
            <v-btn
              v-if="permissions.admin.includes(user.type)"
              title="سحب البيانات من ملف الاكسس"
              @click="readExaminerFromMdb()"
              class="elevation-0 ms-2"
              ><v-icon>mdi-microsoft-access</v-icon></v-btn
            >
          </div>
          <div>
            <v-scale-transition group>
              <v-chip
                v-for="(item, k) in filtersItems"
                v-show="
                  item !== 'من تم تسجيلهم'
                    ? true
                    : permissions.admin.includes(user.type)
                    ? true
                    : false
                "
                :key="k"
                class="ma-2"
                close
                filter
                label
                color="grey lighten-4"
                @click:close="filters[k] = ''"
              >
                {{ item }}
              </v-chip>
            </v-scale-transition>
            <v-menu :close-on-content-click="false" :nudge-bottom="40">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  width="36px"
                  min-width="36px"
                  class="elevation-0 ma-2"
                  v-bind="attrs"
                  v-on="on"
                  title="تصفية النتائج"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </template>

              <v-card min-width="400px" class="pa-4">
                <v-sheet class="d-flex justify-space-between align-center">
                  <v-list-item-title class="font-weight-black">
                    تصفية النتائج</v-list-item-title
                  >
                  <v-btn color="primary" @click="fetchExaminers(true)" text
                    >تطبيق</v-btn
                  >
                </v-sheet>
                <v-card-text>
                  <v-autocomplete
                    v-model="filters.qualification"
                    append-icon="mdi-menu-swap"
                    outlined
                    dense
                    placeholder="المؤهل"
                    label="المؤهل"
                    cache-items
                    :items="helpers.qualification"
                    item-text="name"
                    item-value="value"
                  ></v-autocomplete>
                  <v-autocomplete
                    v-model="filters.examFinish"
                    append-icon="mdi-menu-swap"
                    outlined
                    dense
                    placeholder="انتهاء الامتحان"
                    label="انتهاء الامتحان"
                    cache-items
                    :items="helpers.examFinish"
                    item-text="name"
                    item-value="value"
                  ></v-autocomplete>
                  <v-autocomplete
                    v-if="permissions.admin.includes(user.type)"
                    v-model="filters.battaryId"
                    append-icon="mdi-menu-swap"
                    outlined
                    dense
                    placeholder="البطارية"
                    label="البطارية"
                    item-text="name"
                    item-value="id"
                    cache-items
                    :items="battaryId"
                  ></v-autocomplete>
                  <v-autocomplete
                    v-model="filters.stage"
                    append-icon="mdi-menu-swap"
                    outlined
                    dense
                    placeholder="المرحلة"
                    label="المرحلة"
                    item-value="stage"
                    item-text="stage"
                    cache-items
                    :items="stage"
                  ></v-autocomplete>
                  <v-autocomplete
                    v-model="filters.register"
                    append-icon="mdi-menu-swap"
                    outlined
                    dense
                    placeholder="المسجلين للامتحان"
                    label="المسجلين للامتحان"
                    item-value="value"
                    item-text="name"
                    cache-items
                    :items="helpers.register"
                  ></v-autocomplete>
                  <v-checkbox
                    v-if="permissions.admin.includes(user.type)"
                    v-model="withResualt"
                    label=" مع النتيجة"
                  ></v-checkbox>
                </v-card-text>
              </v-card>
            </v-menu>
          </div>
        </div>

        <v-data-table
          :headers="headers"
          :items="examiners"
          fixed-header
          :search="search"
          :options.sync="options"
          :loading="loading"
          :server-items-length="allExaminers"
          item-key="national_id"
          :single-expand="true"
        >
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn color="success" :to="`/${item.id}`" icon>
              <v-icon small> mdi-pencil </v-icon>
            </v-btn>
            <v-btn icon @click="deleteItem(item)" color="error">
              <v-icon small> mdi-delete-outline </v-icon>
            </v-btn>
          </template>
          <template v-slot:[`item.Answers`]="{ item, header }">
            {{ item.Answers[header.text] }}
          </template>
          <template v-slot:[`item.image`]="{ item }">
            <v-avatar class="ma-2" size="50" color="accent">
              <v-img v-if="item.image" src="item.image"></v-img>
              <span
                class="secondaryT--text font-weight-bold"
                v-else
                v-text="item.name ? item.name.substr(0, 1) : 'us'"
              ></span>
            </v-avatar>
          </template>
        </v-data-table>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >هل انت متاكد انك تريد الحذف؟</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="error" text @click="closeDelete">لا</v-btn>
              <v-btn color="primary" text @click="deleteItemConfirm">نعم</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'ExaminerManager',
  data() {
    return {
      helpers: {
        qualification: [
          { name: 'عليا', value: 2 },
          { name: 'فوق متوسطة', value: 8 },
          { name: 'متوسطة', value: 1 },
          { name: 'عادة', value: 0 },
        ],
        examFinish: [
          { name: 'من انهوا', value: 1 },
          { name: 'من لم ينتهوا بعد', value: 0 },
        ],
        register: [
          { name: 'من تم تسجيلهم', value: 1 },
          { name: 'من لم يتم تسجيلهم', value: 0 },
        ],
      },

      examiners: [],
      expanded: [],
      allExaminers: 0,
      loading: true,
      options: {},
      dialogDelete: false,
      search: '',
      withResualt: 0,
      filters: {
        qualification: '',
        examFinish: '',
        battaryId: '',
        stage: '',
        register: 1,
      },
      defaultHeaders: [
        {
          text: 'الاسم',
          value: 'name',
          align: 'center',
          hide: false,
        },
        {
          text: 'الرقم القومي',
          align: 'center',
          value: 'national_id',
          hide: false,
        },

        {
          text: 'الرقم الثلاثي',
          align: 'center',
          value: 'triple_number',
          hide: false,
        },
        {
          text: 'الرقم العسكري',
          align: 'center',
          value: 'sold_id',
          hide: false,
        },
        {
          text: 'المرحلة',
          align: 'center',
          value: 'stage',
          hide: false,
        },

        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          align: 'center',
          hide: true,
        },
      ],
      headers: [
        {
          text: 'الاسم',
          value: 'name',
          align: 'center',
          hide: false,
        },
        {
          text: 'الرقم القومي',
          align: 'center',
          value: 'national_id',
          hide: false,
        },

        {
          text: 'الرقم الثلاثي',
          align: 'center',
          value: 'triple_number',
          hide: false,
        },
        {
          text: 'الرقم العسكري',
          align: 'center',
          value: 'sold_id',
          hide: false,
        },
        {
          text: 'المرحلة',
          align: 'center',
          value: 'stage',
          hide: false,
        },

        {
          text: 'Actions',
          value: 'actions',
          sortable: false,
          align: 'center',
          hide: true,
        },
      ],
    }
  },

  computed: {
    user() {
      return this.$store.getters['User/user']
    },
    permissions() {
      return this.$store.getters['User/permissions']
    },
    battaryId() {
      return this.$store.getters['Exam/battaries']
    },
    stage() {
      return this.$store.getters['Exam/stage']
    },
    filtersItems() {
      const res = Object.fromEntries(
        Object.entries(this.filters).filter(
          ([_, v]) => v != null && (v || v === 0)
        )
      )
      Object.keys(res).forEach((elm) => {
        if (elm === 'battaryId') {
          res[elm] = this.battaryId.find((x) => x.id === res[elm]).name
        } else if (elm === 'stage') {
          // nothing
        } else
          res[elm] = this.helpers[elm].find((x) => x.value === res[elm]).name
      })
      return res
    },
  },

  watch: {
    options: {
      handler() {
        this.fetchExaminers()
      },
      deep: true,
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    filtersItems(val) {
      Object.keys(val).length || this.fetchExaminers(true)
    },
  },

  methods: {
    printRep() {
      this.$store.commit('Report/setReport', {
        data: this.examiners,
        columns: this.headers,
        backTo: '/ExaminerManager',
      })
      this.$router.push('/report')
    },
    async fetchExaminers(isSearch = false) {
      this.options.page = isSearch ? 1 : this.options.page
      if (this.withResualt) this.options.withResualt = this.withResualt

      this.loading = true
      await this.$store
        .dispatch(`Examiner/getExaminers`, {
          search: this.search,
          ...this.filters,
          ...this.options,
        })
        .then((res) => {
          this.examiners = res.data.examiners
          this.allExaminers = res.data.allExaminers
          this.headers = [...this.defaultHeaders]
          if (this.examiners && this.examiners.length > 0) {
            if (this.examiners[0].Answers) {
              Object.keys(this.examiners[0].Answers).forEach((k) => {
                this.headers.push({
                  text: k,
                  align: 'center',
                  value: `Answers`,
                  hide: false,
                })
              })
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteItem(item) {
      this.editedIndex = this.examiners.indexOf(item)
      this.dialogDelete = true
    },
    tryConnection() {
      this.$axios('api/tryConnection')
    },
    readExaminerFromMdb() {
      this.loading = true
      this.$store
        .dispatch(`Examiner/readExaminerFromMdb`)
        .then((res) => {
          this.examiners = res.data
          this.allExaminers = this.examiners.length
        })
        .finally(() => {
          this.loading = false
        })
    },

    deleteItemConfirm() {
      this.$store.dispatch('Examiner/deleteExaminer', {
        id: this.examiners[this.editedIndex].id,
      })
      this.examiners.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    closeDelete() {
      this.dialogDelete = false
    },
  },
}
</script>

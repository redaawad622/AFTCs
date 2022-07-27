/* eslint-disable vue/valid-v-slot */
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

            <v-btn
              color="white"
              title="طباعة"
              class="elevation-0 ms-2"
              @click="printRep()"
              ><v-img
                width="24px"
                height="24px"
                contain
                src="/icon/printer.png"
              ></v-img
            ></v-btn>
            <v-btn
              v-if="permissions.area.includes(user.type)"
              color="white"
              title="رفع بيانات من oracle"
              class="elevation-0 ms-2"
              @click="tryConnection()"
            >
              <v-img
                width="24px"
                height="24px"
                contain
                src="/icon/database.png"
              ></v-img>
            </v-btn>
            <v-btn
              v-if="permissions.admin.includes(user.type)"
              title="سحب بيانات المختبرين من ملف الاكسس"
              class="elevation-0 ms-2"
              color="white"
              @click="readExaminerFromMdb()"
            >
              <v-img
                width="24px"
                height="24px"
                contain
                src="/icon/microsoft-access.png"
              ></v-img>
            </v-btn>
            <v-btn
              v-if="permissions.admin.includes(user.type)"
              title="سحب بيانات مناطق التمركز من ملف الاكسس"
              class="elevation-0 ms-2"
              color="white"
              :loading="readUnitsLoading"
              @click="readUnitsFromMdb()"
            >
              <v-img
                width="24px"
                height="24px"
                contain
                src="/icon/microsoft-access.png"
              ></v-img>
            </v-btn>
            <v-checkbox
              v-if="permissions.developer.includes(user.type)"
              v-model="deleteItems"
              label="مسح البحث"
            ></v-checkbox>
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
              <template #activator="{ on, attrs }">
                <v-btn
                  width="36px"
                  min-width="36px"
                  class="elevation-0 ma-2"
                  color="white"
                  title="تصفية النتائج"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-img src="/icon/filter.png"></v-img>
                </v-btn>
              </template>

              <v-card min-width="400px" class="pa-4">
                <v-sheet class="d-flex justify-space-between align-center">
                  <v-list-item-title class="font-weight-black">
                    تصفية النتائج</v-list-item-title
                  >
                  <v-btn color="primary" text @click="fetchExaminers(true)"
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
                    v-model="filters.interview"
                    append-icon="mdi-menu-swap"
                    outlined
                    dense
                    placeholder="المقابلة"
                    label="المقابلة"
                    cache-items
                    :items="helpers.interview"
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
                    v-if="permissions.admin.includes(user.type)"
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
                  <v-autocomplete
                    v-if="permissions.admin.includes(user.type)"
                    v-model="filters.user"
                    append-icon="mdi-menu-swap"
                    outlined
                    dense
                    placeholder="المستخدمين"
                    label="المستخدمين"
                    item-value="Cat_ID"
                    item-text="Cat_Name"
                    cache-items
                    :items="users"
                  ></v-autocomplete>
                  <v-checkbox
                    v-if="permissions.admin.includes(user.type)"
                    v-model="withResualt"
                    label=" مع النتيجة"
                  ></v-checkbox>
                  <v-checkbox
                    v-if="permissions.admin.includes(user.type)"
                    v-model="nafsy"
                    label="النفسي"
                  ></v-checkbox>
                </v-card-text>
              </v-card>
            </v-menu>
          </div>
        </div>
        <div class="d-flex align-center mb-5">
          <v-select
            v-if="permissions.admin.includes(user.type)"
            v-model="headers"
            return-object
            outlined
            chips
            dense
            multiple
            hide-details
            :items="defaultHeaders"
            class="ml-5"
          ></v-select>
          <v-btn color="primary" @click="filterByExamDegree"
            >استخراج النتائج</v-btn
          >
        </div>
        <v-data-table
          v-model="selectedExaminer"
          :headers="headers"
          :items="examiners"
          fixed-header
          :search="search"
          :options.sync="options"
          :loading="loading"
          :server-items-length="allExaminers"
          item-key="national_id"
          :single-expand="true"
          :single-select="true"
          show-select
          >`
          <template #[`header.Answers`]="{ header }">
            <div class="d-flex flex-column">
              <v-text-field
                v-model="filterExam[`from_${header.id}`]"
                solo-inverted
                placeholder="من"
                type="number"
                dense
                style="min-width: 60px"
              ></v-text-field>
              <v-text-field
                v-model="filterExam[`to_${header.id}`]"
                solo-inverted
                placeholder="الي"
                type="number"
                dense
                style="min-width: 60px"
              ></v-text-field>
              <div class="text-no-wrap text-primary">{{ header.text }}</div>
            </div>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-btn
              color="success"
              :to="`/Examiners/${item.national_id}`"
              icon
              title="تعديل المختبر"
            >
              <v-img
                contain
                width="24px"
                height="24px"
                src="/icon/edit.png"
              ></v-img>
            </v-btn>
            <v-btn
              v-if="permissions.admin.includes(user.type)"
              icon
              color="error"
              @click="deleteItem(item)"
            >
              <v-img
                width="24px"
                contain
                height="24px"
                src="/icon/trash.png"
              ></v-img>
            </v-btn>
            <v-btn
              icon
              color="info"
              :to="`/Examiners/${item.national_id}/interview`"
              title="المقابلة الشخصية"
            >
              <v-icon>mdi-account</v-icon>
            </v-btn>
          </template>
          <template #[`item.again`]="{ item }">
            <v-btn
              v-if="item._count.Answers > 0"
              color="primary"
              text
              title="تعديل المختبر"
              @click="currentDelete = item"
            >
              اعادة
            </v-btn>
            <v-chip v-else>لم يتم امتحانه بعد</v-chip>
          </template>
          <template #[`item.CustomExam`]="{ item }">
            <diV class="d-felx">
              <v-btn
                color="primary"
                text
                @click="currentSelectedExaminer = item"
                >تسجيل
              </v-btn>
              <v-chip class="mx-1 font-weight-bold" color="red">{{
                item.CustomExam.length
              }}</v-chip>
            </diV>
          </template>
          <template #[`item.Answers`]="{ item, header }">
            {{ item.Answers[header.id] }}%
          </template>
          <template #[`item.sold_id`]="{ item }">
            <v-chip v-if="item.sold_id">{{ item.sold_id }}</v-chip>
            <v-btn
              v-else
              color="info"
              :to="`/Examiners/${item.national_id}`"
              text
              >اضافة</v-btn
            >
          </template>
          <template #[`item.stage`]="{ item }">
            <v-chip
              outlined
              color="primary"
              @click="setFilter('stage', item.stage)"
            >
              {{ item.stage }}</v-chip
            >
          </template>
          <template #[`item._count`]="{ item }">
            <v-chip
              :to="`/Examiners/${item.national_id}/interview`"
              :color="item._count['Interview'] > 0 ? 'success' : 'error'"
              >{{ item._count['Interview'] > 0 ? 'نعم' : 'لا' }}</v-chip
            >
          </template>
          <template #[`item.image`]="{ item }">
            <v-avatar class="ma-2" size="50" color="accent">
              <v-img v-if="item.image" src="item.image"></v-img>
              <span
                v-else
                class="secondaryT--text font-weight-bold"
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
        <v-dialog v-if="currentDelete" :value="true" max-width="300px">
          <v-card :loading="currentDeleteLoading">
            <v-card-title class="text-h5"
              >هل انت متاكد انك تريد الاعادة؟</v-card-title
            >
            <v-card-text v-if="currentDelete">
              سيتم حذف جميع اجابات {{ currentDelete.name }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                :loading="currentDeleteLoading"
                @click="removeExamAns()"
                >نعم</v-btn
              >
              <v-btn
                :disabled="currentDeleteLoading"
                color="error"
                text
                @click="currentDelete = null"
                >لا</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-row justify="center">
          <v-dialog
            v-if="currentSelectedExaminer"
            :value="true"
            persistent
            max-width="600px"
          >
            <v-card>
              <v-card-title class="grey lighten-2"
                >الاختبارات التي تمت
              </v-card-title>
              <v-chip-group
                v-if="currentSelectedExaminer.CustomExam.length > 0"
                class="my-3"
              >
                <v-chip
                  v-for="cExam in currentSelectedExaminer.CustomExam"
                  :key="cExam.id + 'cExam'"
                  >{{ cExam.exam.Exm_Name }}</v-chip
                >
              </v-chip-group>
              <v-card-text v-else class="my-3"
                >لا يوجد اختبارات تمت</v-card-text
              >
              <v-card-title class="grey lighten-2">
                <span class="text-h5">تسجيل درجات الاختبارات التالية</span>
              </v-card-title>
              <v-card-text v-if="exams.length > 0" class="my-3">
                <v-text-field
                  v-for="item in exams"
                  :key="item.Exm_Name"
                  v-model.number="examsVal[item.Exm_ID]"
                  outlined
                  :label="item.Exm_Name"
                  type="number"
                ></v-text-field>
              </v-card-text>
              <v-card-text v-else class="my-3"
                >لا يوجد اختبارات لتسجيلها</v-card-text
              >
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  :disabled="examLoading"
                  color="blue darken-1"
                  text
                  @click="currentSelectedExaminer = false"
                >
                  الغاء
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  :loading="examLoading"
                  text
                  @click="saveManualCustomExam()"
                >
                  حفظ
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </div>
    </v-col>
    <v-text-field v-if="false" v-model="ans"></v-text-field>
    <v-btn v-if="false" @click="saveF()">cc</v-btn>
  </v-row>
</template>

<script>
export default {
  name: 'ExaminerManager',
  data() {
    return {
      filterExam: {},
      dialog: false,
      examLoading: false,
      currentSelectedExaminer: null,
      exams: [],
      examsVal: {},
      audio: null,
      currentDelete: null,
      currentDeleteLoading: false,
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
        interview: [
          { name: 'تم عمل مقابلة لهم ', value: 1 },
          { name: 'لم يتم عمل مقابلة لهم', value: 0 },
        ],
        register: [
          { name: 'من تم تسجيلهم', value: 1 },
          { name: 'من لم يتم تسجيلهم', value: 0 },
        ],
      },
      selectedExaminer: [],
      deleteItems: false,
      examiners: [],
      examinersList: [],
      ans: '',
      expanded: [],
      allExaminers: 0,
      loading: true,
      options: {},
      dialogDelete: false,
      readUnitsLoading: false,
      search: '',
      withResualt: 0,
      nafsy: 0,
      filters: {
        qualification: '',
        examFinish: '',
        interview: '',
        battaryId: '',
        stage: '',
        user: '',
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
          text: 'المقابلة',
          align: 'center',
          value: '_count',
          hide: false,
          sortable: false,
        },
        {
          text: 'اعادة الاختبار',
          value: 'again',
          sortable: false,
          align: 'center',
          hide: true,
        },
        {
          text: 'الاختبارت العملية و البدنية',

          value: 'CustomExam',
          sortable: false,
          align: 'center',
          hide: true,
        },
        {
          text: 'الوحده',
          align: 'center',
          value: 'UNIT_NAME',
          hide: false,
        },
        {
          text: 'الجهة',
          align: 'center',
          value: 'GEHA_NAME',
          hide: false,
        },
        {
          text: 'منطقة التمركز',
          align: 'center',
          value: 'TAMARKZ_NAME',
          hide: false,
        },
        {
          text: 'تباعية الوحدة داخل الجيش',
          align: 'center',
          value: 'UNIT_ARMY_NAME',
          hide: false,
        },
        {
          text: 'ملحوظ',
          align: 'center',
          value: 'isNoticed',
          hide: false,
        },
        {
          text: 'تازيخ المتابعه القادم',
          align: 'center',
          value: 'nextFollowDate',
          hide: false,
        },
        {
          text: 'عدد مرات المتابعه',
          align: 'center',
          value: 'numFollowUps',
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
          text: 'المقابلة',
          align: 'center',
          value: '_count',
          sortable: false,
          hide: false,
        },

        {
          text: 'اعادة الاختبار',
          value: 'again',
          sortable: false,
          align: 'center',
          hide: true,
        },
        {
          text: 'عدد الاسئلة التي تم الاجابة عليها',
          align: 'center',
          value: '_count.Answers',
          sortable: false,
          hide: false,
        },
        {
          text: 'الاختبارت العملية و البدنية',
          value: 'CustomExam',
          sortable: false,
          align: 'center',
          hide: true,
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
    users() {
      return this.$store.getters['User/users']
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
    examsBank() {
      return this.$store.getters['Exam/exams']
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
        } else if (elm === 'user') {
          res[elm] = this.users.find((x) => x.Cat_ID === res[elm]).Cat_Name
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
    currentSelectedExaminer(val) {
      if (val) {
        this.$store
          .dispatch('Exam/getAssignExams', this.currentSelectedExaminer.id)
          .then((res) => {
            const custom = res.data.customExam.map((elm) => elm.exam_id)
            this.exams = res.data.battary.filter(
              (elm) => elm.random === 'جهاز' && !custom.includes(elm.Exm_ID)
            )
          })
          .catch(() => {
            this.exams = []
          })
      }
    },
  },
  mounted() {
    this.audio = new Audio(`${this.$audioPath}4357/4357.mp3`)
  },

  methods: {
    filterByExamDegree() {
      console.log(this.filterExam, [0])
      const keys = Object.keys(this.filterExam)
      if (keys.length > 0) {
        this.examiners = this.examinersList.filter((ex) => {
          let isNoticed = false
          keys.forEach((k) => {
            const id = k.split('_')[1]
            if (
              ex.Answers[id] >= this.filterExam[`from_${id}`] &&
              ex.Answers[id] <= this.filterExam[`to_${id}`]
            ) {
              return (isNoticed = true)
            }
          })
          return isNoticed
        })
      } else {
        this.examiners = this.examinersList
      }
    },
    getExamPres(val, fullMark) {
      if (fullMark > 0) {
        return Math.floor((val / fullMark) * 100)
      } else {
        return 0
      }
    },
    getExamById(id) {
      const exam = this.examsBank.find(
        (elm) => Number(elm.Exm_ID) === Number(id)
      )
      if (exam) {
        return exam
      } else {
        return id
      }
    },
    saveManualCustomExam() {
      const exams = Object.fromEntries(
        Object.entries(this.examsVal).filter(([key, elm]) => elm)
      )
      if (Object.keys(exams).length > 0) {
        this.examLoading = true
        this.$store
          .dispatch('Exam/saveManualCustomExam', {
            exams,
            id: this.currentSelectedExaminer.id,
          })
          .then(() => {
            this.currentSelectedExaminer = null
            this.exams = []
            this.examsVal = []
          })
          .finally(() => {
            this.examLoading = false
          })
      }
    },
    removeExamAns() {
      this.currentDeleteLoading = true
      this.$store
        .dispatch('Exam/again', { national_id: this.currentDelete.national_id })
        .then(() => {
          this.$store.commit('Notifications/setNotification', {
            text: 'تم الحذف بنجاح',
            color: 'success',
          })
          const index = this.examiners.findIndex(
            (elm) => elm.id === this.currentDelete.id
          )
          this.examiners[index]._count.Answers = 0
          this.currentDelete = null
          this.currentDeleteLoading = false
        })
        .catch((ex) => {
          this.$store.commit('Notifications/setNotification', {
            text: 'هناك مشكلة في الحذف',
            color: 'error',
          })
        })
        .finally(() => {
          this.currentDeleteLoading = false
        })
    },
    setFilter(filter, value) {
      this.filters[filter] = value
      this.fetchExaminers(true)
    },
    async saveF() {
      await this.$axios.post('/api/saveFake', {
        examinerId: this.selectedExaminer[0].id,

        ans: this.ans,
      })
    },
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
      if (this.nafsy) this.options.nafsy = this.nafsy

      this.loading = true
      if (this.deleteItems) {
        this.options.deleteItems = this.deleteItems
      } else {
        delete this.options.deleteItems
      }
      await this.$store
        .dispatch(`Examiner/getExaminers`, {
          search: this.search,
          ...this.filters,
          ...this.options,
        })
        .then((res) => {
          this.examiners = res.data.examiners
          this.examinersList = res.data.examiners
          this.allExaminers = res.data.allExaminers
          this.headers = [...this.headers]
          if (this.examiners && this.examiners.length > 0) {
            if (this.examiners[0].Answers) {
              this.examiners.forEach((element, index) => {
                Object.keys(element.Answers).forEach((k) => {
                  const ex = this.getExamById(k)

                  this.examiners[index].Answers[k] = this.getExamPres(
                    element.Answers[k],
                    ex.fullMark
                  )
                  if (this.headers.findIndex((e) => e.id === k) === -1) {
                    this.headers.push({
                      text: ex.Exm_Name,
                      id: k,
                      align: 'center',
                      value: `Answers`,
                      hide: false,
                      sortable: false,
                    })
                  }
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
    readUnitsFromMdb() {
      this.readUnitsLoading = true
      this.$store
        .dispatch(`Examiner/readUnitsFromMdb`)
        .then((res) => {
          this.$store.commit('Notifications/setNotification', {
            text: res.data,
            color: 'success',
          })
        })
        .catch((rej) => {
          this.$store.commit('Notifications/setNotification', {
            text: 'حدث خطأ. من فضلك تأكد من اسم ملف ال mdb هو (TNZ_GEHA_CODE.mdb) و اسماء الاعمده في الملف هي (UNIT_NAME,TAMARKZ_NAME,ARMY_TAGNEED_NAME,MIL_NO,GEHA_NAME,RAKMSOLASY)',
            color: 'error',
          })
        })
        .finally((a) => {
          this.readUnitsLoading = false
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

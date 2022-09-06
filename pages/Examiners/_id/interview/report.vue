<template>
  <div v-if="form && !fLoading" class="pa-5">
    <div>
      <div
        class="text-center text-decoration-underline body-2 font-weight-bold"
        style="margin-bottom: -1rem"
      >
        سري
      </div>
      <div class="d-flex justify-space-between mb-3">
        <div
          class="text-justify font-weight-bold body-2"
          style="line-height: 20px"
        >
          وزارة الدفــــــــــــــــــــــــــــــــــــــــاع<br />
          هيئة التنظيم و الادارة للقوات المسلحة<br />
          فرع الانتقاء والتوجيــــــــــــــــــــــــــه
          <div>القيد : 6 / 2 / 512 / &nbsp;&nbsp; 20</div>
          <div>التاريخ : {{ $localeDate() }}</div>
        </div>

        <div class="d-flex flex-column align-center">
          <v-avatar :size="100" class="mb-2">
            <v-img src="/logo.png"></v-img>
          </v-avatar>
          <div class="font-weight-bold body-2">عدد المرفقات ( &nbsp;)</div>
        </div>
      </div>
      <div
        class="title font-weight-black text-center text-decoration-underline"
        style="flex: 1; margin-top: -5rem"
      >
        التقرير النفسي لدراسة الحالة
      </div>
      <div class="mt-10">
        <table-content
          class="mb-5"
          title="البيانات الاساسية :-"
          :content="basicData"
        ></table-content>
        <table-content
          class="mb-5"
          title="البيانات الاجتماعيه :-"
          :content="socialData"
        ></table-content>
        <table-content
          class="mb-5"
          title="معلومات تمهيدية  :-"
          :content="extraData"
        ></table-content>
        <table-content
          class="mb-5"
          title="المظهر و السلوك  :-"
          :content="reactions"
        ></table-content>
        <table-content
          class="mb-5"
          title="المشكلات المعرفية  :-"
          :content="abilityProblems"
        ></table-content>
        <table-content
          v-if="examiner"
          class="mb-5"
          title="نتائج الاختبارات  :-"
          :content="examiner.Answers"
        ></table-content>
        <div v-if="form.transReason">
          <table-title class="ml-2">سبب الاحالة :- </table-title>
          <p>{{ getTextByValue('transReason', form.transReason) }}</p>
        </div>
        <div v-if="form.complaint_f">
          <table-title> الشكوي كما ذكرها المجند بالمركز :- </table-title>
          <p>{{ form.complaint }}</p>
        </div>
        <div v-if="form.complaint_f">
          <table-title> الشكوي كما ذكرها المجند بالفرع :- </table-title>
          <p>{{ form.complaint_f }}</p>
        </div>

        <div v-if="form.interviewer_opinion">
          <table-title>الدلالات التشخيصية :- </table-title>
          <p>{{ form.interviewer_opinion }}</p>
        </div>
        <div v-if="form.final_opinion">
          <table-title> الدلالات التشخيصية من المركز :- </table-title>
          <p>{{ form.final_opinion }}</p>
        </div>

        <div v-if="form.examiner_status">
          <table-title> موقف المجند من المركز :- </table-title>
          <p>{{ form.examiner_status }}</p>
        </div>
        <template v-if="examiner">
          <div v-if="examiner">
            <table-title>المركز :- </table-title>
            <p>{{ getName(examiner.user_id) }}</p>
          </div>
          <div v-if="examiner.UNIT_NAME">
            <table-title>اسم الوحدة :- </table-title>
            <p>{{ examiner.UNIT_NAME }}</p>
          </div>
          <div v-if="examiner">
            <table-title>امتحن مرتين :- </table-title>
            <p>{{ examiner.again ? 'نعم' : 'لا' }}</p>
          </div>
        </template>
        <div v-if="form.recommendation_summary">
          <table-title> التوصية :- </table-title>
          <p>{{ form.recommendation_summary }}</p>
        </div>
        <div v-if="form.recommendation_res">
          <table-title> نتيجة التوصية :- </table-title>
          <p>
            {{ getTextByValue('recommendation_res', form.recommendation_res) }}
          </p>
        </div>

        <div v-if="form.interviewer" class="d-flex">
          <table-title class="ml-2"> القائم بالمقابلة :- </table-title>
          <p>{{ form.interviewer }}</p>
        </div>
        <div class="d-flex justify-space-between mt-5" :contenteditable="true">
          <div class="font-weight-bold">
            <div>التوقيع /</div>
            <div>{{ signture.second.name }}</div>
            <div>{{ signture.second.position }}</div>
          </div>
          <div class="font-weight-bold">
            <div>التوقيع /</div>
            <div>{{ signture.manager.name }}</div>
            <div>{{ signture.manager.position }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="fLoading" class="d-flex justify-center align-center">
      <v-progress-circular indeterminate color="primary" />
    </div>
  </div>
</template>

<script>
import signture from '../../../../assets/fixed-signature-text.json'
import tableContent from '~/components/examiners/interview/tableContent.vue'
import TableTitle from '~/components/examiners/interview/tableTitle.vue'

export default {
  name: 'InterviewReport',
  components: { tableContent, TableTitle },
  layout: 'printing',
  data() {
    return {
      form: null,
      fLoading: false,
      grades: [],
      signture: signture.signture,
      examiner: null,
    }
  },

  computed: {
    examsBank() {
      return this.$store.getters['Exam/exams']
    },
    helperData() {
      return this.$store.getters['HelperData/helperData']
    },

    users() {
      return this.$store.getters['User/users']
    },

    basicData() {
      /* eslint-disable camelcase */
      const { sold_id, name, national_id, marital_state, educational_degree } =
        this.form
      let year = national_id[1] + '' + national_id[2]
      year = Number(national_id[1]) === 0 ? 20 + year : 19 + year
      const month = national_id[3] + '' + national_id[4]
      year = new Date().getFullYear() - year
      year = month > new Date().getMonth() ? year - 1 : year

      return {
        'الرقم العسكري': sold_id,
        الاسم: name,
        السن: year,
        'الحالة الاجتماعية': marital_state,
        'المؤهل الدراسي': educational_degree,
      }
    },
    socialData() {
      const {
        parent_job,
        siblings_num,
        half_brothers,
        order_brothers,
        parent_rel,
        family_relation,
        rel_between_parents,
        family_income,
        personal_medical,
        family_medical,
      } = this.form

      return {
        'وظيفة الوالد': parent_job,
        'عدد الاخوات اشقاء': siblings_num,
        'عدد الاخوات غير اشقاء': half_brothers,
        'ترتيبه بين اخواته': order_brothers,
        'الحالة الاجتماعية للوالدين': this.getTextByValue(
          'parent_rel',
          parent_rel
        ),
        'علاقته بالاسره': family_relation,
        'صلة قرابة بين الوالدين': this.getTextByValue(
          'yesNo',
          rel_between_parents
        ),
        'المستوي الاقتصادي للاسره': this.getTextByValue(
          'family_income',
          family_income
        ),
        'تاريخ مرضي شخصي': this.getTextByValue('yesNo', personal_medical),
        'تاريخ مرضي عائلي': this.getTextByValue('yesNo', family_medical),
      }
    },

    extraData() {
      /* eslint-disable camelcase */
      const {
        medicine_type,
        has_medical_history,
        hospital_name,
        drugs_history,
        drug_type,
        appetite,
        sleeping,
        smoking,
        prayer,
      } = this.form
      let out = {
        'تعاطي ادوية': medicine_type,
        'سبق عرضه علي  أي مست/عياده': has_medical_history,
      }
      if (has_medical_history === 'نعم') {
        out['اسم المست/العيادة'] = hospital_name
      }
      out = { ...out, 'لديه خبره بتعاطي مواد مخدره': drugs_history }
      if (drugs_history === 'نعم') {
        out['نوع المخدر'] = drug_type
      }
      out = {
        ...out,
        'الشهية للطعام': this.getTextByValue('appetite', appetite),
        النوم: this.getTextByValue('sleeping', sleeping),
        مدخن: this.getTextByValue('smoking', smoking),
        الصلاه: this.getTextByValue('prayer', prayer),
      }

      return out
    },
    reactions() {
      /* eslint-disable camelcase */

      const { appearance, speaking_disorder, mood, moving, faceExprission } =
        this.form

      return {
        'المظهر الاجتماعي': appearance,
        'اضطراب الكلام': speaking_disorder,
        'الحالة المزاجية': mood,
        الحركة: this.getTextByValue('moving', moving),
        'تعبيرات الوجه': this.getTextByValue('faceExprission', faceExprission),
      }
    },
    abilityProblems() {
      /* eslint-disable camelcase */

      const {
        focus_ability,
        timeAware,
        situationAware,
        judgeAbility,
        awareDisorder,
        thinkDisorder,
      } = this.form

      return {
        'القدرة على التركيز و الانتباه': focus_ability,
        'مدرك للزمان والمكان والاشخاص': this.getTextByValue(
          'timeAware',
          timeAware
        ),
        'مستبصر بموقفه الحالي': this.getTextByValue(
          'situationAware',
          situationAware
        ),
        'قدرته علي الحكم علي الامور': this.getTextByValue(
          'judgeAbility',
          judgeAbility
        ),
        'اضطراب بالادراك': this.getTextByValue('awareDisorder', awareDisorder),
        'اضطراب بالتفكير': this.getTextByValue('thinkDisorder', thinkDisorder),
      }
    },
  },

  created() {
    this.fLoading = true
    this.$store
      .dispatch('Examiner/getExaminers', {
        search: this.$route.params.id,
        withResult: 1,
        nafsy: 1,
      })
      .then((res) => {
        this.examiner = res.data.examiners[0]
        if (this.examiner.Answers) {
          const newAns = {}
          Object.keys(this.examiner.Answers).forEach((k) => {
            const ex = this.getExamById(k)
            newAns[ex.Exm_Name] = this.getExamPercentage(
              this.examiner.Answers[k],
              ex.fullMark
            )
          })
          this.examiner.Answers = { ...newAns }
        }
      })

    this.$store
      .dispatch('Interview/getInterview', { id: this.$route.params.id })
      .then((res) => {
        if (res.data) {
          const interview = res.data.Interview
          delete res.data.Interview
          this.form = Object.assign(
            res.data,
            interview.length > 0 ? interview[0] : null
          )
        }
      })
      .catch((er) => {
        console.log(er)
      })
      .finally(() => {
        this.fLoading = false
      })
  },
  beforeMount() {
    if (this.users?.length < 1) this.$store.dispatch('User/getUsers')
    if (this.examsBank?.length < 1)
      this.$store.dispatch('Exam/getExams').then((res) => {
        this.$store.commit('Exam/setExams', res.data)
      })
  },
  methods: {
    getName(id) {
      if (!isNaN(id))
        return this.users.find((elm) => elm.Cat_ID === Number(id))?.Cat_Name
      else {
        return id
      }
    },
    getExamPercentage(val, fullMark) {
      console.log(val, fullMark)
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
    getTextByValue(arr, val) {
      const item = this.helperData[arr].find((elm) => elm.value === Number(val))
      if (item) {
        return item.text
      }
      return ''
    },
    print() {
      this.$setLocal('repTitle', this.$refs.repTitle.innerText, false, true)
      print()
    },
  },
}
</script>

<style></style>

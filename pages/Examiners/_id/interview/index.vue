<template>
  <v-form ref="form" v-model="valid">
    <div class="d-flex justify-space-between align-center">
      <v-card-title class="display-1 text-center">{{
        permissions.admin.includes(user.type)
          ? 'المقابة الاكلينيكية'
          : 'المقابلة الشخصية'
      }}</v-card-title>

      <v-btn
        color="primary"
        :to="`/Examiners/${$route.params.id}/interview/report?withDeg=${withDeg}`"
        >استخراج التقرير</v-btn
      >
      <v-checkbox
        v-model="withDeg"
        :true-value="1"
        :false-value="0"
        label="بالدرجات"
      ></v-checkbox>
    </div>

    <v-container v-if="!fLoading" fluid>
      <v-row justify="center">
        <v-expansion-panels v-model="openPanel" accordion focusable mandatory>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-card-title>البيانات الاساسية</v-card-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-text-field
                    v-model="form.sold_id"
                    outlined
                    color="primary"
                    label="الرقم العسكري"
                    placeholder="0000000000000"
                    counter="13"
                    maxlength="13"
                    readonly
                    :rules="required"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-text-field
                    v-model="form.national_id"
                    outlined
                    color="primary"
                    label="الرقم القومي"
                    placeholder="00000000000000"
                    counter="14"
                    maxlength="14"
                    readonly
                    :rules="required"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-text-field
                    v-model="form.name"
                    outlined
                    color="primary"
                    label="الاسم"
                    readonly
                    :rules="required"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-text-field
                    :value="age"
                    outlined
                    color="primary"
                    label="السن"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-select
                    v-model="form.marital_state"
                    :items="helperData.marital_states"
                    outlined
                    label="الحالة الاجتماعيه"
                    :rules="required"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-text-field
                    v-model="form.educational_degree"
                    outlined
                    color="primary"
                    label="المؤهل الدراسي"
                    :rules="required"
                  ></v-text-field>
                </v-col>

                <v-col
                  v-if="permissions.admin.includes(user.type)"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-select
                    v-model="form.transReason"
                    :items="helperData.transReason"
                    outlined
                    label="سبب الاحالة"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-menu
                    v-model="menu2"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template #activator="{ on, attrs }">
                      <v-text-field
                        v-model="form.historyDate"
                        label="تاريخ المرض"
                        prepend-inner-icon="mdi-calendar"
                        readonly
                        outlined
                        v-bind="attrs"
                        :rules="required"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="form.historyDate"
                      @input="menu2 = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-text-field
                    v-model="form.stage"
                    outlined
                    color="primary"
                    label="المرحله"
                    readonly
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-card-title>البيانات الاجتماعيه</v-card-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-text-field
                    v-model="form.parent_job"
                    outlined
                    color="primary"
                    label="وظيفة الوالد"
                    :rules="required"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-text-field
                    v-model.number="form.siblings_num"
                    outlined
                    type="number"
                    color="primary"
                    label=" عدد الاخوات اشقاء"
                    minlength="1"
                    :rules="required"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-text-field
                    v-model.number="form.half_brothers"
                    outlined
                    type="number"
                    color="primary"
                    label=" عدد الاخوات غير اشقاء"
                    minlength="0"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-text-field
                    v-model.number="form.order_brothers"
                    outlined
                    type="number"
                    color="primary"
                    label="ترتيبه بين اخواته"
                    minlength="1"
                    :rules="required"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-select
                    v-model="form.parent_rel"
                    outlined
                    color="primary"
                    label="الحالة الاجتماعية للوالدين"
                    :rules="required"
                    :items="helperData.parent_rel"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-combobox
                    v-model="form.family_relation"
                    outlined
                    color="primary"
                    label="علاقته بالاسره"
                    :rules="required"
                    :items="helperData.family_relation"
                  ></v-combobox>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-select
                    v-model="form.rel_between_parents"
                    outlined
                    color="primary"
                    label="صلة قرابة بين الوالدين"
                    :items="helperData.yesNo"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-select
                    v-model="form.family_income"
                    outlined
                    color="primary"
                    label="المستوي الاقتصادي للاسره"
                    :items="helperData.family_income"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-select
                    v-model="form.personal_medical"
                    outlined
                    color="primary"
                    label="تاريخ مرضي شخصي"
                    :items="helperData.yesNo"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-select
                    v-model="form.family_medical"
                    outlined
                    color="primary"
                    label="تاريخ مرضي عائلي"
                    :items="helperData.yesNo"
                  ></v-select>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="permissions.admin.includes(user.type)">
            <v-expansion-panel-header>
              <v-card-title>معلومات تمهيدية</v-card-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-select
                    v-model="form.medicine_type"
                    :items="medicine_type"
                    outlined
                    label="تعاطي ادوية"
                    :rules="required"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-select
                    v-model="form.has_medical_history"
                    :items="has_medical_history"
                    :rules="required"
                    outlined
                    label="سبق عرضه علي  أي مست/عياده"
                  ></v-select>
                </v-col>
                <v-col
                  v-show="form.has_medical_history == 'نعم'"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-text-field
                    v-model="form.hospital_name"
                    :rules="form.has_medical_history == 'نعم' ? required : []"
                    outlined
                    color="primary"
                    label="اسم المست/العيادة"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-select
                    v-model="form.drugs_history"
                    :items="has_medical_history"
                    outlined
                    :rules="required"
                    label="لديه خبره بتعاطي مواد مخدره"
                  ></v-select>
                </v-col>
                <v-col
                  v-show="form.drugs_history == 'نعم'"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-text-field
                    v-model="form.drug_type"
                    :rules="form.drugs_history == 'نعم' ? required : []"
                    outlined
                    color="primary"
                    label="نوع المخدر"
                  ></v-text-field>
                </v-col>

                <v-col
                  v-if="permissions.admin.includes(user.type)"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-select
                    v-model="form.appetite"
                    :items="helperData.appetite"
                    outlined
                    label="الشهية للطعام"
                  ></v-select>
                </v-col>
                <v-col
                  v-if="permissions.admin.includes(user.type)"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-select
                    v-model="form.sleeping"
                    :items="helperData.sleeping"
                    outlined
                    label="النوم"
                  ></v-select>
                </v-col>
                <v-col
                  v-if="permissions.admin.includes(user.type)"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-select
                    v-model="form.smoking"
                    :items="helperData.smoking"
                    outlined
                    label="مدخن"
                  ></v-select>
                </v-col>
                <v-col
                  v-if="permissions.admin.includes(user.type)"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-select
                    v-model="form.prayer"
                    :items="helperData.prayer"
                    outlined
                    label="الصلاه"
                  ></v-select>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-card-title>الشكوي</v-card-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-textarea
                v-model="form.complaint"
                outlined
                color="primary"
                label="الشكوي كما ذكرها المجند (مركز)"
                rows="8"
                :rules="required"
              ></v-textarea>
              <v-textarea
                v-if="permissions.admin.includes(user.type)"
                v-model="form.complaint_f"
                outlined
                color="primary"
                label="الشكوي كما ذكرها المجند (فرع)"
                rows="8"
              ></v-textarea>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-card-title>المظهر و السلوك</v-card-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-select
                    v-model="form.appearance"
                    :items="helperData.appearance"
                    outlined
                    label="المظهر الاجتماعي"
                    :rules="required"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-select
                    v-model="form.speaking_disorder"
                    :items="speaking_disorder"
                    outlined
                    label="اضطراب الكلام"
                    :rules="required"
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-select
                    v-model="form.mood"
                    :items="helperData.mood"
                    outlined
                    label="الحالة المزاجية"
                    :rules="required"
                  ></v-select>
                </v-col>
                <v-col
                  v-if="permissions.admin.includes(user.type)"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-select
                    v-model="form.moving"
                    :items="helperData.moving"
                    outlined
                    label="الحركة"
                  ></v-select>
                </v-col>
                <v-col
                  v-if="permissions.admin.includes(user.type)"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-select
                    v-model="form.faceExprission"
                    :items="helperData.faceExprission"
                    outlined
                    label="تعبيرات الوجه"
                  ></v-select>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-card-title>المشكلات المعرفية</v-card-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" sm="6" md="6" lg="4" xl="3">
                  <v-select
                    v-model="form.focus_ability"
                    :items="helperData.focus_ability"
                    outlined
                    label="القدرة على التركيز و الانتباه"
                    :rules="required"
                  ></v-select>
                </v-col>

                <v-col
                  v-if="permissions.admin.includes(user.type)"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-select
                    v-model="form.timeAware"
                    :items="helperData.timeAware"
                    outlined
                    label="مدرك للزمان والمكان والاشخاص"
                  ></v-select>
                </v-col>
                <v-col
                  v-if="permissions.admin.includes(user.type)"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-select
                    v-model="form.situationAware"
                    :items="helperData.situationAware"
                    outlined
                    label="مستبصر بموقفه الحالي"
                  ></v-select>
                </v-col>
                <v-col
                  v-if="permissions.admin.includes(user.type)"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-select
                    v-model="form.judgeAbility"
                    :items="helperData.judgeAbility"
                    outlined
                    label="قدرته علي الحكم علي الامور"
                  ></v-select>
                </v-col>
                <v-col
                  v-if="permissions.admin.includes(user.type)"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-select
                    v-model="form.awareDisorder"
                    :items="helperData.awareDisorder"
                    outlined
                    label="اضطراب بالادراك"
                  ></v-select>
                </v-col>
                <v-col
                  v-if="permissions.admin.includes(user.type)"
                  cols="12"
                  sm="6"
                  md="6"
                  lg="4"
                  xl="3"
                >
                  <v-select
                    v-model="form.thinkDisorder"
                    :items="helperData.thinkDisorder"
                    outlined
                    label="اضطراب بالتفكير"
                  ></v-select>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header>
              <v-card-title>رأي القائم بالمقابله (مركز)</v-card-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" sm="12" md="6" lg="4">
                  <v-select
                    v-model="form.final_opinion"
                    :items="final_opinion"
                    outlined
                    :rules="required"
                    label="رأي القائم بالمقابلة"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="12" md="6" lg="4">
                  <v-select
                    v-model="form.examiner_status"
                    :items="examiner_status[form.final_opinion]"
                    outlined
                    :rules="required"
                    label="موقف المجند"
                  ></v-select>
                </v-col>
                <v-col
                  v-show="form.final_opinion == final_opinion[0]"
                  cols="12"
                  sm="12"
                  md="12"
                  lg="4"
                >
                  <v-select
                    v-model="form.final_hospital_result"
                    :items="
                      form.examiner_status === 'عرض مست طبي'
                        ? final_hospital_result.filter((x) => x !== 'رفت نفسي')
                        : final_hospital_result.filter((x) => x !== 'رفت طبي')
                    "
                    outlined
                    label="نتيجة العرض علي المست"
                    :rules="
                      form.final_opinion == final_opinion[0] ? required : []
                    "
                  ></v-select>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="permissions.admin.includes(user.type)">
            <v-expansion-panel-header>
              <v-card-title>رأي القائم بالمقابله (فرع)</v-card-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.interviewer_opinion"
                    outlined
                    color="primary"
                    label="رأي القائم بالمقابله"
                    rows="8"
                  ></v-textarea>
                  <v-select
                    v-model="interviewerOpinionSelect"
                    :items="helperData.endfa"
                    label="الاندفاعية"
                    multiple
                    outlined
                  >
                    <template #selection="{ item }">
                      <v-chip x-small color="primary">{{
                        item
                      }}</v-chip></template
                    >
                  </v-select>
                  <v-divider></v-divider>
                  <v-select
                    v-model="interviewerOpinionSelect"
                    :items="helperData.shchezo"
                    label="الفصــــــاميه"
                    multiple
                    outlined
                  >
                    <template #selection="{ item }">
                      <v-chip x-small color="primary">{{
                        item
                      }}</v-chip></template
                    >
                  </v-select>
                  <v-divider></v-divider>

                  <v-select
                    v-model="interviewerOpinionSelect"
                    :items="helperData.depression"
                    label="الإكــــتئابيه "
                    multiple
                    outlined
                  >
                    <template #selection="{ item }">
                      <v-chip x-small color="primary">{{
                        item
                      }}</v-chip></template
                    >
                  </v-select>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel v-if="permissions.admin.includes(user.type)">
            <v-expansion-panel-header>
              <v-card-title>التوصيه و نتيجة التوصيه</v-card-title>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="form.recommendation"
                    :items="helperData.recommendation"
                    outlined
                    label="التوصية"
                    :rules="form.interviewer_opinion ? required : []"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="form.recommendation_res"
                    :items="helperData.recommendation_res"
                    outlined
                    label="نتيجة التوصية"
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.recommendation_summary"
                    outlined
                    color="primary"
                    label="ملخص التوصيه"
                    rows="4"
                  ></v-textarea>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="form.interviewer"
                    outlined
                    color="primary"
                    label="القائم بالمقابله"
                    :rules="form.interviewer_opinion ? required : []"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-card class="focusedCard">
          <v-card-text>
            <v-btn color="primary" :loading="loading" @click="save()"
              >حفظ التغيرات <v-icon>mdi-content-save-outline</v-icon>
            </v-btn>
            <v-btn class="mx-4" color="error" to="/ExaminerManager"
              >رجوع <v-icon>mdi-arrow-left</v-icon></v-btn
            >
          </v-card-text>
        </v-card>
      </v-row>
    </v-container>
    <div v-else class="d-flex justify-center">
      <v-progress-circular indeterminate></v-progress-circular>
    </div>
  </v-form>
</template>

<script>
import validation from '~/mixins/validation'

export default {
  name: 'InterviewPage',
  mixins: [validation],
  data() {
    return {
      withDeg: 0,
      valid: false,
      menu2: false,
      openPanel: 0,
      interval: null,
      form: {
        id: 0,
        national_id: null,
        name: null,
        stage: null,
        sold_id: null,
        qualification_code: null,
        marital_state: null,
        educational_degree: null,
        parent_job: null,
        siblings_num: null,
        parent_rel: null,
        family_relation: null,
        complaint: null,
        appearance: null,
        focus_ability: null,
        mood: null,
        speaking_disorder: null,
        medicine_type: '',
        has_medical_history: 'لا',
        hospital_name: null,
        drugs_history: '',
        drug_type: null,
        final_opinion: null,
        examiner_status: null,
        final_hospital_result: '',
        order_brothers: 1,
        half_brothers: 0,
        rel_between_parents: null,
        personal_medical: null,
        family_medical: null,
        family_income: null,
        updated_at: null,
        complaint_f: null,
        transReason: null,
        moving: null,
        faceExprission: null,
        timeAware: null,
        situationAware: null,
        judgeAbility: null,
        awareDisorder: null,
        thinkDisorder: null,
        appetite: null,
        sleeping: null,
        smoking: null,
        prayer: null,
        interviewer_opinion: null,
        recommendation: null,
        recommendation_res: null,
        recommendation_summary: null,
        interviewer: null,
        historyDate: new Date(
          Date.now() - new Date().getTimezoneOffset() * 60000
        )
          .toISOString()
          .substr(0, 10),
      },
      loading: false,
      fLoading: false,
      interviewerOpinionSelect: [],
      speaking_disorder: [
        'معتدل',
        'كثير الكلام',
        'قليل الكلام',
        'ضحك بدون سبب',
      ],
      lastOpinionSelectedState: [],
      medicine_type: ['لا يوجد', 'نفسية', 'علاجية'],
      has_medical_history: ['نعم', 'لا'],
      focusCard: null,
      final_opinion: [
        'عرضه علي المست من قبل المركز',
        'عرضه علي فرع الانتقاء و التوجيه',
        'لا يعاني من اي مشاكل',
      ],
      examiner_status: {
        'عرضه علي المست من قبل المركز': ['عرض مست طبي', 'عرض مست نفسي'],
        'عرضه علي فرع الانتقاء و التوجيه': [
          'لائق',
          'لا يوجد',
          'غياب',
          'ترحيل',
          'عرض مست طبي',
          'عرض مست نفسي',
        ],
        'لا يعاني من اي مشاكل': ['لائق'],
      },
      final_hospital_result: [
        'لا يوجد',
        'عودة للوحدة',
        'علاج و عودة للوحدة',
        'رفت طبي',
        'رفت نفسي',
      ],
    }
  },
  computed: {
    helperData() {
      return this.$store.getters['HelperData/helperData']
    },
    user() {
      return this.$store.getters['User/user']
    },

    permissions() {
      return this.$store.getters['User/permissions']
    },
    age() {
      let year = this.form.national_id[1] + '' + this.form.national_id[2]
      year = Number(this.form.national_id[1]) === 0 ? 20 + year : 19 + year
      const month = this.form.national_id[3] + '' + this.form.national_id[4]
      year = new Date().getFullYear() - year
      year = month > new Date().getMonth() ? year - 1 : year
      return year
    },
  },
  watch: {
    interviewerOpinionSelect(val, oldVal) {
      if (val[val.length - 1]) {
        if (!this.form.interviewer_opinion.includes(val[val.length - 1])) {
          this.form.interviewer_opinion += val[val.length - 1] + ' '
        } else {
          this.form.interviewer_opinion = this.form.interviewer_opinion.replace(
            this.getArraysDifference(val, oldVal),
            ''
          )
        }
      } else {
        this.form.interviewer_opinion = this.form.interviewer_opinion.replace(
          this.getArraysDifference(val, oldVal),
          ''
        )
      }
    },
    'form.recommendation'(val) {
      if (val)
        this.form.recommendation_summary = this.helperData.recommendation.find(
          (elm) => elm.value === val
        ).comment
    },
  },
  created() {
    this.fLoading = true

    this.interval = setInterval(() => {
      this.openPanel += 1
      if (this.openPanel > 7) {
        this.openPanel = 0
        clearInterval(this.interval)
      }
    }, 0)

    this.$store
      .dispatch('Interview/getInterview', { id: this.$route.params.id })
      .then((res) => {
        if (res.data) {
          const interview = res.data.Interview
          delete res.data.Interview
          this.form = Object.assign(
            res.data,
            interview.length > 0
              ? interview[0]
              : {
                  id: 0,
                  parent_job: null,
                  siblings_num: null,
                  family_relation: null,
                  parent_rel: null,
                  complaint: null,
                  appearance: null,
                  focus_ability: null,
                  mood: null,
                  speaking_disorder: null,
                  medicine_type: '',
                  has_medical_history: 'لا',
                  hospital_name: null,
                  drugs_history: '',
                  drug_type: null,
                  final_opinion: null,
                  examiner_status: null,
                  final_hospital_result: '',
                  order_brothers: 1,
                  half_brothers: 0,
                  rel_between_parents: null,
                  personal_medical: null,
                  family_medical: null,
                  family_income: null,
                  updated_at: null,
                  complaint_f: null,
                  transReason: null,
                  moving: null,
                  faceExprission: null,
                  timeAware: null,
                  situationAware: null,
                  judgeAbility: null,
                  awareDisorder: null,
                  thinkDisorder: null,
                  appetite: null,
                  sleeping: null,
                  smoking: null,
                  prayer: null,
                  interviewer_opinion: null,
                  recommendation: null,
                  recommendation_res: null,
                  recommendation_summary: null,
                  interviewer: null,
                  historyDate: new Date(
                    Date.now() - new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .substr(0, 10),
                }
          )
        }
      })
      .catch((er) => {
        throw er
      })
      .finally(() => {
        this.fLoading = false
      })
  },
  methods: {
    getArraysDifference(a1, a2) {
      return a2.filter((a2elem) => !a1.includes(a2elem))
    },

    save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$store
          .dispatch('Interview/saveInterview', this.form)
          .then(() => {
            this.$store.commit('Notifications/setNotification', {
              text: 'تم الحفظ بنجاح',
              color: 'success',
            })
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$store.commit('Notifications/setNotification', {
          text: 'أكمل البيانات',
          color: 'error',
        })
      }
    },
  },
}
</script>

<style>
.focusedCard {
  margin-bottom: 8px;
}
.focusedCard:hover {
  transform: scale(1.01);
  transition: transform 0.3s ease;
}
.v-expansion-panel-content {
  padding: 15px 0;
}
.v-expansion-panel-header .v-card__title {
  padding: 0;
}
</style>

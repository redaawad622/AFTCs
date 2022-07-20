<template>
  <v-dialog :value="value" persistent max-width="600px">
    <v-card :loading="loading">
      <v-card-title>
        <span class="text-h5">
          {{
            formType == 'add'
              ? 'اضافة اختبار جديد'
              : `تعديل اختنبار ( ${exam.Exm_Name} )`
          }}
        </span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="form.Exm_Name"
                label="اسم الاختبار"
                outlined
                color="primary"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="form.category"
                :items="categories"
                outlined
                label="التصنيف"
                color="primary"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="form.random"
                :items="order"
                label="الترتيب"
                outlined
                color="primary"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="form.Exm_Duration_In_Mins"
                label="مدة الاختبار"
                outlined
                color="primary"
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red darken-1"
          text
          :disabled="loading"
          @click="$emit('input', false)"
        >
          الغاء
        </v-btn>
        <v-btn color="primary" text :loading="loading" @click="saveExam()">
          حفظ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['value', 'exam', 'formType'],

  data() {
    return {
      loading: false,
      form: {
        Exm_Name: '',
        category: '',
        random: '',
        Exm_Duration_In_Mins: '',
      },
    }
  },
  computed: {
    categories() {
      return this.$store.getters['Exam/categories']
    },
    order() {
      return this.$store.getters['Exam/order']
    },
  },
  watch: {
    value(val) {
      if (val && this.exam) {
        if (this.formType === 'edit') {
          this.form.Exm_Name = this.exam.Exm_Name
          this.form.Exm_Duration_In_Mins = this.exam.Exm_Duration_In_Mins
        }
        this.form.category = this.exam.category
        this.form.random = this.exam.random
      } else {
        this.form = {
          Exm_Name: '',
          category: '',
          random: '',
          Exm_Duration_In_Mins: '',
        }
      }
    },
  },

  methods: {
    saveExam() {
      this.loading = true
      this.$store
        .dispatch('Exam/saveOrEditExam', {
          formData: this.form,
          id: this.formType === 'edit' ? this.exam.Exm_ID : 0,
        })
        .then((res) => {
          this.$emit('update', res.data)
        })
        .finally(() => {
          this.loading = false
          this.$emit('input', false)
        })
    },
  },
}
</script>

<style></style>

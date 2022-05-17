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
                label="اسم الاختبار"
                outlined
                color="primary"
                v-model="form.Exm_Name"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-select
                :items="categories"
                v-model="form.category"
                outlined
                label="التصنيف"
                color="primary"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                :items="order"
                v-model="form.random"
                label="الترتيب"
                outlined
                color="primary"
              ></v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="red darken-1"
          text
          @click="$emit('input', false)"
          :disabled="loading"
        >
          الغاء
        </v-btn>
        <v-btn color="primary" text @click="saveExam()" :loading="loading">
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
        if (this.formType === 'edit') this.form.Exm_Name = this.exam.Exm_Name
        this.form.category = this.exam.category
        this.form.random = this.exam.random
      } else {
        this.form = {
          Exm_Name: '',
          category: '',
          random: '',
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

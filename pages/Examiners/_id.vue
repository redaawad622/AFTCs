<template>
  <v-card class="pa-6">
    <v-form ref="form" v-model="valid" lazy-validation>
      <v-text-field
        outlined
        color="primary"
        v-model="form.national_id"
        label="الرقم القومي"
        placeholder="الرقم القومي"
        :rules="national_ru"
        :counter="14"
        :error-messages="serverErr['national_id']"
        append-icon="mdi-star"
        hide-spin-buttons
        type="number"
      ></v-text-field>
      <v-sheet class="d-flex">
        <v-text-field
          v-model="th_num"
          outlined
          color="primary"
          :rules="minMax4"
          class="me-2"
          hide-spin-buttons
          hint="2010"
          :error-messages="serverErr['triple_number']"
          type="number"
        ></v-text-field>
        <span class="display-1 me-2 mt-2">/</span>

        <v-text-field
          v-model="sec_num"
          outlined
          color="primary"
          :rules="min1Max3"
          hide-spin-buttons
          type="number"
          hint="123"
          class="me-2"
          :error-messages="serverErr['triple_number']"
        ></v-text-field>
        <span class="display-1 me-2 mt-2">/</span>
        <v-text-field
          v-model="f_num"
          outlined
          :rules="min1Max4"
          hide-spin-buttons
          type="number"
          hint="1234"
          color="primary"
          :error-messages="serverErr['triple_number']"
        ></v-text-field>
      </v-sheet>

      <v-text-field
        outlined
        color="primary"
        v-model="form.sold_id"
        label="الرقم العسكري"
        placeholder="الرقم العسكري"
        :error-messages="serverErr['sold_id']"
      ></v-text-field>
      <v-text-field
        outlined
        append-icon="mdi-star"
        color="primary"
        v-model="form.name"
        label="الاسم"
        :rules="required"
        :error-messages="serverErr['name']"
        placeholder="الاسم"
      ></v-text-field>
      <v-select
        :items="currentYerars"
        outlined
        color="primary"
        v-model="form.stage"
        append-icon="mdi-star"
        label="المرحلة"
        placeholder="المرحلة"
      ></v-select>
      <v-text-field
        outlined
        color="primary"
        v-model="form.barcode"
        :error-messages="serverErr['barcode']"
        label="الباركود"
        placeholder="الباركود"
      ></v-text-field>
      <v-select
        :items="battaries"
        outlined
        color="primary"
        v-model="form.battary_id"
        item-text="name"
        item-value="id"
        :return-object="false"
        append-icon="mdi-star"
        label="البطارية"
        placeholder="البطارية"
      ></v-select>
      <v-btn color="primary" @click="save()">حفظ</v-btn>
    </v-form>
  </v-card>
</template>

<script>
import validation from '~/mixins/validation'

export default {
  mixins: [validation],
  data: () => {
    return {
      valid: true,
      form: {
        national_id: '',
        triple_number: '',
        name: '',
        stage: '',
        barcode: '',
        sold_id: '',
        battary_id: '',
      },
      f_num: '',
      sec_num: '',
      th_num: '',
      serverErr: [],
    }
  },
  fetch(){
    if(this.$route.params.id && this.$route.params.id !=='new'){
      this.$store.dispatch('Examiner/getEx').then((res)=>{
        // continue from here to get examiner to update it
      })
    }
  },
  computed: {
    currentYerars() {
      const year = new Date().getFullYear()

      return [year + '1', year + '2', year + '3', year + '4']
    },
    battaries() {
      return this.$store.getters['Exam/battaries']
    },
  },
  methods: {
    save() {
      this.serverErr = []
      if (this.$refs.form.validate()) {
        this.loading = true
        if (this.f_num && this.sec_num && this.th_num)
          this.form.triple_number =
            this.f_num + '/' + this.sec_num + '/' + this.th_num

        this.$store
          .dispatch('Examiner/save', this.form)
          .then(() => {
            this.$store.commit('Notifications/setNotification', {
              text: 'تم الحفظ بنجاح',
              color: 'success',
            })
          })
          .catch((rej) => {
            if (rej instanceof Array) {
              this.serverErr = rej
            }
            this.$store.commit('Notifications/setNotification', {
              text: 'خطأ في الحفظ',
              color: 'error',
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
  mounted() {
    const year = new Date().getFullYear()
    this.form.stage = year + '1'
  },
}
</script>

<style></style>

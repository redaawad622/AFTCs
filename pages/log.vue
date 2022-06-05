<template>
  <div>
    <v-card>
      <v-card-title>تصفية النتائج</v-card-title>
      <v-card-text class="d-flex flex-wrap">
        <v-autocomplete
          v-model="filters.user"
          append-icon="mdi-menu-swap"
          outlined
          dense
          placeholder="الجهة"
          label="الجهة"
          cache-items
          :items="logs"
          item-text="user.Cat_Name"
          item-value="user.Cat_Name"
          class="ml-1"
        ></v-autocomplete>
        <v-autocomplete
          v-model="filters.operationType"
          append-icon="mdi-menu-swap"
          outlined
          dense
          placeholder="نوع العملية"
          label="نوع العملية"
          cache-items
          :items="logs"
          item-text="operation_type"
          item-value="operation_type"
          class="ml-1"
        ></v-autocomplete>
        <v-autocomplete
          v-model="filters.type"
          append-icon="mdi-menu-swap"
          outlined
          dense
          placeholder="النوع"
          label="النوع"
          item-text="type"
          item-value="type"
          cache-items
          :items="logs"
          class="ml-1"
        ></v-autocomplete>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template #activator="{ on, attrs }">
            <v-text-field
              v-model="filters.date"
              append-icon="mdi-calendar"
              outlined
              dense
              placeholder="تاريخ العملية"
              label="تاريخ العملية"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="filters.date"
            :active-picker.sync="activePicker"
            min="1950-01-01"
            @change="save"
          ></v-date-picker>
        </v-menu>
      </v-card-text>
    </v-card>
    <v-scale-transition group>
      <v-chip
        v-for="(item, k) in filtersItems"
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
    <v-data-table
      class="my-3 elevation-1"
      :items="logs"
      :headers="headers"
      :options.sync="options"
      :server-items-length="allLogs"
      multi-sort
    >
      <template #[`item.created_at`]="{ item }">{{
        $localeDate(new Date(item.created_at))
      }}</template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'LogActions',
  data() {
    return {
      headers: [
        { text: 'مسلسل', value: 'id' },
        { text: 'رقم منفذ العملية', value: 'user_id' },
        { text: 'اسم منفذ العمليه', value: 'user.Cat_Name', sortable: false },
        { text: 'الوصف', value: 'description' },
        { text: 'نوع العملية', value: 'type' },
        { text: 'تاريخ الانشاء', value: 'created_at' },
      ],
      filters: {
        user: '',
        type: '',
        operationType: '',
        date: null,
      },
      activePicker: null,
      menu: false,
      options: {},
    }
  },

  computed: {
    logs() {
      return this.$store.getters['Log/getLogs']
    },
    allLogs() {
      return this.$store.getters['Log/allLogs']
    },
    filtersItems() {
      const res = Object.fromEntries(
        Object.entries(this.filters).filter(
          ([_, v]) => v != null && (v || v === 0)
        )
      )
      return res
    },
  },
  watch: {
    options: {
      handler() {
        this.fetchLog()
        // this.filterImages()
      },
      deep: true,
      immediate: true,
    },
    filtersItems() {
      this.fetchLog()
    },
    menu(val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
  },

  methods: {
    fetchLog() {
      this.$store.dispatch('Log/fetchLog', { ...this.options, ...this.filters })
    },
    save(date) {
      this.$refs.menu.save(date)
    },
    // filterImages() {
    //   // const path = require('path')

    //   this.$store.dispatch('Log/filterImages', this.options).then((res) => {
    //     const questionId = res.data.Ans_Qus_ID
    //     const answerId = res.data.Ans_ID
    //     const answerImage = res.data.Ans_image
    //     const fs = require('fs');

    //     console.log(questionId)
    //     console.log(answerId)
    //     console.log(answerImage)

    //     this.$store
    //       .dispatch('Log/filterQuestionImages', questionId)
    //       .then((res1) => {
    //         console.log(res1.data)

    //         const data = this.toBase64(answerImage).replace(/^data:image\/\w+;base64,/, '')
    //         const buf = Buffer.from(data, 'base64')
    //         fs.writeFile('image.png', buf /* callback will go here */)
    //         // path.join('D:', '/Images/' + questionId)
    //       })
    //   })
    // },
    // toBase64(arr) {
    //   const base64String = btoa(
    //     arr.data.reduce((data, byte) => data + String.fromCharCode(byte), '')
    //   )
    //   return `data:image/png;base64,${base64String}`
    // },
  },
}
</script>

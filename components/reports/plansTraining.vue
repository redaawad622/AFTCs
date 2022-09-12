<template>
  <div>
    <v-btn min-width="36px" title="تصفية النتائج" @click="openFilter = true">
      اضافة مخطط
    </v-btn>

    <v-bottom-sheet v-model="openFilter" scrollable>
      <v-card min-width="400px" class="pa-4">
        <v-sheet class="d-flex justify-space-between align-center mb-4">
          <v-card-title class="font-weight-black"> اضافة مخطط</v-card-title>
        </v-sheet>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="3" lg="2" xl="1">
              <v-text-field
                v-model.number="plansFilters.expected_high"
                label="المخطط وصوله عليا"
                outlined
                type="number"
                color="primary"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="2" xl="1">
              <v-text-field
                v-model.number="plansFilters.expected_above"
                label="المخطط وصوله فوق متوسط"
                outlined
                type="number"
                color="primary"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="2" xl="1">
              <v-text-field
                v-model.number="plansFilters.expected_middle"
                label="المخطط وصوله متوسط"
                outlined
                type="number"
                color="primary"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="2" xl="1">
              <v-text-field
                v-model.number="plansFilters.expected_usually"
                label="المخطط وصوله عادة"
                outlined
                type="number"
                color="primary"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="2" xl="1">
              <v-text-field
                v-model.number="plansFilters.actual_arrive_high"
                label="ما تم وصوله عليا"
                outlined
                type="number"
                color="primary"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="2" xl="1">
              <v-text-field
                v-model.number="plansFilters.actual_arrive_above"
                label="ما تم وصوله فوق متوسط"
                outlined
                type="number"
                color="primary"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="2" xl="1">
              <v-text-field
                v-model.number="plansFilters.actual_arrive_middle"
                label="ما تم وصوله متوسط"
                outlined
                type="number"
                color="primary"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="2" xl="1">
              <v-text-field
                v-model.number="plansFilters.actual_arrive_usually"
                label="ما تم وصوله عادة"
                outlined
                type="number"
                color="primary"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="2" xl="1">
              <v-autocomplete
                v-model.number="plansFilters.user_id"
                color="primary"
                label="اسم المركز"
                cache-items
                item-value="Cat_ID"
                item-text="Cat_Name"
                :items="users"
                dense
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-btn color="primary" @click="expectedPlanTransaction()"
              >حفظ المخطط</v-btn
            >
          </v-row>
        </v-card-text>
      </v-card>
    </v-bottom-sheet>
  </div>
</template>
<script>
export default {
  name: 'PlansTrainingPage',
  data() {
    return {
      openFilter: false,
      plansFilters: {
        user_id: null,
        expected_high: null,
        expected_above: null,
        expected_middle: null,
        expected_usually: null,
        actual_arrive_high: null,
        actual_arrive_above: null,
        actual_arrive_middle: null,
        actual_arrive_usually: null,
      },
    }
  },
  computed: {
    users() {
      return this.$store.getters['User/users']
    },
    usersList() {
      const userList = {}
      this.users.forEach((elm) => {
        userList[elm.Cat_ID] = elm.Cat_Name
      })
      return userList
    },
  },
  methods: {
    expectedPlanTransaction() {
      this.$store.dispatch('Report/expectedPlanTransaction', this.plansFilters)
    },
  },
}
</script>

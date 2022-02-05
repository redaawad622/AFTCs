<template>
  <div>
       <v-img src="/uploads/b582a8986f25d8d0acebc4066a3b5ecd"></v-img>

    <v-card flat class="mb-5">
      <v-card-text>
        <v-expansion-panels accordion focusable hover>
          <v-expansion-panel>
            <v-expansion-panel-header class="black--text font-weight-bold"
              >المعلومات الاساسية</v-expansion-panel-header
            >
            <v-expansion-panel-content class="pt-3">
              <v-row>
                <v-col sm="12" md="8">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        color="primary"
                        label="الرقم العسكري"
                        placeholder="الرقم العسكري"
                        v-bind="inputStyle"
                        counter
                        v-model="form.millitarynumber"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        color="primary"
                        label="الاسم"
                        placeholder="الاسم"
                        v-bind="inputStyle"
                        v-model="form.name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        color="primary"
                        label="عدد الاولاد"
                        type="number"
                        placeholder="عدد الاولاد"
                        v-bind="inputStyle"
                        v-model="form.childrens"
                        min="0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-select
                        :items="['أعزب', 'متزوج', 'مطلق', 'أرمل']"
                        append-icon="mdi-menu-swap"
                        v-bind="inputStyle"
                        v-model="form.maritalstate"
                        placeholder="الحالة الاجتماعية"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        color="primary"
                        label="تاريخ الميلاد"
                        type="date"
                        placeholder="تاريخ الميلاد"
                        v-bind="inputStyle"
                        :value="
                          new Date(form.birthdate).toISOString().substr(0, 10)
                        "
                        @input="setDate($event, 'birthdate')"
                        min="0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        color="primary"
                        label="الوزن"
                        type="number"
                        placeholder="الوزن"
                        v-bind="inputStyle"
                        v-model="form.weight"
                        min="0"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        color="primary"
                        label="الطول"
                        type="number"
                        placeholder="الطول"
                        v-bind="inputStyle"
                        min="0"
                        v-model="form.height"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        color="primary"
                        label="ارقام التليفون"
                        type="number"
                        counter
                        placeholder="ارقام التليفون"
                        v-bind="inputStyle"
                        min="0"
                        v-model="form.telnum1"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        color="primary"
                        label="ارقام التليفون"
                        type="number"
                        placeholder="ارقام التليفون"
                        v-bind="inputStyle"
                        counter
                        min="0"
                        v-model="form.telnum2"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        color="primary"
                        label="ارقام التليفون"
                        type="number"
                        placeholder="ارقام التليفون"
                        v-bind="inputStyle"
                        counter
                        min="0"
                        v-model="form.telnum3"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        color="primary"
                        label="ارقام التليفون"
                        type="number"
                        placeholder="ارقام التليفون"
                        counter
                        v-bind="inputStyle"
                        min="0"
                        v-model="form.telnum4"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-textarea
                        color="primary"
                        label="العنوان"
                        placeholder="العنوان"
                        v-bind="inputStyle"
                        v-model="form.address"
                        :rows="2"
                      ></v-textarea>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-textarea
                        color="primary"
                        label="ملاحظات"
                        placeholder="ملاحظات"
                        v-bind="inputStyle"
                        v-model="form.notes"
                        :rows="2"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col sm="12" md="4">
                  <v-file-input
                    accept="image/*"
                    style="display: none"
                    ref="im"
                    v-model="form.picture"
                  ></v-file-input>
                  <v-sheet
                    @click="openFile()"
                    style="border: 2px dashed"
                    class="image d-flex justify-center align-center pa-1"
                    width="100%"
                    height="100%"
                  >
                    <img
                      v-if="form.picture"
                      :id="'prevImage'"
                      :src="$getUrl(form.picture, 'prevImage')"
                      style="max-width: 100%; max-height: 100%"
                    />
                    <v-icon v-else x-large>mdi-image-plus</v-icon>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header class="black--text font-weight-bold"
              >معلومات عسكرية</v-expansion-panel-header
            >
            <v-expansion-panel-content class="pt-3">
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    v-bind="inputStyle"
                    placeholder="الوحدة"
                    cache-items
                    :items="helpers.units"
                    item-text="unitname"
                    item-value="unitid"
                    label="الوحدة"
                    v-model="form.unitid"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    v-bind="inputStyle"
                    placeholder="الدرجة"
                    label="الدرجة"
                    cache-items
                    :items="helpers.levels"
                    item-text="level"
                    item-value="levelid"
                    v-model="form.levelid"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    v-bind="inputStyle"
                    placeholder="التخصص"
                    label="التخصص"
                    cache-items
                    :items="helpers.instruments"
                    item-text="instrument"
                    item-value="instrumentid"
                    v-model="form.instrumentid"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    v-bind="inputStyle"
                    placeholder="السلاح"
                    label="السلاح"
                    cache-items
                    :items="helpers.weapons"
                    item-text="weaponname"
                    item-value="weaponid"
                    v-model="form.weaponid"
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="6" md="4">
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    v-bind="inputStyle"
                    placeholder="فرق الادارة"
                    label="فرق الادارة"
                    :disabled="form.weaponid !== 25"
                    :items="helpers.specialTeams"
                    item-text="specialteamname"
                    item-value="specialteamid"
                    v-model="form.specialteamid"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    color="primary"
                    label="رقم الآلة"
                    type="number"
                    placeholder="رقم الآلة"
                    v-bind="inputStyle"
                    min="0"
                    v-model="form.machinenum"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    color="primary"
                    label="تاريخ التطوع"
                    type="date"
                    placeholder="تاريخ التطوع"
                    v-bind="inputStyle"
                    :value="new Date(form.datejoin).toISOString().substr(0, 10)"
                    @input="setDate($event, 'datejoin')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    color="primary"
                    label="تاريخ الانضمام للوحده"
                    type="date"
                    placeholder="تاريخ الانضمام للوحده"
                    v-bind="inputStyle"
                    :value="
                      new Date(form.enteredon).toISOString().substr(0, 10)
                    "
                    @input="setDate($event, 'enteredon')"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-text-field
                    color="primary"
                    label="مدة الخدمة بالوحده"
                    type="number"
                    placeholder="مدة الخدمة بالوحده"
                    :persistent-hint="!!form.periodofservice"
                    :hint="
                      form.periodofservice > 360
                        ? Math.floor(form.periodofservice / 360) +
                          ' سنة  ' +
                          (form.periodofservice % 360) +
                          ' يوما '
                        : form.periodofservice + ' يوم'
                    "
                    v-bind="inputStyle"
                    min="0"
                    v-model="form.periodofservice"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-switch
                    color="primary"
                    @input="setVal"
                    :value="!form.working"
                    label="انهاء خدمه"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header class="black--text font-weight-bold"
              >انضباط و جزاءات</v-expansion-panel-header
            >
            <v-expansion-panel-content class="pt-3">
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    color="primary"
                    label="عدد جزاءات الغياب"
                    type="number"
                    placeholder="عدد جزاءات الغياب"
                    v-bind="inputStyle"
                    min="0"
                    v-model="form.numofabsent"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    color="primary"
                    label="عدد جزاءات السلوك"
                    type="number"
                    placeholder="عدد جزاءات السلوك"
                    v-bind="inputStyle"
                    v-model="form.numofattitude"
                    min="0"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    color="primary"
                    label="عدد المحاكم العسكرية"
                    type="number"
                    placeholder="عدد المحاكم العسكرية"
                    v-bind="inputStyle"
                    min="0"
                    v-model="form.numofmillitary"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6" md="3">
                  <v-text-field
                    color="primary"
                    label="عدد المحاكم المدنية"
                    type="number"
                    placeholder="عدد المحاكم المدنية"
                    v-bind="inputStyle"
                    min="0"
                    v-model="form.numofcivil"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="2">
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    v-bind="inputStyle"
                    placeholder="مدي تنفيذه للاوامر"
                    label="مدي تنفيذه للاوامر"
                    cache-items
                    :items="helpers.grades"
                    item-text="grade"
                    item-value="gradeid"
                    v-model="form.levelobeyid"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="2">
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    v-bind="inputStyle"
                    placeholder="كفاءة تنفيذ العمل"
                    label="كفاءة تنفيذ العمل"
                    cache-items
                    :items="helpers.grades"
                    item-text="grade"
                    item-value="gradeid"
                    v-model="form.dependonid"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="2">
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    v-bind="inputStyle"
                    placeholder="علاقته بقادته"
                    label="علاقته بقادته"
                    cache-items
                    :items="helpers.grades"
                    item-text="grade"
                    item-value="gradeid"
                    v-model="form.relationofficerid"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="2">
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    v-bind="inputStyle"
                    placeholder="مظهره العسكري"
                    label="مظهره العسكري"
                    cache-items
                    :items="helpers.grades"
                    item-text="grade"
                    item-value="gradeid"
                    v-model="form.lookcareid"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    v-bind="inputStyle"
                    placeholder="الإنضباط العسكري"
                    label="الإنضباط العسكري"
                    cache-items
                    :items="helpers.grades"
                    item-text="grade"
                    item-value="gradeid"
                    v-model="form.selfmanageid"
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header class="black--text font-weight-bold"
              >النشاط</v-expansion-panel-header
            >
            <v-expansion-panel-content class="pt-3">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-switch
                    v-model="form.politicalact"
                    label="لديه نشاط سياسي"
                  ></v-switch>
                  <v-switch
                    v-model="form.religionact"
                    label="لديه نشاط ديني"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-header class="black--text font-weight-bold"
              >الحالة الصحية</v-expansion-panel-header
            >
            <v-expansion-panel-content class="pt-3">
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-combobox
                    append-icon="mdi-menu-swap"
                    v-bind="inputStyle"
                    placeholder="الامراض التي يعاني منها"
                    label="الامراض التي يعاني منها"
                    cache-items
                    :items="helpers.diseases"
                    item-text="clinicalstatename"
                    item-value="clinicalstateid"
                    v-model="form.clinicalstateid"
                  ></v-combobox>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    v-bind="inputStyle"
                    placeholder="الحالة الصحية"
                    label="الحالة الصحية"
                    cache-items
                    :items="helpers.grades"
                    item-text="grade"
                    item-value="gradeid"
                    v-model="form.clinicallevelid"
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                  <v-switch
                    color="primary"
                    v-model="form.outclinic"
                    label="خروج طبي"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
      <v-card-actions class="px-4">
        <v-btn @click="saveOne()" :loading="oneLoading" color="primary"
          >حفظ</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-card flat>
      <v-card-text>
        <v-expansion-panels accordion focusable hover>
          <v-expansion-panel>
            <v-expansion-panel-header class="black--text font-weight-bold"
              >عقوبات</v-expansion-panel-header
            >
            <v-expansion-panel-content class="pt-3">
              <v-simple-table>
                <thead>
                  <tr>
                    <th>الجريمة</th>
                    <th>العقوبة</th>
                    <th>من</th>
                    <th>الي</th>
                    <th>معلومات اضافية</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <v-autocomplete
                        append-icon="mdi-menu-swap"
                        v-bind="inputStyle"
                        cache-items
                        :items="helpers.crimeTypes"
                        item-text="crimetypename"
                        item-value="crimetypeid"
                        v-model="form.levelobeyid"
                      ></v-autocomplete>
                    </td>
                    <td>
                      <v-autocomplete
                        append-icon="mdi-menu-swap"
                        v-bind="inputStyle"
                        cache-items
                        :items="helpers.punishmentList"
                        item-text="punishmentname"
                        item-value="punishmentnameid"
                        v-model="form.levelobeyid"
                      ></v-autocomplete>
                    </td>
                    <td>
                      <v-text-field
                        color="primary"
                        type="date"
                        v-bind="inputStyle"
                        v-model="form.datejoin"
                      ></v-text-field>
                    </td>
                    <td>
                      <v-text-field
                        color="primary"
                        type="date"
                        v-bind="inputStyle"
                        v-model="form.datejoin"
                      ></v-text-field>
                    </td>
                    <td>
                      <v-textarea
                        color="primary"
                        v-bind="inputStyle"
                        rows="1"
                      ></v-textarea>
                    </td>
                  </tr>
                </tbody>
              </v-simple-table>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header class="black--text font-weight-bold"
              >الفرق الحاصل عليها</v-expansion-panel-header
            >
            <v-expansion-panel-content class="pt-3">
              <v-row></v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header class="black--text font-weight-bold"
              >المستوي الفني</v-expansion-panel-header
            >
            <v-expansion-panel-content class="pt-3">
              <v-row></v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-header class="black--text font-weight-bold"
              >التنقلات</v-expansion-panel-header
            >
            <v-expansion-panel-content class="pt-3">
              <v-row></v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'editPage',
  data() {
    return {
      oneLoading: false,
      inputStyle: {
        outlined: true,
        clearable: true,
        backgroundColor: '#eee',
        dense: true,
      },
      id: '',
      form: {
        name: '', // done
        birthdate: null, // done
        unitid: '', // done
        levelid: '', // done
        categoryid: null,
        address: '', // done
        millitarynumber: '', // done
        job: null,
        specialteamid: '', // done
        generalteamid: null,
        datejoin: null, // done
        dateleave: '2014-01-17 00:00:00',
        technicalgradeid: null,
        picture: '', // done
        maritalstate: 'أعزب', // done
        childrens: 0, // done
        weight: 0, // done
        height: 0, // done
        weaponid: '', // done
        clinicalstateid: 'لا يوجد', // done,
        notes: null, // done
        instrumentid: '', // done
        dependonid: 6, // done
        levelobeyid: 6, // done
        relationofficerid: 6, // done
        lookcareid: 6, // done
        selfmanageid: 6, // done
        clinicallevelid: 6, // done
        periodofservice: null, // done
        numofabsent: 0, // done
        numofattitude: 0, // done
        numofmillitary: 0, // done
        numofcivil: 0, // done
        outclinic: 0, // done
        hasconcer: 0,
        enteredon: null, // done
        politicalact: 0, // done
        religionact: 0, // done
        machinenum: null, // done
        telnum1: null, // done
        telnum2: null, // done
        telnum3: null, // done
        telnum4: null, // done
        numofyears: 1,
        editedby: 'طارق خليل',
        status_id: null,
        editedbymachine: 'TANZIM-PC',
        working: 1, // done
      },
    }
  },
  computed: {
    helpers() {
      return this.$store.getters.helpers
    },
  },
  async fetch() {
    if (this.$route.params.id && this.$route.params.id !== 'new')
      await this.$axios(`/api/people/${this.$route.params.id}`).then((res) => {
        this.form = res.data
      })
  },
  methods: {
    setVal(v) {
      this.form.working = v
    },
    setDate($e, item) {
      this.form[item] = $e
    },
    openFile() {
      this.$refs.im.$refs.input.click()
    },
    saveOne() {
      this.oneLoading = true
      this.$store
        .dispatch('saveOne', this.$objectToFormData(this.form))
        .finally(() => {
          this.oneLoading = false
        })
    },
  },

  watch: {
    'form.enteredon'(val) {
      const diffTime = Math.abs(new Date() - new Date(val))
      this.form.periodofservice = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    helpers() {
      if (
        this.form.clinicalstateid &&
        !isNaN(this.form.clinicalstateid) &&
        this.helpers.diseases
      ) {
        this.form.clinicalstateid = this.helpers.diseases.find(
          (x) => x.clinicalstateid === this.form.clinicalstateid
        ).clinicalstatename
      }
    },
  },
}
</script>

<style></style>

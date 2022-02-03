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
            <v-btn class="elevation-0" @click="fetchPeople(true)"
              >تصفية النتائج</v-btn
            >
            <v-btn title="طباعة" @click="printRep()" class="elevation-0 ms-2"
              ><v-icon>mdi-printer-outline</v-icon></v-btn
            >
          </div>
          <div>
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
                  <v-list-item-title class="font-weight-black"
                    >تصفية النتائج</v-list-item-title
                  >
                  <v-btn color="primary" @click="fetchPeople(true)" text
                    >تطبيق</v-btn
                  >
                </v-sheet>
                <v-card-text>
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    outlined
                    dense
                    placeholder="الوحدة"
                    label="الوحدة"
                    cache-items
                    :items="helpers.units"
                    item-text="unitname"
                    item-value="unitid"
                    v-model="filters.unit"
                  ></v-autocomplete>
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    outlined
                    dense
                    placeholder="الدرجة"
                    label="الدرجة"
                    cache-items
                    :items="helpers.levels"
                    item-text="level"
                    item-value="levelid"
                    v-model="filters.level"
                  ></v-autocomplete>
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    outlined
                    dense
                    placeholder="تخصص الآلة"
                    label="تخصص الآلة"
                    cache-items
                    :items="helpers.instruments"
                    item-text="instrument"
                    item-value="instrumentid"
                    v-model="filters.instrument"
                  ></v-autocomplete>
                  <v-autocomplete
                    append-icon="mdi-menu-swap"
                    outlined
                    dense
                    placeholder="فرق الادارة"
                    label="فرق الادارة"
                    cache-items
                    :items="helpers.specialTeams"
                    item-text="specialteamname"
                    item-value="specialteamid"
                    v-model="filters.specialTeam"
                  ></v-autocomplete>
                </v-card-text>
              </v-card>
            </v-menu>
          </div>
        </div>

        <v-data-table
          :headers="headers"
          :items="people"
          fixed-header
          :search="search"
          :options.sync="options"
          :loading="loading"
          :expanded.sync="expanded"
          :server-items-length="allPeople"
          show-expand
          item-key="name"
          :single-expand="true"
        >
          <template v-slot:expanded-item="{ item }">
            <td>...</td>
            <td class="text-center">
              <div class="font-weight-bold mb-1">الحالة الاجتماعية</div>
              <div>{{ item.maritalstate }}</div>
            </td>
            <td class="text-center">
              <div class="font-weight-bold mb-1">العنوان</div>
              <div>{{ item.address }}</div>
            </td>
            <td class="text-center">
              <div class="font-weight-bold mb-1">السلاح</div>
              <div>{{ item.weapon.weaponname }}</div>
            </td>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn color="success" :to="`/${item.id}`" icon>
              <v-icon small> mdi-pencil </v-icon>
            </v-btn>
            <v-btn icon @click="deleteItem(item)" color="error">
              <v-icon small> mdi-delete-outline </v-icon>
            </v-btn>
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
      people: [],
      expanded: [],
      allPeople: 0,
      loading: true,
      options: {},
      dialogDelete: false,
      search: '',
      filters: {
        unit: '',
        level: '',
        instrument: '',
        specialTeam: '',
      },
      headers: [
        {
          text: 'صورة شخصية',
          sortable: false,
          value: 'image',
          align: 'center',
        },
        {
          text: 'الاسم',
          value: 'name',
          align: 'center',
        },
        {
          text: 'الرقم العسكري',
          align: 'center',
          value: 'millitarynumber',
        },
        {
          text: 'الدرجة',
          align: 'center',
          value: 'level.level',
        },
        {
          text: 'الوحدة',
          align: 'center',
          value: 'unit.unitname',
        },
        {
          text: 'التخصص',
          align: 'center',
          sortable: false,
          value: 'instrument.instrument',
        },
        { text: 'Actions', value: 'actions', sortable: false, align: 'center' },
      ],
    }
  },
  computed: {
    filtersItems() {
      const res = Object.fromEntries(
        Object.entries(this.filters).filter(([_, v]) => v != null && v)
      )
      Object.keys(res).forEach((elm) => {
        switch (elm) {
          case 'unit':
            res[elm] = this.helpers.units.find(
              (x) => x.unitid === res[elm]
            ).unitname
            break
          case 'level':
            res[elm] = this.helpers.levels.find(
              (x) => x.levelid === res[elm]
            ).level
            break
          case 'instrument':
            res[elm] = this.helpers.instruments.find(
              (x) => x.instrumentid === res[elm]
            ).instrument
            break
          case 'specialTeam':
            res[elm] = this.helpers.specialTeams.find(
              (x) => x.specialteamid === res[elm]
            ).specialteamname
            break
        }
      })
      return res
    },
    helpers() {
      return this.$store.getters.helpers
    },
  },
  async fetch() {
    await this.fetchPeople()
  },
  watch: {
    options: {
      handler() {
        this.fetchPeople()
      },
      deep: true,
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    filtersItems(val) {
      Object.keys(val).length || this.fetchPeople(true)
    },
  },

  methods: {
    printRep() {
      console.log(this.$store)
      this.$store.commit('setReport', this.people)
      this.$router.push('/report')
    },
    async fetchPeople(isSearch = false) {
      this.options.page = isSearch ? 1 : this.options.page
      this.loading = true
      await this.$axios(`/api/people`, {
        params: {
          search: this.search,
          ...this.filters,
          ...this.options,
        },
      })
        .then((res) => {
          this.people = res.data.people
          this.allPeople = res.data.allPeople
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteItem(item) {
      this.editedIndex = this.people.indexOf(item)
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.people.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    closeDelete() {
      this.dialogDelete = false
    },
  },
}
</script>

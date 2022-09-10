<template>
  <v-row justify="center" align="center">
    <v-col cols="12">
      <v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="auto"
      >
        <template #activator="{ on, attrs }">
          <v-text-field
            v-model="date"
            outlined
            hide-details
            label="حدد التاريخ"
            append-icon="mdi-calendar"
            v-bind="attrs"
            dense
            v-on="on"
          ></v-text-field>
        </template>

        <v-date-picker
          v-model="date"
          full-width
          class="mt-4"
          color="primary"
          @input="menu1 = false"
        ></v-date-picker>
      </v-menu>

      <div>
        <v-data-table
          v-model="selected"
          :headers="headers"
          :items="guests"
          fixed-header
          :loading="loading"
          disable-pagination
          single-select
          show-select
          hide-default-footer
          :search="search"
          checkbox-color="green"
          class="followTable"
        >
          <template #top>
            <v-text-field
              v-model="search"
              label="بحث عن الاشخاص...."
              class="mt-4"
              filled
              solo
              hide-details
              flat
              dense
              append-icon="mdi-magnify"
            ></v-text-field>
          </template>

          <template #[`item.actions`]="{ item }">
            <v-btn
              v-if="!permissions.manager.includes(user.type)"
              color="error"
              icon
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
              v-if="permissions.manager.includes(user.type)"
              color="success"
              icon
              @click="setCase(1, item.id)"
            >
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn
              v-if="permissions.manager.includes(user.type)"
              color="error"
              icon
              @click="setCase(3, item.id)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
          <template #[`item.case`]="{ item }">
            <v-chip :color="cases[item.case].color">{{
              cases[item.case].name
            }}</v-chip>
          </template>
          <template #[`item.name`]="{ item }">
            <div class="font-weight-bold">
              {{ item.name }}
            </div>
          </template>
          <template #[`item.created_at`]="{ item }">
            <div style="direction: ltr">
              {{ new Date(item.created_at).toLocaleTimeString() }}
            </div>
          </template>
          <template
            v-if="!permissions.manager.includes(user.type)"
            #[`body.append`]="{}"
          >
            <tr>
              <td></td>
              <td>
                <v-select
                  v-model="form.degree"
                  :items="degrees"
                  solo-inverted
                  hide-details
                  flat
                  dense
                ></v-select>
              </td>
              <td>
                <v-text-field
                  v-model="form.name"
                  solo-inverted
                  hide-details
                  flat
                  dense
                ></v-text-field>
              </td>
              <td>
                <v-textarea
                  v-model="form.details"
                  solo-inverted
                  hide-details
                  flat
                  dense
                  :rows="1"
                ></v-textarea>
              </td>
              <td><v-chip color="warning">انتظار</v-chip></td>
              <td>{{ date }}</td>
              <td>
                <v-btn :loading="addLoading" icon @click="add"
                  ><v-icon>mdi-plus</v-icon></v-btn
                >
              </td>
            </tr>
          </template>
          <template #footer>
            <div class="py-2 d-flex justify-space-between">
              <v-btn icon @click="setDateTo(-1)"
                ><v-icon>mdi-chevron-right</v-icon></v-btn
              >

              <v-btn large icon @click="setDateTo(1)"
                ><v-icon large>mdi-chevron-left</v-icon></v-btn
              >
            </div>
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
  name: 'FollowManager',
  middleware: 'follow',
  data() {
    return {
      menu1: false,
      socket: null,
      intTime: null,
      lastIds: [],
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      addLoading: false,
      degrees: [
        'فريق',
        'لواء',
        'عميد',
        'عقيد',
        'مقدم',
        'رائد',
        'نقيب',
        'ملازم أول',
        'ملازم',
        'ضابط صف',
        'مجند',
        'مدني',
      ],
      cases: {
        1: { color: 'success', name: 'سماح' },
        2: { color: 'warning', name: 'انتظار' },
        3: { color: 'error', name: 'رفض' },
      },
      selected: [],
      guests: [],
      form: {
        degree: 'لواء',
        name: '',
        details: '',
      },
      eventSrc: null,
      loading: true,
      dialogDelete: false,
      search: '',
      withResualt: 0,
      filters: {
        qualification: '',
        examFinish: '',
        battaryId: '',
        stage: '',
        register: 1,
      },
      headers: [
        {
          text: 'الرتبة',
          value: 'degree',
          align: 'center',
          hide: false,
        },
        {
          text: 'الاسم',
          value: 'name',
          align: 'center',
          hide: false,
        },

        {
          text: 'التفاصيل',
          align: 'center',
          value: 'details',
          hide: false,
        },
        {
          text: 'الحالة',
          align: 'center',
          value: 'case',
          hide: false,
        },
        {
          text: 'تمت',
          align: 'center',
          value: 'case',
          hide: false,
        },
        {
          text: 'الوقت',
          align: 'center',
          value: 'created_at',
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
    }
  },
  async fetch() {
    await this.fetchGuests(this.date)
  },
  computed: {
    user() {
      return this.$store.getters['User/user']
    },
    permissions() {
      return this.$store.getters['User/permissions']
    },
  },

  watch: {
    dialogDelete(val) {
      val || this.closeDelete()
    },
    date(val) {
      this.fetchGuests(val)
    },
    selected(val) {
      const row = val[0]
      if (row) {
        this.form.degree = row.degree
        this.form.name = row.name
        this.form.details = row.details
        this.form.id = row.id
      } else {
        this.form = {
          degree: 'لواء',
          name: '',
          details: '',
        }
      }
    },
  },

  mounted() {
    const vm = this

    // use "main" socket defined in nuxt.config.js
    vm.socket = this.$nuxtSocket({
      name: 'guests', // select "main" socket from nuxt.config.js - we could also skip this because "main" is the default socket
    })

    vm.socket.on('guestSaved', (guests) => {
      // console.log(guests)
    })

    // this.listToChange()
  },
  destroyed() {
    if (this.intTime) clearInterval(this.intTime)
  },
  methods: {
    setCase(val, id) {
      this.$store
        .dispatch('Follow/setCase', {
          val,
          id,
        })
        .then((res) => {
          const index = this.guests.findIndex((x) => x.id === res.data.id)
          if (index !== -1) {
            this.$set(this.guests, index, res.data)
            // this.guests[index] = res.data
          }
        })
    },
    add() {
      this.addLoading = true
      this.$store
        .dispatch('Follow/save', this.form)
        .then((res) => {
          if (this.form.id) {
            const index = this.guests.findIndex((x) => x.id === res.data.id)
            if (index !== -1) {
              this.$set(this.guests, index, res.data)
              // this.guests[index] = res.data
            }
          } else this.guests.push(res.data)
        })
        .finally(() => {
          this.addLoading = false
        })
    },
    setDateTo(day) {
      const date = new Date(this.date).setDate(
        new Date(this.date).getDate() + day
      )

      this.date = new Date(date).toISOString().substr(0, 10)
    },
    async fetchGuests(date = new Date()) {
      this.loading = true
      await this.$store
        .dispatch(`Follow/guests`, {
          date,
        })
        .then((res) => {
          this.guests = res.data.guests
        })
        .finally(() => {
          this.loading = false
        })
    },
    deleteItem(item) {
      this.editedIndex = this.guests.indexOf(item)
      this.dialogDelete = true
    },
    deleteItemConfirm() {
      this.$store.dispatch('Follow/deleteGuest', {
        id: this.guests[this.editedIndex].id,
      })
      this.guests.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    closeDelete() {
      this.dialogDelete = false
    },
    updateOrInsert(elm) {
      const index = this.guests.findIndex((x) => x.id === elm.id)
      if (index !== -1) {
        this.$set(this.guests, index, elm)
      } else {
        elm.color = 'red'
        this.guests.push(elm)
      }
    },
    listToChange() {
      this.intTime = setInterval(() => {
        this.$store
          .dispatch('Follow/checkCase', {
            lastIds: this.lastIds,
          })
          .then((res) => {
            if (res.data) {
              this.lastIds = res.data.ids
              if (this.permissions.manager.includes(this.user.type)) {
                const rows = res.data.newRows
                rows.forEach((element) => {
                  this.updateOrInsert(element)
                })
              }
              if (this.permissions.follow.includes(this.user.type)) {
                const rows = res.data.updateRows
                rows.forEach((element) => {
                  this.updateOrInsert(element)
                })
              }
            }
          })
      }, 1000)
    },
  },
}
</script>
<style lang="scss">
.followTable {
  tr {
    td,
    th {
      font-size: 18px !important;
      border: 1px solid rgba(0, 0, 0, 0.12);
    }
  }
}
</style>

<template>
  <v-app>
    <v-navigation-drawer
      color="customGrey"
      right
      :mini-variant="clipped"
      permanent
      app
    >
      <v-list>
        <v-list-item :class="{ 'px-2': clipped }">
          <v-list-item-avatar>
            <v-img src="/logo.png"></v-img>
          </v-list-item-avatar>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6 font-weight-bold">
              فرع الانتقاء و التوجيه
            </v-list-item-title>
            <v-list-item-subtitle>فكر علم دقة</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list nav>
        <template v-for="(item, i) in items">
          <v-list-group
            v-show="item.permission"
            v-if="item.children"
            :key="item.title"
          >
            <template #activator>
              <v-list-item-action>
                <v-img v-if="item.img" :src="`/icon/${item.img}`"></v-img>
                <v-icon v-else>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="child in item.children"
              :key="child.title"
              link
              :to="child.to"
            >
              <v-list-item-content>
                <v-list-item-title v-text="child.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <template v-else>
            <v-list-item
              v-if="item.permission"
              :key="i + item.title"
              :to="item.to"
              router
              exact
              exact-active-class="overIcon"
              transition="scale-transition"
              color="primary"
            >
              <v-list-item-action>
                <v-img v-if="item.img" :src="`/icon/${item.img}`"></v-img>
                <v-icon v-else>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title" />
              </v-list-item-content>
            </v-list-item>
          </template>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app flat color="white" class="nav">
      <v-app-bar-nav-icon @click="clipped = !clipped"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-black" style="width: 200px"
        >ِAFTCs</v-app-bar-title
      >
      <v-spacer />

      <v-avatar class="me-2" size="30" color="customGrey">
        <span class="secondaryT--text font-weight-bold">اح</span>
      </v-avatar>
      <v-btn
        color="error"
        class="elevation-0 me-2"
        height="35"
        width="35"
        fab
        :loading="loading"
        title="تحديث النظام"
        @click="getHelpers()"
        ><v-icon>mdi-update</v-icon></v-btn
      >
      <v-btn
        title="اضافة جديده"
        to="/Examiners/storeExaminer"
        color="primary"
        class="elevation-0"
        small
        fab
        ><v-icon>mdi-plus</v-icon></v-btn
      >
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
      <notification></notification>
    </v-main>
  </v-app>
</template>

<script>
import Notification from '~/components/notifications/notification.vue'
export default {
  name: 'DefaultLayout',
  components: { Notification },
  middleware: 'auth',

  data() {
    return {
      clipped: false,
      drawer: true,
      loading: false,
      items: [],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
  computed: {
    user() {
      return this.$store.getters['User/user']
    },
    permissions() {
      return this.$store.getters['User/permissions']
    },
  },

  created() {
    this.$store.dispatch('Exam/getHelpers')
    this.$store.dispatch('Exam/getSerials')
    this.$store.dispatch('Exam/getExams').then((res) => {
      this.$store.commit('Exam/setExams', res.data)
    })
    const el = this
    this.items = [
      {
        icon: 'mdi-account-group-outline',
        img: 'exam.png',
        title: 'مدير الاختبارات',
        to: '/examsManager',
        permission: (function () {
          return el.checkPermission('admin')
        })(),
      },
      {
        icon: 'mdi-account-multiple-plus-outline',
        img: 'group.png',
        title: 'مدير المختبرين',
        to: '/ExaminerManager',
        permission: (function () {
          return el.checkPermission([
            ...el.permissions.center,
            ...el.permissions.area,
          ])
        })(),
      },

      {
        icon: 'mdi-update',
        img: 'update.png',
        title: 'التحديثات',
        to: '/new',
        permission: (function () {
          return el.checkPermission([
            ...el.permissions.center,
            ...el.permissions.area,
          ])
        })(),
      },
      {
        icon: 'mdi-update',
        img: 'scale.png',
        title: 'برامج النظري و العملي',
        to: '/external',
        permission: (function () {
          return el.checkPermission('admin')
        })(),
      },
      {
        icon: 'mdi-tablet-cellphone',
        img: 'scale.png',
        title: 'بدني و عملي',
        to: '/badany',
        permission: (function () {
          return el.checkPermission('admin')
        })(),
      },
      {
        icon: 'mdi-account-multiple-plus-outline',
        img: 'add-user.png',
        permission: (function () {
          return el.checkPermission('center')
        })(),
        title: 'الممتحنين',
        children: [
          {
            title: 'تسجيل ممتحن جديد',
            to: '/Examiners/storeExaminer',
          },
        ],
      },
      {
        icon: 'mdi-account-multiple-plus-outline',
        img: 'settings.png',
        title: 'الاعدادات',
        to: '/setting',
        permission: (function () {
          return el.checkPermission([
            ...el.permissions.center,
            ...el.permissions.area,
          ])
        })(),
      },
      {
        icon: 'mdi-account-multiple-plus-outline',
        img: 'rec.png',
        title: 'المتابعة',
        to: '/follow',
        permission: (function () {
          return el.checkPermission('follow')
        })(),
      },
      {
        icon: 'mdi-log',
        img: 'log.png',
        title: 'السجل',
        to: '/log',
        permission: (function () {
          return el.checkPermission('admin')
        })(),
      },
      {
        icon: 'mdi-account-multiple-plus-outline',
        img: 'logout.png',
        title: 'تسجيل الخروج',
        to: '/logout',
        permission: (function () {
          return el.checkPermission(undefined)
        })(),
      },
    ].filter((elm) => elm.permission)
  },
  mounted() {
    this.setPageZoom()
  },
  beforeMount() {
    this.$store.dispatch('User/getUsers')
  },
  methods: {
    checkPermission(per) {
      if (!per) {
        return true
      }

      // eslint-disable-next-line eqeqeq
      if (typeof per == 'string') {
        return this.permissions[per].includes(this.user.type)
      } else {
        return per.includes(this.user.type)
      }
    },
    setPageZoom() {
      if (this.user && this.user.zoom) {
        document.getElementsByTagName('html')[0].style.zoom =
          this.user.zoom + '%'
      }
    },
  },
}
</script>

<style>
.v-navigation-drawer__border {
  display: none !important;
}
.nav .v-app-bar-title__content {
  width: auto !important;
}
</style>

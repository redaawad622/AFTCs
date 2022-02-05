<template>
  <v-app>
    <v-navigation-drawer
      color="accent"
      right
      :mini-variant="clipped"
      permanent
      app
    >
      <v-list>
        <v-list-item :class="{ 'px-2': clipped }">
          <v-list-item-avatar>
            <v-img src="/logo.webp"></v-img>
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
            :key="item.title"
            :prepend-icon="item.icon"
            v-if="item.children"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              link
              v-for="child in item.children"
              :key="child.title"
              :to="child.to"
            >
              <v-list-item-content>
                <v-list-item-title v-text="child.title"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item
            color="primary"
            v-else
            :key="i + item.title"
            :to="item.to"
            router
            exact
            exact-active-class="overIcon"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app flat color="white">
      <v-app-bar-nav-icon @click="clipped = !clipped"></v-app-bar-nav-icon>
      <v-app-bar-title class="font-weight-black">ضباط الصف</v-app-bar-title>
      <v-spacer />

      <v-avatar class="me-2" size="30" color="accent">
        <span class="secondaryT--text font-weight-bold">اح</span>
      </v-avatar>
      <v-btn
        @click="getHelpers()"
        color="error"
        class="elevation-0 me-2"
        height="35"
        width="35"
        fab
        :loading="loading"
        title="تحديث النظام"
        ><v-icon>mdi-update</v-icon></v-btn
      >
      <v-btn
        title="اضافة جديده"
        to="/new"
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
  components: { Notification },
  name: 'examsManager',
  data() {
    return {
      clipped: false,
      drawer: true,
      loading: false,
      items: [
        {
          icon: 'mdi-account-group-outline',
          title: 'مدير الاختبارات',
          to: '/examsManager',
        },
        {
          icon: 'mdi-account-multiple-plus-outline',
          title: 'مدير المختبرين',
          to: '/ExaminerManager',
        },
        {
          icon: 'mdi-account-multiple-plus-outline',
          title: 'التحديثات',
          to: '/new',
        },
        {
          icon: 'mdi-account-multiple-plus-outline',
          title: 'بدني و عملي',
          to: '/badany',
        },
        {
          icon: 'mdi-account-multiple-plus-outline',
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
          title: 'تسجيل الخروج',
          to: '/logout',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js',
    }
  },
  methods: {
    getHelpers() {
      this.loading = true
      this.$store.dispatch('getHelpers', false).finally(() => {
        this.loading = false
      })
    },
  },
  mounted() {
    this.$store.dispatch('getHelpers')
  },
}
</script>

<style>
.v-navigation-drawer__border {
  display: none !important;
}
</style>

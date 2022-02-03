<template>
  <v-sheet width="100%" height="100%" class="d-flex flex-column">
    <v-btn
      class="ma-2 font-weight-bold title"
      width="120px"
      text
      color="primary"
      @click="dialog = true"
      >تسجيل الدخول</v-btn
    >
    <v-spacer></v-spacer>
    <v-sheet
      height="200px"
      max-width="700px"
      width="100%"
      class="d-flex justify-center align-center pa-5 align-self-center"
    >
      <v-text-field
        outlined
        label="ابحث بالرقم القومي-الثلاثي-الباركود "
        placeholder="ابحث بالرقم القومي-الثلاثي-الباركود "
        full-width
        prepend-inner-icon="mdi-search"
        hide-details
        class="me-3 display-1"
      ></v-text-field>
      <v-btn class="headline" width="100px" height="56px" color="primary"
        >بحث</v-btn
      >
    </v-sheet>
    <v-spacer></v-spacer>
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              تسجيل الدخول
            </v-card-title>

            <v-card-text class="pa-4">
              <v-combobox outlined label="مركز التدريب"></v-combobox>
              <v-text-field
                type="password"
                outlined
                label="رقم الدخول"
              ></v-text-field>
            </v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" class="title" text @click="login()">
                تسجيل الدخول
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template></v-sheet
  >
</template>
  </v-sheet>
</template>

<script>
export default {
  name: 'IndexPage',
  layout: 'examLayout',
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    login() {
      this.$router.replace('/ExamsManager')
    },
  },
}
</script>

<style>
</style>
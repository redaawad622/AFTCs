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
            <v-autocomplete
              v-if="permissions.admin.includes(user.type)"
              v-model="noticedAction"
              outlined
              :items="noticedActions"
              color="primary"
              label="الموقف"
              dense
              hide-details
              class="mx-1"
            ></v-autocomplete>
            <v-btn
              v-if="permissions.admin.includes(user.type)"
              class="elevation-0 mx-1"
              :loading="actionLoading"
              @click="takeAction()"
              >تسجيل موقف الملحوظين</v-btn
            >
            <v-btn
              color="white"
              title="طباعة"
              class="elevation-0 ms-2"
              @click="printRep()"
              ><v-img
                width="24px"
                height="24px"
                contain
                src="/icon/printer.png"
              ></v-img
            ></v-btn>
            <v-btn
              v-if="permissions.area.includes(user.type)"
              color="white"
              title="استخراج البيانات الي exam.db"
              class="elevation-0 ms-2"
              :loading="tagLoading"
              @click="extractDialog = true"
            >
              <v-img
                width="24px"
                height="24px"
                contain
                src="/icon/database.png"
              ></v-img>
            </v-btn>
            <v-btn
              v-if="permissions.area.includes(user.type)"
              color="white"
              title="رفع بيانات من oracle"
              class="elevation-0 ms-2"
              :loading="tagLoading"
              @click="getDataFromTag()"
            >
              <v-img
                width="24px"
                height="24px"
                contain
                src="/icon/database.png"
              ></v-img>
            </v-btn>
            <v-btn
              v-if="permissions.admin.includes(user.type)"
              title="سحب بيانات المختبرين من ملف الاكسس"
              class="elevation-0 ms-2"
              color="white"
              @click="readExaminerFromMdb()"
            >
              <v-img
                width="24px"
                height="24px"
                contain
                src="/icon/microsoft-access.png"
              ></v-img>
            </v-btn>
            <v-btn
              v-if="permissions.admin.includes(user.type)"
              title="سحب بيانات مناطق التمركز من ملف الاكسس"
              class="elevation-0 ms-2"
              color="white"
              :loading="readUnitsLoading"
              @click="readUnitsFromMdb()"
            >
              <v-img
                width="24px"
                height="24px"
                contain
                src="/icon/microsoft-access.png"
              ></v-img>
            </v-btn>
            <v-checkbox
              v-if="permissions.developer.includes(user.type)"
              v-model="deleteItems"
              label="مسح البحث"
            ></v-checkbox>
          </div>
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
              @keyup.enter="fetchExaminers(true)"
            ></v-text-field>
            <v-badge
              bordered
              color="error"
              :content="examiners.length"
              left
              overlap
            >
              <v-btn class="elevation-0" @click="fetchExaminers(true)"
                >تصفية النتائج</v-btn
              >
            </v-badge>
          </div>
          <div>
            <v-scale-transition group>
              <v-chip
                v-for="(item, k) in filtersItems"
                v-show="
                  item !== 'من تم تسجيلهم'
                    ? true
                    : permissions.admin.includes(user.type)
                    ? true
                    : false
                "
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

            <v-bottom-sheet v-model="openFilter" scrollable>
              <v-card min-width="400px" class="pa-4">
                <v-sheet class="d-flex justify-space-between align-center mb-4">
                  <v-card-title class="font-weight-black">
                    تصفية النتائج</v-card-title
                  >
                </v-sheet>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" sm="6" md="3" lg="2" xl="1">
                      <v-autocomplete
                        v-model="filters.qualification"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="المؤهل"
                        label="المؤهل"
                        cache-items
                        :items="helpers.qualification"
                        item-text="name"
                        item-value="value"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" lg="2" xl="1">
                      <v-autocomplete
                        v-model="filters.examFinish"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="انتهاء الامتحان"
                        label="انتهاء الامتحان"
                        cache-items
                        :items="helpers.examFinish"
                        item-text="name"
                        item-value="value"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" lg="2" xl="1">
                      <v-autocomplete
                        v-model="filters.hasUnit"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="تسجيل الوحده"
                        label="تسجيل الوحده"
                        cache-items
                        :items="helpers.hasUnit"
                        item-text="name"
                        item-value="value"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" lg="2" xl="1">
                      <v-autocomplete
                        v-model="filters.interview"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="المقابلة"
                        label="المقابلة"
                        cache-items
                        :items="helpers.interview"
                        item-text="name"
                        item-value="value"
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-autocomplete
                        v-model="filters.final_opinion"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="رأي القائم بالمقابله"
                        label="رأي القائم بالمقابله"
                        cache-items
                        :items="helpers.final_opinion"
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-autocomplete
                        v-model="filters.transReason"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="سبب الإحالة"
                        label="سبب الإحالة"
                        cache-items
                        :items="helperData.transReason"
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-autocomplete
                        v-model="filters.interviewEntqaDone"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="عرض على الفرع"
                        label="عرض على الفرع"
                        cache-items
                        :items="helperData.interviewEntqaDone"
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-autocomplete
                        v-model="filters.recommendation"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="التوصية"
                        label="التوصية"
                        cache-items
                        :items="helperData.recommendation"
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-autocomplete
                        v-model="filters.examiner_status"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="التوصية مركز"
                        label="التوصية مركز"
                        cache-items
                        :items="helpers.examiner_status"
                      >
                      </v-autocomplete>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-autocomplete
                        v-model="filters.recommendation_res"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="نتيجة التوصية"
                        label="نتيجة التوصية"
                        cache-items
                        :items="helperData.recommendation_res"
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-autocomplete
                        v-model="filters.battaryId"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="البطارية"
                        label="البطارية"
                        item-text="name"
                        item-value="id"
                        cache-items
                        :items="battaryId"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" lg="2" xl="1">
                      <v-autocomplete
                        v-model="filters.stage"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="المرحلة"
                        label="المرحلة"
                        item-value="stage"
                        item-text="stage"
                        cache-items
                        :items="stage"
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-autocomplete
                        v-model="filters.register"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="المسجلين للامتحان"
                        label="المسجلين للامتحان"
                        item-value="value"
                        item-text="name"
                        cache-items
                        :items="helpers.register"
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-autocomplete
                        v-model="filters.again"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="اعادة الامتحان"
                        label="اعادة الامتحان"
                        item-value="value"
                        item-text="name"
                        cache-items
                        :items="helpers.again"
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-autocomplete
                        v-model="filters.isNoticed"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="الملحوظين"
                        label="الملحوظين"
                        item-value="value"
                        item-text="name"
                        cache-items
                        :items="helpers.isNoticed"
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-autocomplete
                        v-model="filters.user"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="المستخدمين"
                        label="المستخدمين"
                        item-value="Cat_ID"
                        item-text="Cat_Name"
                        cache-items
                        :items="users"
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-checkbox
                        v-model="newSet"
                        label="الموقف الجديد"
                      ></v-checkbox>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-checkbox
                        v-model="withResult"
                        label=" مع النتيجة"
                      ></v-checkbox>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-checkbox v-model="nafsy" label="النفسي"></v-checkbox>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-checkbox
                        v-model="showAll"
                        label="استخراج نتيجه"
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" lg="2" xl="1">
                      <v-dialog
                        ref="dialog"
                        v-model="datePicker"
                        :return-value.sync="filters.date"
                        persistent
                        width="290px"
                      >
                      </v-dialog>
                    </v-col>
                    <v-col cols="12" sm="6" md="3" lg="2" xl="1">
                      <v-btn color="primary" block @click="fetchExaminers(true)"
                        >تطبيق</v-btn
                      >
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                    >
                      <v-divider></v-divider>
                      <v-card-title class="font-weight-black"
                        >تقارير</v-card-title
                      >
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-autocomplete
                        v-model="filters.report"
                        append-icon="mdi-menu-swap"
                        outlined
                        dense
                        placeholder="نوع التقرير"
                        label="نوع التقرير"
                        item-value="value"
                        item-text="text"
                        cache-items
                        :items="helperData.report"
                        :loading="reportLoading"
                      ></v-autocomplete>
                    </v-col>
                    <v-col
                      v-if="permissions.admin.includes(user.type)"
                      cols="12"
                      sm="6"
                      md="3"
                      lg="2"
                      xl="1"
                    >
                      <v-btn :loading="reportLoading" @click="getReports()"
                        >استخراج التقرير</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-bottom-sheet>
            <v-btn
              width="36px"
              min-width="36px"
              class="elevation-0 ma-2"
              color="white"
              title="تصفية النتائج"
              @click="openFilter = true"
            >
              <v-img src="/icon/filter.png"></v-img>
            </v-btn>
          </div>
        </div>
        <div class="d-flex align-center mb-5">
          <v-select
            v-if="permissions.admin.includes(user.type)"
            v-model="headers"
            return-object
            outlined
            chips
            dense
            multiple
            hide-details
            :items="defaultHeaders"
            class="ml-5"
          ></v-select>
          <v-btn
            v-if="permissions.admin.includes(user.type)"
            color="primary"
            @click="filterByExamDegree"
            >استخراج النتائج</v-btn
          >
        </div>
        <v-data-table
          v-model="selectedExaminer"
          :headers="headers"
          :items="examiners"
          fixed-header
          :search="search"
          :options.sync="options"
          :loading="loading"
          :server-items-length="allExaminers"
          item-key="national_id"
          :single-expand="true"
          :single-select="true"
          show-select
          >`
          <template #[`header.Answers`]="{ header }">
            <div class="d-flex flex-column">
              <v-text-field
                v-model="filterExam[`from_${header.id}`]"
                solo-inverted
                placeholder="من"
                type="number"
                hide-details
                class="mb-1"
                dense
                style="min-width: 60px"
              ></v-text-field>
              <v-text-field
                v-model="filterExam[`to_${header.id}`]"
                solo-inverted
                placeholder="الي"
                type="number"
                hide-details
                class="mb-1"
                dense
                style="min-width: 60px"
              >
              </v-text-field>
              <div class="text-no-wrap text-primary">
                {{ header.text }}
              </div>
            </div>
          </template>
          <template #[`item.actions`]="{ item }">
            <div class="d-flex">
              <v-btn
                color="success"
                :to="`/Examiners/${item.national_id}`"
                icon
                title="تعديل المختبر"
              >
                <v-img
                  contain
                  width="24px"
                  height="24px"
                  src="/icon/edit.png"
                ></v-img>
              </v-btn>
              <v-btn
                v-if="permissions.admin.includes(user.type)"
                icon
                color="error"
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
                v-if="permissions.admin.includes(user.type)"
                text
                color="info"
                title="مسح الممتحن مؤقتا"
                @click="hideExaminer(item)"
              >
                اخفاء
              </v-btn>
            </div>
          </template>
          <template #[`item.again`]="{ item }">
            <template v-if="item._count.Answers > 0">
              <v-chip v-if="item.again" outlined>تم الاعاده</v-chip>
              <v-btn
                v-else
                color="primary"
                text
                title="تعديل المختبر"
                @click="currentDelete = item"
              >
                اعادة
              </v-btn>
            </template>

            <v-chip v-else>لم يتم امتحانه بعد</v-chip>
          </template>
          <template #[`item.CustomExam`]="{ item }">
            <diV class="d-felx">
              <v-btn
                color="primary"
                text
                @click="currentSelectedExaminer = item"
                >تسجيل
              </v-btn>
              <v-chip
                class="mx-1 font-weight-bold"
                :color="item.CustomExam.length > 0 ? 'success' : 'error'"
                >{{ item.CustomExam.length }}</v-chip
              >
            </diV>
          </template>
          <template #[`item.unit`]="{ item }">
            <diV class="d-felx">
              <v-btn
                color="primary"
                text
                @click="currentUnitSelectedExaminer = item"
                >تسجيل
              </v-btn>
              <v-chip
                v-if="item.UNIT_NAME"
                class="mx-1 font-weight-bold"
                color="red"
                >{{ item.UNIT_NAME }}</v-chip
              >
            </diV>
          </template>
          <template #[`item.Answers`]="{ item, header }">
            {{ item.Answers[header.id] }}%
          </template>
          <template #[`item.sold_id`]="{ item }">
            <v-chip v-if="item.sold_id">{{ item.sold_id }}</v-chip>
            <v-btn
              v-else
              color="info"
              :to="`/Examiners/${item.national_id}`"
              text
            >
              اضافة</v-btn
            >
          </template>
          <template #[`item.stage`]="{ item }">
            <v-chip
              outlined
              color="primary"
              @click="setFilter('stage', item.stage)"
            >
              {{ item.stage }}</v-chip
            >
          </template>
          <template #[`item.user_id`]="{ item }">
            <v-chip
              v-if="item.user_id"
              outlined
              color="primary"
              @click="setFilter('user', item.user_id)"
            >
              {{ usersList[item.user_id] }}</v-chip
            >
            <div v-else>لم يسجل بعد</div>
          </template>
          <template #[`item._count`]="{ item }">
            <v-chip
              :to="`/Examiners/${item.national_id}/interview`"
              :color="item._count['Interview'] > 0 ? 'success' : 'error'"
              >{{ item._count['Interview'] > 0 ? 'نعم' : 'لا' }}
            </v-chip>
          </template>
          <template #[`item.image`]="{ item }">
            <v-avatar class="ma-2" size="50" color="customGrey">
              <v-img v-if="item.image" src="item.image"></v-img>
              <span
                v-else
                class="secondaryT--text font-weight-bold"
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
        <v-dialog v-if="currentDelete" :value="true" max-width="300px">
          <v-card :loading="currentDeleteLoading">
            <v-card-title class="text-h5"
              >هل انت متاكد انك تريد الاعادة؟</v-card-title
            >
            <v-card-text v-if="currentDelete">
              سيتم حذف جميع اجابات {{ currentDelete.name }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                text
                :loading="currentDeleteLoading"
                @click="removeExamAns()"
                >نعم</v-btn
              >
              <v-btn
                :disabled="currentDeleteLoading"
                color="error"
                text
                @click="currentDelete = null"
                >لا</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-row justify="center">
          <v-dialog
            v-if="currentSelectedExaminer"
            :value="true"
            persistent
            max-width="600px"
          >
            <v-card>
              <v-card-title class="grey lighten-2"
                >الاختبارات التي تمت
              </v-card-title>
              <v-chip-group
                v-if="currentSelectedExaminer.CustomExam.length > 0"
                class="my-3"
              >
                <v-chip
                  v-for="cExam in currentSelectedExaminer.CustomExam"
                  :key="cExam.id + 'cExam'"
                  >{{ cExam.exam.Exm_Name }}</v-chip
                >
              </v-chip-group>
              <v-card-text v-else class="my-3"
                >لا يوجد اختبارات تمت</v-card-text
              >
              <v-card-title class="grey lighten-2">
                <span class="text-h5">تسجيل درجات الاختبارات التالية</span>
              </v-card-title>
              <v-card-text v-if="exams.length > 0" class="my-3">
                <v-text-field
                  v-for="item in exams"
                  :key="item.Exm_Name"
                  v-model.number="examsVal[item.Exm_ID]"
                  outlined
                  :label="item.Exm_Name"
                  type="number"
                ></v-text-field>
              </v-card-text>
              <v-card-text v-else class="my-3"
                >لا يوجد اختبارات لتسجيلها</v-card-text
              >
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  :disabled="examLoading"
                  color="blue darken-1"
                  text
                  @click="currentSelectedExaminer = false"
                >
                  الغاء
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  :loading="examLoading"
                  text
                  @click="saveManualCustomExam()"
                >
                  حفظ
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-row justify="center">
          <v-dialog
            v-if="currentUnitSelectedExaminer"
            :value="true"
            persistent
            max-width="600px"
          >
            <v-card>
              <v-card-title class="grey lighten-2">
                تسجيل الوحدة و منطقة التمركز
              </v-card-title>

              <v-card-text class="my-3">
                <v-combobox
                  v-model="unit.UNIT_NAME"
                  outlined
                  :items="UnitNames"
                  label="اسم الوحده"
                ></v-combobox>
                <v-autocomplete
                  v-model="unit.TAMARKZ_NAME"
                  outlined
                  :items="TamarkzNames"
                  label="التمركز"
                ></v-autocomplete>
                <v-combobox
                  v-model="unit.UNIT_ARMY_NAME"
                  :items="ArmyNames"
                  outlined
                  label="جهة التابعه"
                ></v-combobox>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  :disabled="examUnitLoading"
                  color="blue darken-1"
                  text
                  @click="currentUnitSelectedExaminer = false"
                >
                  الغاء
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  :loading="examUnitLoading"
                  text
                  @click="saveUnit()"
                >
                  حفظ
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-row justify="center">
          <v-dialog v-model="extractDialog" persistent max-width="450px">
            <v-card>
              <v-card-title class="grey lighten-2">
                استخراج المختبرين التاليين في exam.db
              </v-card-title>

              <v-card-text class="my-3">
                <v-text-field
                  v-model="ip"
                  outlined
                  color="primary"
                  label="ال ip الخاص بالجهاز "
                ></v-text-field>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  :disabled="examUnitLoading"
                  color="blue darken-1"
                  text
                  @click="extractDialog = false"
                >
                  الغاء
                </v-btn>
                <v-btn
                  color="blue darken-1"
                  :loading="extractLoading"
                  text
                  @click="extractToDevice()"
                >
                  استخراج
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </div>
    </v-col>
    <v-text-field v-if="false" v-model="ans"></v-text-field>
    <v-btn v-if="false" @click="saveF()">cc</v-btn>
  </v-row>
</template>

<script>
import reportHeaders from '../config/report.config'
export default {
  name: 'ExaminerManager',
  data() {
    return {
      ip: '',
      reportLoading: false,
      openFilter: false,
      extractDialog: false,
      datePicker: false,
      extractLoading: false,
      filterExam: {},
      dialog: false,
      examLoading: false,
      currentSelectedExaminer: null,
      currentUnitSelectedExaminer: null,
      exams: [],
      noticedAction: '',
      noticedActions: [
        { text: 'ملحوظ لاول مره', value: 1 },
        { text: 'تم اعادة الاختبار', value: 2 },
        { text: 'ملحوظ لثاني مره', value: 3 },
      ],
      examsVal: {},
      audio: null,
      currentDelete: null,
      currentDeleteLoading: false,
      helpers: {
        qualification: [
          { name: 'عليا', value: 2 },
          { name: 'فوق متوسطة', value: 8 },
          { name: 'متوسطة', value: 1 },
          { name: 'عادة', value: 0 },
        ],
        examFinish: [
          { name: 'من انهوا', value: 1 },
          { name: 'من لم ينتهوا بعد', value: 0 },
        ],
        hasUnit: [
          { name: 'تم تسجيل وحدته', value: 1 },
          { name: 'لم يتم تسجيل وحدته', value: 0 },
        ],
        interview: [
          { name: 'تم عمل مقابلة لهم ', value: 1 },
          { name: 'لم يتم عمل مقابلة لهم', value: 0 },
        ],
        register: [
          { name: 'من تم تسجيلهم', value: 1 },
          { name: 'من لم يتم تسجيلهم', value: 0 },
        ],
        again: [
          { name: 'امتحن مره', value: 0 },
          { name: 'امتحن مرتين', value: 1 },
        ],
        isNoticed: [
          { name: 'تم تسجيلهم كملحوظين لاول مره', value: 1 },
          { name: 'تم تسجيلهم كملحوظ لثاني مره', value: 2 },
          { name: 'لم يتم تسجيلهم كملحوظين', value: 3 },
        ],

        final_opinion: [
          'عرضه علي المست من قبل المركز',
          'عرضه علي فرع الانتقاء و التوجيه',
          'لا يعاني من اي مشاكل',
        ],
        examiner_status: ['عرض مست طبي', 'عرض مست نفسي'],
      },
      tagLoading: false,
      selectedExaminer: [],
      deleteItems: false,
      examiners: [],
      examinersList: [],
      examinersListForOut: [],
      ans: '',
      expanded: [],
      allExaminers: 0,
      loading: true,
      options: {},
      dialogDelete: false,
      actionLoading: false,
      readUnitsLoading: false,
      search: '',
      withResult: 0,
      newSet: 0,
      nafsy: 0,
      showAll: 0,
      dates: [],
      unit: { UNIT_NAME: '', TAMARKZ_NAME: '', UNIT_ARMY_NAME: '' },
      examUnitLoading: false,
      filters: {
        qualification: '',
        examFinish: '',
        interview: '',
        battaryId: '',
        recommendation_res: '',
        recommendation: '',
        stage: '',
        user: '',
        interviewEntqaDone: '',
        transReason: '',
        examiner_status: '',
        register: 1,
        again: '',
        final_opinion: '',
        report: '',
        isNoticed: '',
        date: '',
        hasUnit: '',
      },
      defaultHeaders: [
        {
          text: 'الاسم',
          value: 'name',
          align: 'center',
          hide: false,
        },
        {
          text: 'الرقم القومي',
          align: 'center',
          value: 'national_id',
          hide: false,
        },

        {
          text: 'الرقم الثلاثي',
          align: 'center',
          value: 'triple_number',
          hide: false,
        },
        {
          text: 'الرقم العسكري',
          align: 'center',
          value: 'sold_id',
          hide: false,
        },
        {
          text: 'المرحلة',
          align: 'center',
          value: 'stage',
          hide: false,
        },
        {
          text: 'المقابلة',
          align: 'center',
          value: '_count',
          hide: false,
          sortable: false,
        },
        {
          text: 'اعادة الاختبار',
          value: 'again',
          sortable: false,
          align: 'center',
          hide: true,
        },
        {
          text: 'الاختبارت العملية و البدنية',

          value: 'CustomExam',
          sortable: false,
          align: 'center',
          hide: true,
        },
        {
          text: 'الوحدات',
          value: 'unit',
          sortable: false,
          align: 'center',
          hide: true,
        },
        {
          text: 'المستخدم',
          value: 'user_id',
          sortable: true,
          align: 'center',
          hide: true,
        },
        {
          text: 'الوحده',
          align: 'center',
          value: 'UNIT_NAME',
          hide: false,
        },
        {
          text: 'الجهة',
          align: 'center',
          value: 'GEHA_NAME',
          hide: false,
        },
        {
          text: 'منطقة التمركز',
          align: 'center',
          value: 'TAMARKZ_NAME',
          hide: false,
        },
        {
          text: 'تباعية الوحدة داخل الجيش',
          align: 'center',
          value: 'UNIT_ARMY_NAME',
          hide: false,
        },
        {
          text: 'ملحوظ',
          align: 'center',
          value: 'isNoticed',
          hide: false,
        },
        {
          text: 'تازيخ المتابعه القادم',
          align: 'center',
          value: 'nextFollowDate',
          hide: false,
        },
        {
          text: 'عدد مرات المتابعه',
          align: 'center',
          value: 'numFollowUps',
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
      headers: [
        {
          text: 'الاسم',
          value: 'name',
          align: 'center',
          hide: false,
        },
        {
          text: 'الرقم القومي',
          align: 'center',
          value: 'national_id',
          hide: false,
        },

        {
          text: 'الرقم الثلاثي',
          align: 'center',
          value: 'triple_number',
          hide: false,
        },
        {
          text: 'الرقم العسكري',
          align: 'center',
          value: 'sold_id',
          hide: false,
        },
        {
          text: 'المرحلة',
          align: 'center',
          value: 'stage',
          hide: false,
        },
        {
          text: 'المقابلة',
          align: 'center',
          value: '_count',
          sortable: false,
          hide: false,
        },

        {
          text: 'اعادة الاختبار',
          value: 'again',
          sortable: false,
          align: 'center',
          hide: true,
        },
        {
          text: 'عدد الاسئلة التي تم الاجابة عليها',
          align: 'center',
          value: '_count.Answers',
          sortable: false,
          hide: false,
        },
        {
          text: 'الاختبارت العملية و البدنية',
          value: 'CustomExam',
          sortable: false,
          align: 'center',
          hide: true,
        },
        {
          text: 'الوحدات',
          value: 'unit',
          sortable: false,
          align: 'center',
          hide: true,
        },
        {
          text: 'المستخدم',
          value: 'user_id',
          sortable: true,
          align: 'center',
          hide: true,
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

  computed: {
    helperData() {
      return this.$store.getters['HelperData/helperData']
    },
    UnitNames() {
      return this.$store.getters['Exam/UnitNames']
    },
    TamarkzNames() {
      return this.$store.getters['Exam/TamarkzNames']
    },
    ArmyNames() {
      return this.$store.getters['Exam/ArmyNames']
    },
    user() {
      return this.$store.getters['User/user']
    },
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
    permissions() {
      return this.$store.getters['User/permissions']
    },
    battaryId() {
      return this.$store.getters['Exam/battaries']
    },
    stage() {
      return this.$store.getters['Exam/stage']
    },
    examsBank() {
      return this.$store.getters['Exam/exams']
    },
    filtersItems() {
      const res = Object.fromEntries(
        Object.entries(this.filters).filter(
          ([_, v]) => v != null && (v || v === 0)
        )
      )
      Object.keys(res).forEach((elm) => {
        if (elm === 'battaryId') {
          res[elm] = this.battaryId.find((x) => x.id === res[elm]).name
        } else if (
          elm === 'stage' ||
          elm === 'final_opinion' ||
          elm === 'date' ||
          elm === 'examiner_status'
        ) {
          // nothing
        } else if (elm === 'user') {
          res[elm] = this.users.find((x) => x.Cat_ID === res[elm]).Cat_Name
        } else if (
          elm === 'transReason' ||
          elm === 'recommendation_res' ||
          elm === 'recommendation' ||
          elm === 'report' ||
          elm === 'examiner_status' ||
          elm === 'interviewEntqaDone'
        ) {
          res[elm] = this.getTextByValue(elm, res[elm])
        } else
          res[elm] = this.helpers[elm].find((x) => x.value === res[elm]).name
      })
      return res
    },
  },

  watch: {
    options: {
      handler() {
        this.fetchExaminers()
      },
      deep: true,
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
    filtersItems(val) {
      Object.keys(val).length || this.fetchExaminers(true)
    },
    currentSelectedExaminer(val) {
      if (val) {
        this.$store
          .dispatch('Exam/getAssignExams', this.currentSelectedExaminer.id)
          .then((res) => {
            const custom = res.data.customExam.map((elm) => elm.exam_id)
            this.exams = res.data.battary.filter(
              (elm) => elm.random === 'جهاز' && !custom.includes(elm.Exm_ID)
            )
          })
          .catch(() => {
            this.exams = []
          })
      }
    },
    'filters.user'(val) {
      this.$store
        .dispatch('Examiner/getDatesByUser', { user_id: val })
        .then((res) => {
          this.dates = res.data
        })
        .catch(() => {})
    },
  },
  mounted() {
    this.audio = new Audio(`${this.$audioPath}4357/4357.mp3`)
  },

  methods: {
    getTextByValue(arr, val) {
      const item = this.helperData[arr].find((elm) => elm.value === Number(val))
      if (item) {
        return item.text
      }
      return ''
    },
    getExaminerListsDifference(a1, a2) {
      return a2.filter((n) => !a1.includes(this.words[n]))
    },
    hideExaminer(examiner) {
      this.examiners.splice(
        this.examiners.findIndex(
          (elm) => elm.national_id === examiner.national_id
        ),
        1
      )
    },
    filterByExamDegree() {
      this.$setLocal('filterExam', this.filterExam)
      const keys = Object.keys(this.filterExam)
      if (keys.length > 0) {
        this.examiners = this.examinersListForOut.filter((ex) => {
          let isNoticed = false
          keys.forEach((k) => {
            const id = k.split('_')[1]
            if (
              ex.Answers[id] >= this.filterExam[`from_${id}`] &&
              ex.Answers[id] <= this.filterExam[`to_${id}`]
            ) {
              return (isNoticed = true)
            }
          })
          return isNoticed
        })
      } else {
        this.examiners = this.examinersList
      }
    },
    getExamPres(val, fullMark) {
      if (fullMark > 0) {
        return Math.floor((val / fullMark) * 100)
      } else {
        return 0
      }
    },
    getExamById(id) {
      const exam = this.examsBank.find(
        (elm) => Number(elm.Exm_ID) === Number(id)
      )
      if (exam) {
        return exam
      } else {
        return id
      }
    },
    saveManualCustomExam() {
      const exams = Object.fromEntries(
        Object.entries(this.examsVal).filter(([key, elm]) => elm)
      )
      if (Object.keys(exams).length > 0) {
        this.examLoading = true
        this.$store
          .dispatch('Exam/saveManualCustomExam', {
            exams,
            id: this.currentSelectedExaminer.id,
          })
          .then(() => {
            this.currentSelectedExaminer = null
            this.exams = []
            this.examsVal = []
          })
          .finally(() => {
            this.examLoading = false
          })
      }
    },
    saveUnit() {
      this.examUnitLoading = true
      this.$store
        .dispatch('Exam/saveUnit', {
          unit: this.unit,
          id: this.currentUnitSelectedExaminer.id,
        })
        .then(() => {
          this.currentUnitSelectedExaminer = null
          this.units = { UNIT_NAME: '', TAMARKZ_NAME: '', UNIT_ARMY_NAME: '' }
        })
        .finally(() => {
          this.examUnitLoading = false
        })
    },
    removeExamAns() {
      this.currentDeleteLoading = true
      this.$store
        .dispatch('Exam/again', { national_id: this.currentDelete.national_id })
        .then(() => {
          this.$store.commit('Notifications/setNotification', {
            text: 'تم الحذف بنجاح',
            color: 'success',
          })
          const index = this.examiners.findIndex(
            (elm) => elm.id === this.currentDelete.id
          )
          this.examiners[index]._count.Answers = 0
          this.currentDelete = null
          this.currentDeleteLoading = false
        })
        .catch((ex) => {
          this.$store.commit('Notifications/setNotification', {
            text: 'هناك مشكلة في الحذف',
            color: 'error',
          })
        })
        .finally(() => {
          this.currentDeleteLoading = false
        })
    },
    takeAction() {
      switch (this.noticedAction) {
        case 1:
          this.setAsFNoticed()
          break
        case 2:
          this.setAsAgain()
          break
        case 3:
          this.setAsFNoticed(1)
          break

        default:
          this.$store.commit('Notifications/setNotification', {
            text: 'من فضلك اختر من القائمه اولا ',
            color: 'error',
          })
          break
      }
    },
    setAsAgain() {
      this.actionLoading = true
      this.$store
        .dispatch('Exam/setAsAgain', {
          nationals: this.examiners.map((elm) => elm.national_id),
        })
        .then(() => {
          this.$store.commit('Notifications/setNotification', {
            text: 'تم التحديث بنجاح بنجاح',
            color: 'success',
          })
        })
        .catch(() => {
          this.$store.commit('Notifications/setNotification', {
            text: 'هناك مشكلة ',
            color: 'error',
          })
        })
        .finally(() => {
          this.actionLoading = false
        })
    },
    extractToDevice() {
      this.extractLoading = true
      this.$store
        .dispatch('Exam/extractToDevice', {
          nationals: this.examiners.map((elm) => elm.national_id),
          deviceIp: this.ip,
        })
        .then(() => {
          this.$store.commit('Notifications/setNotification', {
            text: 'تم استخراج المختبرين بنجاح بنجاح بنجاح',
            color: 'success',
          })
        })
        .catch(() => {
          this.$store.commit('Notifications/setNotification', {
            text: 'هناك مشكلة ',
            color: 'error',
          })
        })
        .finally(() => {
          this.extractLoading = false
        })
    },
    setAsFNoticed(second = 0) {
      this.actionLoading = true
      this.$store
        .dispatch('Exam/setAsFNoticed', {
          nationals: this.examiners.map((elm) => elm.national_id),
          second,
        })
        .then(() => {
          this.$store.commit('Notifications/setNotification', {
            text: 'تم التحديث بنجاح بنجاح',
            color: 'success',
          })
        })
        .catch(() => {
          this.$store.commit('Notifications/setNotification', {
            text: 'هناك مشكلة ',
            color: 'error',
          })
        })
        .finally(() => {
          this.actionLoading = false
        })
    },
    setFilter(filter, value) {
      this.filters[filter] = value
      this.fetchExaminers(true)
    },
    async saveF() {
      await this.$axios.post('/api/saveFake')
    },
    printRep() {
      this.$store.commit('Report/setReport', {
        data: this.examiners,
        columns: this.headers,
        backTo: '/ExaminerManager',
      })
      this.$router.push('/report')
    },

    async fetchExaminers(isSearch = false) {
      this.options.page = isSearch ? 1 : this.options.page
      if (this.newSet) this.options.newSet = this.newSet
      if (this.withResult) this.options.withResult = this.withResult

      if (this.nafsy) this.options.nafsy = this.nafsy

      if (this.showAll) this.options.showAll = this.showAll

      this.loading = true
      if (this.deleteItems) {
        this.options.deleteItems = this.deleteItems
      } else {
        delete this.options.deleteItems
      }
      await this.$store
        .dispatch(`Examiner/getExaminers`, {
          search: this.search,
          ...this.filters,
          ...this.options,
        })
        .then((res) => {
          this.examiners = res.data.examiners
          this.examinersList = res.data.examiners
          if (this.showAll) {
            this.examinersListForOut = res.data.showAllExaminers
          } else {
            this.examinersListForOut = []
          }
          this.allExaminers = res.data.allExaminers
          this.headers = [...this.headers]
          if (this.examiners && this.examiners.length > 0) {
            if (this.examiners[0].Answers) {
              this.filterExam = this.$getLocal('filterExam') || {}
              this.examiners.forEach((element, index) => {
                Object.keys(element.Answers).forEach((k) => {
                  const ex = this.getExamById(k)
                  this.examiners[index].Answers[k] = this.getExamPres(
                    element.Answers[k],
                    ex.fullMark
                  )
                  if (this.headers.findIndex((e) => e.id === k) === -1) {
                    this.headers.push({
                      text: ex.Exm_Name,
                      id: k,
                      align: 'center',
                      value: `Answers`,
                      hide: false,
                      sortable: false,
                    })
                  }
                })
              })
            }
          }
          if (this.examinersListForOut && this.examinersListForOut.length > 0) {
            if (this.examinersListForOut[0].Answers) {
              this.examinersListForOut.forEach((element, index) => {
                Object.keys(element.Answers).forEach((k) => {
                  const ex = this.getExamById(k)
                  this.examinersListForOut[index].Answers[k] = this.getExamPres(
                    element.Answers[k],
                    ex.fullMark
                  )
                })
              })
            }
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    getReports() {
      this.reportLoading = true
      this.$store
        .dispatch(`Examiner/getReports`, {
          ...this.filters,
        })
        .then((res) => {
          this.$store.commit('Report/setReport', {
            data: res.data,
            columns: reportHeaders[`report${this.filters.report}`],
            backTo: '/ExaminerManager',
            filterData: this.filters.report === 1,
          })
          this.$router.push('/report')
        })
        .finally(() => {
          this.reportLoading = false
        })
    },
    deleteItem(item) {
      this.editedIndex = this.examiners.indexOf(item)
      this.dialogDelete = true
    },
    getDataFromTag() {
      this.tagLoading = true
      this.$store
        .dispatch(`Examiner/getDataFromTag`)
        .then(() => {
          this.$store.commit('Notifications/setNotification', {
            text: 'تم السحب بنجاح',
            color: 'success',
          })
        })
        .catch((rej) => {
          this.$store.commit('Notifications/setNotification', {
            text: 'حدث خطأ اثناء الاتصال بالسيرفر تأكد ان الجهاز متصل بالشبكه الداخليه للمنطقة',
            color: 'error',
          })
        })
        .finally(() => {
          this.tagLoading = false
        })
    },

    readExaminerFromMdb() {
      this.loading = true
      this.$store
        .dispatch(`Examiner/readExaminerFromMdb`)
        .then((res) => {
          this.examiners = res.data
          this.allExaminers = this.examiners.length
        })
        .finally(() => {
          this.loading = false
        })
    },
    readUnitsFromMdb() {
      this.readUnitsLoading = true
      this.$store
        .dispatch(`Examiner/readUnitsFromMdb`)
        .then((res) => {
          this.$store.commit('Notifications/setNotification', {
            text: res.data,
            color: 'success',
          })
        })
        .catch((rej) => {
          this.$store.commit('Notifications/setNotification', {
            text: 'حدث خطأ. من فضلك تأكد من اسم ملف ال mdb هو (TNZ_GEHA_CODE.mdb) و اسماء الاعمده في الملف هي (UNIT_NAME,TAMARKZ_NAME,ARMY_TAGNEED_NAME,MIL_NO,GEHA_NAME,RAKMSOLASY)',
            color: 'error',
          })
        })
        .finally((a) => {
          this.readUnitsLoading = false
        })
    },

    deleteItemConfirm() {
      this.$store.dispatch('Examiner/deleteExaminer', {
        id: this.examiners[this.editedIndex].id,
      })
      this.examiners.splice(this.editedIndex, 1)
      this.closeDelete()
    },
    closeDelete() {
      this.dialogDelete = false
    },
  },
}
</script>

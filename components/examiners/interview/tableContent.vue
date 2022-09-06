<template>
  <div>
    <table-title v-if="title">{{ title }}</table-title>
    <v-simple-table class="interviewTable">
      <tr class="customGrey">
        <th v-for="(col, k) in columns" :key="col + '_' + k">{{ col }}</th>
      </tr>
      <tbody>
        <tr>
          <td v-for="(row, k) in rows" :key="row + '_' + k">{{ row }}</td>
        </tr>
      </tbody></v-simple-table
    >
  </div>
</template>

<script>
import tableTitle from './tableTitle.vue'
export default {
  components: { tableTitle },
  props: {
    content: {
      type: Object,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    columns() {
      return Object.keys(this.content)
    },
    rows() {
      return Object.values(this.content)
    },
  },
}
</script>

<style>
.interviewTable th {
  font-size: 0.75rem;
}
.interviewTable td {
  border: 1px solid #eee;
  border-top: none;
  text-align: center;
}
</style>

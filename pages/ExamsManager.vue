<template>
  <div>
    <assign-exam></assign-exam>
  </div>
</template>

<script>
import assignExam from '~/components/examManager/assignExam.vue'
export default {
  name: 'ExamsManager',
  components: { assignExam },
  data() {
    return {
      tab: null,
    }
  },
}
</script>
<style>
/* width */
::-webkit-scrollbar {
  width: 3px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

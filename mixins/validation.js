export default {
  data() {
    return {
      national_ru: [
        (v) => !!v || 'الرقم القومي مطلوب',
        (v) => (v && v.length === 14) || 'الرقم القومي 14 رقما',
      ],
      sold_ru: [(v) => (v && v.length === 13) || 'الرقم العسكري 13 رقما'],
      required: [(v) => !!v || 'هذا الحقل مطلوب'],
      minMax4: [(v) => (v && v.length === 4) || !v || 'الرقم مكون من 4 ارقام'],
      min1Max3: [
        (v) => (v && v.length >= 1 && v.length <= 3) || !v || 'الرقم بين 1:3',
      ],
      min1Max4: [
        (v) => (v && v.length >= 1 && v.length <= 4) || !v || 'الرقم بين 1:4',
      ],
    }
  },
}

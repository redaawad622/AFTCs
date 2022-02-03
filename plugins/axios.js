export default function ({ $axios }) {
  $axios.defaults.params = $axios.defaults.params || {}
  if (process.env.NODE_ENV === 'development') {
    $axios.defaults.params.store_id = 1
  } else {
    $axios.defaults.params.store_id = process.env.store_id || 0
  }
}

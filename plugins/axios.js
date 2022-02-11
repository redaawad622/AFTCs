export default function ({ $axios }) {
  $axios.interceptors.response.use(
    function (response) {
      // Any status code that lie within the range of 2xx cause this function to trigger
      // Do something with response data
      return response
    },
    function (error) {
      // Any status codes that falls outside the range of 2xx cause this function to trigger
      // Do something with response error
      const { status, data } = error.response
      const res = []
      if (status === 422) {
        if (data.code === 'P2002') {
          data.meta.target.forEach((element) => {
            res[element] = 'هذا الحقل موجود مسبقا'
          })
        }
        return Promise.reject(res)
      }
      return Promise.reject(error)
    }
  )
}

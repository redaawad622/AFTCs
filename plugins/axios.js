export default function ({ $axios, app, store }) {
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
  $axios.interceptors.request.use(
    function (config) {
      // Do something before request is sent

      const user = app.$cookiz.get('user') || store.getters['User/currentLogin']
      if (user) {
        config.headers.id = user.Cat_ID
      }
      return config
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error)
    }
  )
}

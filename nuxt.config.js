import colors from 'vuetify/es5/util/colors'

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - AFTCs',
    title: 'AFTCs',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/helper.js',
    '~/plugins/axios.js',
    { src: '~/plugins/vue-timers', mode: 'client' },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    ['cookie-universal-nuxt', { alias: 'cookiz' }],
  ],
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    proxy: true,
    baseURL:
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : 'http://localhost:3000',
  },

  proxy: {
    '/api/': {
      target: 'http://localhost:3000',
      pathRewrite: { '^/api/': '' },
      changeOrigin: true,
    },
  },
  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: 'en',
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    rtl: true,
    lang: { current: 'en' },

    theme: {
      dark: false,
      options: { customProperties: true },

      themes: {
        dark: {
          primary: '#7048eb',
          accent: '#f1f1f4',
          secondary: '#DB5461',
          info: colors.teal.base,
          warning: colors.amber.darken2,
          error: '#ec547a',
          success: '#5bceae',
          primaryT: '#2f475f',
          secondaryT: '#adbfd0',
        },
        light: {
          primary: '#7048eb',
          accent: '#f1f1f4',
          secondary: '#DB5461',
          info: colors.blue.base,
          warning: colors.amber.darken2,
          error: '#ec547a',
          success: '#5bceae',
          primaryT: '#2f475f',
          secondaryT: '#adbfd0',
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.(ogg|mp3|wav|mpe?g)$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      })
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  serverMiddleware: [
    {
      path: '/api',
      handler: '~/api/index.js',
    },
  ],
}

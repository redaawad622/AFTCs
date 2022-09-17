import colors from 'vuetify/es5/util/colors'
import ar from 'vuetify/lib/locale/ar'

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
    { src: '~/plugins/vue_global.js', mode: 'client' },
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
    'nuxt-socket-io',
  ],
  io: {
    sockets: [
      // Required
      {
        // At least one entry is required
        name: 'home',
        url: 'http://localhost:3000',

        vuex: {
          /* see section below */
        },
        namespaces: {
          /* see section below */
        },
      },
      { name: 'guests', default: true, url: 'http://localhost:3000' },
      { name: 'car', url: 'http://somedomain2:3000' },
      { name: 'tv', url: 'http://somedomain3:3000' },
      { name: 'test', url: 'http://localhost:4000' },
    ],
  },
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
    icons: {
      iconfont: 'mdi', // default - only for display purposes
    },
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    rtl: true,
    lang: { current: 'ar', locales: { ar } },

    theme: {
      dark: false,
      options: { customProperties: true },
      themes: {
        dark: {
          primary: '#7048eb',
          accent: '#a42cd6',
          secondary: '#DB5461',
          info: colors.teal.base,
          warning: colors.amber.darken2,
          error: '#ec547a',
          success: '#5bceae',
          primaryT: '#2f475f',
          secondaryT: '#adbfd0',
          customGrey: '#f1f1f4',
        },
        light: {
          primary: '#7048eb',
          accent: '#a42cd6',
          customGrey: '#f1f1f4',
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
    host: '0.0.0.0',
    port: 3000,
  },

  serverMiddleware: [
    {
      path: '/api',
      handler: '~/api/index.js',
    },
  ],
}

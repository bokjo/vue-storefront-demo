import webpack from 'webpack';
import { VSF_LOCALE_COOKIE } from '@vue-storefront/core';
import theme from './themeConfig';

export default {
  mode: 'universal',
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'crossorigin'
      },
      {
        rel: 'preload',
        href: 'https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap',
        as: 'style'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Raleway:300,400,400i,500,600,700|Roboto:300,300i,400,400i,500,700&display=swap',
        media: 'print',
        onload: 'this.media=\'all\'',
        once: true
      }
    ],
    script: []
  },
  loading: { color: '#fff' },
  router: {
    middleware: ['checkout'],
    scrollBehavior(_to, _from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      } else {
        return { x: 0, y: 0 };
      }
    }
  },
  buildModules: [
    // to core
    '@nuxt/typescript-build',
    '@nuxtjs/style-resources',
    // to core soon
    '@nuxtjs/pwa',
    ['@vue-storefront/nuxt', {
      coreDevelopment: true,
      useRawSource: {
        dev: [
          '@vue-storefront/commercetools',
          '@vue-storefront/core'
        ],
        prod: [
          '@vue-storefront/commercetools',
          '@vue-storefront/core'
        ]
      }
    }],
    ['@vue-storefront/nuxt-theme'],
    ['@vue-storefront/commercetools/nuxt', {
      i18n: { useNuxtI18nConfig: true }
    }]
  ],
  modules: [
    'nuxt-i18n',
    'cookie-universal-nuxt',
    'vue-scrollto/nuxt',
    '@vue-storefront/middleware/nuxt',
    ['nuxt-adyen-module', {
      merchantAccount: "Propellor284",
      returnUrl: "http://localhost:3000/api/handleShopperRedirect",
      checkoutEndpoint: "http://localhost:3000/checkout",
      apiKey: "AQEnhmfuXNWTK0Qc+iSAgGsoouiXR5kfVcf85/Usu5evfwAcEJaWPRkdEMFdWw2+5HzctViMSCJMYAc=-g4Ng2rYU3w333hcuYZKGz1RAY06O7ozEWp01l6Nr7/I=-QsY%}}9d5AfC9>)<",
      origin: "http://localhost:3000",
      channel: "Web",
      hmacKey: "10001|AE7852658D6D3F4C88CFF94E6EDF39541DAD4C2EBA9AB85653D00659A50FE2A8BACF3ECF860FECFBF95729054B1988B0CDC964EFC3FA87544548A5E8F6430AE08373EF581F10C49494F58E05DFAAF827D170FD484847ABCF30C437D6913C132A1987A4A1D39841508F5E7D292C54F369CF14663204C7869395429FEDD663726A04E87ED611CED3B3397DE1E11CA2783B43D4CE221ABF367D2FB101815E2C1C1FBE236F1DADAF5D501D68048615ED1F687BEEB6BEF045DE2EB39210C7F7B9716210EDA8133304DA0FEE5E95A4E7811631DCFA87586413442ED4E4B42D79C53311155F4EDDD699A9FF568CDD24885F316CFA7DF0AF74E0787125676E92C30DC1E3",
      environment: "test",
      clientKey: "test_ZAYRTMFQQ5EZLL5A2AYV5RUDDY7HDW5D",
    }]
  ],
  adyen: {
    /* module options */
  },
  i18n: {
    currency: 'USD',
    country: 'US',
    countries: [
      { name: 'US', label: 'United States', states: ['California', 'Nevada'] },
      { name: 'AT', label: 'Austria' },
      { name: 'DE', label: 'Germany' },
      { name: 'NL', label: 'Netherlands' }
    ],
    currencies: [
      { name: 'EUR', label: 'Euro' },
      { name: 'USD', label: 'Dollar' }
    ],
    locales: [
      { code: 'en', label: 'English', file: 'en.js', iso: 'en' },
      { code: 'de', label: 'German', file: 'de.js', iso: 'de' }
    ],
    defaultLocale: 'en',
    lazy: true,
    seo: true,
    langDir: 'lang/',
    vueI18n: {
      fallbackLocale: 'en',
      numberFormats: {
        en: {
          currency: {
            style: 'currency', currency: 'USD', currencyDisplay: 'symbol'
          }
        },
        de: {
          currency: {
            style: 'currency', currency: 'EUR', currencyDisplay: 'symbol'
          }
        }
      }
    },
    detectBrowserLanguage: {
      cookieKey: VSF_LOCALE_COOKIE
    }
  },
  styleResources: {
    scss: [require.resolve('@storefront-ui/shared/styles/_helpers.scss', { paths: [process.cwd()] })]
  },
  publicRuntimeConfig: {
    theme
  },
  build: {
    babel: {
      plugins: [
        ['@babel/plugin-proposal-private-methods', { loose: true }]
      ]
    },
    transpile: [
      'vee-validate/dist/rules'
    ],
    plugins: [
      new webpack.DefinePlugin({
        'process.VERSION': JSON.stringify({
          // eslint-disable-next-line global-require
          version: require('./package.json').version,
          lastCommit: process.env.LAST_COMMIT || ''
        })
      })
    ],
    extend(config, ctx) {
      if (ctx && ctx.isClient) {
        config.optimization = {
          ...config.optimization,
          mergeDuplicateChunks: true,
          splitChunks: {
            ...config.optimization.splitChunks,
            chunks: 'all',
            automaticNameDelimiter: '.',
            maxSize: 128_000,
            maxInitialRequests: Number.POSITIVE_INFINITY,
            minSize: 0,
            maxAsyncRequests: 10,
            cacheGroups: {
              vendor: {
                test: /[/\\]node_modules[/\\]/,
                name: (module) => `${module
                  .context
                  .match(/[/\\]node_modules[/\\](.*?)([/\\]|$)/)[1]
                  .replace(/[.@_]/gm, '')}`
              }
            }
          }
        };
      }
    }
  }
};

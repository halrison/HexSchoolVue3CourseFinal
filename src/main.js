import { createApp } from 'vue'
import { Form, Field, ErrorMessage, defineRule, configure, FieldArray } from 'vee-validate'
import { localize, setLocale } from '@vee-validate/i18n'
import { all as VeeValidateRules } from '@vee-validate/rules'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'
import Loading from 'vue3-loading-overlay'
import App from './App.vue'
import router from './router'
import { currency, transDate } from './util'
Object.keys( VeeValidateRules ).forEach( function ( rule ) {
  defineRule( rule, VeeValidateRules[ rule ] )
} )
configure( {
  generateMessage: localize( 'zh_TW', zhTW ),
  validateOnInput: true
} )
setLocale( 'zh_TW' )
library.add(fas, far, fab)
const app = createApp( App )
app.use( router )
app.component('font-awesome-icon', FontAwesomeIcon)
app.component( 'LoadingC', Loading )
app.component( 'FormC', Form )
app.component( 'FieldC', Field )
app.component( 'FieldArray', FieldArray )
app.component( 'ErrorMessage', ErrorMessage )
app.config.globalProperties.$filters = { currency, transDate }
app.mount( '#app' )
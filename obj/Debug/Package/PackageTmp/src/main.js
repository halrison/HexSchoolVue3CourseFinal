import { createApp } from 'vue'
import { Form, Field, ErrorMessage, defineRule, configure, FieldArray } from 'vee-validate'
import { localize, setLocale } from '@vee-validate/i18n'
import * as VeeValidateRules from '@vee-validate/rules'
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json'
import Loading from 'vue-loading-overlay'
import App from './App.vue'
import router from './router'
import pinia from './stores'

Object.keys(VeeValidateRules).forEach(function (rule) { 
  defineRule(rule, VeeValidateRules[rule])
})

configure({
  generateMessage: localize('zh_TW', zhTW),
  validateOnInput: true
})
setLocale('zh_TW')

const app = createApp(App)

app.config.globalProperties.window = window
app.use(router)
app.use(pinia)
app.component('LoadingC', Loading)
app.component('FormC', Form)
app.component('FieldC', Field)
app.component('FieldArray', FieldArray)
app.component('ErrorMessage', ErrorMessage)
app.mount('#app')
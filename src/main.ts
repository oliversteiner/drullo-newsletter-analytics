import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueGlobalVar from 'vue-global-var'
import 'vue-good-table/dist/vue-good-table.css'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown'
import { faCaretRight } from '@fortawesome/free-solid-svg-icons/faCaretRight'
import { faChartBar } from '@fortawesome/free-solid-svg-icons/faChartBar'
import { faCog } from '@fortawesome/free-solid-svg-icons/faCog'
import { faCheck } from '@fortawesome/free-solid-svg-icons/faCheck'
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle'
import { faClock } from '@fortawesome/free-solid-svg-icons/faClock'
import { faTh } from '@fortawesome/free-solid-svg-icons/faTh'
import { faSun } from '@fortawesome/free-solid-svg-icons/faSun'
import { faMoon } from '@fortawesome/free-solid-svg-icons/faMoon'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons/faCircleNotch'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle'

// Moment
import moment from 'moment'

library.add(
  faCaretDown,
  faCaretRight,
  faCheck,
  faCog,
  faExclamationTriangle,
  faExclamationCircle,
  faClock,
  faChartBar,
  faTh,
  faCircleNotch,
  faSun,
  faMoon,
  faCircle,
  faTimesCircle,
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Global Vars / Theme // TODO remove?
Vue.use(VueGlobalVar, {
  globals: {
    $theme: 'dark',
  },
})

// Config
Vue.config.performance = true
Vue.config.productionTip = false

// Moment with Locale
require('moment/locale/de-ch')
Vue.use(require('vue-moment'), {
  moment,
})

// fixed header in Subscriber list
require('moment/locale/de-ch')

// Global Events / Emits
export const eventBus = new Vue()

// App
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

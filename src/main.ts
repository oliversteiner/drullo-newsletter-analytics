import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

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
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope'
import { faMobileAlt } from '@fortawesome/free-solid-svg-icons/faMobileAlt'
import { faPhoneSquareAlt } from '@fortawesome/free-solid-svg-icons/faPhoneSquareAlt'
import { faToggleOn } from '@fortawesome/free-solid-svg-icons/faToggleOn'
import { faToggleOff } from '@fortawesome/free-solid-svg-icons/faToggleOff'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons/faChevronRight'
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons/faChevronLeft'
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons/faPlusCircle'
import { faUserCog } from '@fortawesome/free-solid-svg-icons/faUserCog'
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp'

// Moment
import moment from 'moment'

// i18n
import VueI18n from 'vue-i18n'
import en from '@/locales/en.json'
import de from '@/locales/de.json'

// Fontawesome Icons
library.add(
  faCaretDown,
  faCaretDown,
  faCaretRight,
  faCaretUp,
  faChartBar,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faCircle,
  faCircleNotch,
  faClock,
  faCog,
  faEnvelope,
  faExclamationCircle,
  faExclamationTriangle,
  faMobileAlt,
  faMoon,
  faPhoneSquareAlt,
  faPlus,
  faPlusCircle,
  faSearch,
  faSun,
  faTh,
  faTimesCircle,
  faToggleOff,
  faToggleOn,
  faUserCog,
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Config
Vue.config.performance = true
Vue.config.productionTip = false

// Moment with Locale
require('moment/locale/de-ch')
Vue.use(require('vue-moment'), {
  moment,
})

// Global Events / Emits
export const eventBus = new Vue()

// Filters
Vue.filter('formatAsPhoneNumber', (value: string) => {
  if (!value) return ''
  return value
})

// i18n
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, de },
})

// App
new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app')

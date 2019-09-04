import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMoment from 'vue-moment'
import VueGlobalVar from 'vue-global-var'
import 'vue-good-table/dist/vue-good-table.css'

// Font Awesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faCheck,
  faCog,
  faExclamationTriangle,
  faExclamationCircle,
  faClock,
  faChartBar,
  faTh,
  faCaretDown,
  faCaretRight,
  faCircleNotch,
  faSun,
  faMoon,
  faCircle,
} from '@fortawesome/free-solid-svg-icons'

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
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// Global Vars / Theme
Vue.use(VueGlobalVar, {
  globals: {
    $theme: 'dark',
  },
})

// Config
Vue.config.performance = true
Vue.config.productionTip = false

// Moment
Vue.use(VueMoment as any)

// Global Events / Emits
export const eventBus = new Vue()

// App
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

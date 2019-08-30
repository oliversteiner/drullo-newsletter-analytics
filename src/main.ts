import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMoment from 'vue-moment'
import 'vue-good-table/dist/vue-good-table.css'

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
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

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
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.use(VueMoment as any)

export const eventBus = new Vue()

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

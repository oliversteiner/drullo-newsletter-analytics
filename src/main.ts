import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueMoment from 'vue-moment'

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
)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false
Vue.use(VueMoment as any)

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

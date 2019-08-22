import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCheck, faCog, faExclamationTriangle, faExclamationCircle, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import '@/assets/main.css';
import VueMoment from 'vue-moment';

library.add(faCheck,faCog, faExclamationTriangle, faExclamationCircle, faClock )
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false;
Vue.use(VueMoment as any)


new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');

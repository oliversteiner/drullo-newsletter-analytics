import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'tasks',
      component: () => import('@/views/Tasks/Tasks.vue'),
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('@/views/Analytics/Analytics.vue'),
    },
    {
      path: '/subscribers',
      name: 'subscribers',
      component: () => import('@/views/SubscribersPage/SubscribersPage.vue'),
    },
  ],
})

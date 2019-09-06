import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

const router = new Router({
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
    {
      path: '/develop',
      name: 'Develop',
      component: () => import('@/views/DeveloperPage/DeveloperPage.vue'),
    },
  ],
})

const waitForStorageToBeReady = async (to, from, next) => {
  await store.restored
  next()
}
router.beforeEach(waitForStorageToBeReady)


export default router

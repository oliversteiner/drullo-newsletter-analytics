<template>
  <div id="app">
    <div class="main-theme" :class="theme">
      <div style="display: flex;justify-content: space-between">
        <AppNavbar></AppNavbar>
        <ThemeSwitcher></ThemeSwitcher>
      </div>
      <StatusMessages></StatusMessages>
      <router-view></router-view>
      <AppFooter></AppFooter>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import AppFooter from './components/AppFooter.vue'
import AppNavbar from './components/AppNavbar.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher/ThemeSwitcher.vue'
import { eventBus } from '@/main'
import {NewsletterStore, SubscriberStore} from '@/store'
import StatusMessages from '@/components/StatusMesages/StatusMessages.vue'

@Component({
  components: {
    AppFooter,
    AppNavbar,
    ThemeSwitcher,
    StatusMessages,
  },
})
export default class App extends Vue {
  private theme: string = 'dark'

  async created() {
    eventBus.$on('theme', (themeID: string) => {
      this.theme = themeID
    })

    // Newsletter
    await NewsletterStore.refresh()

    // Subscribers
    await SubscriberStore.refresh()
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

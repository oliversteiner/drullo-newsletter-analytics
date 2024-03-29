<template>
  <div id="app">
    <div class="main-theme" :class="theme">
      <div style="display: flex;justify-content: space-between">
        <AppNavbar></AppNavbar>
        <div class="settings-icons">
          <ThemeSwitcher></ThemeSwitcher>
          <AppSettings></AppSettings>
        </div>
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
import { NewsletterStore, SettingsStore, SubscriberStore, TasksStore, TermsStore } from '@/store'
import StatusMessages from '@/components/StatusMesages/StatusMessages.vue'
import AppSettings from '@/components/AppSettings/AppSettings.vue'

@Component({
  components: {
    AppFooter,
    AppNavbar,
    ThemeSwitcher,
    StatusMessages,
    AppSettings,
  },
})
export default class App extends Vue {
  private theme: string = 'dark'

  async refreshStore() {
    console.log('refresh Store')

    // Terms
    await TermsStore.refresh()

    // Tasks
    await TasksStore.refresh()

    // Newsletter
    await NewsletterStore.refresh()

    // Subscribers
    await SubscriberStore.refresh()
  }

  created() {
    eventBus.$on('theme', (themeID: string) => {
      this.theme = themeID
    })

    this.refreshStore()

    // set Language
    if (!SettingsStore.language) {
      this.$i18n.locale = SettingsStore.language
    }
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

.settings-icons {
  display: flex;
  margin-right: 10px;
  margin-left: 20px;
}
</style>

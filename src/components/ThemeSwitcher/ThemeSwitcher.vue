<template>
  <div class="theme-switcher" @mouseover="showMessage()" @mouseleave="hideMessage()">
    <div v-if="messageActive" class="theme-switcher-message">{{ message }}</div>
    <div class="theme-switcher-icon" @click="switchTheme">
      <font-awesome-icon v-if="currentTheme === 'dark'" icon="moon"></font-awesome-icon>
      <font-awesome-icon v-if="currentTheme === 'light'" icon="sun"></font-awesome-icon>
      <font-awesome-icon v-if="currentTheme === 'system'" icon="circle"></font-awesome-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { eventBus } from '@/main'

@Component({})
export default class ThemeSwitcher extends Vue {
  private themes = [
    { id: 'dark', name: 'Dark Mode' },
    { id: 'light', name: 'Light Mode' },
    { id: 'system', name: 'Auto' },
  ]
  private index = 0
  private currentTheme = 'dark'
  private messageActive = false

  get message() {
    return this.themes[this.index].name
  }

  showMessage() {
    this.messageActive = true
  }

  hideMessage() {
    this.messageActive = false
  }

  switchTheme() {
    this.index++
    let theme = 'light'
    // Auto
    switch (this.index) {
      case 0:
        theme = 'dark'
        this.currentTheme = theme
        break
      case 1:
        theme = 'light'
        this.currentTheme = theme
        break
      case 2:
        let UserColorScheme = getComputedStyle(document.documentElement)
          .getPropertyValue('content')
          .trim()
        UserColorScheme = UserColorScheme.replace(/"/g, '')
        console.log('userPref:', UserColorScheme)
        theme = UserColorScheme
        this.currentTheme = 'system'
        break
      default:
        this.index = 0
        theme = 'dark'
        this.currentTheme = theme
        break
    }
    eventBus.$emit('theme', theme)
  }
}
</script>

<style lang="scss">
@import 'ThemeSwitcher';
</style>

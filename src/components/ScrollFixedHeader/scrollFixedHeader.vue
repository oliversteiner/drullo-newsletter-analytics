<!--
Based on
https://github.com/TriDiamond/vuejs-scroll-fixed-header
rebuild for TS: oliver@mollo.ch
-->
<template>
  <div :class="[{ 'scroll-fixed-header': true, 'is-fixed': fixed }, userClass]">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class ScrollFixedHeader extends Vue {
  @Prop() threshold!: number
  @Prop() fixed!: boolean
  @Prop() userClass!: string

  tag: string = '' // target html tag
  check: any = null

  mounted() {
    this.tag = this.getTargetTag()
    this.scrollCheck()
  }

  beforeDestroy() {
    this.removeScrollEvent()
  }

  /**
   * Get the current browser supported html tag for watching scroll status
   * @returns {string}
   */
  getTargetTag() {
    // sougou browser support
    if (navigator.userAgent.toLowerCase().indexOf('se 2.x') > -1) {
      return 'body'
    }
    // edge brower support
    if (navigator.userAgent.includes('Edge')) {
      return 'body'
    }
    // firefox browser support
    if (navigator.userAgent.includes('Firefox/') && +navigator.userAgent.split('Firefox/')[1] >= 62) {
      return 'html'
    }
    // chrome browser support
    // @ts-ignore
    if (!window.chrome && 'WebkitAppearance' in document.documentElement.style) return 'body'
    return 'html'
  }

  /**
   * Check for current scroll top height has past the threshold
   */
  scrollCheck() {
    this.check = () => {
      const { tag, threshold } = this
      if (!tag) {
        return
      }
      const elem = document.querySelector(tag)
      if (elem) {
        this.$emit('update:fixed', elem.scrollTop > threshold)
      }
    }
    this.registerScrollEvent()
  }

  /**
   * Register scroll listening event
   */
  registerScrollEvent() {
    window.addEventListener('scroll', this.check)
  }

  /**
   * Remove scroll listening event
   */
  removeScrollEvent() {
    window.removeEventListener('scroll', this.check)
  }
}
</script>

<style scoped>
.scroll-fixed-header.is-fixed {
  position: fixed;
  z-index: 199;
}
</style>

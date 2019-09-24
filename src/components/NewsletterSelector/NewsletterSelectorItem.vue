<template>
  <div id="newsletter-selector-item">
    <h1>{{ newsletter.title }}</h1>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Newsletter } from '@/_models/NewsletterClass'

@Component
export default class NewsletterSelectorItem extends Vue {
  @Prop() newsletter!: Newsletter[]
}
</script>
<style lang="scss">
@import 'NewsletterSelector';
</style>

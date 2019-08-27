<template>

    <div id="newsletter-selector-item">
        <h1>{{newsletter.title}}</h1>
    </div>

</template>
<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator'
  import {Newsletter} from '@/store/models'

  @Component
  export default class NewsletterSelectorItem extends Vue {
    @Prop() newsletter!: Newsletter[]

  }
</script>
<style>
    @import '_NewsletterSelector.scss';
</style>

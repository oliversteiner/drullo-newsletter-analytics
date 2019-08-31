<template>
    <div class="newsletter-selector">
        <ul>
            <li v-for="(newsletter , index) in newsletterList"
                :key="newsletter.id"
                @click="changeItem(index)"
                v-bind:class="{'active': current === index}">
                <div class="wrapper">
                    <!-- Label -->
                    <div class="label">{{ newsletter.title}}</div>
                    <!-- Send Date -->
                    <div class="date">
                        <div v-if="!newsletter.is_send"> -</div>
                        <div v-if="newsletter.is_send">({{newsletter.send| moment('DD.MM.YYYY')}})</div>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script lang="ts">
  import {Vue, Component, Prop, Model} from 'vue-property-decorator'
  import {Newsletter} from '@/store/models'

  @Component
  export default class NewsletterSelector extends Vue {
    @Prop() newsletterList!: Newsletter[]
    @Prop() current!: number

    changeItem(selected: number) {
      console.log('changeItem', selected);
      this.$emit('changeNewsletter', selected);
    }


  }
</script>

<style lang="scss">
    @import 'NewsletterSelector';
</style>

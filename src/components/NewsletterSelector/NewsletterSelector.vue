<template>
  <div class="newsletter-selector">
    <!-- ============= Send ============= -->
    <ul>
      <li
        v-for="newsletter in newsletterListSend"
        :key="newsletter.id"
        :class="{ active: selectedNewsletter === newsletter.id }"
        @click="changeItem(newsletter.id)"
      >
        <div class="wrapper">
          <!-- Send Date -->
          <div class="date">
            <div v-if="newsletter.isSend">{{ newsletter.send | moment('DD. MMM') }}</div>
          </div>
          <!-- Label -->
          <div class="label">{{ newsletter.title }}</div>
        </div>
      </li>
    </ul>
    <!-- ============= UnSend ============= -->
    <div class="divider-un-send">Noch nicht gesended</div>
    <ul>
      <li
        v-for="(newsletter) in newsletterListUnSend"
        :key="newsletter.id"
        @click="changeItem(newsletter.id)"
        :class="{ active: selectedNewsletter === newsletter.id }"
      >
        <div class="wrapper">
          <!-- Send Date -->
          <div class="date">-</div>

          <!-- Label -->
          <div class="label">{{ newsletter.title }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Model } from 'vue-property-decorator'
import { Newsletter } from '@/models/models'

@Component
export default class NewsletterSelector extends Vue {
  @Prop() newsletterListSend!: Newsletter[]
  @Prop() newsletterListUnSend!: Newsletter[]
  @Prop() selectedNewsletter!: number

  changeItem(newsletterId: number) {
    this.$emit('changeNewsletter', newsletterId)
  }
}
</script>

<style lang="scss">
@import 'NewsletterSelector';
</style>

<template>
  <div class="subscriber-list-all">
    <!-- Number of Subscibers-->
    <div>{{ subscribers.length }} von {{ all }} Empfänger</div>

    <!-- List -->
    <ul class="subscriber-list">
      <li v-for="subscriber in subscribers" :key="subscriber.id + '-analytics'">
        <div class="subscriber-list-wrapper">
          <div class="subscriber-status" :class="subscriber.currentStatus"></div>
          <div v-if="debug">{{ subscriber.id }} -</div>
          <div>{{ subscriber.contact.email }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Subscriber } from '@/_models/SubscriberClass'

@Component
export default class SubscriberListAll extends Vue {
  @Prop() subscribers!: Subscriber[]
  @Prop() all!: number

  private debug = false
}
</script>

<style lang="scss" scoped>
@import 'SubscriberList';
</style>

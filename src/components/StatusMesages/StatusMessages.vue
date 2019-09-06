<template>
  <div class="status-messages">
    <div v-if="loading" class="loading">
      <div class="loading-icon">
        <font-awesome-icon icon="circle-notch" spin size="lg" />
      </div>
      <div class="loading-text">aktualisiere {{ name }}</div>

      <div class="loading-count">{{ progress }} von {{ all }}</div>
      <div class="loading-close-button-wrapper">
        <div class="loading-close-button" @click="close">
          <font-awesome-icon icon="times-circle"></font-awesome-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { eventBus } from '@/main'
import { StatusMessage } from '@/models/models'

@Component({})
export default class StatusMessages extends Vue {
  private name: string = ''
  private progress: number | string = 0
  private all: number = 0
  private loading = false

  close() {
    console.log('close');

    this.loading = false
  }

  mounted() {
    eventBus.$on('LOADING_DATA', (progressMessage: StatusMessage) => {
      switch (progressMessage.status) {
        case 'start':
          this.loading = true
          console.log('-- start', this.loading)

          //  this.loading = true
          if (progressMessage.count) this.all = progressMessage.count
          break
        case 'finish':
          this.loading = false
          console.log('-- finish', this.loading)
          break
        case 'loading':
          if (progressMessage.progress) {
            this.progress = progressMessage.progress
            console.log('-- loading', progressMessage.progress)
          }
          break
        case 'error':
          if (progressMessage.message) this.progress = progressMessage.message
          console.log('-- Error', progressMessage.message)
          break
        default:
          if (progressMessage.message) this.progress = progressMessage.message
          break
      }

      // ---- Subscriber ------------------
      if (progressMessage.module === 'subscribers') this.name = 'Empfänger'
    })
  }
}
</script>

<style lang="scss">
@import 'StatusMessages';
</style>

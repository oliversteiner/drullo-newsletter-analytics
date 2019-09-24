<template>
  <div class="subscriber-edit">
    <div v-if="subscriber">
      <!-- Toolbar -->
      <div class="edit-toolbar">
        <button>Edit</button>
        <button @click="save(subscriber.id)">Save</button>
        <button>Cancel</button>
      </div>

      <!-- Read -->
      <div class="read">
        <h2>{{ subscriber.personal.firstName }} {{ subscriber.personal.lastName }}</h2>
        <div>{{ subscriber.address.streetAndNumber }}</div>
        <div>{{ subscriber.address.zip_code }} {{ subscriber.address.city }}</div>
      </div>

      <hr />

      <!-- Edit -->
      <div class="edit">
        <h3>Edit</h3>
        <h2>
          <input v-model="subscriber.personal.firstName" placeholder="Vorname" />
          <input v-model="subscriber.personal.lastName" placeholder="Nachname" />
        </h2>
        <div>
          <input v-model="subscriber.address.streetAndNumber" placeholder="Strasse + Nr." />
        </div>
        <div>
          <input v-model="subscriber.address.zipCode" placeholder="PLZ" />
          <input v-model="subscriber.address.city" placeholder="Ort" />
        </div>
      </div>
    </div>
    <!-- if Subscriber -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Subscriber } from '@/_models/SubscriberClass'
import { SubscriberStore } from '@/store'

@Component({})
export default class SubscriberEdit extends Vue {
  @Prop() subscriberId!: number

  edit: boolean = false
  isSave: boolean = true
  private subscriber: Subscriber | null = null

  async save(id: number) {
    this.isSave = false
    const result = await SubscriberStore.saveSubscriberToServer(id)
    if (result && result.status && result.status === true) {
      this.isSave = true
    }
  }

  @Watch('subscriberId')
  updateCurrentSubscriber() {
    const subscriber = SubscriberStore.list.find(sub => sub.id === this.subscriberId)
    if (subscriber) {
      this.subscriber = subscriber
    }
  }

  created() {
    if (this.subscriberId) {
      const subscriber = SubscriberStore.list.find(sub => sub.id === this.subscriberId)
      if (subscriber) {
        this.subscriber = subscriber
      }
    }
  }
}
</script>

<style lang="scss">
@import 'SubscriberEdit';
</style>

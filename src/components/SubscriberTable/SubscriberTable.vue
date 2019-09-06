<template>
  <div class="subscriber-table">
    <vue-good-table :columns="columns" :rows="rows" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Subscriber } from '@/models/models'

@Component({
  components: {
    'vue-good-table': require('vue-good-table').VueGoodTable,
  },
})
export default class SubscriberTable extends Vue {
  @Prop() subscriberList!: Subscriber[]

  get columns() {
    const columns = [
      {
        label: 'ID',
        field: 'id',
      },
      {
        label: 'Vorname',
        field: 'first_name',
        filterOptions: {
          enabled: true, // enable filter for this column
          trigger: 'enter', //only trigger on enter not on keyup
        },
      },
      {
        label: 'Nachname',
        field: 'last_name',
        filterOptions: {
          enabled: true, // enable filter for this column
          trigger: 'enter', //only trigger on enter not on keyup
        },
      },
      {
        label: 'Age',
        field: 'age',
        type: 'number',
      },
      {
        label: 'Created On',
        field: 'createdAt',
        type: 'date',
        dateInputFormat: 'yyyy-MM-dd',
        dateOutputFormat: 'MMM Do yy',
      },
      {
        label: 'Percent',
        field: 'score',
        type: 'percentage',
      },
    ]

    return columns
  }

  get rows() {
    const rows: any[] = []

    this.subscriberList.map((subscriber: Subscriber) => {
      let row = {
        id: subscriber.id,
        firstName: subscriber.address.first_name,
        lastName: subscriber.address.last_name,
      }
      rows.push(row)
    })
    return rows
  }
}
</script>
<style scoped>
@import '_SubscriberTable.scss';
</style>

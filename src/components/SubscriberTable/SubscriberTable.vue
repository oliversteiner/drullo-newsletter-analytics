<template>
  <div class="subscriber-table">
    <vue-good-table :columns="columns" :rows="rows" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Subscriber } from '@/store/models'

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
        label: 'Name',
        field: 'name',
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
    const rowsSample = [
      { id: 1, name: 'John', age: 20, createdAt: '', score: 0.03343 },
      { id: 2, name: 'Jane', age: 24, createdAt: '2011-10-31', score: 0.03343 },
      { id: 3, name: 'Susan', age: 16, createdAt: '2011-10-30', score: 0.03343 },
      { id: 4, name: 'Chris', age: 55, createdAt: '2011-10-11', score: 0.03343 },
      { id: 5, name: 'Dan', age: 40, createdAt: '2011-10-21', score: 0.03343 },
      { id: 6, name: 'John', age: 20, createdAt: '2011-10-31', score: 0.03343 },
    ]

    this.subscriberList.map((subscriber: Subscriber) => {
      let row = {
        id: subscriber.id,
        name: subscriber.address.first_name +' ' + subscriber.address.last_name,
      }

      rows.push(row)
    })

    console.log(this.subscriberList)
    console.log(rows)

    return rows
  }
}
</script>
<style scoped>
@import '_SubscriberTable.scss';
</style>

<template>
  <div class="tasks">
    <h1>Tasks</h1>

    <TaskRelatedItem
      v-for="relatedItem in relatedItemList"
      :key="relatedItem.related"
      :related-item="relatedItem"
      :uuid="relatedItem.related"
    >
    </TaskRelatedItem>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TaskRelatedItem from '@/components/taskRelatedItem/TaskRelatedItem.vue'
import { TasksStore } from '@/store'

@Component({
  components: {
    TaskRelatedItem,
  },
})
export default class Tasks extends Vue {
  get relatedItemList() {
    return TasksStore.relatedList
  }

  async mounted() {
    // Tasks
    await TasksStore.refresh()
  }

  created() {}
}
</script>

<style lang="scss">
@import 'Tasks';
</style>

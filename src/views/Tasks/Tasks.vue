<template>
  <div class="tasks">
    <h1>Tasks</h1>
    <!-- <pre v-text="$attrs"/>-->

    <TaskRelatedItem
      v-for="relatedItem in relatedItemList"
      :relatedItem="relatedItem"
      :key="relatedItem.related"
      :uuid="relatedItem.related"
    >
    </TaskRelatedItem>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import tasks from '@/store/modules/tasks'
import TaskRelatedItem from '@/components/taskRelatedItem/TaskRelatedItem.vue'

@Component({
  components: {
    TaskRelatedItem,
  },
})
export default class Tasks extends Vue {
  get relatedItemList() {
    return tasks.relatedList
  }

  async created() {
    await tasks.refreshTasklist()
  }
}
</script>

<style lang="scss">
@import 'Tasks';
</style>

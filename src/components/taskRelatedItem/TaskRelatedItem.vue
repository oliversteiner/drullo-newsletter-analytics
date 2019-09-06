<template>
  <!-- <pre v-text="$attrs"/> -->
  <div class="task-related-item">
    <div class="wrapper" :class="{ detail: isLargeCardOpen }">
      <header class="task-related-item-header">
        <!-- Info -->
        <div class="box-info">
          <h2>{{ relatedItem.message.title }}</h2>

          <table class="table-related-info">
            <tr>
              <th>Gesendet:</th>
              <td>12.August</td>
            </tr>
            <tr>
              <th>Kategorie:</th>
              <td>{{ relatedItem.message.category }}</td>
            </tr>
            <tr>
              <th>Tasks:</th>
              <td>{{ numberOfTasksDone }} von {{ numberOfTasks }}</td>
            </tr>
          </table>
        </div>

        <!-- Toolbox -->
        <!-- Show only in Details Mode-->
        <div v-if="isLargeCardOpen" class="toolbox-more">
          <nav>
            <a role="button" class="btn btn-link">
              <font-awesome-icon icon="chart-bar" />
              Auswertung ansehen
            </a>
            <a role="button" class="btn btn-link" @click="largeCardToggle">
              <font-awesome-icon icon="th" />
              Details ausblenden
            </a>
          </nav>
        </div>
      </header>

      <main>
        <!-- List Preview Cards -->
        <div v-if="!isLargeCardOpen" class="box-task-card-preview-list" @click="largeCardToggle">
          <task-item-preview
            v-for="taskItemPreview in taskItemList"
            :key="taskItemPreview.id"
            :task-item-preview="taskItemPreview"
          />
        </div>

        <!-- List Large Cards -->
        <div v-if="isLargeCardOpen" class="box-task-card-large-list">
          <task-item v-for="taskItem in taskItemList" :key="taskItem.id" :task-item="taskItem" />
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import TaskItem from '@/components/taskItem/TaskItem.vue'
import { TaskRelated } from '@/models/models'
import TaskItemPreview from '@/components/taskItem/TaskItemPreview.vue'
import { TasksStore } from '@/store'

@Component({
  components: {
    TaskItem,
    TaskItemPreview,
  },
})
export default class TaskRelatedItem extends Vue {
  @Prop() relatedItem?: TaskRelated

  isLargeCardOpen: boolean = false

  get taskItemList() {
    const relatedItem = this.relatedItem

    if (relatedItem && relatedItem.related) {
      return TasksStore.list.filter(task => {
        return task.related === relatedItem.related
      })
    }
  }

  get numberOfTasks() {
    return TasksStore.count
  }

  get numberOfTasksDone(): number {
    return TasksStore.list.filter(task => task.done).length
  }

  largeCardToggle(): void {
    this.isLargeCardOpen = !this.isLargeCardOpen
  }
}
</script>

<style lang="scss">
@import 'TaskRelatedItem';
</style>

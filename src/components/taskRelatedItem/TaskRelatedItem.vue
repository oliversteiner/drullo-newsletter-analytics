<template>
    <!-- <pre v-text="$attrs"/> -->
    <div class="task-related-item">

        <div class="wrapper" v-bind:class="{detail: isLargeCardOpen}">


            <header class="task-related-item-header">
                <!-- Info -->
                <div class="box-info">
                    <h2>{{relatedItem.message.title}}</h2>

                    <table class="table-related-info">
                        <tr>
                            <th>Gesendet:</th>
                            <td>12.August</td>
                        </tr>
                        <tr>
                            <th>Kategorie:</th>
                            <td>{{relatedItem.message.category}}</td>
                        </tr>
                        <tr>
                            <th>Tasks:</th>
                            <td>{{numberOfTasksDone}} von {{numberOfTasks}}</td>
                        </tr>
                    </table>

                </div>

                <!-- Toolbox -->
                <!-- Show only in Details Mode-->
                <div class="toolbox-more" v-if="isLargeCardOpen">
                    <nav>
                        <a role="button" class="btn btn-link">
                            <font-awesome-icon icon="chart-bar"></font-awesome-icon>
                            Auswertung ansehen
                        </a>
                        <a role="button" class="btn btn-link" @click="largeCardToggle">
                            <font-awesome-icon icon="th"></font-awesome-icon>
                            Details ausblenden
                        </a>
                    </nav>
                </div>

            </header>

            <main>
                <!-- List Preview Cards -->
                <div class="box-task-card-preview-list" @click="largeCardToggle" v-if="!isLargeCardOpen">

                    <task-item-preview v-for="taskItemPreview in taskItemList"
                    :taskItemPreview="taskItemPreview"
                    :key="taskItemPreview.id">

                    </task-item-preview>
                </div>


                <!-- List Large Cards -->
                <div class="box-task-card-large-list" v-if="isLargeCardOpen">
                    <task-item v-for="taskItem in taskItemList"
                               :taskItem="taskItem"
                               :key="taskItem.id">

                    </task-item>
                </div>

            </main>
        </div>

    </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator'
  import TaskItem from "@/components/taskItem/TaskItem.vue"
  import {TaskRelated} from "@/models/models"
  import tasks from "@/store/modules/tasks"
  import TaskItemPreview from "@/components/taskItem/TaskItemPreview.vue"

  @Component({
    components: {
      TaskItem,TaskItemPreview
    },
  })
  export default class TaskRelatedItem extends Vue {
    @Prop() relatedItem?: TaskRelated

    isLargeCardOpen: boolean = false;


    get taskItemList() {
      const allTaskItems = tasks.taskList
      const related = this.relatedItem;

      if (related && related.related) {
        return allTaskItems.filter(task => {
          return task.related === related.related;
        })
      }


    }

    get numberOfTasks() {
      if (this.taskItemList)
        return this.taskItemList.length;
    }

    get numberOfTasksDone(): number {
      if (!this.taskItemList)
        return 0

      return this.taskItemList.filter(task => task.done).length
    }

    largeCardToggle(): void {
      console.log('toggle large Card', this.isLargeCardOpen);

      this.isLargeCardOpen = !this.isLargeCardOpen
    }


  }
</script>

<style lang="scss" scoped>
    @import "TaskRelatedItem";
</style>

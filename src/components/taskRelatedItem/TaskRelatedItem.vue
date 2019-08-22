<template>
    <!-- <pre v-text="$attrs"/> -->
    <div class="task-related-item" @click="toggleDetailsAction">

        <div class="wrapper" v-bind:class="{detail: showDetails}">

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

            <!-- List -->
            <div class="box-task-list">
                <task-item v-for="taskItem in taskItemList"
                           :taskItem="taskItem"
                           :key="taskItem.id"
                           :showDetails="showDetails" >

                </task-item>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator'
    import TaskItem from "@/components/taskItem/TaskItem.vue"
    import {TaskRelated} from "@/store/models"
    import tasks from "@/store/modules/tasks"

    @Component({
        components: {
            TaskItem,
        },
    })
    export default class TaskRelatedItem extends Vue {
        @Prop() relatedItem?: TaskRelated

        showDetails: boolean = true;


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

        toggleDetailsAction(): void {
            console.log('toggle Detail', this.showDetails);

             this.showDetails  = !this.showDetails
        }


    }
</script>

<style lang="scss" scoped>
    @import "TaskRelatedItem";
</style>

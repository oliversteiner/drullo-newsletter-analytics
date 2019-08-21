<template>
    <div class="related-item">
        <h2>{{relatedItem.message.title}}</h2>
        <div class="related">{{relatedItem.related}}</div>
<!--
        <pre v-text="$attrs"/>
-->

        <TaskItem v-for="taskItem in taskItemList"
                  :taskItem="taskItem"
                  :key="taskItem.id"></TaskItem>
    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator'
    import TaskItem from "@/components/task/TaskItem.vue"
    import {TaskRelated} from "@/store/models"
    import tasks  from "@/store/modules/tasks"

    @Component({
        components: {
            TaskItem,
        },
    })
    export default class TaskRelatedItem extends Vue {
        @Prop() relatedItem?: TaskRelated

        constructor() {
            super();
            console.log('tasks',tasks );

        }


        get taskItemList() {
            const allTaskItems = tasks.taskList
            const related = this.relatedItem;

            if(related && related.related){
                return allTaskItems.filter( task => {
                    return task.related === related.related;
                })
            }


        }



    }
</script>

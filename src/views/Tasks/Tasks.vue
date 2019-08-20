<template>
    <div class="Tasks">
        <h1>Tasks</h1>
        <pre v-text="$attrs"/>
        <pre v-text="tasklist"/>

        <ul>
            <li v-for="task in tasklist">
                {{task}}
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
    import {Vue, Component} from 'vue-property-decorator'
    import tasks from '@/store/modules/tasks'

    @Component({
        components: {},
    })
    export default class Tasks extends Vue {
        get tasklist() {
            return tasks.taskList
        }

        async created() {
            await tasks.refreshTasklist();
        }

    }
</script>

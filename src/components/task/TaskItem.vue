<template>
    <div class="task-item">
        <h3>Task {{taskItem.number}}</h3>
        <div>{{taskItem.id}}</div>
        <div>{{taskItem.title}}</div>
        <!-- <pre v-text="$attrs"/> -->

    </div>
</template>

<script lang="ts">
    import {Vue, Component, Prop} from 'vue-property-decorator'
    import {Task} from '@/store/models'

    @Component
    export default class TaskItem extends Vue {
        @Prop() taskItem?: Task

    }
</script>

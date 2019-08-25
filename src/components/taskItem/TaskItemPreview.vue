<template>
    <div class="task-item-preview">
        <div class="square" v-bind:class="taskItemPreview.status">
        </div>
    </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator'
  import {Task} from '@/store/models'

  @Component
  export default class TaskItemPreview extends Vue {
    @Prop() taskItemPreview?: Task


  }
</script>

<style lang="scss" scoped>
    @import 'TaskItem';
</style>

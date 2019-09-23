<template>
  <div class="task-item-preview">
    <div class="square" :class="taskItemPreview.status"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Task } from '@/_models/models'

@Component
export default class TaskItemPreview extends Vue {
  @Prop() taskItemPreview?: Task
}
</script>

<style lang="scss">
@import 'TaskItem';
</style>

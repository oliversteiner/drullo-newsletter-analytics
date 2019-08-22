<template>
  <!-- <pre v-text="$attrs"/> -->
  <div class="task-item">
    <div v-if="showDetails === false">
      <div class="square" v-bind:class="taskItem.status"></div>
    </div>

    <div v-if="showDetails">
      <div class="card" v-bind:class="[taskItem.status]">
        <!-- Card Main -->
        <div class="card-main">
          <!-- Status Icon-->
          <div class="cart-status-icon-wrapper">
            <div class="card-status-icon">
              <div class="status-icon status-icon-default" v-if="taskItem.status === 'default'">
                <font-awesome-icon icon="clock" />
              </div>
              <div class="status-icon status-icon-waiting" v-if="taskItem.status === 'waiting'">
                <font-awesome-icon icon="clock" />
              </div>
              <div class="status-icon status-icon-working" v-if="taskItem.status === 'working'">
                <font-awesome-icon icon="cog" />
              </div>
              <div class="status-icon status-icon-done" v-if="taskItem.status === 'done'">
                <font-awesome-icon icon="check" />
              </div>
              <div class="status-icon status-icon-warning" v-if="taskItem.status === 'warning'">
                <font-awesome-icon icon="exclamation-triangle" />
              </div>
              <div class="status-icon status-icon-error" v-if="taskItem.status === 'error'">
                <font-awesome-icon icon="uexclamation-circle" />
              </div>
            </div>
          </div>

          <!-- Status Message-->
          <div>{{ taskItem.statusMessage }}</div>

          <!-- Title -->
          <h3>Task {{ taskItem.number }}</h3>

          <!-- Run Rime humenreable-->
          <div class="date-time-redable">
            <span class="date-time-day">{{ taskItem.runMoment | moment('calendar') }} </span>
          </div>

          <!-- Runtime detail -->
          <div class="date-time-detail">
            <span class="date-time-day">{{ taskItem.runMoment | moment('dddd, D. MMMM - hh:mm') }} </span>
          </div>


            <!-- Button runTask -->
            <button class="run-task-trigger">Ausführen</button>


            <!-- Trigger Open Details-->
            <div class="card-details-open-trigger">
                <font-awesome-icon icon="caret-right"></font-awesome-icon> <span class="label-width-icon">Details</span></div>

            <!-- Trigger Close Details-->
            <font-awesome-icon icon="caret-down"></font-awesome-icon> <span class="label-width-icon">Detail schliessen</span></div>

            <!-- Number of Adresses -->
            <div >von <span class="from">201</span> bis <span class="to">400</span></div>

        </div> <!-- End Card Mein-->

        <!-- Card Details -->
        <div class="card-details">
          <div>{{ taskItem.id }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Constructor } from 'vue-property-decorator'
import { Task } from '@/store/models'
import { TaskStatus } from '@/enums'

@Component
export default class TaskItem extends Vue {
  @Prop() taskItem?: Task
  @Prop() showDetails?: boolean
}
</script>

<style lang="scss" scoped>
@import 'TaskItem';
</style>

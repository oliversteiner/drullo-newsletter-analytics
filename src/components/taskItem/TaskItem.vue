import {TaskStatus} from '@/enums';
<template>
  <!-- <pre v-text="$attrs"/> -->
  <div class="task-item">
    <div class="card" :class="[taskItem.status]">
      <!-- Card Main -->
      <div class="card-main">
        <!-- Status Icon-->
        <div class="card-status-icon-wrapper">
          <div class="card-status-icon">
            <!-- Default -->
            <div class="status-icon">
              <font-awesome-icon :icon="taskItem.icon" />
            </div>
          </div>
        </div>

        <!-- Status MolloMessages-->
        <div class="card-status-message">
          {{ taskItem.statusMessage }}
        </div>

        <!-- Title -->
        <h3 class="card-title">Task {{ taskItem.number }}</h3>

        <!-- Number of Adresses -->
        <div class="card-number-of-addresses">
          von
          <span class="from">{{ taskItem.range.from }}</span>
          bis
          <span class="to">{{ taskItem.range.to }}</span>
        </div>

        <!-- Runtime detail -->
        <div class="tooltip">
          <div v-if="isTimeDetailsOpen" class="date-time-detail tooltiptext">
            <span class="date-time-day">{{ taskItem.runMoment | moment('D. MMMM - HH:mm') }} </span>
          </div>

          <!-- Run Rime human readable-->
          <div class="card-date-time-readable" @click="toggleDateTimeDetails" @mouseout="hideDateTimeDetails">
            <span class="date-time-day">{{ taskItem.runMoment | moment('calendar') }} </span>
          </div>
        </div>

        <div class="detail-run-wrapper">
          <!-- Card Details Button -->
          <div class="card-details-button">
            <!-- Trigger Open Details-->
            <a
              v-if="!isCardDetailsOpen"
              role="button"
              class="btn card-details-open-trigger"
              @click="showCardDetailsToggle"
            >
              <font-awesome-icon icon="caret-right" />
              <span class="label-width-icon">Details</span>
            </a>

            <!-- Trigger Close Details-->
            <a
              v-if="isCardDetailsOpen"
              role="button"
              class="btn card-details-open-trigger"
              @click="showCardDetailsToggle"
            >
              <font-awesome-icon icon="caret-down" />
              <span class="label-width-icon">Schliessen</span>
            </a>
          </div>

          <!-- Button runTask -->
          <div>
            <a v-if="runTaskButtonStatus == 'waiting'" class="btn btn-outline run-task-button run-task-waiting"
              >Ausführen</a
            >
            <a
              v-if="runTaskButtonStatus === 'done'"
              class="btn btn-outline run-task-button run-task-done"
              @click="taskRun(taskItem.id)"
              >nochmals</a
            >
            <a
              v-if="runTaskButtonStatus === 'save-to-run'"
              class="btn btn-outline run-task-button run-task-save-to-run"
              @click="taskRun(taskItem.id)"
              >Jetzt Ausführen</a
            >
            <a v-if="runTaskButtonStatus == 'working'" class="btn btn-outline run-task-button run-task-working" />
          </div>
        </div>
      </div>
      <!-- Card Details -->
      <div v-if="isCardDetailsOpen" class="card-details">
        <table>
          <!-- ID -->
          <tr>
            <th>ID:</th>
            <td>{{ taskItem.id }}</td>
          </tr>

          <!-- All Addresses -->
          <tr>
            <th>Adressen:</th>
            <td>{{ taskItem.subscribers.all }}</td>
          </tr>

          <!--  Addresses with Errors -->
          <tr>
            <th>Fehlerhaft:</th>
            <td>{{ taskItem.subscribers.error }}</td>
          </tr>

          <!--  Addresses open -->
          <tr>
            <th>geöffnet:</th>
            <td>{{ taskItem.subscribers.open }}</td>
          </tr>

          <!--  Addresse IDs -->

          <tr>
            <td colspan="2">
              <div class="card-details-address-ids">
                <ul>
                  <li>1234</li>
                  <li>1234</li>
                  <li>1234</li>
                  <li>1234</li>
                  <li>1234</li>
                  <li>1234</li>
                  <li>1234</li>
                  <li>1234</li>
                  <li>1234</li>
                  <li>1234</li>
                  <li>1234</li>
                  <li>1234</li>
                  <li>1234</li>
                </ul>
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!-- End Card Main-->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Task } from '@/_models/models'
import { smmgApi } from '@/store/api'
import { TaskStatusMessage } from '@/enums'

@Component
export default class TaskItem extends Vue {
  @Prop() taskItem!: Task

  isCardDetailsOpen: boolean = false
  isTimeDetailsOpen: boolean = false

  showCardDetailsToggle() {
    return (this.isCardDetailsOpen = !this.isCardDetailsOpen)
  }

  // Date Time
  toggleDateTimeDetails() {
    return (this.isTimeDetailsOpen = !this.isTimeDetailsOpen)
  }

  showDateTimeDetails() {
    return (this.isTimeDetailsOpen = true)
  }

  hideDateTimeDetails() {
    return (this.isTimeDetailsOpen = false)
  }

  get icon() {
    return this.taskItem.icon
  }

  async taskRun(taskId: number) {
    const response = await smmgApi.get('/api/task/run/' + taskId)
    // TODO: Add UI Feedback
  }

  get runTaskButtonStatus(): string {
    let status = ''
    const taskItem = this.taskItem

    if (taskItem) {
      status = taskItem.status
      // Task is save to run
      if (taskItem.statusMessage == TaskStatusMessage.SAVE) status = 'save-to-run'
    }
    return status
  }
}
</script>

<style lang="scss">
@import 'TaskItem';
</style>

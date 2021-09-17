import { TaskStatusMessage } from '@/enums';
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
              <div v-if="taskItem.status === 'working'">
                <font-awesome-icon :icon="taskItem.icon" spin="spin" />
              </div>
              <div v-else>
                <font-awesome-icon :icon="taskItem.icon" />
              </div>
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
          <div v-if="debug" class="card-details-button">
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
            <a
              v-if="runTaskButtonStatus === 'waiting'"
              class="btn btn-outline run-task-button run-task-waiting"
              @click="taskRun(taskItem.id)"
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

          <!-- Button Delete-->
          <div class="btn btn-link btn-delete" @click="toggleFieldset('delete')">
            <font-awesome-icon icon="times-circle"></font-awesome-icon>
          </div>
        </div>
        <!-- Button delete Task -->
        <div class="delete-task">
          <div v-show="fieldset.delete.isOpen">
            <p>{{ $t('Delete this Task?') }}</p>
            <div class="row-between">
              <!-- Button Cancel -->
              <div class="btn btn-outline btn-delete" @click="fieldset.delete.isOpen = false">
                {{ $t('No, Cancel') }}
              </div>

              <!-- Button Delete -->
              <div class="btn btn-outline btn-delete" @click="deleteTask">
                {{ $t('Yes, Delete') }}
              </div>
            </div>
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
                  <li></li>
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
import { TaskStatus, TaskStatusMessage } from '@/enums'
import * as api from '@/store/api'
import { Task } from '@/_models/TaskClass'
import { TasksStore } from '@/store'

interface Fieldset {
  delete: FieldsetOptions
}
interface FieldsetOptions {
  isOpen: boolean
}

@Component
export default class TaskItem extends Vue {
  @Prop() taskItem!: Task

  isCardDetailsOpen: boolean = false
  isTimeDetailsOpen: boolean = false
  debug = false
  private fieldset: Fieldset = {
    delete: {
      isOpen: false,
    },
  }

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

  async deleteTask() {
    // set status to working
    const id = this.taskItem.id
    this.taskItem.icon = 'cog'
    this.taskItem.status = TaskStatus.WORKING
    this.taskItem.statusMessage = TaskStatusMessage.WORKING

    const response = await TasksStore.deleteTask(id)
    console.log('Task delete finish: ', response)

    // Error
    if (response && response.error) {
      console.error('', response.message)
      // Set Status to Error
      this.taskItem.icon = 'Exclamation-Circle'
      this.taskItem.status = TaskStatus.ERROR
      this.taskItem.statusMessage = TaskStatusMessage.ERROR
    }

    // OK
    if (response && response.id == id) {
      // Set Status to done
      this.taskItem.icon = 'check'
    }
  }

  async taskRun(taskId: number) {
    // set status to working
    this.taskItem.icon = 'cog'
    this.taskItem.status = TaskStatus.WORKING
    this.taskItem.statusMessage = TaskStatusMessage.WORKING

    const response = await api.runTask(taskId)
    console.log('Task run finish: ', response)

    // Error
    if (response && response.error) {
      console.error('', response.message)
      // Set Status to Error
      this.taskItem.icon = 'Exclamation-Circle'
      this.taskItem.status = TaskStatus.ERROR
      this.taskItem.statusMessage = TaskStatusMessage.ERROR
    }

    // OK
    if (response && response.task && response.task.id == taskId) {
      // Set Status to done
      this.taskItem.icon = 'check'
      this.taskItem.status = TaskStatus.DONE
      this.taskItem.statusMessage = TaskStatusMessage.DONE
    }
  }

  toggleFieldset(name: string) {
    if (name in this.fieldset) {
      // @ts-ignore
      this.fieldset[name].isOpen = !this.fieldset[name].isOpen
    }
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

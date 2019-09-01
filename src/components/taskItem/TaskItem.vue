<template>
    <!-- <pre v-text="$attrs"/> -->
    <div class="task-item">


        <div class="card" v-bind:class="[taskItem.status]">
            <!-- Card Main -->
            <div class="card-main">
                <!-- Status Icon-->
                <div class="card-status-icon-wrapper">
                    <div class="card-status-icon">

                        <!-- Default -->
                        <div class="status-icon status-icon-default" v-if="taskItem.status === 'default'">
                            <font-awesome-icon icon="clock"/>
                        </div>

                        <!-- Waiting -->
                        <div class="status-icon status-icon-waiting" v-if="taskItem.status === 'waiting'">
                            <font-awesome-icon icon="clock"/>
                        </div>

                        <!-- Working -->
                        <div class="status-icon status-icon-working" v-if="taskItem.status === 'working'">
                            <font-awesome-icon icon="cog"/>
                        </div>

                        <!-- Done -->
                        <div class="status-icon status-icon-done" v-if="taskItem.status === 'done'">
                            <font-awesome-icon icon="check"/>
                        </div>

                        <!-- Warning -->
                        <div class="status-icon status-icon-warning" v-if="taskItem.status === 'warning'">
                            <font-awesome-icon icon="exclamation-triangle"/>
                        </div>

                        <!-- Error -->
                        <div class="status-icon status-icon-error" v-if="taskItem.status === 'error'">
                            <font-awesome-icon icon="uexclamation-circle"/>
                        </div>
                    </div>
                </div>

                <!-- Status MolloMessages-->
                <div class="card-status-message">{{ taskItem.statusMessage }}</div>

                <!-- Title -->
                <h3 class="card-title">Task {{ taskItem.number }}</h3>

                <!-- Number of Adresses -->
                <div class="card-number-of-addresses">
                    von
                    <span class="from">{{taskItem.range.from}}</span>
                    bis
                    <span class="to">{{taskItem.range.to}}</span>
                </div>

                <!-- Runtime detail -->
                <div class="tooltip">
                    <div class="date-time-detail tooltiptext" v-if="isTimeDetailsOpen">
                        <span class="date-time-day">{{ taskItem.runMoment | moment('D. MMMM - HH:mm') }} </span>
                    </div>

                    <!-- Run Rime human readable-->
                    <div class="card-date-time-readable" @click="toggleDateTimeDetails"
                         @mouseout="hideDateTimeDetails">
                        <span class="date-time-day">{{ taskItem.runMoment | moment('calendar') }} </span>
                    </div>
                </div>


                <div class="detail-run-wrapper">

                    <!-- Card Details Button -->
                    <div class="card-details-button">
                        <!-- Trigger Open Details-->
                        <a v-if="!isCardDetailsOpen" role="button" class="btn card-details-open-trigger"
                           @click="showCardDetailsToggle">
                            <font-awesome-icon icon="caret-right"></font-awesome-icon>
                            <span class="label-width-icon">Details</span>
                        </a>

                        <!-- Trigger Close Details-->
                        <a v-if="isCardDetailsOpen" role="button" class="btn card-details-open-trigger"
                           @click="showCardDetailsToggle">

                            <font-awesome-icon icon="caret-down"></font-awesome-icon>
                            <span class="label-width-icon">Schliessen</span>
                        </a>
                    </div>

                    <!-- Button runTask -->
                    <div>

                        <a class="btn btn-outline run-task-button run-task-waiting"
                           v-if="runTaskButtonStatus == 'waiting'">Ausführen</a>
                        <a class="btn btn-outline run-task-button run-task-done" v-if="runTaskButtonStatus == 'done'">nochmals</a>
                        <a class="btn btn-outline run-task-button run-task-save-to-run"
                           v-if="runTaskButtonStatus == 'save-to-run'">Jetzt Ausführen</a>
                        <a class="btn btn-outline run-task-button run-task-working"
                           v-if="runTaskButtonStatus == 'working'"></a>


                    </div>


                </div>


            </div>
            <!-- Card Details -->
            <div class="card-details" v-if="isCardDetailsOpen">

                <table>
                    <!-- ID -->
                    <tr>
                        <th>ID:</th>
                        <td>{{ taskItem.id }}</td>
                    </tr>

                    <!-- All Addresses -->
                    <tr>
                        <th>Adressen:</th>
                        <td>{{taskItem.subscribers.all}}</td>
                    </tr>

                    <!--  Addresses with Errors -->
                    <tr>
                        <th>Fehlerhaft:</th>
                        <td>{{ taskItem.subscribers.error}}</td>
                    </tr>

                    <!--  Addresses open -->
                    <tr>
                        <th>geöffnet:</th>
                        <td>{{ taskItem.subscribers.open}}</td>
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
  import {Vue, Component, Prop, Constructor} from 'vue-property-decorator'
  import {Task} from '@/store/models'

  @Component
  export default class TaskItem extends Vue {
    @Prop() taskItem?: Task

    isCardDetailsOpen: boolean = false;
    isTimeDetailsOpen: boolean = false;


    showCardDetailsToggle() {
      return this.isCardDetailsOpen = !this.isCardDetailsOpen;
    }

    // Date Time
    toggleDateTimeDetails() {
      return this.isTimeDetailsOpen = !this.isTimeDetailsOpen;
    }

    showDateTimeDetails() {
      return this.isTimeDetailsOpen = true;
    }

    hideDateTimeDetails() {
      return this.isTimeDetailsOpen = false;
    }

    get runTaskButtonStatus(): string {
      let status = ''

      if (this.taskItem) {

        // Task is working
        if (this.taskItem.working)
          status = 'working'

        // task is waiting to run

        if (this.taskItem.number != 1 && !this.taskItem.done)
          status = 'waiting'

        // Task is done
         if (this.taskItem.done)
          status = 'done'

        // Task is save to run
        if (this.taskItem.number === 1 && !this.taskItem.done)
          status = 'save-to-run'

      }
      return status;
    }

  }
</script>

<style lang="scss" scoped>
    @import 'TaskItem';
</style>

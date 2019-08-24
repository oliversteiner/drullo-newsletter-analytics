<template>
    <!-- <pre v-text="$attrs"/> -->
    <div class="task-item">


        <div class="card" v-bind:class="[taskItem.status]">
            <!-- Card Main -->
            <div class="card-main">
                <!-- Status Icon-->
                <div class="cart-status-icon-wrapper">
                    <div class="card-status-icon">
                        <div class="status-icon status-icon-default" v-if="taskItem.status === 'default'">
                            <font-awesome-icon icon="clock"/>
                        </div>
                        <div class="status-icon status-icon-waiting" v-if="taskItem.status === 'waiting'">
                            <font-awesome-icon icon="clock"/>
                        </div>
                        <div class="status-icon status-icon-working" v-if="taskItem.status === 'working'">
                            <font-awesome-icon icon="cog"/>
                        </div>
                        <div class="status-icon status-icon-done" v-if="taskItem.status === 'done'">
                            <font-awesome-icon icon="check"/>
                        </div>
                        <div class="status-icon status-icon-warning" v-if="taskItem.status === 'warning'">
                            <font-awesome-icon icon="exclamation-triangle"/>
                        </div>
                        <div class="status-icon status-icon-error" v-if="taskItem.status === 'error'">
                            <font-awesome-icon icon="uexclamation-circle"/>
                        </div>
                    </div>
                </div>

                <!-- Status Message-->
                <div class="card-status-message">{{ taskItem.statusMessage }}</div>

                <!-- Title -->
                <h3 class="card-title">Task {{ taskItem.number }}</h3>

                <!-- Number of Adresses -->
                <div class="card-number-of-addresses">
                    von
                    <span class="from">201</span>
                    bis
                    <span class="to">400</span>
                </div>

                <!-- Runtime detail -->
                <div class="tooltip">
                    <div class="date-time-detail tooltiptext" v-if="isTimeDetailsOpen">
                        <span class="date-time-day">{{ taskItem.runMoment | moment('D. MMMM - HH:mm') }} </span>
                    </div>

                    <!-- Run Rime human readable-->
                    <div class="card-date-time-readable"  @mouseenter="showDateTimeDetails" @mouseout="hideDateTimeDetails">
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
                    <a class="btn btn-outline run-task-trigger">Ausführen</a>

                </div>


            </div>
            <!-- Card Details -->
            <div class="card-details" v-if="isCardDetailsOpen">
                <div>{{ taskItem.id }}</div>
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

    showDateTimeDetails() {
      return this.isTimeDetailsOpen = true;
    }

    hideDateTimeDetails() {
      return this.isTimeDetailsOpen = false;
    }

  }
</script>

<style lang="scss" scoped>
    @import 'TaskItem';
</style>

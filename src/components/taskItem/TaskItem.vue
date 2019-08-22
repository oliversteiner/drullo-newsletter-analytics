<template>
    <!-- <pre v-text="$attrs"/> -->
    <div class="task-item">
        <div v-if="showDetails === false">

            <div class="square done">

            </div>

        </div>

        <div v-if="showDetails">
            <div class="card">

                <!-- Card Main -->
                <div class="card-main">
                    <div>{{taskItem.statusMessage}}</div>

                    <div class="card-icon-wrapper">
                        <div class="card-icon" v-bind:class="[taskItem.status]"></div>
                    </div>

                    <h3>Task {{taskItem.number}}</h3>

                    <div class="date-time">
                        <span class="date-time-day">{{ taskItem.changed | moment("calendar") | fromNow() }} </span>
<!--
                        <span class="date-time-time">{{ taskItem.changed | moment('hh:mm')  }}</span>
-->
                    </div>


                    <div>
                        <div>Details</div>
                        <div>von <span class="from">201</span> bis <span class="to">400</span></div>
                    </div>

                </div>

                <!-- Card Details -->
                <div class="card-details">
                    <div>{{taskItem.id}}</div>
                </div>


            </div>
        </div>
    </div>

</template>

<script lang="ts">
    import {Vue, Component, Prop, Constructor} from 'vue-property-decorator'
    import {Task} from "@/store/models"


    @Component
    export default class TaskItem extends Vue {
        @Prop() taskItem?: Task
        @Prop() showDetails?: boolean


    }


</script>

<style lang="scss" scoped>
    @import "TaskItem";
</style>

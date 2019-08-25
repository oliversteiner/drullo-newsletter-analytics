<template>
    <div class="analytics">
        <h1>Analytics</h1>

        <!-- Newsletter Data -->
        <div class="box newsletter-data">
            <!-- Title -->
            <div>
                <span class="label label-hidden">Titel:</span>
                <h2>{{newsletter.title}}</h2>
            </div>

            <!-- Date -->
            <div>
                <span class="label">Versendet am: </span>
                <span>{{newsletter.date | moment('DD.MM.YYYY - HH:mm') }}</span>
                <span>( {{newsletter.date | moment('calendar') }} )</span>
            </div>
        </div>

        <!-- Subscriber Groups -->
        <div class="box box-subscriber-groups">
            <h3>Empfänger Gruppen</h3>
            <nav class="navbar">
                <ul class="navbar nav">
                    <li class="nav-item">alle</li>
                    <li class="nav-item active">Newsletter</li>
                    <li class="nav-item">Import</li>
                    <li class="nav-item">Vorstand</li>
                    <li class="nav-item">Test</li>
                </ul>
            </nav>
        </div>


        <!--  List -->
        <div class="box box-list">
            <table>
                <tr>
                    <th>Personen in der Gruppe:</th>
                    <td>{{newsletter.count.all}}</td>
                </tr>
                <tr>
                    <th>Versendete Newsletter:</th>
                    <td>{{newsletter.count.send}}</td>
                </tr>
                <tr>
                    <th>angesehen:</th>
                    <td>{{newsletter.count.open}}</td>
                </tr>
                <tr>
                    <th>Abmeldungen:</th>
                    <td>{{newsletter.count.unsubscribe}}</td>
                </tr>
            </table>
        </div>

        <!-- Pie Chart -->
        <PieChart></PieChart>

        <!-- timeline -->
        <Timeline></Timeline>

        <!-- Raw Data -->
        <RawDataList></RawDataList>

    </div>
</template>

<script lang="ts">
  import {Vue, Component, Prop} from 'vue-property-decorator'
  import {Newsletter} from '@/store/models'
  import Timeline from '@/components/Timeline/Timeline.vue'
  import PieChart from '@/components/PieChart/PieChart.vue'
  import RawDataList from "@/components/RawDataList/RawDataList.vue"

  @Component({
    components:{ RawDataList, Timeline, PieChart}
  })
  export default class Analytics extends Vue {

    newsletter: Newsletter = {
      title: '3. Newsletter Oktober 2019',
      date: new Date,
      category: 'Tickets',
      subscribers: [{id: 23, name: 'Tickets'}],
      count: {
        all: 100,
        send: 80,
        open: 70,
        unsubscribe: 10,
      }
    }

  }
</script>

<style scoped>
    @import '_Analytics.scss';
</style>

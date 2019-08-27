<template>
    <div class="analytics" v-if="newsletter">
        <h1>Analytics</h1>

        <!-- Newsletter Data -->
        <div class="box newsletter-data">
            <!-- Title Wrapper -->
            <div class="selector-background" v-bind:class="{ 'selector-active': isOpenSelector }">
                <!-- Title -->
                <h2 class="selector-trigger" @click="toggleSelector()">
                    <font-awesome-icon class="title-caret" icon="caret-right" v-if="!isOpenSelector"></font-awesome-icon>
                    <font-awesome-icon icon="caret-down" v-if="isOpenSelector"></font-awesome-icon>
                    {{ newsletter.title }}
                </h2>
                <!-- Newletter selector -->
                <div class="selector-wrapper" v-if="isOpenSelector">
                    <NewsletterSelector
                            v-bind:newsletter-list="newsletterList"
                            v-bind:current="selected"
                            v-on:changeNewsletter="changeNewsletter($event)"
                    ></NewsletterSelector>
                </div>
            </div>
            <div class="selector-title-placeholder" v-bind:class="{ 'placeholder-active': isOpenSelector }"><h2>.</h2>
            </div>


            <!-- Date -->
            <div>
                <span class="label">Versendet am: </span>
                <!-- not send -->
                <div v-if="!newsletter.is_send">
                    <span> - </span>
                </div>
                <!-- send -->
                <div v-if="newsletter.is_send">
                    <span v-if="newsletter.is_send">{{ newsletter.send | moment('DD.MM.YYYY - HH:mm') }}</span>
                    <span v-if="newsletter.is_send">( {{ newsletter.send | moment('calendar') }} )</span>
                </div>
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
                    <td>{{ newsletter.count.all }}</td>
                </tr>
                <tr>
                    <th>Versendete Newsletter:</th>
                    <td>{{ newsletter.count.send }}</td>
                </tr>
                <tr>
                    <th>angesehen:</th>
                    <td>{{ newsletter.count.read }}</td>
                </tr>
                <tr>
                    <th>Abmeldungen:</th>
                    <td>{{ newsletter.count.unsubscribe }}</td>
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
  import {Vue, Component} from 'vue-property-decorator'
  import Timeline from '@/components/Timeline/Timeline.vue'
  import PieChart from '@/components/PieChart/PieChart.vue'
  import RawDataList from '@/components/RawDataList/RawDataList.vue'
  import newsletters from '@/store/modules/newsletters'
  import NewsletterSelector from '@/components/NewsletterSelector/NewsletterSelector.vue'

  @Component({
    components: {RawDataList, Timeline, PieChart, NewsletterSelector},
  })
  export default class Analytics extends Vue {
    selected: number = 0
    private isOpenSelector: boolean = false

    changeNewsletter(selected: number) {
      console.log('event', selected)
      this.selected = selected

      // close Selector
      this.isOpenSelector = false
    }

    openSelector() {
      this.isOpenSelector = true
    }

    toggleSelector() {
      this.isOpenSelector = !this.isOpenSelector
    }

    get newsletterList() {
      return newsletters.newsletterList
    }

    get newsletter() {
      console.log('newsletters', newsletters.newsletterList)

      return newsletters.newsletterList[this.selected]
    }

    async created() {
      await newsletters.refreshNewsletterList()
    }
  }
</script>

<style scoped>
    @import '_Analytics.scss';
</style>

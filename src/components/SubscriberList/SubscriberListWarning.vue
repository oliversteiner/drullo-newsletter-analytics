<template>
  <div class="subscriber-list-warning">
    <h3 v-if="subsribersfilterd.length < 0">Warning</h3>
    <!-- Number of Subscibers-->
    <div>{{ subsribersfilterd.length }} von {{ all }} Empfänger</div>

    <!-- List -->
    <ul class="subscriber-list">
      <li v-for="subscriber in subsribersfilterd" :key="subscriber.id + '-analytics'">
        <div class="subscriber-list-wrapper">
          <div class="subscriber-status" :class="subscriber.currentStatus"></div>
          <div v-if="debug">{{ subscriber.id }} -</div>
          <div>{{ subscriber.contact.email }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Subscriber } from '@/_models/SubscriberClass'

@Component
export default class SubscriberListWarning extends Vue {
  @Prop() subscribers!: Subscriber[]
  @Prop() all!: number

  private debug = false
  private subsribersfilterd: Subscriber[] = []

  @Watch('subscribers')
  filterSubscriber() {
    this.checkEmail()
  }

  // TODO depricated?
  private checkEmail() {
    console.log('checkEmail')
    // this.subsribersfilterd = this.subscribers.filter(subscriber => check(subscriber.contact.email))
  }

  created() {}
}

/**
 * https://tylermcginnis.com/validate-email-address-javascript/
 * https://emailregex.com/
 * https://www.w3resource.com/javascript/form/email-validation.php
 *
 * Example of invalid email id
 * ----------------------------------
 *    mysite.ourearth.com [@ is not present]
 *    mysite@.com.my [ tld (Top Level domain) can not start with dot "." ]
 *    @you.me.net [ No character before @ ]
 *    mysite123@gmail.b [ ".b" is not a valid tld ]
 *    mysite@.org.org [ tld can not start with dot "." ]
 *    .mysite@mysite.org [ an email should not be start with "." ]
 *    mysite()*@gmail.com [ here the regular expression only allows character, digit, underscore, and dash ]
 *    mysite..1234@yahoo.com [double dots are not allowed]
 *    name@gmx,ch [ "," should be '.']
 *
 * @param email
 */
function check(email: string) {
  // console.log('email', email)
  //  console.log('email', email.search('gmx'))

  const mailformat = /\S+@\S+\.\S+/
  if (!email.match(mailformat)) return true
}
</script>

<style lang="scss" scoped>
@import 'SubscriberList';
</style>

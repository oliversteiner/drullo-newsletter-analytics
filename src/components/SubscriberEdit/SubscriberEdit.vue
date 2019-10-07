<template>
  <div class="subscriber-edit">
    <div v-if="subscriber">
      <!-- Toolbar -->
      <div class="edit-toolbar">
        <span v-if="!edit" class="btn btn-link" @click="openEdit">{{ $t('Edit') }}</span>
        <span v-if="edit" class="btn btn-link" @click="closeEdit">{{ $t('Cancel') }}</span>
        <span v-if="edit" class="btn btn-link" @click="save(subscriber.id)">{{ $t('Save') }}</span>
        <span v-if="!edit" class="btn btn-link btn-plus" @click="newSubscriber">
          <font-awesome-icon icon="plus" />
        </span>
      </div>

      <!-- Deleted -->
      <div v-show="isDeleted">
        {{ $t('Data deleted') }}
      </div>

      <!-- Deleted -->
      <div v-show="isDeleting">
        <font-awesome-icon icon="circle-notch" spin size="lg" />
        {{ $t('Data delete...') }}
      </div>

      <!-- Read -->
      <div v-show="!edit && !isDeleted" class="read">
        <!-- Address -->
        <fieldset class="fieldset-address">
          <div class="item">
            <h2>{{ subscriber.personal.firstName }} {{ subscriber.personal.lastName }}</h2>
          </div>

          <h3>{{ $t('Address') }}</h3>
          <div class="item">
            {{ gender }}
          </div>
          <div class="item">{{ subscriber.personal.firstName }} {{ subscriber.personal.lastName }}</div>
          <div class="item">
            {{ subscriber.address.streetAndNumber }}
          </div>
          <div class="item">{{ subscriber.address.zipCode }} {{ subscriber.address.city }}</div>
          <div class="item">
            {{ country }}
          </div>
        </fieldset>

        <!-- Contact -->
        <fieldset class="fieldset-contact">
          <h3>{{ $t('Contact') }}</h3>
          <!-- mail -->
          <div v-if="subscriber.contact.email" class="item">
            <span class="label label-icon label-contact">
              <font-awesome-icon icon="envelope" />
            </span>
            <a
              class="btn btn-mailto "
              :class="{ invalid: subscriber.error }"
              :href="'mailto:' + subscriber.contact.email"
              >{{ subscriber.contact.email }}</a
            >
          </div>

          <!-- Mobile -->
          <div v-if="subscriber.contact.mobile" class="item">
            <span class="label label-icon label-contact">
              <font-awesome-icon icon="mobile-alt" />
            </span>
            {{ subscriber.contact.mobile }}
          </div>

          <!-- Phone 1 -->
          <div v-if="subscriber.contact.phone" class="item">
            <span class="label label-icon label-contact">
              <font-awesome-icon icon="phone-square-alt" />
            </span>
            {{ subscriber.contact.phone }}
          </div>

          <!-- Phone 2 -->
          <div v-if="subscriber.contact.phone2" class="item">
            <span class="label label-icon label-contact">
              <font-awesome-icon icon="phone-square-alt" />
            </span>
            {{ subscriber.contact.phone2 }}
          </div>
        </fieldset>

        <!-- Newsletter-->
        <fieldset class="fieldset-newsletter">
          <h3>{{ $t('Newsletter') }}</h3>

          <div v-if="subscriber.personal.newsletter" class="item">
            <span class="label label-icon label-newsletter">
              <font-awesome-icon icon="check" />
            </span>
            Ja
          </div>
          <div v-if="!subscriber.personal.newsletter" class="item">
            <span class="label label-icon label-newsletter">
              <font-awesome-icon icon="times-circle" />
            </span>
            Nein
          </div>
        </fieldset>

        <!-- Subscriber Groups -->
        <fieldset class="fieldset-subscriber-groups">
          <h3>{{ $t('Subscriber Groups') }}</h3>

          <div class="subscriber-groups">
            <div v-for="group in subscriber.groups" :key="'read-' + group.id" class="subscriber-groups-item active">
              <span class="">{{ group.name }}</span>
            </div>
          </div>
        </fieldset>

        <!-- Personal -->
        <fieldset v-if="subscriber.personal.birthday" class="fieldset-personal">
          <h3>{{ $t('Personal') }}</h3>

          <!-- Birthday -->
          <div class="item">
            <span class="label">{{ $t('Birthday') }}</span>
            {{ subscriber.personal.birthday | moment('D MMMM YYYY') }}
          </div>
        </fieldset>

        <!-- Meta -->
        <fieldset class="fieldset-meta">
          <h3>{{ $t('Meta') }}</h3>

          <!-- Invalid Data -->
          <div v-if="subscriber.error" class="item">
            {{ $t('Invalid Data found') }}
          </div>

          <!-- ID-->
          <div class="item">
            <span class="label">{{ $t('ID') }}</span>
            {{ subscriber.id }}
          </div>

          <!-- Transfer ID -->
          <div class="item">
            <span class="label">{{ $t('Transfer ID') }}</span>
            {{ subscriber.transferId }}
          </div>

          <!-- Created  -->
          <div class="item">
            <span class="label">{{ $t('Created') }}</span>
            {{ subscriber.changed | moment('DD. MM. YYYY - HH:mm') }}
          </div>

          <!-- Changed -->
          <div class="item">
            <span class="label">{{ $t('Changed') }}</span>
            {{ subscriber.created | moment('DD. MM. YYYY - HH:mm') }}
          </div>

          <!-- Origin -->
          <div class="item">
            <span class="label">{{ $t('Origin') }}</span>
            {{ origin }}
          </div>

          <!-- Status -->
          <div class="item">
            <span class="label">{{ $t('Status') }}</span>
            {{ subscriberStatus }}
          </div>
        </fieldset>
      </div>

      <!-- ############################################## -->

      <!-- Edit -->
      <div v-show="edit && !isDeleted" class="read">
        <fieldset class="fieldset-name">
          <!-- Header -->
          <div class="fieldset-header" />

          <!-- Content -->
          <div class="fieldset-content">
            <div class="item">
              <label for="first-name" style="display: none">{{ $t('First Name') }}</label>
              <input
                id="first-name"
                v-model="subscriber.personal.firstName"
                :placeholder="$t('First Name')"
                size="15"
                autocomplete="nonono"
              />

              <label for="last-name" style="display: none">{{ $t('Last Name') }}</label>
              <input
                id="last-name"
                v-model="subscriber.personal.lastName"
                :placeholder="$t('Last Name')"
                size="15"
                autocomplete="nonono"
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="fieldset-footer" />
        </fieldset>

        <!-- Address -->
        <fieldset class="fieldset-address">
          <!-- Header -->
          <div class="fieldset-header interactive" @click="toggleFieldset('address')">
            <div class="fieldset-toggle">
              <font-awesome-icon v-if="!fieldset.address.isOpen" icon="caret-right" />
              <font-awesome-icon v-if="fieldset.address.isOpen" icon="caret-down" />
            </div>
            <h3>{{ $t('Address') }}</h3>
          </div>

          <!-- gender -->
          <div v-if="fieldset.address.isOpen" class="fieldset-content">
            <div class="item">
              <select v-model="subscriber.personal.gender">
                <option v-for="option in genderList" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
            </div>

            <!-- firstName -->
            <div class="item">
              <label for="first-name-1" style="display: none">{{ $t('First Name') }}</label>
              <input
                id="first-name-1"
                v-model="subscriber.personal.firstName"
                :placeholder="$t('First Name')"
                size="15"
                autocomplete="nonono"
              />

              <!-- lastName -->
              <label for="last-name-1" style="display: none">{{ $t('Last Name') }}</label>
              <input
                id="last-name-1"
                v-model="subscriber.personal.lastName"
                :placeholder="$t('Last Name')"
                size="15"
                autocomplete="nonono"
              />
            </div>

            <!-- streetAndNumber -->
            <div class="item">
              <label for="street" style="display: none">{{ $t('Street and Nr') }}</label>
              <input
                id="street"
                v-model="subscriber.address.streetAndNumber"
                :placeholder="$t('Street and Nr')"
                autocomplete="nonono"
                size="35"
              />
            </div>

            <!-- ZIP Code -->
            <div class="item">
              <label for="zip-code" style="display: none">{{ $t('ZIP Code') }}</label>
              <input
                id="zip-code"
                v-model="subscriber.address.zipCode"
                :placeholder="$t('ZIP Code')"
                size="6"
                autocomplete="nonono"
              />

              <!-- City-->
              <label for="city" style="display: none">{{ $t('City') }}</label>
              <input
                id="city"
                v-model="subscriber.address.city"
                :placeholder="$t('City')"
                size="28"
                autocomplete="nonono"
              />
            </div>

            <!-- Country -->
            <div class="item">
              <select v-model="subscriber.address.country">
                <option v-for="option in countryList" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
            </div>
          </div>

          <!-- Footer -->
          <div class="fieldset-footer" />
        </fieldset>

        <!-- Contact -->
        <fieldset class="fieldset-contact">
          <!-- Header -->
          <div class="fieldset-header interactive" @click="toggleFieldset('contact')">
            <div class="fieldset-toggle">
              <font-awesome-icon v-if="!fieldset.contact.isOpen" icon="caret-right" />
              <font-awesome-icon v-if="fieldset.contact.isOpen" icon="caret-down" />
            </div>
            <h3>{{ $t('Contact') }}</h3>
          </div>

          <!-- Email -->
          <div v-if="fieldset.contact.isOpen" class="fieldset-content">
            <!-- mail -->
            <div class="item">
              <span class="label label-icon label-contact">
                <font-awesome-icon icon="envelope" />
              </span>
              <label for="email" style="display: none">{{ $t('Email') }}</label>
              <input
                id="email"
                v-model="subscriber.contact.email"
                :placeholder="$t('Email')"
                size="32"
                autocomplete="nonono"
                :class="{ invalid: subscriber.error }"
              />
            </div>

            <!-- Mobile -->
            <div class="item">
              <span class="label label-icon label-contact">
                <font-awesome-icon icon="mobile-alt" />
              </span>
              <label for="mobile" style="display: none">{{ $t('Mobile') }}</label>
              <input
                id="mobile"
                v-model="subscriber.contact.mobile"
                :placeholder="$t('Mobile')"
                size="32"
                autocomplete="nonono"
              />
            </div>

            <!-- Phone 1 -->
            <div class="item">
              <span class="label label-icon label-contact">
                <font-awesome-icon icon="phone-square-alt" />
              </span>
              <label for="phone" style="display: none">{{ $t('Phone Privat') }}</label>
              <input
                id="phone"
                v-model="subscriber.contact.phone"
                :placeholder="$t('Phone Privat')"
                size="32"
                autocomplete="nonono"
              />
            </div>

            <!-- Phone 2 -->
            <div class="item">
              <span class="label label-icon label-contact">
                <font-awesome-icon icon="phone-square-alt" />
              </span>
              <label for="phone2" style="display: none">{{ $t('Phone Company') }}</label>
              <input
                id="phone2"
                v-model="subscriber.contact.phone2"
                :placeholder="$t('Phone Company')"
                size="32"
                autocomplete="nonono"
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="fieldset-footer" />
        </fieldset>

        <!-- Newsletter-->
        <fieldset class="fieldset-newsletter">
          <!-- Header -->
          <div class="fieldset-header interactive" @click="toggleFieldset('newsletter')">
            <div class="fieldset-toggle">
              <font-awesome-icon v-if="!fieldset.newsletter.isOpen" icon="caret-right" />
              <font-awesome-icon v-if="fieldset.newsletter.isOpen" icon="caret-down" />
            </div>
            <h3>{{ $t('Newsletter') }}</h3>
          </div>

          <!-- Content -->
          <div v-if="fieldset.newsletter.isOpen" class="fieldset-content">
            <div v-if="subscriber.personal.newsletter" class="item" @click="toggleNewsletter()">
              <font-awesome-icon class="icon btn-icon toggle-on" icon="toggle-on" />
              {{ $t('Yes') }}
            </div>

            <div v-if="!subscriber.personal.newsletter" class="item" @click="toggleNewsletter()">
              <font-awesome-icon class="icon btn-icon toggle-off" icon="toggle-off" />
              {{ $t('No') }}
            </div>
          </div>

          <!-- Footer -->
          <div class="fieldset-footer" />
        </fieldset>

        <!-- Subscriber Groups -->
        <fieldset class="fieldset-subscriber-groups">
          <!-- Header -->
          <div class="fieldset-header interactive" @click="toggleFieldset('subscriberGroups')">
            <div class="fieldset-toggle">
              <font-awesome-icon v-if="!fieldset.subscriberGroups.isOpen" icon="caret-right" />
              <font-awesome-icon v-if="fieldset.subscriberGroups.isOpen" icon="caret-down" />
            </div>
            <h3>{{ $t('Subscriber Groups') }}</h3>
          </div>

          <!-- content -->
          <div v-if="fieldset.subscriberGroups.isOpen" class="subscriber-groups">
            <div
              v-for="group in groups"
              :key="group.id"
              :class="{ active: isGroupActive(group.id) }"
              class="subscriber-groups-item"
              @click="toggleGroup(group.id)"
            >
              <font-awesome-icon class="icon btn-icon toggle-on" icon="toggle-on" />
              <font-awesome-icon class="icon btn-icon toggle-off" icon="toggle-off" />
              <span class="">{{ group.name }}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="fieldset-footer" />
        </fieldset>

        <!-- Personal -->
        <fieldset class="fieldset-personal">
          <!-- Header -->
          <div class="fieldset-header interactive" @click="toggleFieldset('personal')">
            <div class="fieldset-toggle">
              <font-awesome-icon v-if="!fieldset.personal.isOpen" icon="caret-right" />
              <font-awesome-icon v-if="fieldset.personal.isOpen" icon="caret-down" />
            </div>
            <h3>{{ $t('Personal') }}</h3>
          </div>

          <!-- Content -->
          <div v-if="fieldset.personal.isOpen" class="fieldset-content">
            <!-- Birthday -->
            <div class="item">
              <label for="birthday" class="label">{{ $t('Birthday') }}</label>
              <input id="birthday" v-model="subscriber.personal.birthday" type="datetime-local" />
            </div>
          </div>

          <!-- Footer -->
          <div class="fieldset-footer" />
        </fieldset>

        <!-- Meta -->
        <fieldset class="fieldset-meta">
          <!-- Header -->
          <div class="fieldset-header interactive" @click="toggleFieldset('meta')">
            <div class="fieldset-toggle">
              <font-awesome-icon v-if="!fieldset.meta.isOpen" icon="caret-right" />
              <font-awesome-icon v-if="fieldset.meta.isOpen" icon="caret-down" />
            </div>
            <h3>{{ $t('Meta') }}</h3>
          </div>

          <!-- content -->
          <div v-if="fieldset.meta.isOpen" class="fieldset-content">
            <!-- Invalid Data -->
            <div v-if="subscriber.error" class="item">
              {{ $t('Invalid Data found') }}
            </div>

            <!-- ID-->
            <div class="item">
              <label class="label">{{ $t('ID') }}</label>
              <span class="deactivated"> {{ subscriber.id }}</span>
            </div>

            <!-- Transfer ID -->
            <div class="item">
              <label for="transfer-id" class="label">{{ $t('Transfer ID') }}</label>
              <input
                id="transfer-id"
                v-model="subscriber.transferId"
                :placeholder="$t('Transfer ID')"
                size="15"
                autocomplete="nonono"
              />
            </div>

            <!-- Created  -->
            <div class="item">
              <label class="label">{{ $t('Created') }}</label>
              <span class="deactivated"> {{ subscriber.changed | moment('DD. MM. YYYY - HH:mm') }}</span>
            </div>

            <!-- Changed -->
            <div class="item">
              <label class="label">{{ $t('Changed') }}</label>
              <span class="deactivated"> {{ subscriber.created | moment('DD. MM. YYYY - HH:mm') }}</span>
            </div>

            <!-- Origin -->
            <div class="item">
              <label class="label">{{ $t('Origin') }}</label>

              <select v-model="subscriber.origin">
                <option v-for="option in originList" :key="option.id" :value="option.id">
                  {{ option.name }}
                </option>
              </select>
            </div>

            <!-- Status -->
            <div class="item">
              <label class="label">{{ $t('Status') }}</label>
              <span class="deactivated"> {{ subscriberStatus }}</span>
            </div>
          </div>
          <div class="fieldset-foot" />
        </fieldset>

        <!-- Delete -->
        <fieldset class="fieldset-delete">
          <!-- Header -->
          <div class="fieldset-header ">
            <div class="row-between">
              <!-- Button Save-->
              <div class="btn btn-outline" @click="save(subscriber.id)">{{ $t('Save') }}</div>

              <!-- Button Delete-->
              <div class="btn btn-link btn-delete" @click="toggleFieldset('delete')">
                {{ $t('Delete...') }}
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="fieldset-content">
            <div v-show="fieldset.delete.isOpen">
              <p>{{ $t('Delete Data for') }} {{ subscriber.personal.firstName }} {{ subscriber.personal.lastName }}?</p>
              <div class="row-between">
                <!-- Button Cancel -->
                <div class="btn btn-outline btn-delete" @click="fieldset.delete.isOpen = false">
                  {{ $t('No, Cancel') }}
                </div>

                <!-- Button Delete -->
                <div class="btn btn-outline btn-delete" @click="deleteSubscriber">
                  {{ $t('Yes, Delete') }}
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="fieldset-footer" />
        </fieldset>
      </div>
    </div>
    <!-- if Subscriber -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import SubscriberClass, { Subscriber } from '@/_models/SubscriberClass'
import { SubscriberStore, TermsStore } from '@/store'
import { SubscriberGroupTerm } from '@/store/modules/SubscriberModule'

interface Fieldset {
  personal: FieldsetOptions
  address: FieldsetOptions
  contact: FieldsetOptions
  newsletter: FieldsetOptions
  subscriberGroups: FieldsetOptions
  meta: FieldsetOptions
  delete: FieldsetOptions
}
interface FieldsetOptions {
  isOpen: boolean
}

@Component({})
export default class SubscriberEdit extends Vue {
  @Prop() subscriberId!: number

  edit: boolean = true
  isSave: boolean = true
  private subscriber: Subscriber | null = null
  private fieldset: Fieldset = {
    address: {
      isOpen: true,
    },
    contact: {
      isOpen: true,
    },
    newsletter: {
      isOpen: false,
    },
    subscriberGroups: {
      isOpen: false,
    },
    personal: {
      isOpen: false,
    },
    meta: {
      isOpen: false,
    },
    delete: {
      isOpen: false,
    },
  }
  private isDeleting: boolean = false
  private isDeleted: boolean = false

  toggleEdit() {
    this.edit = !this.edit
  }

  openEdit() {
    this.edit = true
  }

  closeEdit() {
    this.edit = false
  }

  get subscriberStatus() {
    if (this.subscriber && this.subscriber.status && this.subscriber.status[0]) {
      return this.subscriber.status[0].status
    }
  }

  get originList() {
    console.log('TermsStore.origin', TermsStore.origin)

    return TermsStore.origin
  }

  get origin() {
    let name = ''
    if (this.subscriber && this.subscriber.origin) {
      const id = this.subscriber.origin
      const term = TermsStore.origin.filter(term => term.id === id)
      if (term.length != 0) {
        name = term[0].name
      }
    }
    return name
  }

  get gender() {
    let name = ''
    if (this.subscriber && this.subscriber.personal && this.subscriber.personal.gender) {
      const id = this.subscriber.personal.gender
      const term = TermsStore.gender.filter(term => term.id === id)
      if (term.length != 0) {
        name = term[0].name
      }
    }
    return name
  }

  get country() {
    let name = ''
    if (this.subscriber && this.subscriber.address && this.subscriber.address.country) {
      const id = this.subscriber.address.country
      const term = TermsStore.country.filter(term => term.id === id)
      if (term.length != 0) {
        name = term[0].name
      }
    }
    return name
  }

  get genderList() {
    return TermsStore.gender
  }

  get countryList() {
    return TermsStore.country
  }

  async save(id: number) {
    this.isSave = false
    this.edit = false

    const result = await SubscriberStore.saveSubscriberToServer(id)
    if (result && result.status && result.status === true) {
      this.isSave = true
    }
  }

  get groups() {
    return SubscriberStore.groups
  }

  toggleNewsletter() {
    if (this.subscriber && this.subscriber.personal) {
      this.subscriber.personal.newsletter = !this.subscriber.personal.newsletter
    }
  }

  toggleGroup(id: number) {
    if (this.isGroupActive(id)) {
      this.removeGroup(id)
    } else {
      this.addGroup(id)
    }
  }

  addGroup(id: number) {
    if (this.subscriber && this.subscriber.groups) {
      const term: SubscriberGroupTerm = SubscriberStore.groups.filter(_group => _group.id === id)[0]
      this.subscriber.groups.push(term)
    }
  }

  removeGroup(id: number) {
    if (this.subscriber && this.subscriber.groups) {
      this.subscriber.groups = this.subscriber.groups.filter(_group => _group.id != id)
    }
  }

  isGroupActive(id: number) {
    if (this.subscriber && this.subscriber.groups) {
      const result = this.subscriber.groups.filter(_group => _group.id === id)
      console.log('result', result)
      if (result.length === 1) {
        return true
      }
    }
    return false
  }

  toggleFieldset(name: string) {
    if (name in this.fieldset) {
      // @ts-ignore
      this.fieldset[name].isOpen = !this.fieldset[name].isOpen
    }
  }

  async newSubscriber() {
    await SubscriberClass.create()
    const subscriber = SubscriberStore.list.find(sub => sub.id === 0)
    if (subscriber) {
    this.resetEditor()
      this.subscriber = subscriber
      this.edit = true
    }
  }

  async deleteSubscriber() {
    if (this.subscriber) {
      const id = this.subscriber.id
      if (id) {
        this.isDeleting = true
        await SubscriberStore.deleteSubscriber(id)
        this.edit = false
        this.isDeleting = false
        this.isDeleted = true
      }
    }
  }

  @Watch('subscriberId')
  updateCurrentSubscriber() {
    const subscriber = SubscriberStore.list.find(sub => sub.id === this.subscriberId)
    if (subscriber) {
      this.subscriber = subscriber
      this.resetEditor()
    }
  }

  mount() {
    this.resetEditor()
  }

  resetEditor(){
    this.isDeleting = false
    this.isDeleted = false
    this.fieldset.delete.isOpen = false
  }

  created() {
    if (this.subscriberId) {
      const subscriber = SubscriberStore.list.find(sub => sub.id === this.subscriberId)
      if (subscriber) {
        this.subscriber = subscriber
      }
    }
  }
}
</script>

<style lang="scss">
@import 'SubscriberEdit';
</style>

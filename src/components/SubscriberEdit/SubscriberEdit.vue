<template>
  <div class="subscriber-edit">
    <div v-if="subscriber">
      <!-- Toolbar -->
      <div class="edit-toolbar">
        <span v-if="!edit" class="btn btn-link" @click="openEdit">Bearbeiten</span>
        <span v-if="edit" class="btn btn-link" @click="closeEdit">Abbrechen</span>
        <span v-if="edit" class="btn btn-link" @click="save(subscriber.id)">Sichern</span>
        <span v-if="!edit" class="btn btn-link btn-plus"> <font-awesome-icon icon="plus" /> </span>
      </div>

      <!-- Read -->
      <div v-show="!edit" class="read">
        <!-- Address -->
        <fieldset class="fieldset-address">
          <div class="item">
            <h2>{{ subscriber.personal.firstName }} {{ subscriber.personal.lastName }}</h2>
          </div>

          <h3>Adresse</h3>
          <div class="item">
            {{ subscriber.personal.gender[0].name }}
          </div>
          <div class="item">{{ subscriber.personal.firstName }} {{ subscriber.personal.lastName }}</div>
          <div class="item">
            {{ subscriber.address.streetAndNumber }}
          </div>
          <div class="item">{{ subscriber.address.zipCode }} {{ subscriber.address.city }}</div>
          <div class="item">
            {{ subscriber.address.country }}
          </div>
        </fieldset>

        <!-- Kontakt -->
        <fieldset class="fieldset-contact">
          <h3>Kontakt</h3>
          <!-- mail -->
          <div v-if="subscriber.contact.email" class="item">
            <span class="label label-icon label-contact">
              <font-awesome-icon icon="envelope" />
            </span>
            <a class="btn btn-mailto" :href="'mailto:' + subscriber.contact.email">{{ subscriber.contact.email }}</a>
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
          <h3>Newsletter</h3>

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
          <h3>Empfänger Gruppen</h3>

          <div class="subscriber-groups">
            <div v-for="group in subscriber.groups" :key="'read-' + group.id" class="subscriber-groups-item active">
              <span class="">{{ group.name }}</span>
            </div>
          </div>
        </fieldset>

        <!-- Personal -->
        <fieldset v-if="subscriber.personal.birthday" class="fieldset-personal">
          <h3>Persönlich</h3>
          <!-- Geburtstag -->
          <div class="item">
            <span class="label">Geburtstag</span>
            {{ subscriber.personal.birthday | moment('D MMMM YYYY') }}
          </div>
        </fieldset>

        <!-- Meta -->
        <fieldset class="fieldset-meta">
          <h3>Meta</h3>

          <!-- Fehler -->
          <div v-if="subscriber.error" class="item">
            Fehler in den diesen Daten gefunden
          </div>

          <!-- ID-->
          <div class="item">
            <span class="label">ID</span>
            {{ subscriber.id }}
          </div>
          <!-- Transfer ID -->
          <div class="item">
            <span class="label">Transfer ID</span>
            {{ subscriber.transferId }}
          </div>
          <!-- Erstellt  -->
          <div class="item">
            <span class="label">Erstellt</span>
            {{ subscriber.changed | moment('DD. MM. YYYY - HH:mm') }}
          </div>
          <!-- Aktualisiert -->
          <div class="item">
            <span class="label">Geändert</span>
            {{ subscriber.created | moment('DD. MM. YYYY - HH:mm') }}
          </div>

          <!-- Herkunft -->
          <div class="item">
            <span class="label">Herkunft</span>
            {{ origin }}
          </div>
          <!-- Status -->
          <div class="item">
            <span class="label">Status</span>
            {{ subscriberStatus }}
          </div>
        </fieldset>
      </div>

      <!-- Edit -->
      <div v-show="edit" class="read">
        <!-- Address -->
        <fieldset class="fieldset-address">
          <div class="item">
            <h2>
              <label for="first-name" style="display: none">Vorname</label>
              <input
                id="first-name"
                v-model="subscriber.personal.firstName"
                placeholder="Vorname"
                size="15"
                autocomplete="off"
              />

              <label for="last-name" style="display: none">Nachname</label>
              <input
                id="last-name"
                v-model="subscriber.personal.lastName"
                placeholder="Nachname"
                size="15"
                autocomplete="off"
              />
            </h2>
          </div>

          <h3>Adresse</h3>
          <div class="item">
            {{ subscriber.personal.gender[0].name }}
          </div>

          <div class="item">
            <label for="first-name-1" style="display: none">Vorname</label>
            <input
              id="first-name-1"
              v-model="subscriber.personal.firstName"
              placeholder="Vorname"
              size="15"
              autocomplete="off"
            />

            <label for="last-name-1" style="display: none">Nachname</label>
            <input
              id="last-name-1"
              v-model="subscriber.personal.lastName"
              placeholder="Nachname"
              size="15"
              autocomplete="off"
            />
          </div>
          <div class="item">
            <label for="street" style="display: none">Strasse und Nr.</label>
            <input
              id="street"
              v-model="subscriber.address.streetAndNumber"
              placeholder="Strasse und Nr."
              autocomplete="off"
              size="35"
            />
          </div>
          <div class="item">
            <label for="zip-code" style="display: none">PLZ</label>
            <input id="zip-code" v-model="subscriber.address.zipCode" placeholder="PLZ" size="6" autocomplete="off" />

            <label for="city" style="display: none">Ort</label>
            <input id="city" v-model="subscriber.address.city" placeholder="Ort" size="28" autocomplete="off" />
          </div>
          <div class="item">
            {{ subscriber.address.country }}
          </div>
        </fieldset>

        <!-- Kontakt -->
        <fieldset class="fieldset-contact">
          <h3>Kontakt</h3>
          <!-- mail -->
          <div class="item">
            <span class="label label-icon label-contact">
              <font-awesome-icon icon="envelope" />
            </span>
            <label for="email" style="display: none">Email</label>
            <input v-model="subscriber.contact.email" id="email" placeholder="Email" size="32" autocomplete="off" />
          </div>
          <!-- Mobile -->
          <div class="item">
            <span class="label label-icon label-contact">
              <font-awesome-icon icon="mobile-alt" />
            </span>
            <label for="mobile" style="display: none">Telefon Mobile</label>
            <input v-model="subscriber.contact.mobile" id="mobile" placeholder="Mobile" size="32" autocomplete="off" />
          </div>

          <!-- Phone 1 -->
          <div class="item">
            <span class="label label-icon label-contact">
              <font-awesome-icon icon="phone-square-alt" />
            </span>
            <label for="phone" style="display: none">Telefon Privat</label>
            <input
              v-model="subscriber.contact.phone"
              id="phone"
              placeholder="Telefon Privat"
              size="32"
              autocomplete="off"
            />
          </div>

          <!-- Phone 2 -->
          <div class="item">
            <span class="label label-icon label-contact">
              <font-awesome-icon icon="phone-square-alt" />
            </span>
            <label for="phone2" style="display: none">Telefon Geschäft</label>
            <input
              v-model="subscriber.contact.phone2"
              id="phone2"
              placeholder="Telefon Geschäft"
              size="32"
              autocomplete="off"
            />
          </div>
        </fieldset>

        <!-- Newsletter-->
        <fieldset class="fieldset-newsletter">
          <h3>Newsletter</h3>

          <div v-if="subscriber.personal.newsletter" class="item" @click="toggleNewsletter()">
            <font-awesome-icon class="icon btn-icon toggle-on" icon="toggle-on" />
            Ja
          </div>

          <div v-if="!subscriber.personal.newsletter" class="item" @click="toggleNewsletter()">
            <font-awesome-icon class="icon btn-icon toggle-off" icon="toggle-off" />
            Nein
          </div>
        </fieldset>

        <!-- Subscriber Groups -->
        <fieldset class="fieldset-subscriber-groups">
          <h3>Empfänger Gruppen</h3>

          <div class="subscriber-groups">
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
        </fieldset>

        <!-- Personal -->
        <fieldset class="fieldset-personal">
          <h3>Persönlich</h3>
          <!-- Geburtstag -->
          <div class="item">
            <label for="birthday" class="label">Geburtstag</label>
            <input v-model="subscriber.personal.birthday" type="datetime-local" id="birthday" />
          </div>
        </fieldset>

        <!-- Meta -->
        <fieldset class="fieldset-meta">
          <h3>Meta</h3>

          <!-- Fehler -->
          <div v-if="subscriber.error" class="item">
            Fehler in den diesen Daten gefunden
          </div>

          <!-- ID-->
          <div class="item">
            <label class="label">ID</label>
            <span class="deactivated"> {{ subscriber.id }}</span>
          </div>
          <!-- Transfer ID -->
          <div class="item">
            <label for="transfer-id" class="label">Transfer ID</label>
            <input
              id="transfer-id"
              v-model="subscriber.transferId"
              placeholder="Transfer ID"
              size="15"
              autocomplete="off"
            />
          </div>
          <!-- Erstellt  -->
          <div class="item">
            <label class="label">Erstellt</label>
            <span class="deactivated"> {{ subscriber.changed | moment('DD. MM. YYYY - HH:mm') }}</span>
          </div>
          <!-- Aktualisiert -->
          <div class="item">
            <label class="label">Geändert</label>
            <span class="deactivated"> {{ subscriber.created | moment('DD. MM. YYYY - HH:mm') }}</span>
          </div>

          <!-- Herkunft -->
          <div class="item">
            <label class="label">Herkunft</label>
            <span class="deactivated"> {{ origin }}</span>
          </div>
          <!-- Status -->
          <div class="item">
            <label class="label">Status</label>
            <span class="deactivated"> {{ subscriberStatus }}</span>
          </div>
        </fieldset>
      </div>
    </div>
    <!-- if Subscriber -->
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { Subscriber } from '@/_models/SubscriberClass'
import { SubscriberStore } from '@/store'
import { SubscriberGroupTerm } from '@/_models/mollo'

@Component({})
export default class SubscriberEdit extends Vue {
  @Prop() subscriberId!: number

  edit: boolean = false
  isSave: boolean = true
  private subscriber: Subscriber | null = null

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
    if (this.subscriber && this.subscriber.status[0]) {
      return this.subscriber.status[0].status
    }
  }

  get origin() {
    if (this.subscriber && this.subscriber.origin && this.subscriber.origin[0]) {
      return this.subscriber.origin[0].name
    }
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
    if (this.subscriber) {
      const term: SubscriberGroupTerm = SubscriberStore.groups.filter(_group => _group.id === id)[0]
      this.subscriber.groups.push(term)
    }
  }

  removeGroup(id: number) {
    if (this.subscriber) {
      this.subscriber.groups = this.subscriber.groups.filter(_group => _group.id != id)
    }
  }

  isGroupActive(id: number) {
    if (this.subscriber) {
      const result = this.subscriber.groups.filter(_group => _group.id === id)
      console.log('result', result)
      if (result.length === 1) {
        return true
      }
    }
    return false
  }

  @Watch('subscriberId')
  updateCurrentSubscriber() {
    const subscriber = SubscriberStore.list.find(sub => sub.id === this.subscriberId)
    if (subscriber) {
      this.subscriber = subscriber
    }
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

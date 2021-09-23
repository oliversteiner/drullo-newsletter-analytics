import { Action, Module, Mutation, MutationAction, VuexModule } from 'vuex-module-decorators'
import store, { SubscriberStore } from '@/store'
import * as api from '@/store/api'
import { AxiosResponse } from 'axios'

import { MolloResponse } from '@/_models/mollo'
import SubscriberClass, { Subscriber } from '@/_models/SubscriberClass'
import { MolloAddress, MolloContact, MolloMember, MolloPersonal } from '@/_models/MolloMember'
import { CountryTerm, GenderTerm, OriginTerm, TaxonomyTerm } from '@/store/modules/TermsModule'
import { EnumsSubscriberStatus } from '@/enums'

export interface SubscriberGroupTerm extends TaxonomyTerm {
  id: number
  name: string
  subscribers?: number
  active?: boolean
  invalidAddresses?: string[]
}

export interface SubscriberModuleInterface {
  list: Subscriber[]
  groups: SubscriberGroupTerm[]
  count: number
}

@Module({
  namespaced: true,
  name: 'subscriber',
  store,
})
export default class SubscriberModule extends VuexModule implements SubscriberModuleInterface {
  public list: Subscriber[] = []
  public groups: SubscriberGroupTerm[] = []
  public count: number = 0
  public invalidAddresses: string[] = []

  @Mutation
  public ADD_SUBSCRIBER(subscriber: Subscriber): void {
    this.list.push(subscriber)
  }

  @Action({ commit: 'ADD_SUBSCRIBER' })
  public addSubscriber(subscriber: Subscriber): Subscriber {
    console.log('New Subscriber')

    return subscriber
  }

  @Action
  public getSubscriberByID(id: number): Subscriber | undefined {
    return this.list.find((sub: Subscriber) => sub.id === id)
  }

  @Mutation
  public async deleteSubscriber(id: number): Promise<MolloResponse> {
    // check if Subscriber exists
    const _subscriber = this.list.find(sub => sub.id === id)
    if (!_subscriber) {
      return { status: false }
    }

    // Delete in Store
    const index = this.list.findIndex(sub => sub.id === id)
    this.list.splice(index, 1)

    // Delete on Server
    const result = await api.deleteSubscriber(id)
    console.log('result', result)

    return result
  }

  @Mutation
  public async saveSubscriberToServer(id: number): Promise<MolloResponse> {
    const _subscriber = this.list.find(sub => sub.id === id)
    if (!_subscriber) {
      return { status: false }
    }

    // remove Observer
    const subscriber: Subscriber = JSON.parse(JSON.stringify(_subscriber))

    // Gender
    let gender: GenderTerm[] = []
    if (subscriber.personal && subscriber.personal.gender != 0) {
      // @ts-ignore
      gender = [{ id: subscriber.personal.gender }]
    }

    const personal: MolloPersonal = {
      gender: gender,
      firstName: subscriber.personal?.firstName,
      lastName: subscriber.personal?.lastName,
      birthday: subscriber.personal?.birthday,
      newsletter: subscriber.personal?.newsletter,
    }

    // Country
    let country: CountryTerm[] = []
    if (subscriber.address && subscriber.address.country != 0) {
      // @ts-ignore
      country = [{ id: subscriber.address.country }]
    }

    const address: MolloAddress = {
      // @ts-ignore
      streetAndNumber: subscriber.address.streetAndNumber,
      // @ts-ignore
      zipCode: subscriber.address.zipCode,
      // @ts-ignore
      city: subscriber.address.city,
      country: country,
    }

    const contact: MolloContact = {
      email: subscriber.contact?.email,
      phone: subscriber.contact?.phone,
      phone2: subscriber.contact?.phone2,
      mobile: subscriber.contact?.mobile,
    }

    // Origin
    let origin: OriginTerm[] = []
    if (subscriber.origin != 0) {
      // @ts-ignore
      origin = [{ id: subscriber.origin }]
    }

    const postData: MolloMember = {
      id: id,
      personal: personal,
      address: address,
      contact: contact,
      error: subscriber.error,
      read: subscriber.read,
      groups: subscriber.groups,
      origin: origin,
      telemetry: subscriber.telemetry,
    }

    console.log('postData', postData)

    // return testReturn
    const result = await api.updateSubscriber(postData)
    console.log('result', result)

    // if new Subscriber: update ID:
    if (subscriber.id === 0 && result.id) {
      this.list.forEach((sub: Subscriber) => {
        if (sub.id === 0) {
          sub.id = result.id
        }
      })
    }

    return result
  }

  @Action({ commit: 'getSubscriberGroups' })
  public async loadSubscriberGroups() {
    return await api.getSubscriberGroups()
  }

  /*  @MutationAction
  public async updateFromServer(): Promise<AxiosResponse> {
    return await api.getUpdatedSubscribers()
  }*/

  @Mutation
  public async refresh(): Promise<void> {
    // ------------------  Invalid Email Addresses  ------------------
    const invalidAddressesResponse = await api.getInvalidAddresses()
    const invalidAddresses = invalidAddressesResponse.addresses
    console.log('invalidAddresses', invalidAddresses)

    this.invalidAddresses = invalidAddresses

    // ------------------  Subscriber Groups  ------------------
    const groupResponse = await api.getSubscriberGroups()
    const groups = groupResponse.terms.map(group => {
      group.active = false
      return group
    })
    console.log('Subscriber Groups', groups)

    this.groups = groups

    // ------------------  Subscribers  ------------------

    //  const update = await api.getUpdatedSubscribers()

    //  console.log('Subscriber Changes From Server:', update.data.count)
    console.log('Subscribers in LocalStore:', SubscriberStore.count)

    // check Status
    if (SubscriberStore.count != 0) {
      SubscriberStore.list.forEach(subscriber => {
        // check email
        if (subscriber.contact && subscriber.contact.email) {
          const result = SubscriberClass.checkEmail(subscriber.contact.email)
          if (result && result.error) {
            subscriber.error = true
          }
        }

        // set Status
        if (subscriber.error) {
          subscriber.currentStatus = EnumsSubscriberStatus.ERROR
        }
      })
    }

    //  if (SubscriberStore.count == 0 || update.data.count > 0) {
    if (SubscriberStore.count == 0) {
      const listFromServer = await api.getAllSubscribers()

      const members = listFromServer.members

      const subscribers = SubscriberClass.convertMemberToSubscribers(members)
      this.list = subscribers
      this.count = subscribers.length
    }
  }
}

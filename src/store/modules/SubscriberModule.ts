import { Action, Module, Mutation, MutationAction, VuexModule } from 'vuex-module-decorators'
import store, { SubscriberStore } from '@/store'
import * as api from '@/store/api'
import { AxiosResponse } from 'axios'

import { MolloResponse } from '@/_models/mollo'
import SubscriberClass, { Subscriber } from '@/_models/SubscriberClass'
import { MolloAddress, MolloContact, MolloMember, MolloPersonal } from '@/_models/MolloMember'
import { CountryTerm, GenderTerm, OriginTerm, TaxonomyTerm } from '@/store/modules/TermsModule'

export interface SubscriberGroupTerm extends TaxonomyTerm {
  id: number
  name: string
  subscribers?: number
  active?: boolean
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

  @Action
  public getSubscriberByID(id: number): Subscriber | undefined {
    return this.list.find((sub: Subscriber) => sub.id === id)
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
      // @ts-ignore
      gender: gender,
      // @ts-ignore
      first_name: subscriber.personal.firstName,
      // @ts-ignore
      last_name: subscriber.personal.lastName,
      // @ts-ignore
      birthday: subscriber.personal.birthday,
      // @ts-ignore
      newsletter: subscriber.personal.newsletter,
    }

    // Country
    let country: CountryTerm[] = []
    if (subscriber.address && subscriber.address.country != 0) {
      // @ts-ignore
      country = [{ id: subscriber.address.country }]
    }

    const address: MolloAddress = {
      // @ts-ignore
      street_and_number: subscriber.address.streetAndNumber,
      // @ts-ignore
      zip_code: subscriber.address.zipCode,
      // @ts-ignore
      city: subscriber.address.city,
      country: country,
    }

    const contact: MolloContact = {
      // @ts-ignore
      email: subscriber.contact.email,
      // @ts-ignore
      phone: subscriber.contact.phone,
      // @ts-ignore
      phone_2: subscriber.contact.phone2,
      // @ts-ignore
      mobile: subscriber.contact.mobile,
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

    const testReturn: MolloResponse = { status: true }
    // return testReturn
    const result = await api.updateSubscriber(postData)
    console.log('result', result)

    return result
  }

  @Action({ commit: 'getSubscriberGroups' })
  public async loadSubscriberGroups() {
    return await api.getSubscriberGroups()
  }

  // @ts-ignore
  @MutationAction
  public async updateFromServer(): Promise<AxiosResponse> {
    return await api.getUpdatedSubscribers()
  }

  @Mutation
  public async refresh(): Promise<void> {
    // ------------------  Subscriber Groups  ------------------
    const groupResponse = await api.getSubscriberGroups()
    const groups = groupResponse.terms.map(group => {
      group.active = false
      return group
    })
    console.log('Subscriber Groups', groups)

    this.groups = groups

    // ------------------  Subscribers  ------------------

    const update = await api.getUpdatedSubscribers()

    console.log('Subscriber Changes From Server:', update.data.count)
    console.log('Subscribers in LocalStore:', SubscriberStore.count)

    if (SubscriberStore.count == 0 || update.data.count > 0) {
      const listFromServer = await api.getAllSubscribers()

      const members = listFromServer.members

      const subscribers = SubscriberClass.convertMemberToSubscribers(members)
      this.list = subscribers
      this.count = subscribers.length
    }
  }
}

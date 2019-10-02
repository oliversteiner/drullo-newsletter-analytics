import axios from 'axios'

import { eventBus } from '@/main'
import { SubscriberStore } from '@/store/index'
import { TasksResponse } from '@/_models/TaskClass'
import { MolloMessageResponse } from '@/_models/NewsletterClass'
import { SubscriberCountResponse } from '@/_models/SubscriberClass'
import { Profile, ProfileResponse, User, UserForUpdate, UserResponse, UserSubmit } from '@/_models/models'
import { StatusMessage } from '@/_models/MessageClass'
import { MolloResponse, MolloTermResponse } from '@/_models/mollo'
import { MolloMember, MolloMemberResponse } from '@/_models/MolloMember'

export const smmgApi = axios.create({
  baseURL: process.env.VUE_APP_HOST + '/smmg',
})

export const drupalApi = axios.create({
  baseURL: process.env.VUE_APP_HOST,
})

export async function getTaskList() {
  const response = await smmgApi.get('/api/tasks')
  return response.data as TasksResponse
}

export async function getNewsletterList() {
  const response = await smmgApi.get('/api/newsletters')
  return response.data as MolloMessageResponse
}

export async function getSubscribersList() {
  const response = await smmgApi.get('/api/members')
  return response.data as MolloMemberResponse
}

export async function getSubscriberCount() {
  const response = await smmgApi.get('/api/members/count')
  return response.data as SubscriberCountResponse
}

export async function getSubscriberGroups() {
  const response = await smmgApi.get('/api/terms/subscriber-group')
  return response.data as MolloTermResponse
}

export async function getGenderTerms() {
  const response = await smmgApi.get('/api/terms/gender')
  return response.data as MolloTermResponse
}

export async function getCountryTerms() {
  const response = await smmgApi.get('/api/terms/country')
  return response.data as MolloTermResponse
}

export async function getOriginTerms() {
  const response = await smmgApi.get('/api/terms/origin')
  return response.data as MolloTermResponse
}

export async function getCategoryTerms() {
  const response = await smmgApi.get('/api/terms/category')
  return response.data as MolloTermResponse
}

export async function updateSubscriber(data: MolloMember) {
  const response = await smmgApi.post('/api/member/update/', data)
  return response.data as MolloResponse
}

export async function getUpdatedSubscribers() {
  // search in localstorage for latest updated item
  const allChangedTS: number[] = SubscriberStore.list.map(subscribers => {
    return subscribers.changedTs as number
  })
  const latestChanged = Math.max(...allChangedTS)
  return await smmgApi.get('/api/members/sync/' + latestChanged)
}

export async function getAllSubscribers() {
  // Number of all Members
  let statusMessage!: StatusMessage

  const response = await smmgApi.get('/api/members/count')
  const memberLength = response.data.countMembers
  statusMessage = { module: 'subscribers', status: 'start', count: memberLength }
  eventBus.$emit('LOADING_DATA', statusMessage)

  // Args for request url
  const group = 0
  const range = 100

  // split to one request per 100 Members
  let urls: string[] = [] // Store Urls for Requests
  for (let i = 0; i < memberLength; i += range) {
    // build request url
    const url = 'api/members/' + i + '/' + range + '/' + group

    // add url to request queue
    urls.push(url)
  }

  // actual request
  // @ts-ignore url
  let loadingStatus = 0
  const getData = async (url: string) => {
    const response = await smmgApi.get(url)
    // wait(1000) // for Testing
    statusMessage = { module: 'subscribers', status: 'loading', progress: loadingStatus }
    eventBus.$emit('LOADING_DATA', statusMessage)
    loadingStatus += range

    return response.data as MolloMemberResponse
  }

  // collect all requests
  const allResponses = (await Promise.all(urls.map(url => getData(url))).catch(e => {
    console.error('error loading Members', e)
    statusMessage = {
      module: 'subscribers',
      status: 'error',
      message: "Can't load the Subscriber data",
    }
    eventBus.$emit('LOADING_DATA', statusMessage)
  })) as MolloMemberResponse[]

  // assemble all members in one array
  let members: MolloMember[] = []
  allResponses.map(response => {
    console.warn('-- Response Members', response.members.length)

    response.members.map((member: MolloMember) => {
      members.push(member)
    })
  })

  statusMessage = { module: 'subscribers', status: 'finish' }
  eventBus.$emit('LOADING_DATA', statusMessage)

  // build Request Response
  const result: MolloMemberResponse = {
    count: memberLength,
    set: range,
    start: 0,
    length: memberLength,
    subscriberGroups: 0,
    members: members,
  }

  //
  return result
}

// --------------------------------------- //

export function setJWT(jwt: string) {
  drupalApi.defaults.headers.common['Authorization'] = `Token ${jwt}`
}

export function clearJWT() {
  delete drupalApi.defaults.headers.common['Authorization']
}

export async function loginUser(user: UserSubmit): Promise<User> {
  const response = await drupalApi.post('/users/login', {
    user,
  })
  return (response.data as UserResponse).user
}

export async function fetchProfile(username: string): Promise<Profile> {
  const response = await drupalApi.get(`/profiles/${username}`)
  return (response.data as ProfileResponse).profile
}

export async function fetchUser(): Promise<User> {
  const response = await drupalApi.get('/user')
  return (response.data as UserResponse).user
}

export async function updateUser(user: UserForUpdate): Promise<User> {
  const response = await drupalApi.put('/user', user)
  return (response.data as UserResponse).user
}

// Helper
// --------------------------------------- //
function wait(ms: number) {
  var start = new Date().getTime()
  var end = start
  while (end < start + ms) {
    end = new Date().getTime()
  }
}

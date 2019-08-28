import axios from 'axios'
import {
  UserSubmit,
  UserResponse,
  User,
  Profile,
  ProfileResponse,
  UserForUpdate,
  TasksResponse,
  NewslettersResponse,
  MemberResponse,
  Member,
} from './models'
import tasks from '@/store/modules/tasks'

export const smmgApi = axios.create({
  baseURL: 'https://drullo.local/smmg',
})

export const drupalApi = axios.create({
  baseURL: 'https://drullo.local/',
})

export async function getTaskList() {
  const response = await smmgApi.get('/api/tasks')
  return response.data as TasksResponse
}

export async function getNewsletterList() {
  const response = await smmgApi.get('/api/newsletters')
  return response.data as NewslettersResponse
}

export async function getSubscribersList() {
  const response = await smmgApi.get('/api/members')
  return response.data as MemberResponse
}

export async function getAllSubscribers() {
  const response = await smmgApi.get('/api/members/count')

  // Number of all Members
  const memberLength = response.data.all

  // Args for request url
  const group = 0
  let start = 0
  const range = 100

  // split to one request per 100 Members
  let urls: string[] = []   // Store Urls for Requests
  for (let i = 0; i < memberLength; i += range) {
    // build request url
    const url = 'api/members/' + start + '/' + range + '/' + group
    urls.push(url)
    start += range
  }

  // actual request
  // @ts-ignore url
  const getData = async url => {
    const response = await smmgApi.get(url)
    return response.data as MemberResponse
  }

  // collect all requests
  const allResponses = (await Promise.all(urls.map(url => getData(url))).catch(e =>
    console.error('error loading Members', e),
  )) as MemberResponse[]

  // assemble all members in one array
  let members: Member[] = []
  allResponses.map(response => {
    response.members.map(member => {
      members.push(member)
    })
  })

  // build Request Response
  const result: MemberResponse = {
    count: memberLength,
    set: range,
    start: 0,
    length: memberLength,
    subscriber_group: 0,
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

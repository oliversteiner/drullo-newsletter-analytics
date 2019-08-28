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
  MemberResponse, Member,
} from './models'
import tasks from '@/store/modules/tasks'

export const smmgApi = axios.create({
  baseURL: 'https://drullo.local/smmg',
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
  const response = await smmgApi.get('/api/members')

  const memberLengh = response.data.count
  const set = response.data.set

  // get required promises
  const tasks = Math.ceil(memberLengh / set)
  const table = {all: memberLengh, set: set, tasks: tasks}
  console.log('server', table)

  const group = 0
  let start = 0
  let urls: string[] = []

  // split to one request per 200 Members
  for (let i = 0; i < memberLengh; i += set) {
    console.log('Member Nr: ', i)
    // build requests
    const url = 'api/members/' + start + '/' + set + '/' + group
    urls.push(url)
    start += set
  }


  const getData = async url => {
    const response = await smmgApi.get(url)
    return response.data as MemberResponse
  }

  console.log('urls', urls)

  const allResponses = await Promise.all(urls.map(
    url => getData(url)
  )).catch(e => console.log('e', e)) as MemberResponse[]

  console.log('allResponses', allResponses);

  let members2: Member[] = []
  const nids = []

  allResponses.map(response => {
    response.members.map(member => {
        members2.push(member)
      }
    )
  })

  const result: MemberResponse = {
    count: memberLengh,
    set: set,
    start: 0,
    length: memberLengh,
    subscriber_group: 0,
    members: members2,
  }
  console.log('result', result);


  // collect
  // return await Promise.all(request).catch(e => console.log('error', e))

  // return allMembers.data as MemberResponse
  return result
}

// --------------------------------------- //

export const conduitApi = axios.create({
  baseURL: 'https://conduit.productionready.io/api',
})

export function setJWT(jwt: string) {
  conduitApi.defaults.headers.common['Authorization'] = `Token ${jwt}`
}

export function clearJWT() {
  delete conduitApi.defaults.headers.common['Authorization']
}

export async function loginUser(user: UserSubmit): Promise<User> {
  const response = await conduitApi.post('/users/login', {
    user,
  })
  return (response.data as UserResponse).user
}

export async function fetchProfile(username: string): Promise<Profile> {
  const response = await conduitApi.get(`/profiles/${username}`)
  return (response.data as ProfileResponse).profile
}

export async function fetchUser(): Promise<User> {
  const response = await conduitApi.get('/user')
  return (response.data as UserResponse).user
}

export async function updateUser(user: UserForUpdate): Promise<User> {
  const response = await conduitApi.put('/user', user)
  return (response.data as UserResponse).user
}

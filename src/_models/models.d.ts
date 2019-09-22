export interface Range {
  from: number
  to: number
}

interface Category {
  id: number
  name: string
}

interface Origin {
  id: number
  name: string
}

interface Contact {
  phone: string
  phone_2: string
  mobile: string
  email: string
}

interface Address {
  first_name: string
  last_name: string
  street_and_number: string
  zip_code: string
  city: string
  birthday: string
}

// ------------------------- //

export interface Profile {
  username: string
  bio?: string
  image?: string
  following: boolean
}

export interface User {
  email: string
  token: string
  username: string
  bio?: string
  image?: string
}

export interface UserForUpdate {
  email?: string
  username?: string
  bio?: string
  password?: string
  image?: string
}

export interface UserSubmit {
  email: string
  password: string
}

export interface UserResponse {
  user: User
}

export interface ProfileResponse {
  profile: Profile
}

interface Statistic {
  subscribers: number
  unconfirmed: number
  send: number
  open: number
  unsubscribe: number
  error: number
}

import axios from 'axios';
import {
    UserSubmit,
    UserResponse,
    User,
    Profile,
    ProfileResponse,
    UserForUpdate, TasksResponse, NewslettersResponse,
} from './models';


export const smmgApi = axios.create({
    baseURL: 'https://drullo.local/smmg'
})



export async function getTaskList() {
    const response = await smmgApi.get('/api/tasks');
    return response.data as TasksResponse;
}

export async function getNewsletterList() {
    const response = await smmgApi.get('/api/newsletters');
    return response.data as NewslettersResponse;
}

// --------------------------------------- //

export const conduitApi = axios.create({
    baseURL: 'https://conduit.productionready.io/api',
});

export function setJWT(jwt: string) {
    conduitApi.defaults.headers.common['Authorization'] = `Token ${jwt}`;
}

export function clearJWT() {
    delete conduitApi.defaults.headers.common['Authorization'];
}

export async function loginUser(user: UserSubmit): Promise<User> {
    const response = await conduitApi.post('/users/login', {
        user,
    });
    return (response.data as UserResponse).user;
}

export async function fetchProfile(username: string): Promise<Profile> {
    const response = await conduitApi.get(`/profiles/${username}`);
    return (response.data as ProfileResponse).profile;
}

export async function fetchUser(): Promise<User> {
    const response = await conduitApi.get('/user')
    return (response.data as UserResponse).user
}


export async function updateUser(user: UserForUpdate): Promise<User> {
    const response = await conduitApi.put('/user', user)
    return (response.data as UserResponse).user
}

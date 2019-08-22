import {Moment} from "moment";
import {TaskStatus, TaskStatusMessage} from "@/enums";

export interface TasksResponse {
    tasks?: (Task)[] | null;
    tasksCount: number;
}

export interface Task {
    id: number;
    title: string;
    created:number | Moment;
    changed:number | Moment;
    done: boolean;
    status: TaskStatus;
    statusMessage: TaskStatusMessage;
    active: boolean;
    number: number;
    part_of: number;
    group: string;
    message: Message;
    range: Range;
    related:string;
}

export interface Range {
    from: number;
    to: number;
}

export interface Message {
    id: number;
    title: string;
    category: string;
}

export interface TaskRelated{
    related:string;
    message: Message;
}





// ------------------------- //

export interface Profile {
    username: string;
    bio?: string;
    image?: string;
    following: boolean;
}

export interface User {
    email: string;
    token: string;
    username: string;
    bio?: string;
    image?: string;
}

export interface UserForUpdate {
    email?: string
    username?: string
    bio?: string
    password?: string
    image?: string
}

export interface Article {
    slug: string;
    title: string;
    description: string;
    body: string;
    tagList?: (string)[] | null;
    createdAt: string;
    updatedAt: string;
    favorited: boolean;
    favoritesCount: number;
    author: Author;
}

export interface Author {
    username: string;
    bio: string;
    image: string;
    following: boolean;
}

export interface UserSubmit {
    email: string;
    password: string;
}

export interface UserResponse {
    user: User;
}

export interface ProfileResponse {
    profile: Profile;
}

export interface ArticlesResponse {
    articles?: (Article)[] | null;
    articlesCount: number;
}



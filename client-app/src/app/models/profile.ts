import { User } from "./user";

export interface Profile {
    displayName: string;
    userName: string;
    bio?: string;
    image?: string;
    photos?: Photo[];
    following: boolean;
    followersCount: number;
    followingCount: number;
}

export class Profile implements Profile {
    displayName: string;
    userName: string;
    bio?: string;
    image?: string;


    constructor(user: User) {
        this.displayName = user.displayName;
        this.userName = user.userName;
        this.image = user.image;
        this.bio = user.bio;
    }
}

export interface Photo {
    id: string;
    url: string;
    isMain: boolean;
    publicId?: string;
}

export interface UserActivity {
    id: string;
    title: string;
    category: string;
    date: Date;
}

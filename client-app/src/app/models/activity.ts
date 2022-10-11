import { Profile } from "./profile";

export interface Activity {
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date | null;
    city: string;
    venue: string;
    hostUsername: string;
    host?: Profile;
    isCancelled: boolean;
    isGoing: boolean;
    isHost: boolean;
    attendees: Profile[];
}

export class Activity implements Activity {
    constructor(init?: ActivityFormValues) {
        Object.assign(this, init);
    }
}

export class ActivityFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description: string = '';
    date: Date | null = null;
    city: string = '';
    venue: string = '';

    constructor(init?: ActivityFormValues) {
        if (!init) return;
        this.category = init.category;
        this.title = init.title;
        this.description = init.description;
        this.date = init.date;
        this.city = init.city;
        this.venue = init.venue;
        this.id = init.id;

    }
}
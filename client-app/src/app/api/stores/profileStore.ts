import { makeAutoObservable, runInAction } from "mobx";
import { Photo, Profile } from "../../models/profile";
import agent from "../agent";
import { store } from "./store";

export default class profileStore {
    profile: Profile | undefined = undefined;
    loadingProfile = false;
    uploadingPhoto = false;
    loading = false;
    followings: Profile[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.userName === this.profile.userName;
        } else {
            return false;
        }
    }

    loadProfile = async (username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loadingProfile = false;
            })
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            console.log('photo to upload', photo);

            runInAction(() => {
                if (this.profile) {
                    this.profile.photos!.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.uploadingPhoto = false;
            })
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(() => {
                this.profile!.photos!.find(a => a.isMain)!.isMain = false;
                this.profile!.photos!.find(a => a.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                this.profile!.photos = this.profile!.photos!.filter(a => a.id !== photo.id);
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        this.loading = true;
        try {
            await agent.Profiles.updateProfile(profile);
            runInAction(() => {
                if (profile.displayName !== store.userStore.user!.displayName) {
                    store.userStore.setDisplayName(profile.displayName!);
                }
                this.profile = { ...this.profile!, ...profile };
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;
        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);
            runInAction(() => {
                if (this.profile && this.profile.userName !== store.userStore.user!.userName && this.profile.userName === username) {
                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.following = !this.profile.following;
                }
                // if (username !== store.userStore.user!.userName) {
                //    
                // }
                if (this.profile && this.profile.userName === store.userStore.user!.userName) {
                    following ? this.profile.followingCount++ : this.profile.followingCount--;
                }

                // following ? this.followings.push(this.profile!) : this.followings = this.followings.filter(a => a.userName !== username);

                this.followings.forEach(profile => {
                    if (profile.userName === username) {
                        profile.following ? profile.followersCount-- : profile.followersCount++;
                        profile.following = !profile.following;
                    }
                })
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    loadFollowings = async (predicate: string) => {
        this.loading = true;
        try {
            const followings = await agent.Profiles.listFollowings(this.profile!.userName, predicate);
            runInAction(() => {
                this.followings = followings;
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    clearFollowings = () => {
        this.followings = [];
    }
}
import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../../..";
import { User, UserFormValues } from "../../models/user";
import agent from "../agent";
import { store } from "./store";

// declare var google: any;


export default class UserStore {
    user: User | null = null;
    fbAccessToken: string | null = null;
    fbLoading: boolean = false;
    googleAccessToken: string | null = null;
    googleLoading: boolean = false;


    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user;
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds);
            store.commonStore.setToken(user.token);

            runInAction(() => {
                this.user = user;
            })

            history.push('/activities');
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        history.push('/');
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => {
                this.user = user;
            })
        } catch (error) {
            throw error;
        }
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds);
            store.commonStore.setToken(user.token);

            runInAction(() => {
                this.user = user;
            })

            history.push('/activities');
            store.modalStore.closeModal();
        } catch (error) {
            throw error;
        }
    }

    setImage = (image: string) => {
        if (this.user) this.user.image = image;
    }

    setDisplayName = (displayName: string) => {
        if (this.user) this.user.displayName = displayName;
    }

    getFacebookLoginStatus = async () => {
        window.FB.getLoginStatus((response) => {
            if (response && response.status === 'connected') {
                this.fbAccessToken = response.authResponse.accessToken;
            }
        });
    }

    facebookLogin = () => {
        const apiLogin = async (accessToken: string) => {
            this.fbLoading = true;
            try {
                const user = await agent.Account.fbLogin(accessToken);
                store.commonStore.setToken(user.token);

                runInAction(() => {
                    this.user = user;
                })

                history.push('/activities');
                store.modalStore.closeModal();

            } catch (error) {
                throw error;
            } finally {
                this.fbLoading = false;
            }
        }

        if (this.fbAccessToken) {
            apiLogin(this.fbAccessToken);
        } else {
            window.FB.login((response) => {
                if (response != null && response.authResponse != null) {
                    apiLogin(response.authResponse.accessToken);
                }
            }, { scope: 'public_profile,email' })
        }
    }

    googleLogin = async (response: any) => {
        this.googleLoading = true;
        try {
            const user = await agent.Account.googleLogin(response.credential);
            store.commonStore.setToken(user.token);

            runInAction(() => {
                this.user = user;
            })

            history.push('/activities');
            store.modalStore.closeModal();

        } catch (error) {
            throw error;
        } finally {
            this.googleLoading = false;
        }

    };

}


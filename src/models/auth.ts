import { AtpSessionData, BskyAgent } from "@atproto/api";
import { makeAutoObservable } from "mobx";
import { DEFAULT_BSKY_IDENTIFIER, DEFAULT_BSKY_PASSWORD } from "../env";
import { LocalStorageModel } from "./local_storage";
import { useNavigate } from "@tanstack/react-router";

export class AuthModel {
    username = new LocalStorageModel<string>({
        key: "debugapp_username",
        defaultValue: DEFAULT_BSKY_IDENTIFIER,
    });

    password = new LocalStorageModel<string>({
        key: "debugapp_password",
        defaultValue: DEFAULT_BSKY_PASSWORD,
    });

    session = new LocalStorageModel<AtpSessionData | undefined>({
        key: "debugapp_session",
        defaultValue: undefined,
    });

    loggedIn = false;

    bskyAgent = new BskyAgent({
        service: "https://bsky.social",
    });
    myDid?: string;

    constructor() {
        makeAutoObservable(this, {
            bskyAgent: false,
        });
    }

    async checkLogin(force: boolean = false) {
        if (!force) {
            if (this.loggedIn && this.bskyAgent && this.bskyAgent.session) {
                return true;
            }
        }

        try {
            if (this.session.value) {
                console.log("Resuming session...");
                const sess = await this.bskyAgent.resumeSession(this.session.value);

                this.myDid = sess.data.did;
            } else {
                console.log("Logging in...");
                const resp = await this.bskyAgent.login({
                    identifier: this.username.value,
                    password: this.password.value,
                });

                this.myDid = resp.data.did;

                this.session.set(this.bskyAgent.session);
            }

            this.loggedIn = true;
            console.log("Logged in!");
        } catch (e) {
            console.log("Failed to log in!");
            this.loggedIn = false;
            this.session.set(undefined);
            this.myDid = undefined;
        }

        return this.loggedIn;
    }

    async logout() {
        this.loggedIn = false;
        this.myDid = undefined;
        this.session.clear();
        this.username.clear();
        this.password.clear();
    }
}

export const AUTH_MODEL = new AuthModel();

export function useRequireLogin() {
    const navigate = useNavigate();
    if (!AUTH_MODEL.loggedIn) {
        navigate({ to: "/login" });
    }
}

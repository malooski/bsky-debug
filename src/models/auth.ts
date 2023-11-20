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

    bskyAgent?: BskyAgent;

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
            const agent = new BskyAgent({
                service: "https://bsky.social",
            });

            if (this.session.value) {
                console.log("Resuming session...");
                await agent.resumeSession(this.session.value);
            } else {
                console.log("Logging in...");
                await agent.login({
                    identifier: this.username.value,
                    password: this.password.value,
                });

                this.session.set(agent.session);
            }

            this.bskyAgent = agent;
            this.loggedIn = true;
            console.log("Logged in!");
        } catch (e) {
            console.log("Failed to log in!");
            this.loggedIn = false;
            this.bskyAgent = undefined;
            this.session.set(undefined);
        }

        return this.loggedIn;
    }

    async logout() {
        this.loggedIn = false;
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

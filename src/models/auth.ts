import { AtpSessionData, BskyAgent } from "@atproto/api";
import { makeAutoObservable } from "mobx";
import { LocalStorageModel } from "./local_storage";

interface ILoggedInContext {
    isLoggedIn: true;
    username: string;
    did: string;
}

export class LoggedInContext {
    isLoggedIn: true;
    username: string;
    did: string;

    constructor(args: ILoggedInContext) {
        this.isLoggedIn = args.isLoggedIn;
        this.username = args.username;
        this.did = args.did;

        makeAutoObservable(this);
    }
}

export class AuthModel {
    session = new LocalStorageModel<AtpSessionData | undefined>({
        key: "debugapp_session",
        defaultValue: undefined,
    });

    bskyAgent = new BskyAgent({
        service: "https://bsky.social",
        persistSession: async (evt, sess) => {
            console.log("Persisting session...");
            await this.session.set(sess);
        },
    });

    loggedInContext?: LoggedInContext;

    constructor() {
        makeAutoObservable(this, {
            bskyAgent: false,
        });
    }

    async check() {
        const session = await this.session.value;
        if (!session) {
            throw new Error("No session found!");
        }

        if (this.bskyAgent.hasSession) {
            return;
        }

        const resumedResp = await this.bskyAgent.resumeSession(session);
        if (!resumedResp.success) {
            throw new Error("Failed to resume session!");
        }

        this.setLoggedInContext({
            isLoggedIn: true,
            username: resumedResp.data.handle,
            did: resumedResp.data.did,
        });
    }

    async login(username: string, password: string) {
        this.session.set(undefined);

        try {
            const resp = await this.bskyAgent.login({
                identifier: username,
                password: password,
            });

            if (!resp.success) throw new Error("Failed to log in!");

            this.setLoggedInContext({
                isLoggedIn: true,
                username: resp.data.handle,
                did: resp.data.did,
            });
        } catch (e) {
            console.log("Failed to log in!");
            throw e;
        }
    }

    setLoggedInContext(ctx: ILoggedInContext) {
        this.loggedInContext = new LoggedInContext(ctx);
    }

    clearLoggedInContext() {
        this.loggedInContext = undefined;
    }

    async logout() {
        this.session.clear();
        this.clearLoggedInContext();
        this.bskyAgent.session = undefined;
    }
}

export const AUTH_MODEL = new AuthModel();

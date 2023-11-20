import { makeAutoObservable } from "mobx";

interface LocalStorageModelArgs<T> {
    key: string;
    defaultValue: T;
}

export class LocalStorageModel<T> {
    value: T;

    private key: string;
    private defaultValue: T;

    constructor(args: LocalStorageModelArgs<T>) {
        this.key = args.key;
        this.defaultValue = args.defaultValue;

        this.value = args.defaultValue;

        this.load();

        makeAutoObservable(this);
    }

    set(value: T): void {
        this.value = value;
        localStorage.setItem(this.key, JSON.stringify(value));
    }

    load(): void {
        const entry = localStorage.getItem(this.key);

        if (entry === null) {
            this.value = this.defaultValue;
            return;
        }

        try {
            const parsed = JSON.parse(entry);
            this.value = parsed;
        } catch (e) {
            this.value = this.defaultValue;
        }
    }

    clear(): void {
        this.value = this.defaultValue;
        localStorage.removeItem(this.key);
    }
}

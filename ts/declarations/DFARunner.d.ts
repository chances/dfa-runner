declare module DFARunner {

    export interface DFAFromJSON {
        name?: string;
        states: string[];
        alphabet: string[];
        transitions: TransitionFromJSON[];
        startState: string;
        acceptStates: string[];
    }

    export interface TransitionFromJSON {
        source: string;
        input: string;
        destination: string;
    }

    export interface Marshaller<T> {
        (value: any): T;
    }

    export interface ListItem<T> {
        label: string;
        value: T;
    }

    export interface ListItemWrapper<T> {
        add(item: ListItem<T>): void;
        clear(): void;
        get(index: number): T;
        getItem(index: number): ListItem<T>;
        indexOf(item: T): number;
    }
}

interface ZeptoCollection {
    hasAttr(name: string): boolean;
}

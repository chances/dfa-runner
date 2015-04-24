module DFARunner {

    export class State {
        private _id: string;
        private _transitions: Transition[];

        constructor(id: string, transitions: Transition[] = []) {
            this._id = id;
            this._transitions = transitions;
        }

        get id() {
            return this._id;
        }

        get transitions() {
            return this._transitions;
        }

        isAcceptState(acceptStates: State[]): boolean {
            for (var i = 0; i < acceptStates.length; i++) {
                if (this._id === acceptStates[i].id) {
                    return true;
                }
            }

            // This state is not an accept state
            return false;
        }

        transition(input: string): State {
            for (var i = 0; i < this._transitions.length; i++) {
                if (this._transitions[i].input === input) {
                    return this._transitions[i].destination;
                }
            }

            // No transition found for given input
            return null;
        }

        getTransitionByInput(input: string): Transition {
            for (var i = 0; i < this._transitions.length; i++) {
                if (this._transitions[i].input === input) {
                    return this._transitions[i];
                }
            }

            // No transition found for given input
            return null;
        }
    }

    export class Transition {
        private _input: string;
        private _destination: State;

        constructor(character: string, destination: State) {
            this._input = character;
            this._destination = destination;
        }

        get input() {
            return this._input;
        }

        get destination() {
            return this._destination;
        }

        set destination(destination: State) {
            this._destination = destination;
        }
    }
}

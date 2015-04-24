module DFARunner {

    export class DFA {
        private _states: State[]        = [];
        private _alphabet: string[]     = [];
        private _startState: State      = null;
        private _acceptStates: State[]  = [];

        static createMachine(json: DFAFromJSON): DFA {
            var emitResult = false,
                dfa = new DFA();

            // Add states
            if (json.states && Array.isArray(json.states)) {
                json.states.forEach(function (stateId: string) {
                    dfa.states.push(new State(stateId));

                    emitResult = true;
                });
            }

            // Add alphabet
            if (json.alphabet && Array.isArray(json.alphabet)) {
                json.alphabet.forEach(function (character: string) {
                    dfa.alphabet.push(character);

                    emitResult = true;
                });
            }

            // Add transitions
            if (json.transitions && Array.isArray(json.transitions)) {
                json.transitions.forEach(function (transition) {
                    if (typeof transition.source === 'string' &&
                        typeof transition.input === 'string' &&
                        typeof transition.destination === 'string') {
                        var sourceState = dfa.getStateById(transition.source);
                        var destinationState = dfa.getStateById(transition.destination);

                        if (sourceState !== null && destinationState !== null) {
                            sourceState.transitions.push(
                                new Transition(transition.input, destinationState)
                            );
                        }
                    }
                });
            }

            // Set start state
            if (json.startState && typeof json.startState === 'string') {
                var startState = dfa.getStateById(json.startState);

                if (startState !== null) {
                    dfa.startState = startState;

                    emitResult = true;
                } else {
                    // Default to first state, if available
                    if (dfa.states.length > 0) {
                        dfa.startState = dfa.states[0];

                        emitResult = true;
                    }
                }
            } else {
                // Default to first state, if available
                if (dfa.states.length > 0) {
                    dfa.startState = dfa.states[0];

                    emitResult = true;
                }
            }

            // Add accept states, creating new states if necessary
            if (json.acceptStates && Array.isArray(json.acceptStates)) {
                json.acceptStates.forEach(function (acceptStateId: string) {
                    var acceptState = dfa.getStateById(acceptStateId);

                    if (acceptState === null) {
                        acceptState = new State(acceptStateId);
                        dfa.states.push(acceptState);
                    }

                    dfa.acceptStates.push(acceptState);

                    emitResult = true;
                });
            }

            if (emitResult) return dfa;

            return null;
        }

        static validate(dfa: DFA): boolean {
            // TODO: Validate a DFA

            return false;
        }

        get states() {
            return this._states;
        }

        get alphabet() {
            return this._alphabet;
        }

        get startState() {
            return this._startState;
        }

        set startState(startState: State) {
            this._startState = startState;
        }

        get acceptStates() {
            return this._acceptStates;
        }

        equals(other: DFA): boolean;
        equals(other: DFAFromJSON): boolean;
        equals(other: any): boolean {
            if (!other) return false;

            if (other instanceof DFA) {
                other = other.toJSON();
            }

            if (!other.states) return false;
            if (!other.alphabet) return false;
            if (!other.transitions) return false;
            if ((!other.startState || other.startState === "") && this._startState === null) return false;
            if (other.startState && this._startState === null) return false;
            if (other.startState && this._startState.id !== other.startState) return false;
            if (!other.acceptStates) return false;

            var found = false;

            // Check states and transitions
            for (var i = 0; i < this._states.length; i++) {
                // Check that the state exists in other
                found = false;
                for (var v = 0; v < other.states.length; v++) {
                    if (this._states[i].id === other.states[v]) {
                        found = true;
                        break;
                    }
                }
                if (!found) return false;

                // Check for matching transitions
                for (var v = 0; v < this._states[i].transitions.length; v++) {
                    found = false;
                    for (var u = 0; u < other.transitions.length; u++) {
                        var transition = this._states[i].transitions[v];
                        var otherTransition: TransitionFromJSON = other.transitions[u];
                        if (otherTransition.source === this._states[i].id ||
                            otherTransition.input === transition.input ||
                            otherTransition.destination === transition.destination.id) {
                            found = true;
                            break;
                        }
                    }

                    if (!found) return false;
                }
            }

            // Check alphabet
            for (var i = 0; i < this._alphabet.length; i++) {
                found = false;
                for (var v = 0; v < other.alphabet.length; v++) {
                    if (this._alphabet[i] === other.alphabet[v]) {
                        found = true;
                        break;
                    }
                }

                if (!found) return false;
            }

            // Check accept states
            for (var i = 0; i < this._alphabet.length; i++) {
                found = false;
                for (var v = 0; v < other.alphabet.length; v++) {
                    if (this._alphabet[i] === other.alphabet[v]) {
                        found = true;
                    }
                }

                if (!found) return false;
            }

            return true;
        }

        getStateById(id: string): State {
            if (id !== null) {
                for (var i = 0; i < this._states.length; i++) {
                    if (this._states[i].id === id) {
                        return this._states[i];
                    }
                }
            }

            // State not found
            return null;
        }

        stringInAlphabet(value: string): boolean {
            var found = false;

            for (var i = 0; i < this._alphabet.length; i++) {
                if (this._alphabet[i] === value) {
                    found = true;
                }
            }

            return found;
        }

        stateIsAcceptState(state: State): boolean {
            for (var i = 0; i < this._acceptStates.length; i++) {
                if (this._acceptStates[i].id === state.id) {
                    return true;
                }
            }

            return false;
        }

        toJSON(): DFAFromJSON {
            var states: string[] = [];
            var alphabet: string[] = [];
            var transitions: {
                source: string
                input: string
                destination: string
            }[] = [];
            var acceptStates: string[] = [];

            this._states.forEach(function (state: State) {
                states.push(state.id);

                state.transitions.forEach(function (transition: Transition) {
                    transitions.push({
                        source: state.id,
                        input: transition.input,
                        destination: transition.destination.id
                    });
                });
            });

            this._alphabet.forEach(function (str: string) {
                alphabet.push(str);
            });

            this._acceptStates.forEach(function (state: State) {
                acceptStates.push(state.id);
            });

            return {
                states: states,
                alphabet: alphabet,
                transitions: transitions,
                startState: this._startState ? this._startState.id : "",
                acceptStates: acceptStates
            };
        }

        testString(str: string): boolean {
            if (this._startState === null) return false;
            return this._readString(str, this._startState);
        }

        private _readString(str: string, currentState: State): boolean {
            if (str === "" && currentState.isAcceptState(this._acceptStates)) {
                return true;
            } else if (str === "") {
                return false;
            }

            var input = "",
                nextState: State = null;
            // Get the next state given current alphabet
            for (var i = 0; i < this._alphabet.length; i++) {
                input = this._alphabet[i];
                if (str.indexOf(input) === 0) {
                    nextState = currentState.transition(input);
                    break;
                }
            }

            if (nextState === null) return false;

            //console.log("Input: " + input + "   Rest: " + str.slice(input.length));
            //console.log(nextState);

            return this._readString(str.slice(input.length), nextState);
        }
    }
}

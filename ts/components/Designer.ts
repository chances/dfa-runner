module DFARunner {

    export class Designer extends Component {
        private _states: States;
        private _alphabet: Alphabet;
        private _transitions: Transitions;

        constructor() {
            super("#designer");

            this._states = new States();
            this._alphabet = new Alphabet();
            this._transitions = new Transitions();
        }
    }
}

module DFARunner {

    export class Application {
        private _tabs: Tabs;
        private _examples: Examples;
        private _error: ErrorMessage;
        private _json: JSONEntry;
        private _designer: Designer;
        private _tester: Tester;

        private _debugMode: boolean;

        constructor() {
            $(() => {
                this._tabs = new Tabs();
                this._examples = new Examples();
                this._error = new ErrorMessage();
                this._json = new JSONEntry();
                this._designer = new Designer();
                this._tester = new Tester();

                this._debugMode = false;

                services.dfa = new DFA();
                services.events.trigger('dfaChanged');

                $('#json').hide();
            });
        }

        get error() {
            return this._error;
        }

        get tabs() {
            return this._tabs;
        }

        get json() {
            return this._json;
        }

        get designer() {
            return this._designer;
        }

        get debugMode() {
            return this._debugMode;
        }

        set debugMode(debugMode: boolean) {
            this._debugMode = debugMode;
        }

        debug() {
            this._debugMode = true;
        }
    }
}

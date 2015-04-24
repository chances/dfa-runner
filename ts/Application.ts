module DFARunner {

    export class Application {
        private _tabs: Tabs;
        private _examples: Examples;
        private _error: ErrorMessage;
        private _json: JSONEntry;
        private _designer: Designer;
        private _tester: Tester;
        private _upload: Upload;

        private _debugMode: boolean;

        constructor() {
            $(() => {
                this._tabs = new Tabs();
                this._examples = new Examples();
                this._error = new ErrorMessage();
                this._json = new JSONEntry();
                this._designer = new Designer();
                this._tester = new Tester();
                this._upload = new Upload();

                this._debugMode = false;

                this._upload.upload((json: string) => {
                    this._json.valueFromUpload = json;
                });

                services.events.on('dfaChanged', () => { this.dfaChanged(); });

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

        private dfaChanged() {
            if (services.dfa !== null) {
                if (DFA.validate(services.dfa)) {
                    // DFA is valid
                    this._error.hide();
                } else {
                    // DFA is invalid
                    this._error.show();
                }
            } else {
                this._error.hide();
            }
        }
    }
}

module DFARunner {

    export class JSONEntry extends Component {
        private _error: Component;
        private _focused: boolean;
        private _modified: Component;
        private _codeMirror: CodeMirror.EditorFromTextArea = null;

        constructor() {
            super('#jsonEntry');

            this._error = new Component('#jsonError');
            this._focused = false;
            this._modified = new Component('#json > .toolbar > span.text-muted');

            this._error.hide();
            this._modified.hide();

            this._codeMirror = CodeMirror.fromTextArea(<HTMLTextAreaElement>this.e.get(0), {
                autofocus: true,
                lineNumbers: true,
                mode: 'application/json',
                viewportMargin: Infinity,
                smartIndent: true,
                matchBrackets: true,
                autoCloseBrackets: true
            });

            //this._codeMirror.setSize('100%', this.e.parent().height());

            this._codeMirror.refresh();

            this._codeMirror.on('keyup', () => {
                // Try to parse JSON
                try {
                    this._error.hide();
                    //app.error.hide();
                    JSON.parse(this._codeMirror.getDoc().getValue());
                } catch (e) {
                    this._events.trigger('error');
                    this._error.show();
                    //app.error.show();

                    if (app.debugMode) throw e;
                }
            });

            this._codeMirror.on('change', () => {
                if (this._codeMirror.hasFocus()) {
                    this._modified.show();
                }
            });

            this._codeMirror.on('blur', () => {
                this.update();
            });

            app.tabs.change((selectedTab: Component) => {
                if (selectedTab.id === 'json') {
                    this._codeMirror.refresh();
                    this._codeMirror.focus();
                }
            });

            services.events.on('dfaChanged', () => { this.dfaChanged(); });
        }

        get value() {
            return this._codeMirror.getDoc().getValue();
        }

        set value(value: string) {
            try {
                this._error.hide();
                this.updateDfa(value);
            } catch (e) {
                this._codeMirror.getDoc().setValue(value);
                this._events.trigger('error');
                this._error.show();
                //app.error.show();

                if (app.debugMode) {
                    console.log(services.dfa);
                    throw e;
                }
            }
        }

        set valueFromUpload(value: string) {
            try {
                this._error.hide();
                this.updateDfa(value, false);
            } catch (e) {
                this._codeMirror.getDoc().setValue(value);
                this._events.trigger('error');
                this._error.show();
                //app.error.show();

                if (app.debugMode) {
                    console.log(services.dfa);
                    throw e;
                }
            }
        }

        get valueAsJSON(): DFAFromJSON {
            try {
                return JSON.parse(this._codeMirror.getDoc().getValue());
            } catch (e) {
                return null;
            }
        }

        set valueFromJSON(dfa: DFAFromJSON) {
            try {
                //app.error.hide();
                this._error.hide();
                var value = JSON.stringify(dfa, null, '\t');
                this._codeMirror.getDoc().setValue(value);
            } catch (e) {
                this._codeMirror.getDoc().setValue('');
                // TODO: There was invalid DFA JSON object (how?), let the user know?

                if (app.debugMode) {
                    console.log(dfa);
                    throw e;
                }
            }
        }

        get editor(): CodeMirror.Editor {
            return this._codeMirror;
        }

        update() {
            try {
                this._error.hide();
                this._modified.hide();

                this.updateDfa(this._codeMirror.getDoc().getValue());
            } catch (e) {
                services.dfa = null;
                this._events.trigger('error');
                this._error.show();
                this._modified.show();
                //app.error.show();

                if (app.debugMode) throw e;
            }
        }

        private updateDfa(valueAsJSON: string, createTemplate: boolean = true) {
            var json = JSON.parse(valueAsJSON);
            var dfa = DFA.createMachine(<DFAFromJSON>json);
            var dfaIsDifferent: boolean = null;

            if (app.debugMode) {
                console.log('"old" DFA: ', services.dfa);
                console.log('"new" DFA: ', dfa);
            }
            if (services.dfa !== null) {
                dfaIsDifferent = !services.dfa.equals(dfa);
                if (!dfaIsDifferent) {
                    if (app.debugMode) console.log("DFA is the same, no changes");
                }
                if (app.debugMode && dfaIsDifferent) {
                    console.log('DFA is different, changes found');
                }
            } else {
                dfaIsDifferent = !(dfa === null);
                if (createTemplate) {
                    // Create an empty DFA template
                    dfa = new DFA();
                }
            }

            if (dfaIsDifferent) {
                services.dfa = dfa;
                services.events.trigger('dfaChanged');
            }
        }

        private dfaChanged() {
            if (services.dfa !== null) {
                this.valueFromJSON = services.dfa.toJSON();
            }
        }
    }
}

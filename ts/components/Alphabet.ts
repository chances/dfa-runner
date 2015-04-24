module DFARunner {

    export class Alphabet extends Component {
        private _list: ListComponent<string>;
        private _form: Component;
        private _textbox: TextboxComponent;
        private _acceptCheckbox: InputComponent<boolean>;
        private _add: ButtonComponent;
        private _remove: ButtonComponent;

        constructor() {
            super("#alphabet");

            this._list = new ListComponent<string>(this.e.find('select').get(0));
            this._form = new Component(this.e.find('form').get(0));
            this._textbox = new TextboxComponent(this.e.find('input[type=text]').get(0));
            this._add = new ButtonComponent(this.e.find('button.add').get(0));
            this._remove = new ButtonComponent(this.e.find('button.remove').get(0));

            this._list.marshaller = InputComponent.StringMarshaller;

            services.events.on("dfaChanged", () => { this.dfaChanged(); });

            this._list.change((str: string) => { this.selectedStringChanged(str); });
            this._form.e.submit((event: Event) => {
                event.preventDefault();

                this._add.e.click();
            });
            this._textbox.change((value: string) => { this.textChanged(value) });
            this._add.click(() => { this.addString(); });
            this._remove.click(() => { this.deleteString() });
        }

        private dfaChanged() {
            if (services.dfa !== null) {
                this._list.items.clear();

                // Repopulate alphabet list
                var strings = services.dfa.alphabet;
                for (var i = 0; i < strings.length; i++) {
                    this._list.items.add({
                        label: '"' + strings[i] + '"',
                        value: strings[i]
                    });
                }
            } else {
                this._list.items.clear();
            }

            this.textChanged(this._textbox.text);
            this._remove.disable();
        }

        private selectedStringChanged(str: String) {
            if (this._list.selectedIndex !== -1) {
                this._remove.enable();
            } else {
                this._remove.disable();
            }
        }

        private textChanged(value: string) {
            if (services.dfa && services.dfa.stringInAlphabet(value) === false) {
                this._add.enable();
            } else {
                this._add.disable();
            }
        }

        private addString() {
            if (services.dfa === null) {
                services.dfa = new DFA();
            }

            if (this._add.enabled && services.dfa.stringInAlphabet(this._textbox.text) === false) {
                services.dfa.alphabet.push(this._textbox.text);
                this._textbox.text = "";
                services.events.trigger("dfaChanged");
            }
        }

        private deleteString() {
            services.dfa.alphabet.splice(this._list.selectedIndex, 1);
            this.textChanged(this._textbox.text);
            this._remove.disable();
            services.events.trigger("dfaChanged");
        }
    }
}

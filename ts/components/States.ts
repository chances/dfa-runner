module DFARunner {

    export class States extends Component {
        private _list: ListComponent<State>;
        private _form: Component;
        private _textbox: TextboxComponent;
        private _acceptCheckbox: CheckboxComponent;
        private _add: ButtonComponent;
        private _remove: ButtonComponent;

        constructor() {
            super("#states");

            this._list = new ListComponent<State>(this.e.find('select').get(0));
            this._form = new Component(this.e.find('form').get(0));
            this._textbox = new TextboxComponent(this.e.find('input[type=text]').get(0));
            this._acceptCheckbox = new CheckboxComponent(this.e.find('input[type=checkbox]').get(0));
            this._add = new ButtonComponent(this.e.find('button.add').get(0));
            this._remove = new ButtonComponent(this.e.find('button.remove').get(0));

            this._list.marshaller = (index: string): State => {
                return this._list.items.get(parseInt(index, 10));
            };

            services.events.on("dfaChanged", () => { this.dfaChanged(); });

            this._list.change((state: State) => { this.selectedStateChanged(state); });
            this._form.e.submit((event: Event) => {
                event.preventDefault();

                this._add.e.click();
            });
            this._textbox.change((value: string) => { this.textChanged(value) });
            this._add.click(() => { this.addState(); });
            this._remove.click(() => { this.deleteState() });
            this._acceptCheckbox.change((checked: boolean) => { this.acceptToggled(checked); });
        }

        get selectedState() {
            return this._list.selectedItem;
        }

        private dfaChanged() {
            var oldSelectedStateId: string = null;
            if (this._list.selectedItem !== null) {
                oldSelectedStateId = this._list.selectedItem.id;
            }

            if (services.dfa !== null) {

                this._list.items.clear();

                // Repopulate states list
                var states = services.dfa.states;
                for (var i = 0; i < states.length; i++) {
                    this._list.items.add({
                        label: states[i].id,
                        value: states[i]
                    });
                }
            } else {
                this._list.items.clear();
            }

            // Preserve previous selection
            var state: State = null;
            if (services.dfa !== null) {
                state = services.dfa.getStateById(oldSelectedStateId);
                if (state !== null) {
                    this._list.selectedItem = state;
                }
            }
            //this.selectedStateChanged(state);

            //this.textChanged(this._textbox.text);
            //this._acceptCheckbox.checked = false;
            //this._acceptCheckbox.disable();
            //this._remove.disable();
        }

        private selectedStateChanged(state: State) {
            this.recreateAcceptCheckbox();

            if (state !== null) {
                this._acceptCheckbox.enable();
                this._remove.enable();
            } else {
                this._acceptCheckbox.disable();
                this._remove.disable();
            }

            this._acceptCheckbox.checked = (!!services.dfa.stateIsAcceptState(state));

            this._events.trigger('selectionChanged', this.selectedState);
        }

        private textChanged(value: string) {
            if (value !== "" && (services.dfa ? services.dfa.getStateById(value) === null : true)) {
                this._add.enable();
            } else {
                this._add.disable();
            }
        }

        private addState() {
            var isNewDFA = false,
                state = new State(this._textbox.text);

            if (services.dfa === null) {
                services.dfa = new DFA();
                isNewDFA = true;
            }

            if (this._add.enabled && services.dfa.getStateById(state.id) === null) {
                services.dfa.states.push(state);
                if (isNewDFA) {
                    services.dfa.startState = state;
                }
                this._textbox.text = "";
                services.events.trigger("dfaChanged");
            }
        }

        private deleteState() {
            services.dfa.states.splice(this._list.selectedIndex, 1);
            this.textChanged(this._textbox.text);
            this._acceptCheckbox.checked = false;
            this._acceptCheckbox.disable();
            this._remove.disable();
            if (services.dfa.states.length === 0) {
                services.dfa = null;
            }
            services.events.trigger("dfaChanged");
        }

        // Delete and recreate the accepted checkbox because of weird fucking bug
        private recreateAcceptCheckbox() {
            var newCheckbox = $('<label class="checkbox-inline"><input type="checkbox" disabled> Accept state</label>');
            this._acceptCheckbox.e.parent().remove();
            this.e.find('.toolbar').append(newCheckbox);
            this._acceptCheckbox = new CheckboxComponent(this.e.find('input[type=checkbox]').get(0));
            this._acceptCheckbox.change((checked: boolean) => { this.acceptToggled(checked); });
        }

        private acceptToggled(acceptChecked: boolean) {
            var state: State = this.selectedState,
                foundIndex = -1;
            if (state !== null) {
                if (acceptChecked && services.dfa.stateIsAcceptState(state) === false) {
                    services.dfa.acceptStates.push(state);
                    services.events.trigger("dfaChanged");
                } else {
                    for (var i = 0; i < services.dfa.acceptStates.length; i++) {
                        if (services.dfa.acceptStates[i].id === state.id) {
                            foundIndex = i;
                            break;
                        }
                    }

                    if (foundIndex !== -1) {
                        services.dfa.acceptStates.splice(foundIndex, 1);
                        services.events.trigger("dfaChanged");
                    }
                }
            }
        }
    }
}

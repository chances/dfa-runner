module DFARunner {

    export class Transitions extends InputComponent<Transition[]> {
        private _table: Component;
        private _thead: Component;
        private _tbody: Component;
        private _transitions: Transition[];

        constructor() {
            super('#transitions');

            this._table = new Component(this.e.find('table').get(0));
            this._thead = new Component(this._table.e.find('thead').get(0));
            this._tbody = new Component(this._table.e.find('tbody').get(0));
            this._transitions = [];

            services.events.on('dfaChanged', () => { this.dfaChanged(); });
        }

        change(callback: BridgeCallback<Transition[]>): Transitions {
            this.addEventListener('transitionsChanged', (transitions: Transition[]) => {
                callback(transitions);
            });

            return this;
        }

        private dfaChanged() {
            if (services.dfa !== null) {
                //this.valueFromJSON = services.dfa.toJSON();

                // Update transitions table
                this._thead.e.empty();
                this._tbody.e.empty();

                // Alphabet headers
                var $tr = $('<tr>');
                $tr.append($('<th>'));
                for (var i = 0; i < services.dfa.alphabet.length; i++) {
                    $tr.append($('<th>"' + services.dfa.alphabet[i] + '"</th>'));
                }
                this._thead.e.append($tr);

                for (var i = 0; i < services.dfa.states.length; i++) {
                    $tr = $('<tr>');
                    // State header
                    $tr.append($('<th>').text(services.dfa.states[i].id));
                    for (var j = 0; j < services.dfa.alphabet.length; j++) {
                        // Transition for states[i] state on alphabet[j] input
                        var $td = $('<td>');
                        var $stateSelect = $('<select>');
                        var stateSelect: ListComponent<State> = new ListComponent<State>($stateSelect.get(0));

                        stateSelect.data('state', services.dfa.states[i].id);
                        stateSelect.data('input', services.dfa.alphabet[j]);

                        // Get the current transition destination, if any
                        var destination: State = services.dfa.states[i].transition(services.dfa.alphabet[j]);
                        // TODO: Generalize this for all finite automata, not just DFAs
                        if (destination === null) {
                            $stateSelect.append(ListComponent.NullListItem);
                        }

                        // Append all states to list selection component
                        for (var k = 0; k < services.dfa.states.length; k++) {
                            stateSelect.items.add({
                                label: services.dfa.states[k].id,
                                value: services.dfa.states[k]
                            });
                        }

                        stateSelect.selectedItem = destination;

                        // Handle state list selection change, reassigning the transition's destination
                        stateSelect.change(function (selectedState: State) {
                            var stateSelect: ListComponent<State> = <ListComponent<State>>this,
                                state = services.dfa.getStateById(stateSelect.data('state')),
                                input = stateSelect.data('input'),
                                transition = state.getTransitionByInput(input);
                            if (transition !== null) {
                                transition.destination = selectedState;
                            } else {
                                state.transitions.push(new Transition(input, selectedState));
                            }

                            services.events.trigger('dfaChanged');
                        });

                        $td.append($stateSelect);
                        $tr.append($td);
                    }
                    this._tbody.e.append($tr);
                }
            }
        }
    }
}

module DFARunner {

    export class Examples extends ListComponent<DFAFromJSON> {

        constructor() {
            super('#examples');

            this.marshaller = (index: string): DFAFromJSON => {
                return this.items.get(parseInt(index, 10));
            };

            services.examples.forEach((example: DFAFromJSON) => {
                var item: ListItem<DFAFromJSON> = {
                    label: example.name,
                    value: null
                };
                delete example.name;
                item.value = example;
                this.items.add(item);
            });

            services.events.on("dfaChanged", () => { this.dfaChanged(); });

            this.change((example: DFAFromJSON) => {
                if (example) {
                    app.json.valueFromJSON = example;
                    services.dfa = DFA.createMachine(example);
                    services.events.trigger("dfaChanged");
                }
            });
        }

        private dfaChanged() {

            if (services.dfa === null) {
                //this.e.val('-1');
                // TODO: Should I do anything special here?
            } else {
                //var index:number = parseInt(this.e.val(), 10);
                //var selectedExample = this.selectedItem;
                var equal = services.dfa.equals(this.selectedItem);
                if (!equal) {
                    this.e.val('-1');
                }
            }
        }
    }
}

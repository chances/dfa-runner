module DFARunner {

    export class Tester extends TextboxComponent {
        private _icon: Component;

        constructor() {
            super('#string');

            this._icon = new Component('#testResultIcon');

            services.events.on('error', () => { this.testString(); });
            services.events.on('dfaChanged', () => { this.testString(); });

            this.change(() => { this.testString(); });
        }

        private testString() {
            if (services.dfa !== null && services.dfa.testString(this.text)) {
                this.e.parent().removeClass('has-error');
                this.e.parent().addClass('has-success');

                this._icon.e.removeClass('glyphicon-remove');
                this._icon.e.addClass('glyphicon-ok');
            } else {
                this.e.parent().addClass('has-error');
                this.e.parent().removeClass('has-success');

                this._icon.e.addClass('glyphicon-remove');
                this._icon.e.removeClass('glyphicon-ok');
            }
        }
    }
}

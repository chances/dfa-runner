module DFARunner {

    export class Component {
        protected _element: ZeptoFxCollection;
        protected _events: Bridge;

        constructor (elementSelector: string);
        constructor (element: HTMLElement);
        constructor (element: any) {
            this._element = <ZeptoFxCollection>$(element);
            this._events = new Bridge();

            this.e.keyup((data: KeyboardEvent) => {
                this._events.trigger('keyup', data);
            });
        }

        get e(): ZeptoFxCollection {
            return this._element;
        }

        get id(): string {
            return this._element.attr('id');
        }

        addEventListener(event: string, callback: BridgeCallback<any>): number {
            return this._events.on(event, callback);
        }

        on(event: string, callback: BridgeCallback<any>): Component {
            this._events.on(event, callback);

            return this;
        }

        removeEventListener(id: number): void;
        removeEventListener(callback: BridgeCallback<any>): void;
        removeEventListener(idOrCallback: any): void {
            this._events.off(idOrCallback);
        }

        off(id: number): Component;
        off(callback: BridgeCallback<any>): Component;
        off(idOrCallback: any): Component {
            this._events.off(idOrCallback);

            return this;
        }

        data(name: string): string;
        data(name: string, value: string): Component;
        data(name: string, value?: string): any {
            if (value === undefined) {
                var str:string = this.e.attr('data-' + name);
                if (str !== '') return str;
            } else {
                this.e.attr('data-' + name, value);
            }

            return Component;
        }

        show(fade: boolean = false, duration: number = $.fx.speeds._default) {
            if (fade) {
                this.e.fadeIn(duration);
            } else {
                this.e.show();
            }
        }

        hide(fade: boolean = false, duration: number = $.fx.speeds._default) {
            if (fade) {
                this.e.fadeOut(duration);
            } else {
                this.e.hide();
            }
        }

        keyup(callback: BridgeCallback<KeyboardEvent>): Component {
            this.on('keyup', callback);

            return this;
        }
    }
}

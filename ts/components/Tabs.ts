module DFARunner {

    export class Tabs extends InputComponent<Component> {
        private _selectedTab: Component;

        constructor() {
            super('#tabs');

            this.e.children().each((index, item): boolean => {
                if ($(item).css('display') !== 'hidden') {
                    this._selectedTab = new Component(<HTMLElement>item);

                    this._events.trigger('selectedTabChanged', this._selectedTab);
                }

                return true;
            });

            $('nav > .nav-tabs > li > a').click((event) => {
                var anchor = $(event.target),
                    href = anchor.attr('href');

                $('nav > .nav-tabs > li').removeClass('active');
                $(event.target).parent().addClass('active');

                this.e.children().each((index, item): boolean => {
                    var dataHref = $(item).attr('data-href').split('|');

                    for (var i = 0; i < dataHref.length; i++) {
                        if (dataHref[i] === href) {
                            this.e.children().hide();
                            $(item).show();
                            this._selectedTab = new Component(<HTMLElement>item);

                            this._events.trigger('selectedTabChanged', this._selectedTab);

                            return false;
                        }
                    }

                    return true;
                });
            });
        }

        get selectedTab() {
            return this._selectedTab;
        }

        change(callback: BridgeCallback<Component>): Tabs {
            this.addEventListener('selectedTabChanged', (tab: Component) => {
                callback.call(this, tab);
            });

            return this;
        }
    }
}

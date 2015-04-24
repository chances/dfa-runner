var DFARunner;
(function (DFARunner) {
    var Helpers;
    (function (Helpers) {
        function delay(time) {
            var promise = pinkySwear();
            window.setTimeout(function () {
                promise(true);
            }, time);
            return promise;
        }
        Helpers.delay = delay;
        //Interval utility function
        function interval(func, time) {
            var interval = window.setInterval(func, time);
            return {
                intervalId: interval,
                clear: function () {
                    window.clearInterval(interval);
                }
            };
        }
        Helpers.interval = interval;
        function randomNumber(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        Helpers.randomNumber = randomNumber;
        function objectIsA(object, type) {
            if (type.hasOwnProperty("prototype")) {
                return object.constructor.name === type.prototype.constructor.name;
            }
            else {
                return false;
            }
        }
        Helpers.objectIsA = objectIsA;
    })(Helpers = DFARunner.Helpers || (DFARunner.Helpers = {}));
})(DFARunner || (DFARunner = {}));

var DFARunner;
(function (DFARunner) {
    var Bridge = (function () {
        function Bridge() {
            this.handlers = [];
        }
        /**
         * Add and subscribe to an event
         * @param event Type of bridge event to handle
         * @param callback Handling callback delegate
         * @return Unique id representing this event
         */
        Bridge.prototype.on = function (event, callback) {
            Math.random();
            var handler = {
                event: event,
                id: DFARunner.Helpers.randomNumber(0, Date.now()),
                callback: callback
            };
            this.handlers.push(handler);
            return handler.id;
        };
        Bridge.prototype.off = function (idOrCallback) {
            var index = -1;
            for (var i = 0; i < this.handlers.length; i++) {
                if (typeof idOrCallback === 'number') {
                    if (this.handlers[i].id === idOrCallback) {
                        index = i;
                        break;
                    }
                }
                else {
                    if (this.handlers[i].callback === idOrCallback) {
                        index = i;
                        break;
                    }
                }
            }
            if (index !== -1) {
                this.handlers.splice(index, 1);
            }
            return this;
        };
        /**
         * Dispatch an event
         * @param event Type of bridge event to dispatch
         * @param data Data to pass along to event handlers
         * @param context=window Context in which to execute handling callback delegates
         */
        Bridge.prototype.trigger = function (event, data, context) {
            if (data === void 0) { data = null; }
            if (context === void 0) { context = window; }
            this.handlers.forEach(function (handler) {
                if (handler.event === event) {
                    if (data === null) {
                        handler.callback.call(context);
                    }
                    else {
                        handler.callback.call(context, data);
                    }
                }
            });
            return this;
        };
        return Bridge;
    })();
    DFARunner.Bridge = Bridge;
})(DFARunner || (DFARunner = {}));

var DFARunner;
(function (DFARunner) {
    var Component = (function () {
        function Component(element) {
            var _this = this;
            this._element = $(element);
            this._events = new DFARunner.Bridge();
            this.e.keyup(function (data) {
                _this._events.trigger('keyup', data);
            });
        }
        Object.defineProperty(Component.prototype, "e", {
            get: function () {
                return this._element;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Component.prototype, "id", {
            get: function () {
                return this._element.attr('id');
            },
            enumerable: true,
            configurable: true
        });
        Component.prototype.addEventListener = function (event, callback) {
            return this._events.on(event, callback);
        };
        Component.prototype.on = function (event, callback) {
            this._events.on(event, callback);
            return this;
        };
        Component.prototype.removeEventListener = function (idOrCallback) {
            this._events.off(idOrCallback);
        };
        Component.prototype.off = function (idOrCallback) {
            this._events.off(idOrCallback);
            return this;
        };
        Component.prototype.data = function (name, value) {
            if (value === undefined) {
                var str = this.e.attr('data-' + name);
                if (str !== '')
                    return str;
            }
            else {
                this.e.attr('data-' + name, value);
            }
            return Component;
        };
        Component.prototype.show = function (fade, duration) {
            if (fade === void 0) { fade = false; }
            if (duration === void 0) { duration = $.fx.speeds._default; }
            if (fade) {
                this.e.fadeIn(duration);
            }
            else {
                this.e.show();
            }
        };
        Component.prototype.hide = function (fade, duration) {
            if (fade === void 0) { fade = false; }
            if (duration === void 0) { duration = $.fx.speeds._default; }
            if (fade) {
                this.e.fadeOut(duration);
            }
            else {
                this.e.hide();
            }
        };
        Component.prototype.keyup = function (callback) {
            this.on('keyup', callback);
            return this;
        };
        return Component;
    })();
    DFARunner.Component = Component;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var EnableableComponent = (function (_super) {
        __extends(EnableableComponent, _super);
        function EnableableComponent(element) {
            _super.call(this, element);
            this._enabled = this.e.hasAttr('disabled');
        }
        Object.defineProperty(EnableableComponent.prototype, "enabled", {
            get: function () {
                return this._enabled;
            },
            set: function (enabled) {
                if (enabled) {
                    this.enable();
                }
                else {
                    this.disable();
                }
            },
            enumerable: true,
            configurable: true
        });
        EnableableComponent.prototype.enable = function () {
            this.e.removeAttr('disabled');
            this._enabled = true;
            return this;
        };
        EnableableComponent.prototype.disable = function () {
            this.e.attr('disabled', '');
            this._enabled = false;
            return this;
        };
        return EnableableComponent;
    })(DFARunner.Component);
    DFARunner.EnableableComponent = EnableableComponent;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var ButtonComponent = (function (_super) {
        __extends(ButtonComponent, _super);
        function ButtonComponent(element) {
            var _this = this;
            _super.call(this, element);
            this.e.change(function () {
                _this._events.trigger('change', _this.e.val());
            });
        }
        ButtonComponent.prototype.click = function (callback) {
            this.e.click(function () {
                callback();
            });
        };
        return ButtonComponent;
    })(DFARunner.EnableableComponent);
    DFARunner.ButtonComponent = ButtonComponent;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var InputComponent = (function (_super) {
        __extends(InputComponent, _super);
        function InputComponent(element) {
            var _this = this;
            _super.call(this, element);
            this._marshall = null;
            this.e.change(function () {
                _this._events.trigger('change', _this.e.val(), _this);
            });
        }
        Object.defineProperty(InputComponent, "NumberMarshaller", {
            get: function () {
                return function (value) {
                    return parseInt(value, 10);
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputComponent, "BooleanMarshaller", {
            get: function () {
                return function (value) {
                    return value !== "" && value !== "false" && value !== "n" && value !== "no";
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputComponent, "StringMarshaller", {
            get: function () {
                return function (value) {
                    return value.toString();
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(InputComponent.prototype, "marshaller", {
            set: function (marshaller) {
                this._marshall = marshaller;
            },
            enumerable: true,
            configurable: true
        });
        InputComponent.prototype.change = function (callback) {
            var _this = this;
            this.addEventListener('change', function (value) {
                if (_this._marshall !== null) {
                    value = _this._marshall(value);
                }
                callback.call(_this, value);
            });
            return this;
        };
        return InputComponent;
    })(DFARunner.EnableableComponent);
    DFARunner.InputComponent = InputComponent;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var TextboxComponent = (function (_super) {
        __extends(TextboxComponent, _super);
        function TextboxComponent(element) {
            var _this = this;
            _super.call(this, element);
            this._marshall = DFARunner.InputComponent.StringMarshaller;
            this._text = "";
            _super.prototype.change.call(this, function (value) {
                _this.checkTextChanged(value);
            });
            this.keyup(function () {
                _this.checkTextChanged(_this.e.val());
            });
        }
        Object.defineProperty(TextboxComponent.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (value) {
                this.e.val(value);
            },
            enumerable: true,
            configurable: true
        });
        TextboxComponent.prototype.change = function (callback) {
            this.addEventListener('textChanged', function (value) {
                callback(value);
            });
            return this;
        };
        TextboxComponent.prototype.checkTextChanged = function (value) {
            if (this._text !== value) {
                this._text = value;
                this._events.trigger('textChanged', value);
            }
        };
        return TextboxComponent;
    })(DFARunner.InputComponent);
    DFARunner.TextboxComponent = TextboxComponent;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var CheckboxComponent = (function (_super) {
        __extends(CheckboxComponent, _super);
        function CheckboxComponent(element) {
            var _this = this;
            _super.call(this, element);
            this.marshaller = function () {
                return _this.checked;
            };
            this._step = 0;
            this.e.change(function () {
                _this._step = _this._step === 0 ? 1 : 0;
            });
            if (this.e.parent().is('label')) {
                this.e.parent().click(function () {
                    _this.clicked();
                });
            }
            else {
                this.e.click(function () {
                    _this.clicked();
                });
            }
        }
        Object.defineProperty(CheckboxComponent.prototype, "checked", {
            get: function () {
                return this.e.hasAttr('checked') && this.e.is(':checked');
            },
            set: function (checked) {
                if (checked === true) {
                    this.e.attr('checked', '');
                }
                else {
                    this.e.removeAttr('checked');
                }
            },
            enumerable: true,
            configurable: true
        });
        CheckboxComponent.prototype.change = function (callback) {
            this.addEventListener('checkedChanged', function (value) {
                callback(value);
            });
            return this;
        };
        CheckboxComponent.prototype.clicked = function () {
            this._step = this._step === 1 ? 2 : 0;
            this.checkedChanged();
        };
        CheckboxComponent.prototype.checkedChanged = function () {
            this._step = this._step === 2 ? 3 : 0;
            if (this._step === 3) {
                this._events.trigger('checkedChanged', this.checked);
                this._step = 0;
            }
        };
        return CheckboxComponent;
    })(DFARunner.InputComponent);
    DFARunner.CheckboxComponent = CheckboxComponent;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var ListComponent = (function (_super) {
        __extends(ListComponent, _super);
        function ListComponent(element) {
            var _this = this;
            _super.call(this, element);
            this._items = [];
            this._selectedIndex = -1;
            this._itemWrapper = {
                add: function (item) {
                    _this._items.push(item);
                    var element = $('<option value="' + (_this._items.length - 1) + '">' + item.label + '</option>');
                    _this.e.append(element);
                },
                clear: function () {
                    _this._items = [];
                    _this._selectedIndex = -1;
                    _this.e.find('option').remove();
                    //this.e.empty();
                },
                get: function (index) {
                    if (index < 0 || index >= _this._items.length) {
                        throw new RangeError("Index out of bounds");
                    }
                    return _this._items[index].value;
                },
                getItem: function (index) {
                    if (index < 0 || index >= _this._items.length) {
                        throw new RangeError("Index out of bounds");
                    }
                    return _this._items[index];
                },
                indexOf: function (item) {
                    var index = -1;
                    for (var i = 0; i < _this._items.length; i++) {
                        if (_this._items[i].value === item) {
                            index = i;
                            break;
                        }
                    }
                    return index;
                }
            };
            this.e.change(function () {
                _this._selectedIndex = parseInt(_this.e.val(), 10);
                _this._events.trigger('selectionChanged', _this.selectedItem, _this);
            });
        }
        Object.defineProperty(ListComponent, "NullListItem", {
            get: function () {
                return $('<option value="-1"></option>');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListComponent.prototype, "items", {
            get: function () {
                return this._itemWrapper;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListComponent.prototype, "selectedIndex", {
            get: function () {
                return this._selectedIndex;
            },
            set: function (index) {
                if (index < 0 || index >= this._items.length) {
                    throw new RangeError("Index out of bounds");
                }
                this._selectedIndex = index;
                this.e.val(index.toString());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ListComponent.prototype, "selectedItem", {
            get: function () {
                if (this._selectedIndex === -1) {
                    return null;
                }
                return this._items[this._selectedIndex].value;
            },
            set: function (item) {
                if (item !== null) {
                    var index = this.items.indexOf(item);
                    if (index !== -1) {
                        this.selectedIndex = index;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        ListComponent.prototype.change = function (callback) {
            var _this = this;
            this.addEventListener('selectionChanged', function (item) {
                callback.call(_this, item);
            });
            return this;
        };
        return ListComponent;
    })(DFARunner.InputComponent);
    DFARunner.ListComponent = ListComponent;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var ErrorMessage = (function (_super) {
        __extends(ErrorMessage, _super);
        function ErrorMessage() {
            _super.call(this, "#error");
            this.e.hide();
        }
        return ErrorMessage;
    })(DFARunner.Component);
    DFARunner.ErrorMessage = ErrorMessage;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var Examples = (function (_super) {
        __extends(Examples, _super);
        function Examples() {
            var _this = this;
            _super.call(this, '#examples');
            this.marshaller = function (index) {
                return _this.items.get(parseInt(index, 10));
            };
            services.examples.forEach(function (example) {
                var item = {
                    label: example.name,
                    value: null
                };
                delete example.name;
                item.value = example;
                _this.items.add(item);
            });
            services.events.on("dfaChanged", function () {
                _this.dfaChanged();
            });
            this.change(function (example) {
                if (example) {
                    app.json.valueFromJSON = example;
                    services.dfa = DFARunner.DFA.createMachine(example);
                    services.events.trigger("dfaChanged");
                }
            });
        }
        Examples.prototype.dfaChanged = function () {
            if (services.dfa === null) {
            }
            else {
                //var index:number = parseInt(this.e.val(), 10);
                //var selectedExample = this.selectedItem;
                var equal = services.dfa.equals(this.selectedItem);
                if (!equal) {
                    this.e.val('-1');
                }
            }
        };
        return Examples;
    })(DFARunner.ListComponent);
    DFARunner.Examples = Examples;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var Tabs = (function (_super) {
        __extends(Tabs, _super);
        function Tabs() {
            var _this = this;
            _super.call(this, '#tabs');
            this.e.children().each(function (index, item) {
                if ($(item).css('display') !== 'hidden') {
                    _this._selectedTab = new DFARunner.Component(item);
                    _this._events.trigger('selectedTabChanged', _this._selectedTab);
                }
                return true;
            });
            $('nav > .nav-tabs > li > a').click(function (event) {
                var anchor = $(event.target), href = anchor.attr('href');
                $('nav > .nav-tabs > li').removeClass('active');
                $(event.target).parent().addClass('active');
                _this.e.children().each(function (index, item) {
                    var dataHref = $(item).attr('data-href').split('|');
                    for (var i = 0; i < dataHref.length; i++) {
                        if (dataHref[i] === href) {
                            _this.e.children().hide();
                            $(item).show();
                            _this._selectedTab = new DFARunner.Component(item);
                            _this._events.trigger('selectedTabChanged', _this._selectedTab);
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
        Object.defineProperty(Tabs.prototype, "selectedTab", {
            get: function () {
                return this._selectedTab;
            },
            enumerable: true,
            configurable: true
        });
        Tabs.prototype.change = function (callback) {
            var _this = this;
            this.addEventListener('selectedTabChanged', function (tab) {
                callback.call(_this, tab);
            });
            return this;
        };
        return Tabs;
    })(DFARunner.InputComponent);
    DFARunner.Tabs = Tabs;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var States = (function (_super) {
        __extends(States, _super);
        function States() {
            var _this = this;
            _super.call(this, "#states");
            this._list = new DFARunner.ListComponent(this.e.find('select').get(0));
            this._form = new DFARunner.Component(this.e.find('form').get(0));
            this._textbox = new DFARunner.TextboxComponent(this.e.find('input[type=text]').get(0));
            this._acceptCheckbox = new DFARunner.CheckboxComponent(this.e.find('input[type=checkbox]').get(0));
            this._add = new DFARunner.ButtonComponent(this.e.find('button.add').get(0));
            this._remove = new DFARunner.ButtonComponent(this.e.find('button.remove').get(0));
            this._list.marshaller = function (index) {
                return _this._list.items.get(parseInt(index, 10));
            };
            services.events.on("dfaChanged", function () {
                _this.dfaChanged();
            });
            this._list.change(function (state) {
                _this.selectedStateChanged(state);
            });
            this._form.e.submit(function (event) {
                event.preventDefault();
                _this._add.e.click();
            });
            this._textbox.change(function (value) {
                _this.textChanged(value);
            });
            this._add.click(function () {
                _this.addState();
            });
            this._remove.click(function () {
                _this.deleteState();
            });
            this._acceptCheckbox.change(function (checked) {
                _this.acceptToggled(checked);
            });
        }
        Object.defineProperty(States.prototype, "selectedState", {
            get: function () {
                return this._list.selectedItem;
            },
            enumerable: true,
            configurable: true
        });
        States.prototype.dfaChanged = function () {
            var oldSelectedStateId = null;
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
            }
            else {
                this._list.items.clear();
            }
            // Preserve previous selection
            var state = null;
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
        };
        States.prototype.selectedStateChanged = function (state) {
            this.recreateAcceptCheckbox();
            if (state !== null) {
                this._acceptCheckbox.enable();
                this._remove.enable();
            }
            else {
                this._acceptCheckbox.disable();
                this._remove.disable();
            }
            this._acceptCheckbox.checked = (!!services.dfa.stateIsAcceptState(state));
            this._events.trigger('selectionChanged', this.selectedState);
        };
        States.prototype.textChanged = function (value) {
            if (value !== "" && (services.dfa ? services.dfa.getStateById(value) === null : true)) {
                this._add.enable();
            }
            else {
                this._add.disable();
            }
        };
        States.prototype.addState = function () {
            var isNewDFA = false, state = new DFARunner.State(this._textbox.text);
            if (services.dfa === null) {
                services.dfa = new DFARunner.DFA();
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
        };
        States.prototype.deleteState = function () {
            services.dfa.states.splice(this._list.selectedIndex, 1);
            this.textChanged(this._textbox.text);
            this._acceptCheckbox.checked = false;
            this._acceptCheckbox.disable();
            this._remove.disable();
            if (services.dfa.states.length === 0) {
                services.dfa = null;
            }
            services.events.trigger("dfaChanged");
        };
        // Delete and recreate the accepted checkbox because of weird fucking bug
        States.prototype.recreateAcceptCheckbox = function () {
            var _this = this;
            var newCheckbox = $('<label class="checkbox-inline"><input type="checkbox" disabled> Accept state</label>');
            this._acceptCheckbox.e.parent().remove();
            this.e.find('.toolbar').append(newCheckbox);
            this._acceptCheckbox = new DFARunner.CheckboxComponent(this.e.find('input[type=checkbox]').get(0));
            this._acceptCheckbox.change(function (checked) {
                _this.acceptToggled(checked);
            });
        };
        States.prototype.acceptToggled = function (acceptChecked) {
            var state = this.selectedState, foundIndex = -1;
            if (state !== null) {
                if (acceptChecked && services.dfa.stateIsAcceptState(state) === false) {
                    services.dfa.acceptStates.push(state);
                    services.events.trigger("dfaChanged");
                }
                else {
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
        };
        return States;
    })(DFARunner.Component);
    DFARunner.States = States;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var Alphabet = (function (_super) {
        __extends(Alphabet, _super);
        function Alphabet() {
            var _this = this;
            _super.call(this, "#alphabet");
            this._list = new DFARunner.ListComponent(this.e.find('select').get(0));
            this._form = new DFARunner.Component(this.e.find('form').get(0));
            this._textbox = new DFARunner.TextboxComponent(this.e.find('input[type=text]').get(0));
            this._add = new DFARunner.ButtonComponent(this.e.find('button.add').get(0));
            this._remove = new DFARunner.ButtonComponent(this.e.find('button.remove').get(0));
            this._list.marshaller = DFARunner.InputComponent.StringMarshaller;
            services.events.on("dfaChanged", function () {
                _this.dfaChanged();
            });
            this._list.change(function (str) {
                _this.selectedStringChanged(str);
            });
            this._form.e.submit(function (event) {
                event.preventDefault();
                _this._add.e.click();
            });
            this._textbox.change(function (value) {
                _this.textChanged(value);
            });
            this._add.click(function () {
                _this.addString();
            });
            this._remove.click(function () {
                _this.deleteString();
            });
        }
        Alphabet.prototype.dfaChanged = function () {
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
            }
            else {
                this._list.items.clear();
            }
            this.textChanged(this._textbox.text);
            this._remove.disable();
        };
        Alphabet.prototype.selectedStringChanged = function (str) {
            if (this._list.selectedIndex !== -1) {
                this._remove.enable();
            }
            else {
                this._remove.disable();
            }
        };
        Alphabet.prototype.textChanged = function (value) {
            if (services.dfa && services.dfa.stringInAlphabet(value) === false) {
                this._add.enable();
            }
            else {
                this._add.disable();
            }
        };
        Alphabet.prototype.addString = function () {
            if (services.dfa === null) {
                services.dfa = new DFARunner.DFA();
            }
            if (this._add.enabled && services.dfa.stringInAlphabet(this._textbox.text) === false) {
                services.dfa.alphabet.push(this._textbox.text);
                this._textbox.text = "";
                services.events.trigger("dfaChanged");
            }
        };
        Alphabet.prototype.deleteString = function () {
            services.dfa.alphabet.splice(this._list.selectedIndex, 1);
            this.textChanged(this._textbox.text);
            this._remove.disable();
            services.events.trigger("dfaChanged");
        };
        return Alphabet;
    })(DFARunner.Component);
    DFARunner.Alphabet = Alphabet;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var Transitions = (function (_super) {
        __extends(Transitions, _super);
        function Transitions() {
            var _this = this;
            _super.call(this, '#transitions');
            this._table = new DFARunner.Component(this.e.find('table').get(0));
            this._thead = new DFARunner.Component(this._table.e.find('thead').get(0));
            this._tbody = new DFARunner.Component(this._table.e.find('tbody').get(0));
            this._transitions = [];
            services.events.on('dfaChanged', function () {
                _this.dfaChanged();
            });
        }
        Transitions.prototype.change = function (callback) {
            this.addEventListener('transitionsChanged', function (transitions) {
                callback(transitions);
            });
            return this;
        };
        Transitions.prototype.dfaChanged = function () {
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
                        var stateSelect = new DFARunner.ListComponent($stateSelect.get(0));
                        stateSelect.data('state', services.dfa.states[i].id);
                        stateSelect.data('input', services.dfa.alphabet[j]);
                        // Get the current transition destination, if any
                        var destination = services.dfa.states[i].transition(services.dfa.alphabet[j]);
                        // TODO: Generalize this for all finite automata, not just DFAs
                        if (destination === null) {
                            $stateSelect.append(DFARunner.ListComponent.NullListItem);
                        }
                        for (var k = 0; k < services.dfa.states.length; k++) {
                            stateSelect.items.add({
                                label: services.dfa.states[k].id,
                                value: services.dfa.states[k]
                            });
                        }
                        stateSelect.selectedItem = destination;
                        // Handle state list selection change, reassigning the transition's destination
                        stateSelect.change(function (selectedState) {
                            var stateSelect = this, state = services.dfa.getStateById(stateSelect.data('state')), input = stateSelect.data('input'), transition = state.getTransitionByInput(input);
                            if (transition !== null) {
                                transition.destination = selectedState;
                            }
                            else {
                                state.transitions.push(new DFARunner.Transition(input, selectedState));
                            }
                            services.events.trigger('dfaChanged');
                        });
                        $td.append($stateSelect);
                        $tr.append($td);
                    }
                    this._tbody.e.append($tr);
                }
            }
        };
        return Transitions;
    })(DFARunner.InputComponent);
    DFARunner.Transitions = Transitions;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var Designer = (function (_super) {
        __extends(Designer, _super);
        function Designer() {
            _super.call(this, "#designer");
            this._states = new DFARunner.States();
            this._alphabet = new DFARunner.Alphabet();
            this._transitions = new DFARunner.Transitions();
        }
        return Designer;
    })(DFARunner.Component);
    DFARunner.Designer = Designer;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var JSONEntry = (function (_super) {
        __extends(JSONEntry, _super);
        function JSONEntry() {
            var _this = this;
            _super.call(this, '#jsonEntry');
            this._codeMirror = null;
            this._error = new DFARunner.Component('#jsonError');
            this._focused = false;
            this._modified = new DFARunner.Component('#json > .toolbar > span.text-muted');
            this._error.hide();
            this._modified.hide();
            this._codeMirror = CodeMirror.fromTextArea(this.e.get(0), {
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
            this._codeMirror.on('keyup', function () {
                try {
                    _this._error.hide();
                    //app.error.hide();
                    JSON.parse(_this._codeMirror.getDoc().getValue());
                }
                catch (e) {
                    _this._events.trigger('error');
                    _this._error.show();
                    //app.error.show();
                    if (app.debugMode)
                        throw e;
                }
            });
            this._codeMirror.on('change', function () {
                if (_this._codeMirror.hasFocus()) {
                    _this._modified.show();
                }
            });
            this._codeMirror.on('blur', function () {
                try {
                    _this._error.hide();
                    //app.error.hide();
                    var json = JSON.parse(_this._codeMirror.getDoc().getValue());
                    var dfa = DFARunner.DFA.createMachine(json);
                    if (app.debugMode) {
                        console.log('"old" DFA: ', services.dfa);
                        console.log('"new" DFA: ', dfa);
                    }
                    if (services.dfa !== null) {
                        var newDfaIsNotDifferent = services.dfa.equals(dfa);
                        if (newDfaIsNotDifferent) {
                            if (app.debugMode)
                                console.log("DFA is the same, no changes");
                            return;
                        }
                        if (app.debugMode && !newDfaIsNotDifferent) {
                            console.log('DFA is different, changes found');
                        }
                    }
                    else {
                        // Create an empty DFA template
                        dfa = new DFARunner.DFA();
                    }
                    services.dfa = dfa;
                    services.events.trigger('dfaChanged');
                    _this._modified.hide();
                }
                catch (e) {
                    services.dfa = null;
                    _this._events.trigger('error');
                    _this._error.show();
                    //app.error.show();
                    if (app.debugMode)
                        throw e;
                }
            });
            app.tabs.change(function (selectedTab) {
                if (selectedTab.id === 'json') {
                    _this._codeMirror.refresh();
                    _this._codeMirror.focus();
                }
            });
            services.events.on('dfaChanged', function () {
                _this.dfaChanged();
            });
        }
        Object.defineProperty(JSONEntry.prototype, "value", {
            get: function () {
                return this._codeMirror.getDoc().getValue();
            },
            set: function (value) {
                try {
                    this._error.hide();
                    var value = JSON.stringify(JSON.parse(value), null, '\t');
                    this._codeMirror.getDoc().setValue(value);
                }
                catch (e) {
                    this._codeMirror.getDoc().setValue(value);
                    this._events.trigger('error');
                    this._error.show();
                    //app.error.show();
                    if (app.debugMode) {
                        console.log(services.dfa);
                        throw e;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JSONEntry.prototype, "valueAsJSON", {
            get: function () {
                try {
                    return JSON.parse(this._codeMirror.getDoc().getValue());
                }
                catch (e) {
                    return null;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JSONEntry.prototype, "valueFromJSON", {
            set: function (dfa) {
                try {
                    //app.error.hide();
                    this._error.hide();
                    var value = JSON.stringify(dfa, null, '\t');
                    this._codeMirror.getDoc().setValue(value);
                }
                catch (e) {
                    this._codeMirror.getDoc().setValue('');
                    // TODO: There was invalid DFA JSON object (how?), let the user know?
                    if (app.debugMode) {
                        console.log(dfa);
                        throw e;
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(JSONEntry.prototype, "editor", {
            get: function () {
                return this._codeMirror;
            },
            enumerable: true,
            configurable: true
        });
        JSONEntry.prototype.dfaChanged = function () {
            if (services.dfa !== null) {
                this.valueFromJSON = services.dfa.toJSON();
            }
        };
        return JSONEntry;
    })(DFARunner.Component);
    DFARunner.JSONEntry = JSONEntry;
})(DFARunner || (DFARunner = {}));

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var Tester = (function (_super) {
        __extends(Tester, _super);
        function Tester() {
            var _this = this;
            _super.call(this, '#string');
            this._icon = new DFARunner.Component('#testResultIcon');
            services.events.on('error', function () {
                _this.testString();
            });
            services.events.on('dfaChanged', function () {
                _this.testString();
            });
            this.change(function () {
                _this.testString();
            });
        }
        Tester.prototype.testString = function () {
            if (services.dfa !== null && services.dfa.testString(this.text)) {
                this.e.parent().removeClass('has-error');
                this.e.parent().addClass('has-success');
                this._icon.e.removeClass('glyphicon-remove');
                this._icon.e.addClass('glyphicon-ok');
            }
            else {
                this.e.parent().addClass('has-error');
                this.e.parent().removeClass('has-success');
                this._icon.e.addClass('glyphicon-remove');
                this._icon.e.removeClass('glyphicon-ok');
            }
        };
        return Tester;
    })(DFARunner.TextboxComponent);
    DFARunner.Tester = Tester;
})(DFARunner || (DFARunner = {}));

var DFARunner;
(function (DFARunner) {
    var State = (function () {
        function State(id, transitions) {
            if (transitions === void 0) { transitions = []; }
            this._id = id;
            this._transitions = transitions;
        }
        Object.defineProperty(State.prototype, "id", {
            get: function () {
                return this._id;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(State.prototype, "transitions", {
            get: function () {
                return this._transitions;
            },
            enumerable: true,
            configurable: true
        });
        State.prototype.isAcceptState = function (acceptStates) {
            for (var i = 0; i < acceptStates.length; i++) {
                if (this._id === acceptStates[i].id) {
                    return true;
                }
            }
            // This state is not an accept state
            return false;
        };
        State.prototype.transition = function (input) {
            for (var i = 0; i < this._transitions.length; i++) {
                if (this._transitions[i].input === input) {
                    return this._transitions[i].destination;
                }
            }
            // No transition found for given input
            return null;
        };
        State.prototype.getTransitionByInput = function (input) {
            for (var i = 0; i < this._transitions.length; i++) {
                if (this._transitions[i].input === input) {
                    return this._transitions[i];
                }
            }
            // No transition found for given input
            return null;
        };
        return State;
    })();
    DFARunner.State = State;
    var Transition = (function () {
        function Transition(character, destination) {
            this._input = character;
            this._destination = destination;
        }
        Object.defineProperty(Transition.prototype, "input", {
            get: function () {
                return this._input;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Transition.prototype, "destination", {
            get: function () {
                return this._destination;
            },
            set: function (destination) {
                this._destination = destination;
            },
            enumerable: true,
            configurable: true
        });
        return Transition;
    })();
    DFARunner.Transition = Transition;
})(DFARunner || (DFARunner = {}));

var DFARunner;
(function (DFARunner) {
    var DFA = (function () {
        function DFA() {
            this._states = [];
            this._alphabet = [];
            this._startState = null;
            this._acceptStates = [];
        }
        DFA.createMachine = function (json) {
            var emitResult = false, dfa = new DFA();
            // Add states
            if (json.states && Array.isArray(json.states)) {
                json.states.forEach(function (stateId) {
                    dfa.states.push(new DFARunner.State(stateId));
                    emitResult = true;
                });
            }
            // Add alphabet
            if (json.alphabet && Array.isArray(json.alphabet)) {
                json.alphabet.forEach(function (character) {
                    dfa.alphabet.push(character);
                    emitResult = true;
                });
            }
            // Add transitions
            if (json.transitions && Array.isArray(json.transitions)) {
                json.transitions.forEach(function (transition) {
                    if (typeof transition.source === 'string' && typeof transition.input === 'string' && typeof transition.destination === 'string') {
                        var sourceState = dfa.getStateById(transition.source);
                        var destinationState = dfa.getStateById(transition.destination);
                        if (sourceState !== null && destinationState !== null) {
                            sourceState.transitions.push(new DFARunner.Transition(transition.input, destinationState));
                        }
                    }
                });
            }
            // Set start state
            if (json.startState && typeof json.startState === 'string') {
                var startState = dfa.getStateById(json.startState);
                if (startState !== null) {
                    dfa.startState = startState;
                    emitResult = true;
                }
                else {
                    // Default to first state, if available
                    if (dfa.states.length > 0) {
                        dfa.startState = dfa.states[0];
                        emitResult = true;
                    }
                }
            }
            else {
                // Default to first state, if available
                if (dfa.states.length > 0) {
                    dfa.startState = dfa.states[0];
                    emitResult = true;
                }
            }
            // Add accept states, creating new states if necessary
            if (json.acceptStates && Array.isArray(json.acceptStates)) {
                json.acceptStates.forEach(function (acceptStateId) {
                    var acceptState = dfa.getStateById(acceptStateId);
                    if (acceptState === null) {
                        acceptState = new DFARunner.State(acceptStateId);
                        dfa.states.push(acceptState);
                    }
                    dfa.acceptStates.push(acceptState);
                    emitResult = true;
                });
            }
            if (emitResult)
                return dfa;
            return null;
        };
        DFA.validate = function (dfa) {
            // TODO: Validate a DFA
            return false;
        };
        Object.defineProperty(DFA.prototype, "states", {
            get: function () {
                return this._states;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DFA.prototype, "alphabet", {
            get: function () {
                return this._alphabet;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DFA.prototype, "startState", {
            get: function () {
                return this._startState;
            },
            set: function (startState) {
                this._startState = startState;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(DFA.prototype, "acceptStates", {
            get: function () {
                return this._acceptStates;
            },
            enumerable: true,
            configurable: true
        });
        DFA.prototype.equals = function (other) {
            if (!other)
                return false;
            if (other instanceof DFA) {
                other = other.toJSON();
            }
            if (!other.states)
                return false;
            if (!other.alphabet)
                return false;
            if (!other.transitions)
                return false;
            if ((!other.startState || other.startState === "") && this._startState === null)
                return false;
            if (other.startState && this._startState === null)
                return false;
            if (other.startState && this._startState.id !== other.startState)
                return false;
            if (!other.acceptStates)
                return false;
            var found = false;
            for (var i = 0; i < this._states.length; i++) {
                // Check that the state exists in other
                found = false;
                for (var v = 0; v < other.states.length; v++) {
                    if (this._states[i].id === other.states[v]) {
                        found = true;
                        break;
                    }
                }
                if (!found)
                    return false;
                for (var v = 0; v < this._states[i].transitions.length; v++) {
                    found = false;
                    for (var u = 0; u < other.transitions.length; u++) {
                        var transition = this._states[i].transitions[v];
                        var otherTransition = other.transitions[u];
                        if (otherTransition.source === this._states[i].id || otherTransition.input === transition.input || otherTransition.destination === transition.destination.id) {
                            found = true;
                            break;
                        }
                    }
                    if (!found)
                        return false;
                }
            }
            for (var i = 0; i < this._alphabet.length; i++) {
                found = false;
                for (var v = 0; v < other.alphabet.length; v++) {
                    if (this._alphabet[i] === other.alphabet[v]) {
                        found = true;
                        break;
                    }
                }
                if (!found)
                    return false;
            }
            for (var i = 0; i < this._alphabet.length; i++) {
                found = false;
                for (var v = 0; v < other.alphabet.length; v++) {
                    if (this._alphabet[i] === other.alphabet[v]) {
                        found = true;
                    }
                }
                if (!found)
                    return false;
            }
            return true;
        };
        DFA.prototype.getStateById = function (id) {
            if (id !== null) {
                for (var i = 0; i < this._states.length; i++) {
                    if (this._states[i].id === id) {
                        return this._states[i];
                    }
                }
            }
            // State not found
            return null;
        };
        DFA.prototype.stringInAlphabet = function (value) {
            var found = false;
            for (var i = 0; i < this._alphabet.length; i++) {
                if (this._alphabet[i] === value) {
                    found = true;
                }
            }
            return found;
        };
        DFA.prototype.stateIsAcceptState = function (state) {
            for (var i = 0; i < this._acceptStates.length; i++) {
                if (this._acceptStates[i].id === state.id) {
                    return true;
                }
            }
            return false;
        };
        DFA.prototype.toJSON = function () {
            var states = [];
            var alphabet = [];
            var transitions = [];
            var acceptStates = [];
            this._states.forEach(function (state) {
                states.push(state.id);
                state.transitions.forEach(function (transition) {
                    transitions.push({
                        source: state.id,
                        input: transition.input,
                        destination: transition.destination.id
                    });
                });
            });
            this._alphabet.forEach(function (str) {
                alphabet.push(str);
            });
            this._acceptStates.forEach(function (state) {
                acceptStates.push(state.id);
            });
            return {
                states: states,
                alphabet: alphabet,
                transitions: transitions,
                startState: this._startState ? this._startState.id : "",
                acceptStates: acceptStates
            };
        };
        DFA.prototype.testString = function (str) {
            if (this._startState === null)
                return false;
            return this._readString(str, this._startState);
        };
        DFA.prototype._readString = function (str, currentState) {
            if (str === "" && currentState.isAcceptState(this._acceptStates)) {
                return true;
            }
            else if (str === "") {
                return false;
            }
            var input = "", nextState = null;
            for (var i = 0; i < this._alphabet.length; i++) {
                input = this._alphabet[i];
                if (str.indexOf(input) === 0) {
                    nextState = currentState.transition(input);
                    break;
                }
            }
            if (nextState === null)
                return false;
            //console.log("Input: " + input + "   Rest: " + str.slice(input.length));
            //console.log(nextState);
            return this._readString(str.slice(input.length), nextState);
        };
        return DFA;
    })();
    DFARunner.DFA = DFA;
})(DFARunner || (DFARunner = {}));

var DFARunner;
(function (DFARunner) {
    var Application = (function () {
        function Application() {
            var _this = this;
            $(function () {
                _this._tabs = new DFARunner.Tabs();
                _this._examples = new DFARunner.Examples();
                _this._error = new DFARunner.ErrorMessage();
                _this._json = new DFARunner.JSONEntry();
                _this._designer = new DFARunner.Designer();
                _this._tester = new DFARunner.Tester();
                _this._debugMode = false;
                services.dfa = new DFARunner.DFA();
                services.events.trigger('dfaChanged');
                $('#json').hide();
            });
        }
        Object.defineProperty(Application.prototype, "error", {
            get: function () {
                return this._error;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Application.prototype, "tabs", {
            get: function () {
                return this._tabs;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Application.prototype, "json", {
            get: function () {
                return this._json;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Application.prototype, "designer", {
            get: function () {
                return this._designer;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Application.prototype, "debugMode", {
            get: function () {
                return this._debugMode;
            },
            set: function (debugMode) {
                this._debugMode = debugMode;
            },
            enumerable: true,
            configurable: true
        });
        Application.prototype.debug = function () {
            this._debugMode = true;
        };
        return Application;
    })();
    DFARunner.Application = Application;
})(DFARunner || (DFARunner = {}));

var services = {
    events: new DFARunner.Bridge(),
    examples: [],
    dfa: null
};
$.fn.hasAttr = function (name) {
    var attr = this.attr(name);
    return attr !== undefined && attr !== false;
    //return this.attr(name) !== undefined;
};
var app = new DFARunner.Application();
app.debug();

// Add examples to examples service
services.examples.push({
    name: "{w | w is the empty string or ends in a 0}",
    states: ["q1", "q2"],
    alphabet: ["0", "1"],
    transitions: [
        { source: "q1", input: "0", destination: "q1" },
        { source: "q1", input: "1", destination: "q2" },
        { source: "q2", input: "1", destination: "q2" },
        { source: "q2", input: "0", destination: "q1" }
    ],
    "startState": "q1",
    "acceptStates": ["q1"]
});
services.examples.push({
    name: "{w | w has exactly two a's}",
    states: ["q1", "q2", "q3", "q4"],
    alphabet: ["a", "b"],
    transitions: [
        { source: "q1", input: "b", destination: "q1" },
        { source: "q1", input: "a", destination: "q2" },
        { source: "q2", input: "b", destination: "q2" },
        { source: "q2", input: "a", destination: "q3" },
        { source: "q3", input: "b", destination: "q3" },
        { source: "q3", input: "a", destination: "q4" },
        { source: "q4", input: "a", destination: "q4" },
        { source: "q4", input: "b", destination: "q4" }
    ],
    "startState": "q1",
    "acceptStates": ["q3"]
});
services.examples.push({
    name: "a*b(a|b)*\t{w | w has at least one b}",
    states: ["q1", "q2"],
    alphabet: ["a", "b"],
    transitions: [
        { source: "q1", input: "a", destination: "q1" },
        { source: "q1", input: "b", destination: "q2" },
        { source: "q2", input: "a", destination: "q2" },
        { source: "q2", input: "b", destination: "q2" }
    ],
    "startState": "q1",
    "acceptStates": ["q2"]
});
services.examples.push({
    "name": "{w | w = \"oompa loompa\"}",
    "states": ["q1", "q2", "q3", "q4", "q5"],
    "alphabet": ["oompa", "loompa", " "],
    "transitions": [
        { "source": "q1", "input": "oompa", "destination": "q2" },
        { "source": "q1", "input": "loompa", "destination": "q5" },
        { "source": "q1", "input": " ", "destination": "q5" },
        { "source": "q2", "input": "oompa", "destination": "q5" },
        { "source": "q2", "input": "loompa", "destination": "q5" },
        { "source": "q2", "input": " ", "destination": "q3" },
        { "source": "q3", "input": "oompa", "destination": "q5" },
        { "source": "q3", "input": "loompa", "destination": "q4" },
        { "source": "q3", "input": " ", "destination": "q5" },
        { "source": "q4", "input": "oompa", "destination": "q5" },
        { "source": "q4", "input": "loompa", "destination": "q5" },
        { "source": "q4", "input": " ", "destination": "q5" },
        { "source": "q5", "input": "oompa", "destination": "q5" },
        { "source": "q5", "input": "loompa", "destination": "q5" },
        { "source": "q5", "input": " ", "destination": "q5" }
    ],
    "startState": "q1",
    "acceptStates": ["q4"]
});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9IZWxwZXJzLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL0JyaWRnZS50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9jb21wb25lbnRzL0NvbXBvbmVudC50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9jb21wb25lbnRzL0VuYWJsZWFibGVDb21wb25lbnQudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9CdXR0b25Db21wb25lbnQudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9JbnB1dENvbXBvbmVudC50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9jb21wb25lbnRzL1RleHRib3hDb21wb25lbnQudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9DaGVja2JveENvbXBvbmVudC50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9jb21wb25lbnRzL0xpc3RDb21wb25lbnQudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9FcnJvck1lc3NhZ2UudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9FeGFtcGxlcy50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9jb21wb25lbnRzL1RhYnMudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9TdGF0ZXMudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9BbHBoYWJldC50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9jb21wb25lbnRzL1RyYW5zaXRpb25zLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvRGVzaWduZXIudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9KU09ORW50cnkudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9UZXN0ZXIudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvU3RhdGVUcmFuc2l0aW9uLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL0RGQS50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9BcHBsaWNhdGlvbi50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9tYWluLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2V4YW1wbGVzLnRzIl0sIm5hbWVzIjpbIkRGQVJ1bm5lciIsIkRGQVJ1bm5lci5IZWxwZXJzIiwiREZBUnVubmVyLkhlbHBlcnMuZGVsYXkiLCJERkFSdW5uZXIuSGVscGVycy5pbnRlcnZhbCIsIkRGQVJ1bm5lci5IZWxwZXJzLnJhbmRvbU51bWJlciIsIkRGQVJ1bm5lci5IZWxwZXJzLm9iamVjdElzQSIsIkRGQVJ1bm5lci5CcmlkZ2UiLCJERkFSdW5uZXIuQnJpZGdlLmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkJyaWRnZS5vbiIsIkRGQVJ1bm5lci5CcmlkZ2Uub2ZmIiwiREZBUnVubmVyLkJyaWRnZS50cmlnZ2VyIiwiREZBUnVubmVyLkNvbXBvbmVudCIsIkRGQVJ1bm5lci5Db21wb25lbnQuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuQ29tcG9uZW50LmUiLCJERkFSdW5uZXIuQ29tcG9uZW50LmlkIiwiREZBUnVubmVyLkNvbXBvbmVudC5hZGRFdmVudExpc3RlbmVyIiwiREZBUnVubmVyLkNvbXBvbmVudC5vbiIsIkRGQVJ1bm5lci5Db21wb25lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lciIsIkRGQVJ1bm5lci5Db21wb25lbnQub2ZmIiwiREZBUnVubmVyLkNvbXBvbmVudC5kYXRhIiwiREZBUnVubmVyLkNvbXBvbmVudC5zaG93IiwiREZBUnVubmVyLkNvbXBvbmVudC5oaWRlIiwiREZBUnVubmVyLkNvbXBvbmVudC5rZXl1cCIsIkRGQVJ1bm5lci5FbmFibGVhYmxlQ29tcG9uZW50IiwiREZBUnVubmVyLkVuYWJsZWFibGVDb21wb25lbnQuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuRW5hYmxlYWJsZUNvbXBvbmVudC5lbmFibGVkIiwiREZBUnVubmVyLkVuYWJsZWFibGVDb21wb25lbnQuZW5hYmxlIiwiREZBUnVubmVyLkVuYWJsZWFibGVDb21wb25lbnQuZGlzYWJsZSIsIkRGQVJ1bm5lci5CdXR0b25Db21wb25lbnQiLCJERkFSdW5uZXIuQnV0dG9uQ29tcG9uZW50LmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkJ1dHRvbkNvbXBvbmVudC5jbGljayIsIkRGQVJ1bm5lci5JbnB1dENvbXBvbmVudCIsIkRGQVJ1bm5lci5JbnB1dENvbXBvbmVudC5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5JbnB1dENvbXBvbmVudC5OdW1iZXJNYXJzaGFsbGVyIiwiREZBUnVubmVyLklucHV0Q29tcG9uZW50LkJvb2xlYW5NYXJzaGFsbGVyIiwiREZBUnVubmVyLklucHV0Q29tcG9uZW50LlN0cmluZ01hcnNoYWxsZXIiLCJERkFSdW5uZXIuSW5wdXRDb21wb25lbnQubWFyc2hhbGxlciIsIkRGQVJ1bm5lci5JbnB1dENvbXBvbmVudC5jaGFuZ2UiLCJERkFSdW5uZXIuVGV4dGJveENvbXBvbmVudCIsIkRGQVJ1bm5lci5UZXh0Ym94Q29tcG9uZW50LmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLlRleHRib3hDb21wb25lbnQudGV4dCIsIkRGQVJ1bm5lci5UZXh0Ym94Q29tcG9uZW50LmNoYW5nZSIsIkRGQVJ1bm5lci5UZXh0Ym94Q29tcG9uZW50LmNoZWNrVGV4dENoYW5nZWQiLCJERkFSdW5uZXIuQ2hlY2tib3hDb21wb25lbnQiLCJERkFSdW5uZXIuQ2hlY2tib3hDb21wb25lbnQuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuQ2hlY2tib3hDb21wb25lbnQuY2hlY2tlZCIsIkRGQVJ1bm5lci5DaGVja2JveENvbXBvbmVudC5jaGFuZ2UiLCJERkFSdW5uZXIuQ2hlY2tib3hDb21wb25lbnQuY2xpY2tlZCIsIkRGQVJ1bm5lci5DaGVja2JveENvbXBvbmVudC5jaGVja2VkQ2hhbmdlZCIsIkRGQVJ1bm5lci5MaXN0Q29tcG9uZW50IiwiREZBUnVubmVyLkxpc3RDb21wb25lbnQuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuTGlzdENvbXBvbmVudC5OdWxsTGlzdEl0ZW0iLCJERkFSdW5uZXIuTGlzdENvbXBvbmVudC5pdGVtcyIsIkRGQVJ1bm5lci5MaXN0Q29tcG9uZW50LnNlbGVjdGVkSW5kZXgiLCJERkFSdW5uZXIuTGlzdENvbXBvbmVudC5zZWxlY3RlZEl0ZW0iLCJERkFSdW5uZXIuTGlzdENvbXBvbmVudC5jaGFuZ2UiLCJERkFSdW5uZXIuRXJyb3JNZXNzYWdlIiwiREZBUnVubmVyLkVycm9yTWVzc2FnZS5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5FeGFtcGxlcyIsIkRGQVJ1bm5lci5FeGFtcGxlcy5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5FeGFtcGxlcy5kZmFDaGFuZ2VkIiwiREZBUnVubmVyLlRhYnMiLCJERkFSdW5uZXIuVGFicy5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5UYWJzLnNlbGVjdGVkVGFiIiwiREZBUnVubmVyLlRhYnMuY2hhbmdlIiwiREZBUnVubmVyLlN0YXRlcyIsIkRGQVJ1bm5lci5TdGF0ZXMuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuU3RhdGVzLnNlbGVjdGVkU3RhdGUiLCJERkFSdW5uZXIuU3RhdGVzLmRmYUNoYW5nZWQiLCJERkFSdW5uZXIuU3RhdGVzLnNlbGVjdGVkU3RhdGVDaGFuZ2VkIiwiREZBUnVubmVyLlN0YXRlcy50ZXh0Q2hhbmdlZCIsIkRGQVJ1bm5lci5TdGF0ZXMuYWRkU3RhdGUiLCJERkFSdW5uZXIuU3RhdGVzLmRlbGV0ZVN0YXRlIiwiREZBUnVubmVyLlN0YXRlcy5yZWNyZWF0ZUFjY2VwdENoZWNrYm94IiwiREZBUnVubmVyLlN0YXRlcy5hY2NlcHRUb2dnbGVkIiwiREZBUnVubmVyLkFscGhhYmV0IiwiREZBUnVubmVyLkFscGhhYmV0LmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkFscGhhYmV0LmRmYUNoYW5nZWQiLCJERkFSdW5uZXIuQWxwaGFiZXQuc2VsZWN0ZWRTdHJpbmdDaGFuZ2VkIiwiREZBUnVubmVyLkFscGhhYmV0LnRleHRDaGFuZ2VkIiwiREZBUnVubmVyLkFscGhhYmV0LmFkZFN0cmluZyIsIkRGQVJ1bm5lci5BbHBoYWJldC5kZWxldGVTdHJpbmciLCJERkFSdW5uZXIuVHJhbnNpdGlvbnMiLCJERkFSdW5uZXIuVHJhbnNpdGlvbnMuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuVHJhbnNpdGlvbnMuY2hhbmdlIiwiREZBUnVubmVyLlRyYW5zaXRpb25zLmRmYUNoYW5nZWQiLCJERkFSdW5uZXIuRGVzaWduZXIiLCJERkFSdW5uZXIuRGVzaWduZXIuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuSlNPTkVudHJ5IiwiREZBUnVubmVyLkpTT05FbnRyeS5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5KU09ORW50cnkudmFsdWUiLCJERkFSdW5uZXIuSlNPTkVudHJ5LnZhbHVlQXNKU09OIiwiREZBUnVubmVyLkpTT05FbnRyeS52YWx1ZUZyb21KU09OIiwiREZBUnVubmVyLkpTT05FbnRyeS5lZGl0b3IiLCJERkFSdW5uZXIuSlNPTkVudHJ5LmRmYUNoYW5nZWQiLCJERkFSdW5uZXIuVGVzdGVyIiwiREZBUnVubmVyLlRlc3Rlci5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5UZXN0ZXIudGVzdFN0cmluZyIsIkRGQVJ1bm5lci5TdGF0ZSIsIkRGQVJ1bm5lci5TdGF0ZS5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5TdGF0ZS5pZCIsIkRGQVJ1bm5lci5TdGF0ZS50cmFuc2l0aW9ucyIsIkRGQVJ1bm5lci5TdGF0ZS5pc0FjY2VwdFN0YXRlIiwiREZBUnVubmVyLlN0YXRlLnRyYW5zaXRpb24iLCJERkFSdW5uZXIuU3RhdGUuZ2V0VHJhbnNpdGlvbkJ5SW5wdXQiLCJERkFSdW5uZXIuVHJhbnNpdGlvbiIsIkRGQVJ1bm5lci5UcmFuc2l0aW9uLmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLlRyYW5zaXRpb24uaW5wdXQiLCJERkFSdW5uZXIuVHJhbnNpdGlvbi5kZXN0aW5hdGlvbiIsIkRGQVJ1bm5lci5ERkEiLCJERkFSdW5uZXIuREZBLmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkRGQS5jcmVhdGVNYWNoaW5lIiwiREZBUnVubmVyLkRGQS52YWxpZGF0ZSIsIkRGQVJ1bm5lci5ERkEuc3RhdGVzIiwiREZBUnVubmVyLkRGQS5hbHBoYWJldCIsIkRGQVJ1bm5lci5ERkEuc3RhcnRTdGF0ZSIsIkRGQVJ1bm5lci5ERkEuYWNjZXB0U3RhdGVzIiwiREZBUnVubmVyLkRGQS5lcXVhbHMiLCJERkFSdW5uZXIuREZBLmdldFN0YXRlQnlJZCIsIkRGQVJ1bm5lci5ERkEuc3RyaW5nSW5BbHBoYWJldCIsIkRGQVJ1bm5lci5ERkEuc3RhdGVJc0FjY2VwdFN0YXRlIiwiREZBUnVubmVyLkRGQS50b0pTT04iLCJERkFSdW5uZXIuREZBLnRlc3RTdHJpbmciLCJERkFSdW5uZXIuREZBLl9yZWFkU3RyaW5nIiwiREZBUnVubmVyLkFwcGxpY2F0aW9uIiwiREZBUnVubmVyLkFwcGxpY2F0aW9uLmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkFwcGxpY2F0aW9uLmVycm9yIiwiREZBUnVubmVyLkFwcGxpY2F0aW9uLnRhYnMiLCJERkFSdW5uZXIuQXBwbGljYXRpb24uanNvbiIsIkRGQVJ1bm5lci5BcHBsaWNhdGlvbi5kZXNpZ25lciIsIkRGQVJ1bm5lci5BcHBsaWNhdGlvbi5kZWJ1Z01vZGUiLCJERkFSdW5uZXIuQXBwbGljYXRpb24uZGVidWciXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sU0FBUyxDQW1DZjtBQW5DRCxXQUFPLFNBQVM7SUFBQ0EsSUFBQUEsT0FBT0EsQ0FtQ3ZCQTtJQW5DZ0JBLFdBQUFBLE9BQU9BLEVBQUNBLENBQUNBO1FBRXRCQyxTQUFnQkEsS0FBS0EsQ0FBQ0EsSUFBWUE7WUFDOUJDLElBQUlBLE9BQU9BLEdBQUdBLFVBQVVBLEVBQUVBLENBQUNBO1lBQzNCQSxNQUFNQSxDQUFDQSxVQUFVQSxDQUFDQTtnQkFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEIsQ0FBQyxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNUQSxNQUFNQSxDQUFDQSxPQUFPQSxDQUFDQTtRQUNuQkEsQ0FBQ0E7UUFOZUQsYUFBS0EsR0FBTEEsS0FNZkEsQ0FBQUE7UUFPREEsQUFDQUEsMkJBRDJCQTtpQkFDWEEsUUFBUUEsQ0FBQ0EsSUFBZ0JBLEVBQUVBLElBQVlBO1lBQ25ERSxJQUFJQSxRQUFRQSxHQUFHQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUM5Q0EsTUFBTUEsQ0FBQ0E7Z0JB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QUNBLHNCQUFzQkEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDekZBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLHlCQUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNsRUEsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsSUFBSUEseUJBQWVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBRXhFQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxVQUFVQSxHQUFHQSxVQUFDQSxLQUFhQTtnQkFDbENBLE1BQU1BLENBQUNBLEtBQUlBLENBQUNBLEtBQUtBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO1lBQ3JEQSxDQUFDQSxDQUFDQTtZQUVGQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxZQUFZQSxFQUFFQTtnQkFBUUEsS0FBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7WUFBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFFL0RBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLENBQUNBLFVBQUNBLEtBQVlBO2dCQUFPQSxLQUFJQSxDQUFDQSxvQkFBb0JBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzNFQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxVQUFDQSxLQUFZQTtnQkFDN0JBLEtBQUtBLENBQUNBLGNBQWNBLEVBQUVBLENBQUNBO2dCQUV2QkEsS0FBSUEsQ0FBQ0Es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QUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO29CQUNwREEsR0FBR0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsR0FBR0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pFQSxDQUFDQTtnQkFDREEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBRTFCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDbERBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO29CQUNoQkEsQUFDQUEsZUFEZUE7b0JBQ2ZBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO29CQUN0REEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7d0JBQ3BEQSxBQUNBQSxzREFEc0RBOzRCQUNsREEsR0FBR0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7d0JBQ3BCQSxJQUFJQSxZQUFZQSxHQUFHQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQSxDQUFDQTt3QkFDakNBLElB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LEtBQUtBLENBQUNBLFFBQVFBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNsQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsV0FBV0EsQ0FBQ0E7Z0JBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1lBQ3JDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxVQUFVQSxJQUFJQSxLQUFLQSxDQUFDQSxVQUFVQSxLQUFLQSxFQUFFQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxXQUFXQSxLQUFLQSxJQUFJQSxDQUFDQTtnQkFBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDOUZBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLFVBQVVBLElBQUlBLElBQUlBLENBQUNBLFdBQVdBLEtBQUtBLElBQUlBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNoRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBVUEsSUFBSUEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsRUFBRUEsS0FBS0EsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7Z0JBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1lBQy9FQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxZQUFZQSxDQUFDQTtnQkFBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFFdENBLElBQUlBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1lBR2xCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDM0NBLEFBQ0FBLHVDQUR1Q0E7Z0JBQ3ZDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtnQkFDZEEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQzNDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDekNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO3dCQUNiQSxLQUFLQSxDQUFDQTtvQkFDVkEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQTtvQkFBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBR3pCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDMURBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO29CQUNkQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTt3QkFDaERBLElBQUlBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNoREEsSUFBSUEsZUFBZUEsR0FBdUJBLEtBQUtBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUMvREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsTUFBTUEsS0FBS0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFDN0NBLGVBQWVBLENBQUNBLEtBQUtBLEtBQUtBLFVBQVVBLENBQUNBLEtBQUtBLElBQzFDQSxlQUFlQSxDQUFDQSxXQUFXQSxLQUFLQSxVQUFVQSxDQUFDQSxXQUFXQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDNURBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBOzRCQUNiQSxLQUFLQSxDQUFDQTt3QkFDVkEsQ0FBQ0E7b0JBQ0xBLENBQUNBO29CQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQTt3QkFBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQzdCQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUdEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDN0NBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO2dCQUNkQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDN0NBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUMxQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0E7d0JBQ2JBLEtBQUtBLENBQUNBO29CQUNWQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7Z0JBRURBLEVB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Q0FBRTtJQUMxQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQztJQUNwQyxhQUFhLEVBQUU7UUFDWCxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBTSxhQUFhLEVBQUUsSUFBSSxFQUFFO1FBQzdELEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFLLGFBQWEsRUFBRSxJQUFJLEVBQUU7UUFDN0QsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQVUsYUFBYSxFQUFFLElBQUksRUFBRTtRQUM3RCxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBTSxhQUFhLEVBQUUsSUFBSSxFQUFFO1FBQzdELEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFLLGFBQWEsRUFBRSxJQUFJLEVBQUU7UUFDN0QsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQVUsYUFBYSxFQUFFLElBQUksRUFBRTtRQUM3RCxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBTSxhQUFhLEVBQUUsSUFBSSxFQUFFO1FBQzdELEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFLLGFBQWEsRUFBRSxJQUFJLEVBQUU7UUFDN0QsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQVUsYUFBYSxFQUFFLElBQUksRUFBRTtRQUM3RCxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBTSxhQUFhLEVBQUUsSUFBSSxFQUFFO1FBQzdELEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFLLGFBQWEsRUFBRSxJQUFJLEVBQUU7UUFDN0QsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQVUsYUFBYSxFQUFFLElBQUksRUFBRTtRQUM3RCxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBTSxhQUFhLEVBQUUsSUFBSSxFQUFFO1FBQzdELEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFLLGFBQWEsRUFBRSxJQUFJLEVBQUU7UUFDN0QsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQVUsYUFBYSxFQUFFLElBQUksRUFBRTtLQUNoRTtJQUNELFlBQVksRUFBRSxJQUFJO0lBQ2xCLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQztDQUN6QixDQUFDLENBQUMiLCJmaWxlIjoiZGZhLnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIERGQVJ1bm5lci5IZWxwZXJzIHtcblxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZWxheSh0aW1lOiBudW1iZXIpOiBQaW5reVN3ZWFyLlByb21pc2Uge1xuICAgICAgICB2YXIgcHJvbWlzZSA9IHBpbmt5U3dlYXIoKTtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcHJvbWlzZSh0cnVlKTtcbiAgICAgICAgfSwgdGltZSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW50ZXJ2YWwge1xuICAgICAgICBpbnRlcnZhbElkOiBudW1iZXI7XG4gICAgICAgIGNsZWFyOiAoKSA9PiB2b2lkO1xuICAgIH1cblxuICAgIC8vSW50ZXJ2YWwgdXRpbGl0eSBmdW5jdGlvblxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbnRlcnZhbChmdW5jOiAoKSA9PiB2b2lkLCB0aW1lOiBudW1iZXIpOiBJbnRlcnZhbCB7XG4gICAgICAgIHZhciBpbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jLCB0aW1lKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGludGVydmFsSWQ6IGludGVydmFsLFxuICAgICAgICAgICAgY2xlYXI6IGZ1bmN0aW9uICgpIHsgd2luZG93LmNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpOyB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbU51bWJlcihtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpICsgbWluO1xuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBvYmplY3RJc0Eob2JqZWN0OiBhbnksIHR5cGU6IGFueSkge1xuICAgICAgICBpZiAodHlwZS5oYXNPd25Qcm9wZXJ0eShcInByb3RvdHlwZVwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIG9iamVjdC5jb25zdHJ1Y3Rvci5uYW1lID09PSB0eXBlLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIERGQVJ1bm5lciB7XG4gICAgZXhwb3J0IGNsYXNzIEJyaWRnZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBoYW5kbGVyczogQnJpZGdlSGFuZGxlcltdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlcnMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGQgYW5kIHN1YnNjcmliZSB0byBhbiBldmVudFxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQgVHlwZSBvZiBicmlkZ2UgZXZlbnQgdG8gaGFuZGxlXG4gICAgICAgICAqIEBwYXJhbSBjYWxsYmFjayBIYW5kbGluZyBjYWxsYmFjayBkZWxlZ2F0ZVxuICAgICAgICAgKiBAcmV0dXJuIFVuaXF1ZSBpZCByZXByZXNlbnRpbmcgdGhpcyBldmVudFxuICAgICAgICAgKi9cbiAgICAgICAgb24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEJyaWRnZUNhbGxiYWNrPGFueT4pOiBudW1iZXIge1xuICAgICAgICAgICAgTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIHZhciBoYW5kbGVyOiBCcmlkZ2VIYW5kbGVyID0ge1xuICAgICAgICAgICAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICBpZDogREZBUnVubmVyLkhlbHBlcnMucmFuZG9tTnVtYmVyKDAsIERhdGUubm93KCkpLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVyLmlkO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBhbiBldmVudCBoYW5kbGVyXG4gICAgICAgICAqIEBwYXJhbSBpZCBVbmlxdWUgaWQgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0byByZW1vdmVcbiAgICAgICAgICovXG4gICAgICAgIG9mZihpZDogbnVtYmVyKTogQnJpZGdlO1xuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIGFuIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICogQHBhcmFtIGNhbGxiYWNrIEZ1bmN0aW9uIGNhbGxiYWNrIGFzc2lnbmVkIHRvIHRoZSBldmVudCB0byByZW1vdmVcbiAgICAgICAgICovXG4gICAgICAgIG9mZihjYWxsYmFjazogQnJpZGdlQ2FsbGJhY2s8YW55Pik6IEJyaWRnZTtcbiAgICAgICAgb2ZmKGlkT3JDYWxsYmFjazogYW55KTogQnJpZGdlIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IC0xO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmhhbmRsZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpZE9yQ2FsbGJhY2sgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhbmRsZXJzW2ldLmlkID09PSBpZE9yQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFuZGxlcnNbaV0uY2FsbGJhY2sgPT09IGlkT3JDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGF0Y2ggYW4gZXZlbnRcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IFR5cGUgb2YgYnJpZGdlIGV2ZW50IHRvIGRpc3BhdGNoXG4gICAgICAgICAqIEBwYXJhbSBkYXRhIERhdGEgdG8gcGFzcyBhbG9uZyB0byBldmVudCBoYW5kbGVyc1xuICAgICAgICAgKiBAcGFyYW0gY29udGV4dD13aW5kb3cgQ29udGV4dCBpbiB3aGljaCB0byBleGVjdXRlIGhhbmRsaW5nIGNhbGxiYWNrIGRlbGVnYXRlc1xuICAgICAgICAgKi9cbiAgICAgICAgdHJpZ2dlcihldmVudDogc3RyaW5nLCBkYXRhOiBhbnkgPSBudWxsLCBjb250ZXh0OiBhbnkgPSB3aW5kb3cpOiBCcmlkZ2Uge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyOiBCcmlkZ2VIYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXIuZXZlbnQgPT09IGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGxiYWNrLmNhbGwoY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGxiYWNrLmNhbGwoY29udGV4dCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVjbGFyZSBjbGFzcyBCcmlkZ2VIYW5kbGVyIHtcbiAgICAgICAgZXZlbnQ6IHN0cmluZztcbiAgICAgICAgaWQ6IG51bWJlcjtcbiAgICAgICAgY2FsbGJhY2s6IEJyaWRnZUNhbGxiYWNrPGFueT47XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBCcmlkZ2VDYWxsYmFjazxUPiB7XG4gICAgICAgIChkYXRhPzogVCk6IHZvaWQ7XG4gICAgICAgIChkYXRhPzogYW55KTogdm9pZDtcbiAgICB9XG59XG4iLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsIm1vZHVsZSBERkFSdW5uZXIge1xuXG4gICAgZXhwb3J0IGNsYXNzIFN0YXRlIHtcbiAgICAgICAgcHJpdmF0ZSBfaWQ6IHN0cmluZztcbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNpdGlvbnM6IFRyYW5zaXRpb25bXTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCB0cmFuc2l0aW9uczogVHJhbnNpdGlvbltdID0gW10pIHtcbiAgICAgICAgICAgIHRoaXMuX2lkID0gaWQ7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2l0aW9ucyA9IHRyYW5zaXRpb25zO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGlkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRyYW5zaXRpb25zKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zaXRpb25zO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNBY2NlcHRTdGF0ZShhY2NlcHRTdGF0ZXM6IFN0YXRlW10pOiBib29sZWFuIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWNjZXB0U3RhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lkID09PSBhY2NlcHRTdGF0ZXNbaV0uaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGlzIHN0YXRlIGlzIG5vdCBhbiBhY2NlcHQgc3RhdGVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyYW5zaXRpb24oaW5wdXQ6IHN0cmluZyk6IFN0YXRlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fdHJhbnNpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdHJhbnNpdGlvbnNbaV0uaW5wdXQgPT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90cmFuc2l0aW9uc1tpXS5kZXN0aW5hdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE5vIHRyYW5zaXRpb24gZm91bmQgZm9yIGdpdmVuIGlucHV0XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFRyYW5zaXRpb25CeUlucHV0KGlucHV0OiBzdHJpbmcpOiBUcmFuc2l0aW9uIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fdHJhbnNpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdHJhbnNpdGlvbnNbaV0uaW5wdXQgPT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90cmFuc2l0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE5vIHRyYW5zaXRpb24gZm91bmQgZm9yIGdpdmVuIGlucHV0XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBUcmFuc2l0aW9uIHtcbiAgICAgICAgcHJpdmF0ZSBfaW5wdXQ6IHN0cmluZztcbiAgICAgICAgcHJpdmF0ZSBfZGVzdGluYXRpb246IFN0YXRlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoYXJhY3Rlcjogc3RyaW5nLCBkZXN0aW5hdGlvbjogU3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2lucHV0ID0gY2hhcmFjdGVyO1xuICAgICAgICAgICAgdGhpcy5fZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBpbnB1dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBkZXN0aW5hdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBkZXN0aW5hdGlvbihkZXN0aW5hdGlvbjogU3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2Rlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgREZBUnVubmVyIHtcblxuICAgIGV4cG9ydCBjbGFzcyBERkEge1xuICAgICAgICBwcml2YXRlIF9zdGF0ZXM6IFN0YXRlW10gICAgICAgID0gW107XG4gICAgICAgIHByaXZhdGUgX2FscGhhYmV0OiBzdHJpbmdbXSAgICAgPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBfc3RhcnRTdGF0ZTogU3RhdGUgICAgICA9IG51bGw7XG4gICAgICAgIHByaXZhdGUgX2FjY2VwdFN0YXRlczogU3RhdGVbXSAgPSBbXTtcblxuICAgICAgICBzdGF0aWMgY3JlYXRlTWFjaGluZShqc29uOiBERkFGcm9tSlNPTik6IERGQSB7XG4gICAgICAgICAgICB2YXIgZW1pdFJlc3VsdCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRmYSA9IG5ldyBERkEoKTtcblxuICAgICAgICAgICAgLy8gQWRkIHN0YXRlc1xuICAgICAgICAgICAgaWYgKGpzb24uc3RhdGVzICYmIEFycmF5LmlzQXJyYXkoanNvbi5zdGF0ZXMpKSB7XG4gICAgICAgICAgICAgICAganNvbi5zdGF0ZXMuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGVJZDogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGRmYS5zdGF0ZXMucHVzaChuZXcgU3RhdGUoc3RhdGVJZCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGVtaXRSZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGQgYWxwaGFiZXRcbiAgICAgICAgICAgIGlmIChqc29uLmFscGhhYmV0ICYmIEFycmF5LmlzQXJyYXkoanNvbi5hbHBoYWJldCkpIHtcbiAgICAgICAgICAgICAgICBqc29uLmFscGhhYmV0LmZvckVhY2goZnVuY3Rpb24gKGNoYXJhY3Rlcjogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGRmYS5hbHBoYWJldC5wdXNoKGNoYXJhY3Rlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgZW1pdFJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFkZCB0cmFuc2l0aW9uc1xuICAgICAgICAgICAgaWYgKGpzb24udHJhbnNpdGlvbnMgJiYgQXJyYXkuaXNBcnJheShqc29uLnRyYW5zaXRpb25zKSkge1xuICAgICAgICAgICAgICAgIGpzb24udHJhbnNpdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRyYW5zaXRpb24uc291cmNlID09PSAnc3RyaW5nJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHRyYW5zaXRpb24uaW5wdXQgPT09ICdzdHJpbmcnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdHJhbnNpdGlvbi5kZXN0aW5hdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2VTdGF0ZSA9IGRmYS5nZXRTdGF0ZUJ5SWQodHJhbnNpdGlvbi5zb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlc3RpbmF0aW9uU3RhdGUgPSBkZmEuZ2V0U3RhdGVCeUlkKHRyYW5zaXRpb24uZGVzdGluYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlU3RhdGUgIT09IG51bGwgJiYgZGVzdGluYXRpb25TdGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVN0YXRlLnRyYW5zaXRpb25zLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBUcmFuc2l0aW9uKHRyYW5zaXRpb24uaW5wdXQsIGRlc3RpbmF0aW9uU3RhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZXQgc3RhcnQgc3RhdGVcbiAgICAgICAgICAgIGlmIChqc29uLnN0YXJ0U3RhdGUgJiYgdHlwZW9mIGpzb24uc3RhcnRTdGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRTdGF0ZSA9IGRmYS5nZXRTdGF0ZUJ5SWQoanNvbi5zdGFydFN0YXRlKTtcblxuICAgICAgICAgICAgICAgIGlmIChzdGFydFN0YXRlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGRmYS5zdGFydFN0YXRlID0gc3RhcnRTdGF0ZTtcblxuICAgICAgICAgICAgICAgICAgICBlbWl0UmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBEZWZhdWx0IHRvIGZpcnN0IHN0YXRlLCBpZiBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRmYS5zdGF0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGZhLnN0YXJ0U3RhdGUgPSBkZmEuc3RhdGVzWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBlbWl0UmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRGVmYXVsdCB0byBmaXJzdCBzdGF0ZSwgaWYgYXZhaWxhYmxlXG4gICAgICAgICAgICAgICAgaWYgKGRmYS5zdGF0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBkZmEuc3RhcnRTdGF0ZSA9IGRmYS5zdGF0ZXNbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgZW1pdFJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGQgYWNjZXB0IHN0YXRlcywgY3JlYXRpbmcgbmV3IHN0YXRlcyBpZiBuZWNlc3NhcnlcbiAgICAgICAgICAgIGlmIChqc29uLmFjY2VwdFN0YXRlcyAmJiBBcnJheS5pc0FycmF5KGpzb24uYWNjZXB0U3RhdGVzKSkge1xuICAgICAgICAgICAgICAgIGpzb24uYWNjZXB0U3RhdGVzLmZvckVhY2goZnVuY3Rpb24gKGFjY2VwdFN0YXRlSWQ6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWNjZXB0U3RhdGUgPSBkZmEuZ2V0U3RhdGVCeUlkKGFjY2VwdFN0YXRlSWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY2NlcHRTdGF0ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXB0U3RhdGUgPSBuZXcgU3RhdGUoYWNjZXB0U3RhdGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZmEuc3RhdGVzLnB1c2goYWNjZXB0U3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZGZhLmFjY2VwdFN0YXRlcy5wdXNoKGFjY2VwdFN0YXRlKTtcblxuICAgICAgICAgICAgICAgICAgICBlbWl0UmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVtaXRSZXN1bHQpIHJldHVybiBkZmE7XG5cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIHZhbGlkYXRlKGRmYTogREZBKTogYm9vbGVhbiB7XG4gICAgICAgICAgICAvLyBUT0RPOiBWYWxpZGF0ZSBhIERGQVxuXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgc3RhdGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBhbHBoYWJldCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbHBoYWJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBzdGFydFN0YXRlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0U3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgc3RhcnRTdGF0ZShzdGFydFN0YXRlOiBTdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRTdGF0ZSA9IHN0YXJ0U3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgYWNjZXB0U3RhdGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjY2VwdFN0YXRlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGVxdWFscyhvdGhlcjogREZBKTogYm9vbGVhbjtcbiAgICAgICAgZXF1YWxzKG90aGVyOiBERkFGcm9tSlNPTik6IGJvb2xlYW47XG4gICAgICAgIGVxdWFscyhvdGhlcjogYW55KTogYm9vbGVhbiB7XG4gICAgICAgICAgICBpZiAoIW90aGVyKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIERGQSkge1xuICAgICAgICAgICAgICAgIG90aGVyID0gb3RoZXIudG9KU09OKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghb3RoZXIuc3RhdGVzKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAoIW90aGVyLmFscGhhYmV0KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAoIW90aGVyLnRyYW5zaXRpb25zKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAoKCFvdGhlci5zdGFydFN0YXRlIHx8IG90aGVyLnN0YXJ0U3RhdGUgPT09IFwiXCIpICYmIHRoaXMuX3N0YXJ0U3RhdGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmIChvdGhlci5zdGFydFN0YXRlICYmIHRoaXMuX3N0YXJ0U3RhdGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmIChvdGhlci5zdGFydFN0YXRlICYmIHRoaXMuX3N0YXJ0U3RhdGUuaWQgIT09IG90aGVyLnN0YXJ0U3RhdGUpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmICghb3RoZXIuYWNjZXB0U3RhdGVzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBzdGF0ZXMgYW5kIHRyYW5zaXRpb25zXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3N0YXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIHRoYXQgdGhlIHN0YXRlIGV4aXN0cyBpbiBvdGhlclxuICAgICAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdiA9IDA7IHYgPCBvdGhlci5zdGF0ZXMubGVuZ3RoOyB2KyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlc1tpXS5pZCA9PT0gb3RoZXIuc3RhdGVzW3ZdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgbWF0Y2hpbmcgdHJhbnNpdGlvbnNcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IHRoaXMuX3N0YXRlc1tpXS50cmFuc2l0aW9ucy5sZW5ndGg7IHYrKykge1xuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB1ID0gMDsgdSA8IG90aGVyLnRyYW5zaXRpb25zLmxlbmd0aDsgdSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNpdGlvbiA9IHRoaXMuX3N0YXRlc1tpXS50cmFuc2l0aW9uc1t2XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvdGhlclRyYW5zaXRpb246IFRyYW5zaXRpb25Gcm9tSlNPTiA9IG90aGVyLnRyYW5zaXRpb25zW3VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVyVHJhbnNpdGlvbi5zb3VyY2UgPT09IHRoaXMuX3N0YXRlc1tpXS5pZCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyVHJhbnNpdGlvbi5pbnB1dCA9PT0gdHJhbnNpdGlvbi5pbnB1dCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyVHJhbnNpdGlvbi5kZXN0aW5hdGlvbiA9PT0gdHJhbnNpdGlvbi5kZXN0aW5hdGlvbi5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGFscGhhYmV0XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2FscGhhYmV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IG90aGVyLmFscGhhYmV0Lmxlbmd0aDsgdisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hbHBoYWJldFtpXSA9PT0gb3RoZXIuYWxwaGFiZXRbdl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFmb3VuZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDaGVjayBhY2NlcHQgc3RhdGVzXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2FscGhhYmV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IG90aGVyLmFscGhhYmV0Lmxlbmd0aDsgdisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hbHBoYWJldFtpXSA9PT0gb3RoZXIuYWxwaGFiZXRbdl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRTdGF0ZUJ5SWQoaWQ6IHN0cmluZyk6IFN0YXRlIHtcbiAgICAgICAgICAgIGlmIChpZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc3RhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zdGF0ZXNbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTdGF0ZSBub3QgZm91bmRcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyaW5nSW5BbHBoYWJldCh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9hbHBoYWJldC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hbHBoYWJldFtpXSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGVJc0FjY2VwdFN0YXRlKHN0YXRlOiBTdGF0ZSk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9hY2NlcHRTdGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYWNjZXB0U3RhdGVzW2ldLmlkID09PSBzdGF0ZS5pZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvSlNPTigpOiBERkFGcm9tSlNPTiB7XG4gICAgICAgICAgICB2YXIgc3RhdGVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgdmFyIGFscGhhYmV0OiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgdmFyIHRyYW5zaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgc291cmNlOiBzdHJpbmdcbiAgICAgICAgICAgICAgICBpbnB1dDogc3RyaW5nXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb246IHN0cmluZ1xuICAgICAgICAgICAgfVtdID0gW107XG4gICAgICAgICAgICB2YXIgYWNjZXB0U3RhdGVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZXMuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGU6IFN0YXRlKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVzLnB1c2goc3RhdGUuaWQpO1xuXG4gICAgICAgICAgICAgICAgc3RhdGUudHJhbnNpdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAodHJhbnNpdGlvbjogVHJhbnNpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogc3RhdGUuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dDogdHJhbnNpdGlvbi5pbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiB0cmFuc2l0aW9uLmRlc3RpbmF0aW9uLmlkXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2FscGhhYmV0LmZvckVhY2goZnVuY3Rpb24gKHN0cjogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgYWxwaGFiZXQucHVzaChzdHIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2FjY2VwdFN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChzdGF0ZTogU3RhdGUpIHtcbiAgICAgICAgICAgICAgICBhY2NlcHRTdGF0ZXMucHVzaChzdGF0ZS5pZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0ZXM6IHN0YXRlcyxcbiAgICAgICAgICAgICAgICBhbHBoYWJldDogYWxwaGFiZXQsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbnM6IHRyYW5zaXRpb25zLFxuICAgICAgICAgICAgICAgIHN0YXJ0U3RhdGU6IHRoaXMuX3N0YXJ0U3RhdGUgPyB0aGlzLl9zdGFydFN0YXRlLmlkIDogXCJcIixcbiAgICAgICAgICAgICAgICBhY2NlcHRTdGF0ZXM6IGFjY2VwdFN0YXRlc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRlc3RTdHJpbmcoc3RyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdGFydFN0YXRlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVhZFN0cmluZyhzdHIsIHRoaXMuX3N0YXJ0U3RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVhZFN0cmluZyhzdHI6IHN0cmluZywgY3VycmVudFN0YXRlOiBTdGF0ZSk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgaWYgKHN0ciA9PT0gXCJcIiAmJiBjdXJyZW50U3RhdGUuaXNBY2NlcHRTdGF0ZSh0aGlzLl9hY2NlcHRTdGF0ZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0ciA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGlucHV0ID0gXCJcIixcbiAgICAgICAgICAgICAgICBuZXh0U3RhdGU6IFN0YXRlID0gbnVsbDtcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbmV4dCBzdGF0ZSBnaXZlbiBjdXJyZW50IGFscGhhYmV0XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2FscGhhYmV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSB0aGlzLl9hbHBoYWJldFtpXTtcbiAgICAgICAgICAgICAgICBpZiAoc3RyLmluZGV4T2YoaW5wdXQpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IGN1cnJlbnRTdGF0ZS50cmFuc2l0aW9uKGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobmV4dFN0YXRlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJJbnB1dDogXCIgKyBpbnB1dCArIFwiICAgUmVzdDogXCIgKyBzdHIuc2xpY2UoaW5wdXQubGVuZ3RoKSk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKG5leHRTdGF0ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWFkU3RyaW5nKHN0ci5zbGljZShpbnB1dC5sZW5ndGgpLCBuZXh0U3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIERGQVJ1bm5lciB7XG5cbiAgICBleHBvcnQgY2xhc3MgQXBwbGljYXRpb24ge1xuICAgICAgICBwcml2YXRlIF90YWJzOiBUYWJzO1xuICAgICAgICBwcml2YXRlIF9leGFtcGxlczogRXhhbXBsZXM7XG4gICAgICAgIHByaXZhdGUgX2Vycm9yOiBFcnJvck1lc3NhZ2U7XG4gICAgICAgIHByaXZhdGUgX2pzb246IEpTT05FbnRyeTtcbiAgICAgICAgcHJpdmF0ZSBfZGVzaWduZXI6IERlc2lnbmVyO1xuICAgICAgICBwcml2YXRlIF90ZXN0ZXI6IFRlc3RlcjtcblxuICAgICAgICBwcml2YXRlIF9kZWJ1Z01vZGU6IGJvb2xlYW47XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICAkKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl90YWJzID0gbmV3IFRhYnMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9leGFtcGxlcyA9IG5ldyBFeGFtcGxlcygpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yID0gbmV3IEVycm9yTWVzc2FnZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2pzb24gPSBuZXcgSlNPTkVudHJ5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVzaWduZXIgPSBuZXcgRGVzaWduZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl90ZXN0ZXIgPSBuZXcgVGVzdGVyKCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9kZWJ1Z01vZGUgPSBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHNlcnZpY2VzLmRmYSA9IG5ldyBERkEoKTtcbiAgICAgICAgICAgICAgICBzZXJ2aWNlcy5ldmVudHMudHJpZ2dlcignZGZhQ2hhbmdlZCcpO1xuXG4gICAgICAgICAgICAgICAgJCgnI2pzb24nKS5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBlcnJvcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9lcnJvcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCB0YWJzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RhYnM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQganNvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9qc29uO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGRlc2lnbmVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Rlc2lnbmVyO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGRlYnVnTW9kZSgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZWJ1Z01vZGU7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgZGVidWdNb2RlKGRlYnVnTW9kZTogYm9vbGVhbikge1xuICAgICAgICAgICAgdGhpcy5fZGVidWdNb2RlID0gZGVidWdNb2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgZGVidWcoKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z01vZGUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiXG52YXIgc2VydmljZXM6IHtcbiAgICBldmVudHM6IERGQVJ1bm5lci5CcmlkZ2U7XG4gICAgZXhhbXBsZXM6IERGQVJ1bm5lci5ERkFGcm9tSlNPTltdO1xuICAgIGRmYTogREZBUnVubmVyLkRGQTtcbn0gPSB7XG4gICAgZXZlbnRzOiBuZXcgREZBUnVubmVyLkJyaWRnZSgpLFxuICAgIGV4YW1wbGVzOiBbXSxcbiAgICBkZmE6IG51bGxcbn07XG5cbiQuZm4uaGFzQXR0ciA9IGZ1bmN0aW9uKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHZhciBhdHRyID0gdGhpcy5hdHRyKG5hbWUpO1xuICAgIHJldHVybiBhdHRyICE9PSB1bmRlZmluZWQgJiYgYXR0ciAhPT0gZmFsc2U7XG4gICAgLy9yZXR1cm4gdGhpcy5hdHRyKG5hbWUpICE9PSB1bmRlZmluZWQ7XG59O1xuXG52YXIgYXBwID0gbmV3IERGQVJ1bm5lci5BcHBsaWNhdGlvbigpO1xuXG5hcHAuZGVidWcoKTtcbiIsIi8vIEFkZCBleGFtcGxlcyB0byBleGFtcGxlcyBzZXJ2aWNlXG5cbnNlcnZpY2VzLmV4YW1wbGVzLnB1c2goe1xuICAgIG5hbWU6IFwie3cgfCB3IGlzIHRoZSBlbXB0eSBzdHJpbmcgb3IgZW5kcyBpbiBhIDB9XCIsXG4gICAgc3RhdGVzOiBbXCJxMVwiLCBcInEyXCJdLFxuICAgIGFscGhhYmV0OiBbXCIwXCIsIFwiMVwiXSxcbiAgICB0cmFuc2l0aW9uczogW1xuICAgICAgICB7IHNvdXJjZTogXCJxMVwiLCBpbnB1dDogXCIwXCIsIGRlc3RpbmF0aW9uOiBcInExXCIgfSxcbiAgICAgICAgeyBzb3VyY2U6IFwicTFcIiwgaW5wdXQ6IFwiMVwiLCBkZXN0aW5hdGlvbjogXCJxMlwiIH0sXG4gICAgICAgIHsgc291cmNlOiBcInEyXCIsIGlucHV0OiBcIjFcIiwgZGVzdGluYXRpb246IFwicTJcIiB9LFxuICAgICAgICB7IHNvdXJjZTogXCJxMlwiLCBpbnB1dDogXCIwXCIsIGRlc3RpbmF0aW9uOiBcInExXCIgfVxuICAgIF0sXG4gICAgXCJzdGFydFN0YXRlXCI6IFwicTFcIixcbiAgICBcImFjY2VwdFN0YXRlc1wiOiBbXCJxMVwiXVxufSk7XG5cbnNlcnZpY2VzLmV4YW1wbGVzLnB1c2goe1xuICAgIG5hbWU6IFwie3cgfCB3IGhhcyBleGFjdGx5IHR3byBhJ3N9XCIsXG4gICAgc3RhdGVzOiBbXCJxMVwiLCBcInEyXCIsIFwicTNcIiwgXCJxNFwiXSxcbiAgICBhbHBoYWJldDogW1wiYVwiLCBcImJcIl0sXG4gICAgdHJhbnNpdGlvbnM6IFtcbiAgICAgICAgeyBzb3VyY2U6IFwicTFcIiwgaW5wdXQ6IFwiYlwiLCBkZXN0aW5hdGlvbjogXCJxMVwiIH0sXG4gICAgICAgIHsgc291cmNlOiBcInExXCIsIGlucHV0OiBcImFcIiwgZGVzdGluYXRpb246IFwicTJcIiB9LFxuICAgICAgICB7IHNvdXJjZTogXCJxMlwiLCBpbnB1dDogXCJiXCIsIGRlc3RpbmF0aW9uOiBcInEyXCIgfSxcbiAgICAgICAgeyBzb3VyY2U6IFwicTJcIiwgaW5wdXQ6IFwiYVwiLCBkZXN0aW5hdGlvbjogXCJxM1wiIH0sXG4gICAgICAgIHsgc291cmNlOiBcInEzXCIsIGlucHV0OiBcImJcIiwgZGVzdGluYXRpb246IFwicTNcIiB9LFxuICAgICAgICB7IHNvdXJjZTogXCJxM1wiLCBpbnB1dDogXCJhXCIsIGRlc3RpbmF0aW9uOiBcInE0XCIgfSxcbiAgICAgICAgeyBzb3VyY2U6IFwicTRcIiwgaW5wdXQ6IFwiYVwiLCBkZXN0aW5hdGlvbjogXCJxNFwiIH0sXG4gICAgICAgIHsgc291cmNlOiBcInE0XCIsIGlucHV0OiBcImJcIiwgZGVzdGluYXRpb246IFwicTRcIiB9XG4gICAgXSxcbiAgICBcInN0YXJ0U3RhdGVcIjogXCJxMVwiLFxuICAgIFwiYWNjZXB0U3RhdGVzXCI6IFtcInEzXCJdXG59KTtcblxuc2VydmljZXMuZXhhbXBsZXMucHVzaCh7XG4gICAgbmFtZTogXCJhKmIoYXxiKSpcXHR7dyB8IHcgaGFzIGF0IGxlYXN0IG9uZSBifVwiLFxuICAgIHN0YXRlczogW1wicTFcIiwgXCJxMlwiXSxcbiAgICBhbHBoYWJldDogW1wiYVwiLCBcImJcIl0sXG4gICAgdHJhbnNpdGlvbnM6IFtcbiAgICAgICAgeyBzb3VyY2U6IFwicTFcIiwgaW5wdXQ6IFwiYVwiLCBkZXN0aW5hdGlvbjogXCJxMVwiIH0sXG4gICAgICAgIHsgc291cmNlOiBcInExXCIsIGlucHV0OiBcImJcIiwgZGVzdGluYXRpb246IFwicTJcIiB9LFxuICAgICAgICB7IHNvdXJjZTogXCJxMlwiLCBpbnB1dDogXCJhXCIsIGRlc3RpbmF0aW9uOiBcInEyXCIgfSxcbiAgICAgICAgeyBzb3VyY2U6IFwicTJcIiwgaW5wdXQ6IFwiYlwiLCBkZXN0aW5hdGlvbjogXCJxMlwiIH1cbiAgICBdLFxuICAgIFwic3RhcnRTdGF0ZVwiOiBcInExXCIsXG4gICAgXCJhY2NlcHRTdGF0ZXNcIjogW1wicTJcIl1cbn0pO1xuXG5zZXJ2aWNlcy5leGFtcGxlcy5wdXNoKHtcbiAgICBcIm5hbWVcIjogXCJ7dyB8IHcgPSBcXFwib29tcGEgbG9vbXBhXFxcIn1cIixcbiAgICBcInN0YXRlc1wiOiBbIFwicTFcIiwgXCJxMlwiLCBcInEzXCIsIFwicTRcIiwgXCJxNVwiIF0sXG4gICAgXCJhbHBoYWJldFwiOiBbXCJvb21wYVwiLCBcImxvb21wYVwiLCBcIiBcIl0sXG4gICAgXCJ0cmFuc2l0aW9uc1wiOiBbXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMVwiLCBcImlucHV0XCI6IFwib29tcGFcIiwgICAgIFwiZGVzdGluYXRpb25cIjogXCJxMlwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMVwiLCBcImlucHV0XCI6IFwibG9vbXBhXCIsICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMVwiLCBcImlucHV0XCI6IFwiIFwiLCAgICAgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMlwiLCBcImlucHV0XCI6IFwib29tcGFcIiwgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMlwiLCBcImlucHV0XCI6IFwibG9vbXBhXCIsICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMlwiLCBcImlucHV0XCI6IFwiIFwiLCAgICAgICAgIFwiZGVzdGluYXRpb25cIjogXCJxM1wiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxM1wiLCBcImlucHV0XCI6IFwib29tcGFcIiwgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxM1wiLCBcImlucHV0XCI6IFwibG9vbXBhXCIsICAgIFwiZGVzdGluYXRpb25cIjogXCJxNFwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxM1wiLCBcImlucHV0XCI6IFwiIFwiLCAgICAgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxNFwiLCBcImlucHV0XCI6IFwib29tcGFcIiwgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxNFwiLCBcImlucHV0XCI6IFwibG9vbXBhXCIsICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxNFwiLCBcImlucHV0XCI6IFwiIFwiLCAgICAgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxNVwiLCBcImlucHV0XCI6IFwib29tcGFcIiwgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxNVwiLCBcImlucHV0XCI6IFwibG9vbXBhXCIsICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxNVwiLCBcImlucHV0XCI6IFwiIFwiLCAgICAgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH1cbiAgICBdLFxuICAgIFwic3RhcnRTdGF0ZVwiOiBcInExXCIsXG4gICAgXCJhY2NlcHRTdGF0ZXNcIjogW1wicTRcIl1cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
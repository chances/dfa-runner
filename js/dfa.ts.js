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
    var FormComponent = (function (_super) {
        __extends(FormComponent, _super);
        function FormComponent(element) {
            var _this = this;
            _super.call(this, element);
            this._marshall = null;
            this.e.submit(function (event) {
                _this._events.trigger('submit', event, _this);
            });
        }
        Object.defineProperty(FormComponent, "NumberMarshaller", {
            get: function () {
                return function (value) {
                    return parseInt(value, 10);
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormComponent, "BooleanMarshaller", {
            get: function () {
                return function (value) {
                    return value !== "" && value !== "false" && value !== "n" && value !== "no";
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormComponent, "StringMarshaller", {
            get: function () {
                return function (value) {
                    return value.toString();
                };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FormComponent.prototype, "marshaller", {
            set: function (marshaller) {
                this._marshall = marshaller;
            },
            enumerable: true,
            configurable: true
        });
        FormComponent.prototype.submit = function (callback) {
            var _this = this;
            this.addEventListener('submit', function (event) {
                var value = null;
                if (_this._marshall !== null) {
                    value = _this._marshall(value);
                }
                callback.call(_this, event, value);
            });
            return this;
        };
        return FormComponent;
    })(DFARunner.Component);
    DFARunner.FormComponent = FormComponent;
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
                _this.update();
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
                    this.updateDfa(value);
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
        Object.defineProperty(JSONEntry.prototype, "valueFromUpload", {
            set: function (value) {
                try {
                    this._error.hide();
                    this.updateDfa(value, false);
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
        JSONEntry.prototype.update = function () {
            try {
                this._error.hide();
                this._modified.hide();
                this.updateDfa(this._codeMirror.getDoc().getValue());
            }
            catch (e) {
                services.dfa = null;
                this._events.trigger('error');
                this._error.show();
                this._modified.show();
                //app.error.show();
                if (app.debugMode)
                    throw e;
            }
        };
        JSONEntry.prototype.updateDfa = function (valueAsJSON, createTemplate) {
            if (createTemplate === void 0) { createTemplate = true; }
            var json = JSON.parse(valueAsJSON);
            var dfa = DFARunner.DFA.createMachine(json);
            var dfaIsDifferent = null;
            if (app.debugMode) {
                console.log('"old" DFA: ', services.dfa);
                console.log('"new" DFA: ', dfa);
            }
            if (services.dfa !== null) {
                dfaIsDifferent = !services.dfa.equals(dfa);
                if (!dfaIsDifferent) {
                    if (app.debugMode)
                        console.log("DFA is the same, no changes");
                }
                if (app.debugMode && dfaIsDifferent) {
                    console.log('DFA is different, changes found');
                }
            }
            else {
                dfaIsDifferent = !(dfa === null);
                if (createTemplate) {
                    // Create an empty DFA template
                    dfa = new DFARunner.DFA();
                }
            }
            if (dfaIsDifferent) {
                services.dfa = dfa;
                services.events.trigger('dfaChanged');
            }
        };
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

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var DFARunner;
(function (DFARunner) {
    var Upload = (function (_super) {
        __extends(Upload, _super);
        function Upload() {
            var _this = this;
            _super.call(this, '#upload');
            this._fileInput = new DFARunner.Component(this.e.find('input[type=file]').get(0));
            this._fileInput.e.change(function () {
                var fileInput = _this._fileInput.e.get(0), files = fileInput.files, reader = new FileReader();
                if (files.length > 0) {
                    // If there is a file, read it as text
                    reader.readAsText(files[0]);
                }
                reader.onload = function () {
                    var fileContents = reader.result;
                    _this._events.trigger('upload', fileContents, _this);
                };
            });
            // Add submit handler to upload file
            _super.prototype.submit.call(this, function (event) {
                event.preventDefault();
                _this._fileInput.e.val('');
                _this._fileInput.e.click();
            });
        }
        Upload.prototype.upload = function (callback) {
            this.addEventListener('upload', function (value) {
                callback(value);
            });
            return this;
        };
        return Upload;
    })(DFARunner.FormComponent);
    DFARunner.Upload = Upload;
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
            for (var i = 0; i < dfa.states.length; i++) {
                for (var j = 0; j < dfa.alphabet.length; j++) {
                    if (dfa.states[i].transition(dfa.alphabet[j]) === null) {
                        return false;
                    }
                }
            }
            return true;
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
                _this._upload = new DFARunner.Upload();
                _this._debugMode = false;
                _this._upload.upload(function (json) {
                    _this._json.valueFromUpload = json;
                });
                services.events.on('dfaChanged', function () {
                    _this.dfaChanged();
                });
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
        Application.prototype.dfaChanged = function () {
            if (services.dfa !== null) {
                if (DFARunner.DFA.validate(services.dfa)) {
                    // DFA is valid
                    this._error.hide();
                }
                else {
                    // DFA is invalid
                    this._error.show();
                }
            }
            else {
                this._error.hide();
            }
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
    "name": "{w | w = \"foobar\"}",
    "states": ["q1", "q2", "q3"],
    "alphabet": ["foo", "bar"],
    "transitions": [
        { "source": "q1", "input": "foo", "destination": "q3" },
        { "source": "q1", "input": "bar", "destination": "q3" },
        { "source": "q2", "input": "foo", "destination": "q3" },
        { "source": "q2", "input": "bar", "destination": "q3" },
        { "source": "q3", "input": "foo", "destination": "q3" },
        { "source": "q3", "input": "bar", "destination": "q2" }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9IZWxwZXJzLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL0JyaWRnZS50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9jb21wb25lbnRzL0NvbXBvbmVudC50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9jb21wb25lbnRzL0Zvcm1Db21wb25lbnQudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9FbmFibGVhYmxlQ29tcG9uZW50LnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvQnV0dG9uQ29tcG9uZW50LnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvSW5wdXRDb21wb25lbnQudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9UZXh0Ym94Q29tcG9uZW50LnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvQ2hlY2tib3hDb21wb25lbnQudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9MaXN0Q29tcG9uZW50LnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvRXJyb3JNZXNzYWdlLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvRXhhbXBsZXMudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9UYWJzLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvU3RhdGVzLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvQWxwaGFiZXQudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9UcmFuc2l0aW9ucy50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9jb21wb25lbnRzL0Rlc2lnbmVyLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvSlNPTkVudHJ5LnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvVGVzdGVyLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvVXBsb2FkLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL1N0YXRlVHJhbnNpdGlvbi50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9ERkEudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvQXBwbGljYXRpb24udHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvbWFpbi50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9leGFtcGxlcy50cyJdLCJuYW1lcyI6WyJERkFSdW5uZXIiLCJERkFSdW5uZXIuSGVscGVycyIsIkRGQVJ1bm5lci5IZWxwZXJzLmRlbGF5IiwiREZBUnVubmVyLkhlbHBlcnMuaW50ZXJ2YWwiLCJERkFSdW5uZXIuSGVscGVycy5yYW5kb21OdW1iZXIiLCJERkFSdW5uZXIuSGVscGVycy5vYmplY3RJc0EiLCJERkFSdW5uZXIuQnJpZGdlIiwiREZBUnVubmVyLkJyaWRnZS5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5CcmlkZ2Uub24iLCJERkFSdW5uZXIuQnJpZGdlLm9mZiIsIkRGQVJ1bm5lci5CcmlkZ2UudHJpZ2dlciIsIkRGQVJ1bm5lci5Db21wb25lbnQiLCJERkFSdW5uZXIuQ29tcG9uZW50LmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkNvbXBvbmVudC5lIiwiREZBUnVubmVyLkNvbXBvbmVudC5pZCIsIkRGQVJ1bm5lci5Db21wb25lbnQuYWRkRXZlbnRMaXN0ZW5lciIsIkRGQVJ1bm5lci5Db21wb25lbnQub24iLCJERkFSdW5uZXIuQ29tcG9uZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIiLCJERkFSdW5uZXIuQ29tcG9uZW50Lm9mZiIsIkRGQVJ1bm5lci5Db21wb25lbnQuZGF0YSIsIkRGQVJ1bm5lci5Db21wb25lbnQuc2hvdyIsIkRGQVJ1bm5lci5Db21wb25lbnQuaGlkZSIsIkRGQVJ1bm5lci5Db21wb25lbnQua2V5dXAiLCJERkFSdW5uZXIuRm9ybUNvbXBvbmVudCIsIkRGQVJ1bm5lci5Gb3JtQ29tcG9uZW50LmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkZvcm1Db21wb25lbnQuTnVtYmVyTWFyc2hhbGxlciIsIkRGQVJ1bm5lci5Gb3JtQ29tcG9uZW50LkJvb2xlYW5NYXJzaGFsbGVyIiwiREZBUnVubmVyLkZvcm1Db21wb25lbnQuU3RyaW5nTWFyc2hhbGxlciIsIkRGQVJ1bm5lci5Gb3JtQ29tcG9uZW50Lm1hcnNoYWxsZXIiLCJERkFSdW5uZXIuRm9ybUNvbXBvbmVudC5zdWJtaXQiLCJERkFSdW5uZXIuRW5hYmxlYWJsZUNvbXBvbmVudCIsIkRGQVJ1bm5lci5FbmFibGVhYmxlQ29tcG9uZW50LmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkVuYWJsZWFibGVDb21wb25lbnQuZW5hYmxlZCIsIkRGQVJ1bm5lci5FbmFibGVhYmxlQ29tcG9uZW50LmVuYWJsZSIsIkRGQVJ1bm5lci5FbmFibGVhYmxlQ29tcG9uZW50LmRpc2FibGUiLCJERkFSdW5uZXIuQnV0dG9uQ29tcG9uZW50IiwiREZBUnVubmVyLkJ1dHRvbkNvbXBvbmVudC5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5CdXR0b25Db21wb25lbnQuY2xpY2siLCJERkFSdW5uZXIuSW5wdXRDb21wb25lbnQiLCJERkFSdW5uZXIuSW5wdXRDb21wb25lbnQuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuSW5wdXRDb21wb25lbnQuTnVtYmVyTWFyc2hhbGxlciIsIkRGQVJ1bm5lci5JbnB1dENvbXBvbmVudC5Cb29sZWFuTWFyc2hhbGxlciIsIkRGQVJ1bm5lci5JbnB1dENvbXBvbmVudC5TdHJpbmdNYXJzaGFsbGVyIiwiREZBUnVubmVyLklucHV0Q29tcG9uZW50Lm1hcnNoYWxsZXIiLCJERkFSdW5uZXIuSW5wdXRDb21wb25lbnQuY2hhbmdlIiwiREZBUnVubmVyLlRleHRib3hDb21wb25lbnQiLCJERkFSdW5uZXIuVGV4dGJveENvbXBvbmVudC5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5UZXh0Ym94Q29tcG9uZW50LnRleHQiLCJERkFSdW5uZXIuVGV4dGJveENvbXBvbmVudC5jaGFuZ2UiLCJERkFSdW5uZXIuVGV4dGJveENvbXBvbmVudC5jaGVja1RleHRDaGFuZ2VkIiwiREZBUnVubmVyLkNoZWNrYm94Q29tcG9uZW50IiwiREZBUnVubmVyLkNoZWNrYm94Q29tcG9uZW50LmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkNoZWNrYm94Q29tcG9uZW50LmNoZWNrZWQiLCJERkFSdW5uZXIuQ2hlY2tib3hDb21wb25lbnQuY2hhbmdlIiwiREZBUnVubmVyLkNoZWNrYm94Q29tcG9uZW50LmNsaWNrZWQiLCJERkFSdW5uZXIuQ2hlY2tib3hDb21wb25lbnQuY2hlY2tlZENoYW5nZWQiLCJERkFSdW5uZXIuTGlzdENvbXBvbmVudCIsIkRGQVJ1bm5lci5MaXN0Q29tcG9uZW50LmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkxpc3RDb21wb25lbnQuTnVsbExpc3RJdGVtIiwiREZBUnVubmVyLkxpc3RDb21wb25lbnQuaXRlbXMiLCJERkFSdW5uZXIuTGlzdENvbXBvbmVudC5zZWxlY3RlZEluZGV4IiwiREZBUnVubmVyLkxpc3RDb21wb25lbnQuc2VsZWN0ZWRJdGVtIiwiREZBUnVubmVyLkxpc3RDb21wb25lbnQuY2hhbmdlIiwiREZBUnVubmVyLkVycm9yTWVzc2FnZSIsIkRGQVJ1bm5lci5FcnJvck1lc3NhZ2UuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuRXhhbXBsZXMiLCJERkFSdW5uZXIuRXhhbXBsZXMuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuRXhhbXBsZXMuZGZhQ2hhbmdlZCIsIkRGQVJ1bm5lci5UYWJzIiwiREZBUnVubmVyLlRhYnMuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuVGFicy5zZWxlY3RlZFRhYiIsIkRGQVJ1bm5lci5UYWJzLmNoYW5nZSIsIkRGQVJ1bm5lci5TdGF0ZXMiLCJERkFSdW5uZXIuU3RhdGVzLmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLlN0YXRlcy5zZWxlY3RlZFN0YXRlIiwiREZBUnVubmVyLlN0YXRlcy5kZmFDaGFuZ2VkIiwiREZBUnVubmVyLlN0YXRlcy5zZWxlY3RlZFN0YXRlQ2hhbmdlZCIsIkRGQVJ1bm5lci5TdGF0ZXMudGV4dENoYW5nZWQiLCJERkFSdW5uZXIuU3RhdGVzLmFkZFN0YXRlIiwiREZBUnVubmVyLlN0YXRlcy5kZWxldGVTdGF0ZSIsIkRGQVJ1bm5lci5TdGF0ZXMucmVjcmVhdGVBY2NlcHRDaGVja2JveCIsIkRGQVJ1bm5lci5TdGF0ZXMuYWNjZXB0VG9nZ2xlZCIsIkRGQVJ1bm5lci5BbHBoYWJldCIsIkRGQVJ1bm5lci5BbHBoYWJldC5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5BbHBoYWJldC5kZmFDaGFuZ2VkIiwiREZBUnVubmVyLkFscGhhYmV0LnNlbGVjdGVkU3RyaW5nQ2hhbmdlZCIsIkRGQVJ1bm5lci5BbHBoYWJldC50ZXh0Q2hhbmdlZCIsIkRGQVJ1bm5lci5BbHBoYWJldC5hZGRTdHJpbmciLCJERkFSdW5uZXIuQWxwaGFiZXQuZGVsZXRlU3RyaW5nIiwiREZBUnVubmVyLlRyYW5zaXRpb25zIiwiREZBUnVubmVyLlRyYW5zaXRpb25zLmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLlRyYW5zaXRpb25zLmNoYW5nZSIsIkRGQVJ1bm5lci5UcmFuc2l0aW9ucy5kZmFDaGFuZ2VkIiwiREZBUnVubmVyLkRlc2lnbmVyIiwiREZBUnVubmVyLkRlc2lnbmVyLmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkpTT05FbnRyeSIsIkRGQVJ1bm5lci5KU09ORW50cnkuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuSlNPTkVudHJ5LnZhbHVlIiwiREZBUnVubmVyLkpTT05FbnRyeS52YWx1ZUZyb21VcGxvYWQiLCJERkFSdW5uZXIuSlNPTkVudHJ5LnZhbHVlQXNKU09OIiwiREZBUnVubmVyLkpTT05FbnRyeS52YWx1ZUZyb21KU09OIiwiREZBUnVubmVyLkpTT05FbnRyeS5lZGl0b3IiLCJERkFSdW5uZXIuSlNPTkVudHJ5LnVwZGF0ZSIsIkRGQVJ1bm5lci5KU09ORW50cnkudXBkYXRlRGZhIiwiREZBUnVubmVyLkpTT05FbnRyeS5kZmFDaGFuZ2VkIiwiREZBUnVubmVyLlRlc3RlciIsIkRGQVJ1bm5lci5UZXN0ZXIuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuVGVzdGVyLnRlc3RTdHJpbmciLCJERkFSdW5uZXIuVXBsb2FkIiwiREZBUnVubmVyLlVwbG9hZC5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5VcGxvYWQudXBsb2FkIiwiREZBUnVubmVyLlN0YXRlIiwiREZBUnVubmVyLlN0YXRlLmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLlN0YXRlLmlkIiwiREZBUnVubmVyLlN0YXRlLnRyYW5zaXRpb25zIiwiREZBUnVubmVyLlN0YXRlLmlzQWNjZXB0U3RhdGUiLCJERkFSdW5uZXIuU3RhdGUudHJhbnNpdGlvbiIsIkRGQVJ1bm5lci5TdGF0ZS5nZXRUcmFuc2l0aW9uQnlJbnB1dCIsIkRGQVJ1bm5lci5UcmFuc2l0aW9uIiwiREZBUnVubmVyLlRyYW5zaXRpb24uY29uc3RydWN0b3IiLCJERkFSdW5uZXIuVHJhbnNpdGlvbi5pbnB1dCIsIkRGQVJ1bm5lci5UcmFuc2l0aW9uLmRlc3RpbmF0aW9uIiwiREZBUnVubmVyLkRGQSIsIkRGQVJ1bm5lci5ERkEuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuREZBLmNyZWF0ZU1hY2hpbmUiLCJERkFSdW5uZXIuREZBLnZhbGlkYXRlIiwiREZBUnVubmVyLkRGQS5zdGF0ZXMiLCJERkFSdW5uZXIuREZBLmFscGhhYmV0IiwiREZBUnVubmVyLkRGQS5zdGFydFN0YXRlIiwiREZBUnVubmVyLkRGQS5hY2NlcHRTdGF0ZXMiLCJERkFSdW5uZXIuREZBLmVxdWFscyIsIkRGQVJ1bm5lci5ERkEuZ2V0U3RhdGVCeUlkIiwiREZBUnVubmVyLkRGQS5zdHJpbmdJbkFscGhhYmV0IiwiREZBUnVubmVyLkRGQS5zdGF0ZUlzQWNjZXB0U3RhdGUiLCJERkFSdW5uZXIuREZBLnRvSlNPTiIsIkRGQVJ1bm5lci5ERkEudGVzdFN0cmluZyIsIkRGQVJ1bm5lci5ERkEuX3JlYWRTdHJpbmciLCJERkFSdW5uZXIuQXBwbGljYXRpb24iLCJERkFSdW5uZXIuQXBwbGljYXRpb24uY29uc3RydWN0b3IiLCJERkFSdW5uZXIuQXBwbGljYXRpb24uZXJyb3IiLCJERkFSdW5uZXIuQXBwbGljYXRpb24udGFicyIsIkRGQVJ1bm5lci5BcHBsaWNhdGlvbi5qc29uIiwiREZBUnVubmVyLkFwcGxpY2F0aW9uLmRlc2lnbmVyIiwiREZBUnVubmVyLkFwcGxpY2F0aW9uLmRlYnVnTW9kZSIsIkRGQVJ1bm5lci5BcHBsaWNhdGlvbi5kZWJ1ZyIsIkRGQVJ1bm5lci5BcHBsaWNhdGlvbi5kZmFDaGFuZ2VkIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFNBQVMsQ0FtQ2Y7QUFuQ0QsV0FBTyxTQUFTO0lBQUNBLElBQUFBLE9BQU9BLENBbUN2QkE7SUFuQ2dCQSxXQUFBQSxPQUFPQSxFQUFDQSxDQUFDQTtRQUV0QkMsU0FBZ0JBLEtBQUtBLENBQUNBLElBQVlBO1lBQzlCQyxJQUFJQSxPQUFPQSxHQUFHQSxVQUFVQSxFQUFFQSxDQUFDQTtZQUMzQkEsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7Z0JBQ2QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLENBQUMsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDVEEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDbkJBLENBQUNBO1FBTmVELGFBQUtBLEdBQUxBLEtBTWZBLENBQUFBO1FBT0RBLEFBQ0FBLDJCQUQyQkE7aUJBQ1hBLFFBQVFBLENBQUNBLElBQWdCQSxFQUFFQSxJQUFZQTtZQUNuREUsSUFBSUEsUUFBUUEsR0FBR0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDOUNBLE1BQU1BLENBQUNBO2dCQUNIQSxVQUFVQSxFQUFFQSxRQUFRQTtnQkFDcEJBLEtBQUtBLEVBQUVBO29CQUFjLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQUMsQ0FBQzthQUN6REEsQ0FBQ0E7UUFDTkEsQ0FBQ0E7UUFOZUYsZ0JBQVFBLEdBQVJBLFFBTWZBLENBQUFBO1FBRURBLFNBQWdCQSxZQUFZQSxDQUFDQSxHQUFXQSxFQUFFQSxHQUFXQTtZQUNqREcsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsQ0FBQ0EsR0FB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QUFHQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtnQkFFL0JBLENBQUNBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hEQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFFNUNBLEtBQUlBLENBQUNBLENBQUNBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLFVBQUNBLEtBQUtBLEVBQUVBLElBQUlBO29CQUMvQkEsSUFBSUEsUUFBUUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBRXBEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTt3QkFDdkNBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLENBQUNBOzRCQUN2QkEsS0FBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7NEJBQ3pCQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTs0QkFDZkEsS0FBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsbUJBQVNBLENBQWNBLElBQUlBLENBQUNBLENBQUNBOzRCQUVyREEsS0FBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxLQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTs0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QUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUV4RUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBVUEsR0FBR0Esd0JBQWNBLENBQUNBLGdCQUFnQkEsQ0FBQ0E7WUFFeERBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLFlBQVlBLEVBQUVBO2dCQUFRQSxLQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTtZQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUUvREEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBQ0EsR0FBV0E7Z0JBQU9BLEtBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDekVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLFVBQUNBLEtBQVlBO2dCQUM3QkEsS0FBS0EsQ0FBQ0EsY0FBY0EsRUFBRUEsQ0FBQ0E7Z0JBRXZCQSxLQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDSEEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBQ0EsS0FBYUE7Z0JBQU9BLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLENBQUNBLENBQUFBO1lBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3JFQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtnQkFBUUEsS0FBSUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0E7WUFBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDN0NBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBO2dCQUFRQSxLQUFJQSxDQUFD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QkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7Z0JBQ3RCQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtnQkFFdEJBLEFBQ0FBLG1CQURtQkE7b0JBQ2ZBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO2dCQUNwQkEsR0FBR0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDcERBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLE9BQU9BLEdBQUdBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO2dCQUNqRUEsQ0FBQ0E7Z0JBQ0RBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUUxQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQ2xEQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtvQkFDaEJBLEFBQ0FBLGVBRGVBO29CQUNmQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFD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Q0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7d0JBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO2dCQUM3QkEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFHREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQzdDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtnQkFDZEEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQzdDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDMUNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO3dCQUNiQSxLQUFLQSxDQUFDQTtvQkFDVkEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQTtvQkFBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDN0JBLENBQUNBO1lBR0RBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUM3Q0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBQ2RBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdB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RSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQVUsYUFBYSxFQUFFLElBQUksRUFBRTtRQUM3RCxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBTSxhQUFhLEVBQUUsSUFBSSxFQUFFO1FBQzdELEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFLLGFBQWEsRUFBRSxJQUFJLEVBQUU7UUFDN0QsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQVUsYUFBYSxFQUFFLElBQUksRUFBRTtRQUM3RCxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBTSxhQUFhLEVBQUUsSUFBSSxFQUFFO1FBQzdELEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFLLGFBQWEsRUFBRSxJQUFJLEVBQUU7UUFDN0QsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQVUsYUFBYSxFQUFFLElBQUksRUFBRTtLQUNoRTtJQUNELFlBQVksRUFBRSxJQUFJO0lBQ2xCLGNBQWMsRUFBRSxDQUFDLElBQUksQ0FBQztDQUN6QixDQUFDLENBQUMiLCJmaWxlIjoiZGZhLnRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIERGQVJ1bm5lci5IZWxwZXJzIHtcblxuICAgIGV4cG9ydCBmdW5jdGlvbiBkZWxheSh0aW1lOiBudW1iZXIpOiBQaW5reVN3ZWFyLlByb21pc2Uge1xuICAgICAgICB2YXIgcHJvbWlzZSA9IHBpbmt5U3dlYXIoKTtcbiAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcHJvbWlzZSh0cnVlKTtcbiAgICAgICAgfSwgdGltZSk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSW50ZXJ2YWwge1xuICAgICAgICBpbnRlcnZhbElkOiBudW1iZXI7XG4gICAgICAgIGNsZWFyOiAoKSA9PiB2b2lkO1xuICAgIH1cblxuICAgIC8vSW50ZXJ2YWwgdXRpbGl0eSBmdW5jdGlvblxuICAgIGV4cG9ydCBmdW5jdGlvbiBpbnRlcnZhbChmdW5jOiAoKSA9PiB2b2lkLCB0aW1lOiBudW1iZXIpOiBJbnRlcnZhbCB7XG4gICAgICAgIHZhciBpbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jLCB0aW1lKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGludGVydmFsSWQ6IGludGVydmFsLFxuICAgICAgICAgICAgY2xlYXI6IGZ1bmN0aW9uICgpIHsgd2luZG93LmNsZWFySW50ZXJ2YWwoaW50ZXJ2YWwpOyB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbU51bWJlcihtaW46IG51bWJlciwgbWF4OiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikpICsgbWluO1xuICAgIH1cblxuICAgIGV4cG9ydCBmdW5jdGlvbiBvYmplY3RJc0Eob2JqZWN0OiBhbnksIHR5cGU6IGFueSkge1xuICAgICAgICBpZiAodHlwZS5oYXNPd25Qcm9wZXJ0eShcInByb3RvdHlwZVwiKSkge1xuICAgICAgICAgICAgcmV0dXJuIG9iamVjdC5jb25zdHJ1Y3Rvci5uYW1lID09PSB0eXBlLnByb3RvdHlwZS5jb25zdHJ1Y3Rvci5uYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIERGQVJ1bm5lciB7XG4gICAgZXhwb3J0IGNsYXNzIEJyaWRnZSB7XG5cbiAgICAgICAgcHJpdmF0ZSBoYW5kbGVyczogQnJpZGdlSGFuZGxlcltdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yICgpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlcnMgPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBBZGQgYW5kIHN1YnNjcmliZSB0byBhbiBldmVudFxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQgVHlwZSBvZiBicmlkZ2UgZXZlbnQgdG8gaGFuZGxlXG4gICAgICAgICAqIEBwYXJhbSBjYWxsYmFjayBIYW5kbGluZyBjYWxsYmFjayBkZWxlZ2F0ZVxuICAgICAgICAgKiBAcmV0dXJuIFVuaXF1ZSBpZCByZXByZXNlbnRpbmcgdGhpcyBldmVudFxuICAgICAgICAgKi9cbiAgICAgICAgb24oZXZlbnQ6IHN0cmluZywgY2FsbGJhY2s6IEJyaWRnZUNhbGxiYWNrPGFueT4pOiBudW1iZXIge1xuICAgICAgICAgICAgTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIHZhciBoYW5kbGVyOiBCcmlkZ2VIYW5kbGVyID0ge1xuICAgICAgICAgICAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgICAgICAgICAgICBpZDogREZBUnVubmVyLkhlbHBlcnMucmFuZG9tTnVtYmVyKDAsIERhdGUubm93KCkpLFxuICAgICAgICAgICAgICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlcnMucHVzaChoYW5kbGVyKTtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVyLmlkO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBhbiBldmVudCBoYW5kbGVyXG4gICAgICAgICAqIEBwYXJhbSBpZCBVbmlxdWUgaWQgcmVwcmVzZW50aW5nIHRoZSBldmVudCB0byByZW1vdmVcbiAgICAgICAgICovXG4gICAgICAgIG9mZihpZDogbnVtYmVyKTogQnJpZGdlO1xuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIGFuIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICogQHBhcmFtIGNhbGxiYWNrIEZ1bmN0aW9uIGNhbGxiYWNrIGFzc2lnbmVkIHRvIHRoZSBldmVudCB0byByZW1vdmVcbiAgICAgICAgICovXG4gICAgICAgIG9mZihjYWxsYmFjazogQnJpZGdlQ2FsbGJhY2s8YW55Pik6IEJyaWRnZTtcbiAgICAgICAgb2ZmKGlkT3JDYWxsYmFjazogYW55KTogQnJpZGdlIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IC0xO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmhhbmRsZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBpZE9yQ2FsbGJhY2sgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmhhbmRsZXJzW2ldLmlkID09PSBpZE9yQ2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFuZGxlcnNbaV0uY2FsbGJhY2sgPT09IGlkT3JDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogRGlzcGF0Y2ggYW4gZXZlbnRcbiAgICAgICAgICogQHBhcmFtIGV2ZW50IFR5cGUgb2YgYnJpZGdlIGV2ZW50IHRvIGRpc3BhdGNoXG4gICAgICAgICAqIEBwYXJhbSBkYXRhIERhdGEgdG8gcGFzcyBhbG9uZyB0byBldmVudCBoYW5kbGVyc1xuICAgICAgICAgKiBAcGFyYW0gY29udGV4dD13aW5kb3cgQ29udGV4dCBpbiB3aGljaCB0byBleGVjdXRlIGhhbmRsaW5nIGNhbGxiYWNrIGRlbGVnYXRlc1xuICAgICAgICAgKi9cbiAgICAgICAgdHJpZ2dlcihldmVudDogc3RyaW5nLCBkYXRhOiBhbnkgPSBudWxsLCBjb250ZXh0OiBhbnkgPSB3aW5kb3cpOiBCcmlkZ2Uge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChoYW5kbGVyOiBCcmlkZ2VIYW5kbGVyKSB7XG4gICAgICAgICAgICAgICAgaWYgKGhhbmRsZXIuZXZlbnQgPT09IGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGxiYWNrLmNhbGwoY29udGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYW5kbGVyLmNhbGxiYWNrLmNhbGwoY29udGV4dCwgZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVjbGFyZSBjbGFzcyBCcmlkZ2VIYW5kbGVyIHtcbiAgICAgICAgZXZlbnQ6IHN0cmluZztcbiAgICAgICAgaWQ6IG51bWJlcjtcbiAgICAgICAgY2FsbGJhY2s6IEJyaWRnZUNhbGxiYWNrPGFueT47XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBCcmlkZ2VDYWxsYmFjazxUPiB7XG4gICAgICAgIChkYXRhPzogVCk6IHZvaWQ7XG4gICAgICAgIChkYXRhPzogYW55KTogdm9pZDtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEV2ZW50QnJpZGdlQ2FsbGJhY2s8VD4ge1xuICAgICAgICAoZXZlbnQ6IEV2ZW50LCBkYXRhPzogVCk6IHZvaWQ7XG4gICAgICAgIChldmVudDogRXZlbnQsIGRhdGE/OiBhbnkpOiB2b2lkO1xuICAgIH1cbn1cbiIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsIm1vZHVsZSBERkFSdW5uZXIge1xuXG4gICAgZXhwb3J0IGNsYXNzIFN0YXRlIHtcbiAgICAgICAgcHJpdmF0ZSBfaWQ6IHN0cmluZztcbiAgICAgICAgcHJpdmF0ZSBfdHJhbnNpdGlvbnM6IFRyYW5zaXRpb25bXTtcblxuICAgICAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCB0cmFuc2l0aW9uczogVHJhbnNpdGlvbltdID0gW10pIHtcbiAgICAgICAgICAgIHRoaXMuX2lkID0gaWQ7XG4gICAgICAgICAgICB0aGlzLl90cmFuc2l0aW9ucyA9IHRyYW5zaXRpb25zO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGlkKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRyYW5zaXRpb25zKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zaXRpb25zO1xuICAgICAgICB9XG5cbiAgICAgICAgaXNBY2NlcHRTdGF0ZShhY2NlcHRTdGF0ZXM6IFN0YXRlW10pOiBib29sZWFuIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWNjZXB0U3RhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lkID09PSBhY2NlcHRTdGF0ZXNbaV0uaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBUaGlzIHN0YXRlIGlzIG5vdCBhbiBhY2NlcHQgc3RhdGVcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyYW5zaXRpb24oaW5wdXQ6IHN0cmluZyk6IFN0YXRlIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fdHJhbnNpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdHJhbnNpdGlvbnNbaV0uaW5wdXQgPT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90cmFuc2l0aW9uc1tpXS5kZXN0aW5hdGlvbjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE5vIHRyYW5zaXRpb24gZm91bmQgZm9yIGdpdmVuIGlucHV0XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFRyYW5zaXRpb25CeUlucHV0KGlucHV0OiBzdHJpbmcpOiBUcmFuc2l0aW9uIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fdHJhbnNpdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdHJhbnNpdGlvbnNbaV0uaW5wdXQgPT09IGlucHV0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90cmFuc2l0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE5vIHRyYW5zaXRpb24gZm91bmQgZm9yIGdpdmVuIGlucHV0XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGV4cG9ydCBjbGFzcyBUcmFuc2l0aW9uIHtcbiAgICAgICAgcHJpdmF0ZSBfaW5wdXQ6IHN0cmluZztcbiAgICAgICAgcHJpdmF0ZSBfZGVzdGluYXRpb246IFN0YXRlO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGNoYXJhY3Rlcjogc3RyaW5nLCBkZXN0aW5hdGlvbjogU3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2lucHV0ID0gY2hhcmFjdGVyO1xuICAgICAgICAgICAgdGhpcy5fZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBpbnB1dCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9pbnB1dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBkZXN0aW5hdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBkZXN0aW5hdGlvbihkZXN0aW5hdGlvbjogU3RhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2Rlc3RpbmF0aW9uID0gZGVzdGluYXRpb247XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgREZBUnVubmVyIHtcblxuICAgIGV4cG9ydCBjbGFzcyBERkEge1xuICAgICAgICBwcml2YXRlIF9zdGF0ZXM6IFN0YXRlW10gICAgICAgID0gW107XG4gICAgICAgIHByaXZhdGUgX2FscGhhYmV0OiBzdHJpbmdbXSAgICAgPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBfc3RhcnRTdGF0ZTogU3RhdGUgICAgICA9IG51bGw7XG4gICAgICAgIHByaXZhdGUgX2FjY2VwdFN0YXRlczogU3RhdGVbXSAgPSBbXTtcblxuICAgICAgICBzdGF0aWMgY3JlYXRlTWFjaGluZShqc29uOiBERkFGcm9tSlNPTik6IERGQSB7XG4gICAgICAgICAgICB2YXIgZW1pdFJlc3VsdCA9IGZhbHNlLFxuICAgICAgICAgICAgICAgIGRmYSA9IG5ldyBERkEoKTtcblxuICAgICAgICAgICAgLy8gQWRkIHN0YXRlc1xuICAgICAgICAgICAgaWYgKGpzb24uc3RhdGVzICYmIEFycmF5LmlzQXJyYXkoanNvbi5zdGF0ZXMpKSB7XG4gICAgICAgICAgICAgICAganNvbi5zdGF0ZXMuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGVJZDogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGRmYS5zdGF0ZXMucHVzaChuZXcgU3RhdGUoc3RhdGVJZCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGVtaXRSZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGQgYWxwaGFiZXRcbiAgICAgICAgICAgIGlmIChqc29uLmFscGhhYmV0ICYmIEFycmF5LmlzQXJyYXkoanNvbi5hbHBoYWJldCkpIHtcbiAgICAgICAgICAgICAgICBqc29uLmFscGhhYmV0LmZvckVhY2goZnVuY3Rpb24gKGNoYXJhY3Rlcjogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIGRmYS5hbHBoYWJldC5wdXNoKGNoYXJhY3Rlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgZW1pdFJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFkZCB0cmFuc2l0aW9uc1xuICAgICAgICAgICAgaWYgKGpzb24udHJhbnNpdGlvbnMgJiYgQXJyYXkuaXNBcnJheShqc29uLnRyYW5zaXRpb25zKSkge1xuICAgICAgICAgICAgICAgIGpzb24udHJhbnNpdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAodHJhbnNpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRyYW5zaXRpb24uc291cmNlID09PSAnc3RyaW5nJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIHRyYW5zaXRpb24uaW5wdXQgPT09ICdzdHJpbmcnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdHJhbnNpdGlvbi5kZXN0aW5hdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2VTdGF0ZSA9IGRmYS5nZXRTdGF0ZUJ5SWQodHJhbnNpdGlvbi5zb3VyY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRlc3RpbmF0aW9uU3RhdGUgPSBkZmEuZ2V0U3RhdGVCeUlkKHRyYW5zaXRpb24uZGVzdGluYXRpb24pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlU3RhdGUgIT09IG51bGwgJiYgZGVzdGluYXRpb25TdGF0ZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZVN0YXRlLnRyYW5zaXRpb25zLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBUcmFuc2l0aW9uKHRyYW5zaXRpb24uaW5wdXQsIGRlc3RpbmF0aW9uU3RhdGUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZXQgc3RhcnQgc3RhdGVcbiAgICAgICAgICAgIGlmIChqc29uLnN0YXJ0U3RhdGUgJiYgdHlwZW9mIGpzb24uc3RhcnRTdGF0ZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RhcnRTdGF0ZSA9IGRmYS5nZXRTdGF0ZUJ5SWQoanNvbi5zdGFydFN0YXRlKTtcblxuICAgICAgICAgICAgICAgIGlmIChzdGFydFN0YXRlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGRmYS5zdGFydFN0YXRlID0gc3RhcnRTdGF0ZTtcblxuICAgICAgICAgICAgICAgICAgICBlbWl0UmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBEZWZhdWx0IHRvIGZpcnN0IHN0YXRlLCBpZiBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRmYS5zdGF0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGZhLnN0YXJ0U3RhdGUgPSBkZmEuc3RhdGVzWzBdO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBlbWl0UmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRGVmYXVsdCB0byBmaXJzdCBzdGF0ZSwgaWYgYXZhaWxhYmxlXG4gICAgICAgICAgICAgICAgaWYgKGRmYS5zdGF0ZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICBkZmEuc3RhcnRTdGF0ZSA9IGRmYS5zdGF0ZXNbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgZW1pdFJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGQgYWNjZXB0IHN0YXRlcywgY3JlYXRpbmcgbmV3IHN0YXRlcyBpZiBuZWNlc3NhcnlcbiAgICAgICAgICAgIGlmIChqc29uLmFjY2VwdFN0YXRlcyAmJiBBcnJheS5pc0FycmF5KGpzb24uYWNjZXB0U3RhdGVzKSkge1xuICAgICAgICAgICAgICAgIGpzb24uYWNjZXB0U3RhdGVzLmZvckVhY2goZnVuY3Rpb24gKGFjY2VwdFN0YXRlSWQ6IHN0cmluZykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYWNjZXB0U3RhdGUgPSBkZmEuZ2V0U3RhdGVCeUlkKGFjY2VwdFN0YXRlSWQpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChhY2NlcHRTdGF0ZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWNjZXB0U3RhdGUgPSBuZXcgU3RhdGUoYWNjZXB0U3RhdGVJZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZmEuc3RhdGVzLnB1c2goYWNjZXB0U3RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgZGZhLmFjY2VwdFN0YXRlcy5wdXNoKGFjY2VwdFN0YXRlKTtcblxuICAgICAgICAgICAgICAgICAgICBlbWl0UmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGVtaXRSZXN1bHQpIHJldHVybiBkZmE7XG5cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGljIHZhbGlkYXRlKGRmYTogREZBKTogYm9vbGVhbiB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRmYS5zdGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRmYS5hbHBoYWJldC5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGZhLnN0YXRlc1tpXS50cmFuc2l0aW9uKGRmYS5hbHBoYWJldFtqXSkgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgc3RhdGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXRlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBhbHBoYWJldCgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9hbHBoYWJldDtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBzdGFydFN0YXRlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0U3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBzZXQgc3RhcnRTdGF0ZShzdGFydFN0YXRlOiBTdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5fc3RhcnRTdGF0ZSA9IHN0YXJ0U3RhdGU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgYWNjZXB0U3RhdGVzKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FjY2VwdFN0YXRlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGVxdWFscyhvdGhlcjogREZBKTogYm9vbGVhbjtcbiAgICAgICAgZXF1YWxzKG90aGVyOiBERkFGcm9tSlNPTik6IGJvb2xlYW47XG4gICAgICAgIGVxdWFscyhvdGhlcjogYW55KTogYm9vbGVhbiB7XG4gICAgICAgICAgICBpZiAoIW90aGVyKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIGlmIChvdGhlciBpbnN0YW5jZW9mIERGQSkge1xuICAgICAgICAgICAgICAgIG90aGVyID0gb3RoZXIudG9KU09OKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghb3RoZXIuc3RhdGVzKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAoIW90aGVyLmFscGhhYmV0KSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAoIW90aGVyLnRyYW5zaXRpb25zKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBpZiAoKCFvdGhlci5zdGFydFN0YXRlIHx8IG90aGVyLnN0YXJ0U3RhdGUgPT09IFwiXCIpICYmIHRoaXMuX3N0YXJ0U3RhdGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmIChvdGhlci5zdGFydFN0YXRlICYmIHRoaXMuX3N0YXJ0U3RhdGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmIChvdGhlci5zdGFydFN0YXRlICYmIHRoaXMuX3N0YXJ0U3RhdGUuaWQgIT09IG90aGVyLnN0YXJ0U3RhdGUpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmICghb3RoZXIuYWNjZXB0U3RhdGVzKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBzdGF0ZXMgYW5kIHRyYW5zaXRpb25zXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX3N0YXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIHRoYXQgdGhlIHN0YXRlIGV4aXN0cyBpbiBvdGhlclxuICAgICAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgdiA9IDA7IHYgPCBvdGhlci5zdGF0ZXMubGVuZ3RoOyB2KyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlc1tpXS5pZCA9PT0gb3RoZXIuc3RhdGVzW3ZdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBmb3IgbWF0Y2hpbmcgdHJhbnNpdGlvbnNcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IHRoaXMuX3N0YXRlc1tpXS50cmFuc2l0aW9ucy5sZW5ndGg7IHYrKykge1xuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB1ID0gMDsgdSA8IG90aGVyLnRyYW5zaXRpb25zLmxlbmd0aDsgdSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJhbnNpdGlvbiA9IHRoaXMuX3N0YXRlc1tpXS50cmFuc2l0aW9uc1t2XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvdGhlclRyYW5zaXRpb246IFRyYW5zaXRpb25Gcm9tSlNPTiA9IG90aGVyLnRyYW5zaXRpb25zW3VdO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVyVHJhbnNpdGlvbi5zb3VyY2UgPT09IHRoaXMuX3N0YXRlc1tpXS5pZCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyVHJhbnNpdGlvbi5pbnB1dCA9PT0gdHJhbnNpdGlvbi5pbnB1dCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyVHJhbnNpdGlvbi5kZXN0aW5hdGlvbiA9PT0gdHJhbnNpdGlvbi5kZXN0aW5hdGlvbi5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGFscGhhYmV0XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2FscGhhYmV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IG90aGVyLmFscGhhYmV0Lmxlbmd0aDsgdisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hbHBoYWJldFtpXSA9PT0gb3RoZXIuYWxwaGFiZXRbdl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFmb3VuZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDaGVjayBhY2NlcHQgc3RhdGVzXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2FscGhhYmV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IG90aGVyLmFscGhhYmV0Lmxlbmd0aDsgdisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hbHBoYWJldFtpXSA9PT0gb3RoZXIuYWxwaGFiZXRbdl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBnZXRTdGF0ZUJ5SWQoaWQ6IHN0cmluZyk6IFN0YXRlIHtcbiAgICAgICAgICAgIGlmIChpZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc3RhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLl9zdGF0ZXNbaV0uaWQgPT09IGlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGVzW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTdGF0ZSBub3QgZm91bmRcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RyaW5nSW5BbHBoYWJldCh2YWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgICAgICAgICB2YXIgZm91bmQgPSBmYWxzZTtcblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9hbHBoYWJldC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hbHBoYWJldFtpXSA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGVJc0FjY2VwdFN0YXRlKHN0YXRlOiBTdGF0ZSk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9hY2NlcHRTdGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fYWNjZXB0U3RhdGVzW2ldLmlkID09PSBzdGF0ZS5pZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRvSlNPTigpOiBERkFGcm9tSlNPTiB7XG4gICAgICAgICAgICB2YXIgc3RhdGVzOiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgdmFyIGFscGhhYmV0OiBzdHJpbmdbXSA9IFtdO1xuICAgICAgICAgICAgdmFyIHRyYW5zaXRpb25zOiB7XG4gICAgICAgICAgICAgICAgc291cmNlOiBzdHJpbmdcbiAgICAgICAgICAgICAgICBpbnB1dDogc3RyaW5nXG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb246IHN0cmluZ1xuICAgICAgICAgICAgfVtdID0gW107XG4gICAgICAgICAgICB2YXIgYWNjZXB0U3RhdGVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgICAgICAgICB0aGlzLl9zdGF0ZXMuZm9yRWFjaChmdW5jdGlvbiAoc3RhdGU6IFN0YXRlKSB7XG4gICAgICAgICAgICAgICAgc3RhdGVzLnB1c2goc3RhdGUuaWQpO1xuXG4gICAgICAgICAgICAgICAgc3RhdGUudHJhbnNpdGlvbnMuZm9yRWFjaChmdW5jdGlvbiAodHJhbnNpdGlvbjogVHJhbnNpdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB0cmFuc2l0aW9ucy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogc3RhdGUuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbnB1dDogdHJhbnNpdGlvbi5pbnB1dCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiB0cmFuc2l0aW9uLmRlc3RpbmF0aW9uLmlkXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2FscGhhYmV0LmZvckVhY2goZnVuY3Rpb24gKHN0cjogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgYWxwaGFiZXQucHVzaChzdHIpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuX2FjY2VwdFN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChzdGF0ZTogU3RhdGUpIHtcbiAgICAgICAgICAgICAgICBhY2NlcHRTdGF0ZXMucHVzaChzdGF0ZS5pZCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBzdGF0ZXM6IHN0YXRlcyxcbiAgICAgICAgICAgICAgICBhbHBoYWJldDogYWxwaGFiZXQsXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbnM6IHRyYW5zaXRpb25zLFxuICAgICAgICAgICAgICAgIHN0YXJ0U3RhdGU6IHRoaXMuX3N0YXJ0U3RhdGUgPyB0aGlzLl9zdGFydFN0YXRlLmlkIDogXCJcIixcbiAgICAgICAgICAgICAgICBhY2NlcHRTdGF0ZXM6IGFjY2VwdFN0YXRlc1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRlc3RTdHJpbmcoc3RyOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9zdGFydFN0YXRlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fcmVhZFN0cmluZyhzdHIsIHRoaXMuX3N0YXJ0U3RhdGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBfcmVhZFN0cmluZyhzdHI6IHN0cmluZywgY3VycmVudFN0YXRlOiBTdGF0ZSk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgaWYgKHN0ciA9PT0gXCJcIiAmJiBjdXJyZW50U3RhdGUuaXNBY2NlcHRTdGF0ZSh0aGlzLl9hY2NlcHRTdGF0ZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0ciA9PT0gXCJcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGlucHV0ID0gXCJcIixcbiAgICAgICAgICAgICAgICBuZXh0U3RhdGU6IFN0YXRlID0gbnVsbDtcbiAgICAgICAgICAgIC8vIEdldCB0aGUgbmV4dCBzdGF0ZSBnaXZlbiBjdXJyZW50IGFscGhhYmV0XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2FscGhhYmV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaW5wdXQgPSB0aGlzLl9hbHBoYWJldFtpXTtcbiAgICAgICAgICAgICAgICBpZiAoc3RyLmluZGV4T2YoaW5wdXQpID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG5leHRTdGF0ZSA9IGN1cnJlbnRTdGF0ZS50cmFuc2l0aW9uKGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobmV4dFN0YXRlID09PSBudWxsKSByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJJbnB1dDogXCIgKyBpbnB1dCArIFwiICAgUmVzdDogXCIgKyBzdHIuc2xpY2UoaW5wdXQubGVuZ3RoKSk7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKG5leHRTdGF0ZSk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWFkU3RyaW5nKHN0ci5zbGljZShpbnB1dC5sZW5ndGgpLCBuZXh0U3RhdGUpO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwibW9kdWxlIERGQVJ1bm5lciB7XG5cbiAgICBleHBvcnQgY2xhc3MgQXBwbGljYXRpb24ge1xuICAgICAgICBwcml2YXRlIF90YWJzOiBUYWJzO1xuICAgICAgICBwcml2YXRlIF9leGFtcGxlczogRXhhbXBsZXM7XG4gICAgICAgIHByaXZhdGUgX2Vycm9yOiBFcnJvck1lc3NhZ2U7XG4gICAgICAgIHByaXZhdGUgX2pzb246IEpTT05FbnRyeTtcbiAgICAgICAgcHJpdmF0ZSBfZGVzaWduZXI6IERlc2lnbmVyO1xuICAgICAgICBwcml2YXRlIF90ZXN0ZXI6IFRlc3RlcjtcbiAgICAgICAgcHJpdmF0ZSBfdXBsb2FkOiBVcGxvYWQ7XG5cbiAgICAgICAgcHJpdmF0ZSBfZGVidWdNb2RlOiBib29sZWFuO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICAgICAgJCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGFicyA9IG5ldyBUYWJzKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXhhbXBsZXMgPSBuZXcgRXhhbXBsZXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvciA9IG5ldyBFcnJvck1lc3NhZ2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9qc29uID0gbmV3IEpTT05FbnRyeSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Rlc2lnbmVyID0gbmV3IERlc2lnbmVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdGVzdGVyID0gbmV3IFRlc3RlcigpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3VwbG9hZCA9IG5ldyBVcGxvYWQoKTtcblxuICAgICAgICAgICAgICAgIHRoaXMuX2RlYnVnTW9kZSA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fdXBsb2FkLnVwbG9hZCgoanNvbjogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2pzb24udmFsdWVGcm9tVXBsb2FkID0ganNvbjtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIHNlcnZpY2VzLmV2ZW50cy5vbignZGZhQ2hhbmdlZCcsICgpID0+IHsgdGhpcy5kZmFDaGFuZ2VkKCk7IH0pO1xuXG4gICAgICAgICAgICAgICAgc2VydmljZXMuZGZhID0gbmV3IERGQSgpO1xuICAgICAgICAgICAgICAgIHNlcnZpY2VzLmV2ZW50cy50cmlnZ2VyKCdkZmFDaGFuZ2VkJyk7XG5cbiAgICAgICAgICAgICAgICAkKCcjanNvbicpLmhpZGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGVycm9yKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Vycm9yO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHRhYnMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdGFicztcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBqc29uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2pzb247XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZGVzaWduZXIoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGVzaWduZXI7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZGVidWdNb2RlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2RlYnVnTW9kZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBkZWJ1Z01vZGUoZGVidWdNb2RlOiBib29sZWFuKSB7XG4gICAgICAgICAgICB0aGlzLl9kZWJ1Z01vZGUgPSBkZWJ1Z01vZGU7XG4gICAgICAgIH1cblxuICAgICAgICBkZWJ1ZygpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnTW9kZSA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGRmYUNoYW5nZWQoKSB7XG4gICAgICAgICAgICBpZiAoc2VydmljZXMuZGZhICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKERGQS52YWxpZGF0ZShzZXJ2aWNlcy5kZmEpKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERGQSBpcyB2YWxpZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gREZBIGlzIGludmFsaWRcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXJyb3Iuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fZXJyb3IuaGlkZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiXG52YXIgc2VydmljZXM6IHtcbiAgICBldmVudHM6IERGQVJ1bm5lci5CcmlkZ2U7XG4gICAgZXhhbXBsZXM6IERGQVJ1bm5lci5ERkFGcm9tSlNPTltdO1xuICAgIGRmYTogREZBUnVubmVyLkRGQTtcbn0gPSB7XG4gICAgZXZlbnRzOiBuZXcgREZBUnVubmVyLkJyaWRnZSgpLFxuICAgIGV4YW1wbGVzOiBbXSxcbiAgICBkZmE6IG51bGxcbn07XG5cbiQuZm4uaGFzQXR0ciA9IGZ1bmN0aW9uKG5hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHZhciBhdHRyID0gdGhpcy5hdHRyKG5hbWUpO1xuICAgIHJldHVybiBhdHRyICE9PSB1bmRlZmluZWQgJiYgYXR0ciAhPT0gZmFsc2U7XG4gICAgLy9yZXR1cm4gdGhpcy5hdHRyKG5hbWUpICE9PSB1bmRlZmluZWQ7XG59O1xuXG52YXIgYXBwID0gbmV3IERGQVJ1bm5lci5BcHBsaWNhdGlvbigpO1xuXG5hcHAuZGVidWcoKTtcbiIsIi8vIEFkZCBleGFtcGxlcyB0byBleGFtcGxlcyBzZXJ2aWNlXG5cbnNlcnZpY2VzLmV4YW1wbGVzLnB1c2goe1xuICAgIG5hbWU6IFwie3cgfCB3IGlzIHRoZSBlbXB0eSBzdHJpbmcgb3IgZW5kcyBpbiBhIDB9XCIsXG4gICAgc3RhdGVzOiBbXCJxMVwiLCBcInEyXCJdLFxuICAgIGFscGhhYmV0OiBbXCIwXCIsIFwiMVwiXSxcbiAgICB0cmFuc2l0aW9uczogW1xuICAgICAgICB7IHNvdXJjZTogXCJxMVwiLCBpbnB1dDogXCIwXCIsIGRlc3RpbmF0aW9uOiBcInExXCIgfSxcbiAgICAgICAgeyBzb3VyY2U6IFwicTFcIiwgaW5wdXQ6IFwiMVwiLCBkZXN0aW5hdGlvbjogXCJxMlwiIH0sXG4gICAgICAgIHsgc291cmNlOiBcInEyXCIsIGlucHV0OiBcIjFcIiwgZGVzdGluYXRpb246IFwicTJcIiB9LFxuICAgICAgICB7IHNvdXJjZTogXCJxMlwiLCBpbnB1dDogXCIwXCIsIGRlc3RpbmF0aW9uOiBcInExXCIgfVxuICAgIF0sXG4gICAgXCJzdGFydFN0YXRlXCI6IFwicTFcIixcbiAgICBcImFjY2VwdFN0YXRlc1wiOiBbXCJxMVwiXVxufSk7XG5cbnNlcnZpY2VzLmV4YW1wbGVzLnB1c2goe1xuICAgIG5hbWU6IFwie3cgfCB3IGhhcyBleGFjdGx5IHR3byBhJ3N9XCIsXG4gICAgc3RhdGVzOiBbXCJxMVwiLCBcInEyXCIsIFwicTNcIiwgXCJxNFwiXSxcbiAgICBhbHBoYWJldDogW1wiYVwiLCBcImJcIl0sXG4gICAgdHJhbnNpdGlvbnM6IFtcbiAgICAgICAgeyBzb3VyY2U6IFwicTFcIiwgaW5wdXQ6IFwiYlwiLCBkZXN0aW5hdGlvbjogXCJxMVwiIH0sXG4gICAgICAgIHsgc291cmNlOiBcInExXCIsIGlucHV0OiBcImFcIiwgZGVzdGluYXRpb246IFwicTJcIiB9LFxuICAgICAgICB7IHNvdXJjZTogXCJxMlwiLCBpbnB1dDogXCJiXCIsIGRlc3RpbmF0aW9uOiBcInEyXCIgfSxcbiAgICAgICAgeyBzb3VyY2U6IFwicTJcIiwgaW5wdXQ6IFwiYVwiLCBkZXN0aW5hdGlvbjogXCJxM1wiIH0sXG4gICAgICAgIHsgc291cmNlOiBcInEzXCIsIGlucHV0OiBcImJcIiwgZGVzdGluYXRpb246IFwicTNcIiB9LFxuICAgICAgICB7IHNvdXJjZTogXCJxM1wiLCBpbnB1dDogXCJhXCIsIGRlc3RpbmF0aW9uOiBcInE0XCIgfSxcbiAgICAgICAgeyBzb3VyY2U6IFwicTRcIiwgaW5wdXQ6IFwiYVwiLCBkZXN0aW5hdGlvbjogXCJxNFwiIH0sXG4gICAgICAgIHsgc291cmNlOiBcInE0XCIsIGlucHV0OiBcImJcIiwgZGVzdGluYXRpb246IFwicTRcIiB9XG4gICAgXSxcbiAgICBcInN0YXJ0U3RhdGVcIjogXCJxMVwiLFxuICAgIFwiYWNjZXB0U3RhdGVzXCI6IFtcInEzXCJdXG59KTtcblxuc2VydmljZXMuZXhhbXBsZXMucHVzaCh7XG4gICAgbmFtZTogXCJhKmIoYXxiKSpcXHR7dyB8IHcgaGFzIGF0IGxlYXN0IG9uZSBifVwiLFxuICAgIHN0YXRlczogW1wicTFcIiwgXCJxMlwiXSxcbiAgICBhbHBoYWJldDogW1wiYVwiLCBcImJcIl0sXG4gICAgdHJhbnNpdGlvbnM6IFtcbiAgICAgICAgeyBzb3VyY2U6IFwicTFcIiwgaW5wdXQ6IFwiYVwiLCBkZXN0aW5hdGlvbjogXCJxMVwiIH0sXG4gICAgICAgIHsgc291cmNlOiBcInExXCIsIGlucHV0OiBcImJcIiwgZGVzdGluYXRpb246IFwicTJcIiB9LFxuICAgICAgICB7IHNvdXJjZTogXCJxMlwiLCBpbnB1dDogXCJhXCIsIGRlc3RpbmF0aW9uOiBcInEyXCIgfSxcbiAgICAgICAgeyBzb3VyY2U6IFwicTJcIiwgaW5wdXQ6IFwiYlwiLCBkZXN0aW5hdGlvbjogXCJxMlwiIH1cbiAgICBdLFxuICAgIFwic3RhcnRTdGF0ZVwiOiBcInExXCIsXG4gICAgXCJhY2NlcHRTdGF0ZXNcIjogW1wicTJcIl1cbn0pO1xuXG5zZXJ2aWNlcy5leGFtcGxlcy5wdXNoKHtcbiAgICBcIm5hbWVcIjogXCJ7dyB8IHcgPSBcXFwiZm9vYmFyXFxcIn1cIixcbiAgICBcInN0YXRlc1wiOiBbXCJxMVwiLCBcInEyXCIsIFwicTNcIl0sXG4gICAgXCJhbHBoYWJldFwiOiBbXCJmb29cIiwgXCJiYXJcIl0sXG4gICAgXCJ0cmFuc2l0aW9uc1wiOiBbXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMVwiLCBcImlucHV0XCI6IFwiZm9vXCIsIFwiZGVzdGluYXRpb25cIjogXCJxM1wiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMVwiLCBcImlucHV0XCI6IFwiYmFyXCIsIFwiZGVzdGluYXRpb25cIjogXCJxM1wiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMlwiLCBcImlucHV0XCI6IFwiZm9vXCIsIFwiZGVzdGluYXRpb25cIjogXCJxM1wiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMlwiLCBcImlucHV0XCI6IFwiYmFyXCIsIFwiZGVzdGluYXRpb25cIjogXCJxM1wiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxM1wiLCBcImlucHV0XCI6IFwiZm9vXCIsIFwiZGVzdGluYXRpb25cIjogXCJxM1wiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxM1wiLCBcImlucHV0XCI6IFwiYmFyXCIsIFwiZGVzdGluYXRpb25cIjogXCJxMlwiIH1cbiAgICBdLFxuICAgIFwic3RhcnRTdGF0ZVwiOiBcInExXCIsXG4gICAgXCJhY2NlcHRTdGF0ZXNcIjogW1wicTJcIl1cbn0pO1xuXG5zZXJ2aWNlcy5leGFtcGxlcy5wdXNoKHtcbiAgICBcIm5hbWVcIjogXCJ7dyB8IHcgPSBcXFwib29tcGEgbG9vbXBhXFxcIn1cIixcbiAgICBcInN0YXRlc1wiOiBbIFwicTFcIiwgXCJxMlwiLCBcInEzXCIsIFwicTRcIiwgXCJxNVwiIF0sXG4gICAgXCJhbHBoYWJldFwiOiBbXCJvb21wYVwiLCBcImxvb21wYVwiLCBcIiBcIl0sXG4gICAgXCJ0cmFuc2l0aW9uc1wiOiBbXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMVwiLCBcImlucHV0XCI6IFwib29tcGFcIiwgICAgIFwiZGVzdGluYXRpb25cIjogXCJxMlwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMVwiLCBcImlucHV0XCI6IFwibG9vbXBhXCIsICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMVwiLCBcImlucHV0XCI6IFwiIFwiLCAgICAgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMlwiLCBcImlucHV0XCI6IFwib29tcGFcIiwgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMlwiLCBcImlucHV0XCI6IFwibG9vbXBhXCIsICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxMlwiLCBcImlucHV0XCI6IFwiIFwiLCAgICAgICAgIFwiZGVzdGluYXRpb25cIjogXCJxM1wiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxM1wiLCBcImlucHV0XCI6IFwib29tcGFcIiwgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxM1wiLCBcImlucHV0XCI6IFwibG9vbXBhXCIsICAgIFwiZGVzdGluYXRpb25cIjogXCJxNFwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxM1wiLCBcImlucHV0XCI6IFwiIFwiLCAgICAgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxNFwiLCBcImlucHV0XCI6IFwib29tcGFcIiwgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxNFwiLCBcImlucHV0XCI6IFwibG9vbXBhXCIsICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxNFwiLCBcImlucHV0XCI6IFwiIFwiLCAgICAgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxNVwiLCBcImlucHV0XCI6IFwib29tcGFcIiwgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxNVwiLCBcImlucHV0XCI6IFwibG9vbXBhXCIsICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH0sXG4gICAgICAgIHsgXCJzb3VyY2VcIjogXCJxNVwiLCBcImlucHV0XCI6IFwiIFwiLCAgICAgICAgIFwiZGVzdGluYXRpb25cIjogXCJxNVwiIH1cbiAgICBdLFxuICAgIFwic3RhcnRTdGF0ZVwiOiBcInExXCIsXG4gICAgXCJhY2NlcHRTdGF0ZXNcIjogW1wicTRcIl1cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
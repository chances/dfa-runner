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
            else {
                // Clear transitions table
                this._thead.e.empty();
                this._tbody.e.empty();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9IZWxwZXJzLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL0JyaWRnZS50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9jb21wb25lbnRzL0NvbXBvbmVudC50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9jb21wb25lbnRzL0Zvcm1Db21wb25lbnQudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9FbmFibGVhYmxlQ29tcG9uZW50LnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvQnV0dG9uQ29tcG9uZW50LnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvSW5wdXRDb21wb25lbnQudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9UZXh0Ym94Q29tcG9uZW50LnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvQ2hlY2tib3hDb21wb25lbnQudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9MaXN0Q29tcG9uZW50LnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvRXJyb3JNZXNzYWdlLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvRXhhbXBsZXMudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9UYWJzLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvU3RhdGVzLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvQWxwaGFiZXQudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvY29tcG9uZW50cy9UcmFuc2l0aW9ucy50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9jb21wb25lbnRzL0Rlc2lnbmVyLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvSlNPTkVudHJ5LnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvVGVzdGVyLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL2NvbXBvbmVudHMvVXBsb2FkLnRzIiwiL1VzZXJzL2NoYW5jZXNub3cvUHJvamVjdHMvSmF2YVNjcmlwdC9ERkEgUnVubmVyL1N0YXRlVHJhbnNpdGlvbi50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9ERkEudHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvQXBwbGljYXRpb24udHMiLCIvVXNlcnMvY2hhbmNlc25vdy9Qcm9qZWN0cy9KYXZhU2NyaXB0L0RGQSBSdW5uZXIvbWFpbi50cyIsIi9Vc2Vycy9jaGFuY2Vzbm93L1Byb2plY3RzL0phdmFTY3JpcHQvREZBIFJ1bm5lci9leGFtcGxlcy50cyJdLCJuYW1lcyI6WyJERkFSdW5uZXIiLCJERkFSdW5uZXIuSGVscGVycyIsIkRGQVJ1bm5lci5IZWxwZXJzLmRlbGF5IiwiREZBUnVubmVyLkhlbHBlcnMuaW50ZXJ2YWwiLCJERkFSdW5uZXIuSGVscGVycy5yYW5kb21OdW1iZXIiLCJERkFSdW5uZXIuSGVscGVycy5vYmplY3RJc0EiLCJERkFSdW5uZXIuQnJpZGdlIiwiREZBUnVubmVyLkJyaWRnZS5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5CcmlkZ2Uub24iLCJERkFSdW5uZXIuQnJpZGdlLm9mZiIsIkRGQVJ1bm5lci5CcmlkZ2UudHJpZ2dlciIsIkRGQVJ1bm5lci5Db21wb25lbnQiLCJERkFSdW5uZXIuQ29tcG9uZW50LmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkNvbXBvbmVudC5lIiwiREZBUnVubmVyLkNvbXBvbmVudC5pZCIsIkRGQVJ1bm5lci5Db21wb25lbnQuYWRkRXZlbnRMaXN0ZW5lciIsIkRGQVJ1bm5lci5Db21wb25lbnQub24iLCJERkFSdW5uZXIuQ29tcG9uZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIiLCJERkFSdW5uZXIuQ29tcG9uZW50Lm9mZiIsIkRGQVJ1bm5lci5Db21wb25lbnQuZGF0YSIsIkRGQVJ1bm5lci5Db21wb25lbnQuc2hvdyIsIkRGQVJ1bm5lci5Db21wb25lbnQuaGlkZSIsIkRGQVJ1bm5lci5Db21wb25lbnQua2V5dXAiLCJERkFSdW5uZXIuRm9ybUNvbXBvbmVudCIsIkRGQVJ1bm5lci5Gb3JtQ29tcG9uZW50LmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkZvcm1Db21wb25lbnQuTnVtYmVyTWFyc2hhbGxlciIsIkRGQVJ1bm5lci5Gb3JtQ29tcG9uZW50LkJvb2xlYW5NYXJzaGFsbGVyIiwiREZBUnVubmVyLkZvcm1Db21wb25lbnQuU3RyaW5nTWFyc2hhbGxlciIsIkRGQVJ1bm5lci5Gb3JtQ29tcG9uZW50Lm1hcnNoYWxsZXIiLCJERkFSdW5uZXIuRm9ybUNvbXBvbmVudC5zdWJtaXQiLCJERkFSdW5uZXIuRW5hYmxlYWJsZUNvbXBvbmVudCIsIkRGQVJ1bm5lci5FbmFibGVhYmxlQ29tcG9uZW50LmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkVuYWJsZWFibGVDb21wb25lbnQuZW5hYmxlZCIsIkRGQVJ1bm5lci5FbmFibGVhYmxlQ29tcG9uZW50LmVuYWJsZSIsIkRGQVJ1bm5lci5FbmFibGVhYmxlQ29tcG9uZW50LmRpc2FibGUiLCJERkFSdW5uZXIuQnV0dG9uQ29tcG9uZW50IiwiREZBUnVubmVyLkJ1dHRvbkNvbXBvbmVudC5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5CdXR0b25Db21wb25lbnQuY2xpY2siLCJERkFSdW5uZXIuSW5wdXRDb21wb25lbnQiLCJERkFSdW5uZXIuSW5wdXRDb21wb25lbnQuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuSW5wdXRDb21wb25lbnQuTnVtYmVyTWFyc2hhbGxlciIsIkRGQVJ1bm5lci5JbnB1dENvbXBvbmVudC5Cb29sZWFuTWFyc2hhbGxlciIsIkRGQVJ1bm5lci5JbnB1dENvbXBvbmVudC5TdHJpbmdNYXJzaGFsbGVyIiwiREZBUnVubmVyLklucHV0Q29tcG9uZW50Lm1hcnNoYWxsZXIiLCJERkFSdW5uZXIuSW5wdXRDb21wb25lbnQuY2hhbmdlIiwiREZBUnVubmVyLlRleHRib3hDb21wb25lbnQiLCJERkFSdW5uZXIuVGV4dGJveENvbXBvbmVudC5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5UZXh0Ym94Q29tcG9uZW50LnRleHQiLCJERkFSdW5uZXIuVGV4dGJveENvbXBvbmVudC5jaGFuZ2UiLCJERkFSdW5uZXIuVGV4dGJveENvbXBvbmVudC5jaGVja1RleHRDaGFuZ2VkIiwiREZBUnVubmVyLkNoZWNrYm94Q29tcG9uZW50IiwiREZBUnVubmVyLkNoZWNrYm94Q29tcG9uZW50LmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkNoZWNrYm94Q29tcG9uZW50LmNoZWNrZWQiLCJERkFSdW5uZXIuQ2hlY2tib3hDb21wb25lbnQuY2hhbmdlIiwiREZBUnVubmVyLkNoZWNrYm94Q29tcG9uZW50LmNsaWNrZWQiLCJERkFSdW5uZXIuQ2hlY2tib3hDb21wb25lbnQuY2hlY2tlZENoYW5nZWQiLCJERkFSdW5uZXIuTGlzdENvbXBvbmVudCIsIkRGQVJ1bm5lci5MaXN0Q29tcG9uZW50LmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkxpc3RDb21wb25lbnQuTnVsbExpc3RJdGVtIiwiREZBUnVubmVyLkxpc3RDb21wb25lbnQuaXRlbXMiLCJERkFSdW5uZXIuTGlzdENvbXBvbmVudC5zZWxlY3RlZEluZGV4IiwiREZBUnVubmVyLkxpc3RDb21wb25lbnQuc2VsZWN0ZWRJdGVtIiwiREZBUnVubmVyLkxpc3RDb21wb25lbnQuY2hhbmdlIiwiREZBUnVubmVyLkVycm9yTWVzc2FnZSIsIkRGQVJ1bm5lci5FcnJvck1lc3NhZ2UuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuRXhhbXBsZXMiLCJERkFSdW5uZXIuRXhhbXBsZXMuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuRXhhbXBsZXMuZGZhQ2hhbmdlZCIsIkRGQVJ1bm5lci5UYWJzIiwiREZBUnVubmVyLlRhYnMuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuVGFicy5zZWxlY3RlZFRhYiIsIkRGQVJ1bm5lci5UYWJzLmNoYW5nZSIsIkRGQVJ1bm5lci5TdGF0ZXMiLCJERkFSdW5uZXIuU3RhdGVzLmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLlN0YXRlcy5zZWxlY3RlZFN0YXRlIiwiREZBUnVubmVyLlN0YXRlcy5kZmFDaGFuZ2VkIiwiREZBUnVubmVyLlN0YXRlcy5zZWxlY3RlZFN0YXRlQ2hhbmdlZCIsIkRGQVJ1bm5lci5TdGF0ZXMudGV4dENoYW5nZWQiLCJERkFSdW5uZXIuU3RhdGVzLmFkZFN0YXRlIiwiREZBUnVubmVyLlN0YXRlcy5kZWxldGVTdGF0ZSIsIkRGQVJ1bm5lci5TdGF0ZXMucmVjcmVhdGVBY2NlcHRDaGVja2JveCIsIkRGQVJ1bm5lci5TdGF0ZXMuYWNjZXB0VG9nZ2xlZCIsIkRGQVJ1bm5lci5BbHBoYWJldCIsIkRGQVJ1bm5lci5BbHBoYWJldC5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5BbHBoYWJldC5kZmFDaGFuZ2VkIiwiREZBUnVubmVyLkFscGhhYmV0LnNlbGVjdGVkU3RyaW5nQ2hhbmdlZCIsIkRGQVJ1bm5lci5BbHBoYWJldC50ZXh0Q2hhbmdlZCIsIkRGQVJ1bm5lci5BbHBoYWJldC5hZGRTdHJpbmciLCJERkFSdW5uZXIuQWxwaGFiZXQuZGVsZXRlU3RyaW5nIiwiREZBUnVubmVyLlRyYW5zaXRpb25zIiwiREZBUnVubmVyLlRyYW5zaXRpb25zLmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLlRyYW5zaXRpb25zLmNoYW5nZSIsIkRGQVJ1bm5lci5UcmFuc2l0aW9ucy5kZmFDaGFuZ2VkIiwiREZBUnVubmVyLkRlc2lnbmVyIiwiREZBUnVubmVyLkRlc2lnbmVyLmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLkpTT05FbnRyeSIsIkRGQVJ1bm5lci5KU09ORW50cnkuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuSlNPTkVudHJ5LnZhbHVlIiwiREZBUnVubmVyLkpTT05FbnRyeS52YWx1ZUZyb21VcGxvYWQiLCJERkFSdW5uZXIuSlNPTkVudHJ5LnZhbHVlQXNKU09OIiwiREZBUnVubmVyLkpTT05FbnRyeS52YWx1ZUZyb21KU09OIiwiREZBUnVubmVyLkpTT05FbnRyeS5lZGl0b3IiLCJERkFSdW5uZXIuSlNPTkVudHJ5LnVwZGF0ZSIsIkRGQVJ1bm5lci5KU09ORW50cnkudXBkYXRlRGZhIiwiREZBUnVubmVyLkpTT05FbnRyeS5kZmFDaGFuZ2VkIiwiREZBUnVubmVyLlRlc3RlciIsIkRGQVJ1bm5lci5UZXN0ZXIuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuVGVzdGVyLnRlc3RTdHJpbmciLCJERkFSdW5uZXIuVXBsb2FkIiwiREZBUnVubmVyLlVwbG9hZC5jb25zdHJ1Y3RvciIsIkRGQVJ1bm5lci5VcGxvYWQudXBsb2FkIiwiREZBUnVubmVyLlN0YXRlIiwiREZBUnVubmVyLlN0YXRlLmNvbnN0cnVjdG9yIiwiREZBUnVubmVyLlN0YXRlLmlkIiwiREZBUnVubmVyLlN0YXRlLnRyYW5zaXRpb25zIiwiREZBUnVubmVyLlN0YXRlLmlzQWNjZXB0U3RhdGUiLCJERkFSdW5uZXIuU3RhdGUudHJhbnNpdGlvbiIsIkRGQVJ1bm5lci5TdGF0ZS5nZXRUcmFuc2l0aW9uQnlJbnB1dCIsIkRGQVJ1bm5lci5UcmFuc2l0aW9uIiwiREZBUnVubmVyLlRyYW5zaXRpb24uY29uc3RydWN0b3IiLCJERkFSdW5uZXIuVHJhbnNpdGlvbi5pbnB1dCIsIkRGQVJ1bm5lci5UcmFuc2l0aW9uLmRlc3RpbmF0aW9uIiwiREZBUnVubmVyLkRGQSIsIkRGQVJ1bm5lci5ERkEuY29uc3RydWN0b3IiLCJERkFSdW5uZXIuREZBLmNyZWF0ZU1hY2hpbmUiLCJERkFSdW5uZXIuREZBLnZhbGlkYXRlIiwiREZBUnVubmVyLkRGQS5zdGF0ZXMiLCJERkFSdW5uZXIuREZBLmFscGhhYmV0IiwiREZBUnVubmVyLkRGQS5zdGFydFN0YXRlIiwiREZBUnVubmVyLkRGQS5hY2NlcHRTdGF0ZXMiLCJERkFSdW5uZXIuREZBLmVxdWFscyIsIkRGQVJ1bm5lci5ERkEuZ2V0U3RhdGVCeUlkIiwiREZBUnVubmVyLkRGQS5zdHJpbmdJbkFscGhhYmV0IiwiREZBUnVubmVyLkRGQS5zdGF0ZUlzQWNjZXB0U3RhdGUiLCJERkFSdW5uZXIuREZBLnRvSlNPTiIsIkRGQVJ1bm5lci5ERkEudGVzdFN0cmluZyIsIkRGQVJ1bm5lci5ERkEuX3JlYWRTdHJpbmciLCJERkFSdW5uZXIuQXBwbGljYXRpb24iLCJERkFSdW5uZXIuQXBwbGljYXRpb24uY29uc3RydWN0b3IiLCJERkFSdW5uZXIuQXBwbGljYXRpb24uZXJyb3IiLCJERkFSdW5uZXIuQXBwbGljYXRpb24udGFicyIsIkRGQVJ1bm5lci5BcHBsaWNhdGlvbi5qc29uIiwiREZBUnVubmVyLkFwcGxpY2F0aW9uLmRlc2lnbmVyIiwiREZBUnVubmVyLkFwcGxpY2F0aW9uLmRlYnVnTW9kZSIsIkRGQVJ1bm5lci5BcHBsaWNhdGlvbi5kZWJ1ZyIsIkRGQVJ1bm5lci5BcHBsaWNhdGlvbi5kZmFDaGFuZ2VkIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFNBQVMsQ0FtQ2Y7QUFuQ0QsV0FBTyxTQUFTO0lBQUNBLElBQUFBLE9BQU9BLENBbUN2QkE7SUFuQ2dCQSxXQUFBQSxPQUFPQSxFQUFDQSxDQUFDQTtRQUV0QkMsU0FBZ0JBLEtBQUtBLENBQUNBLElBQVlBO1lBQzlCQyxJQUFJQSxPQUFPQSxHQUFHQSxVQUFVQSxFQUFFQSxDQUFDQTtZQUMzQkEsTUFBTUEsQ0FBQ0EsVUFBVUEsQ0FBQ0E7Z0JBQ2QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2xCLENBQUMsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDVEEsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0E7UUFDbkJBLENBQUNBO1FBTmVELGFBQUtBLEdBQUxBLEtBTWZBLENBQUFBO1FBT0RBLEFBQ0FBLDJCQUQyQkE7aUJBQ1hBLFFBQVFBLENBQUNBLElBQWdCQSxFQUFFQSxJQUFZQTtZQUNuREUsSUFBSUEsUUFBUUEsR0FBR0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDOUNBLE1BQU1BLENBQUNBO2dCQUNIQSxVQUFVQSxFQUFFQSxRQUFRQTtnQkFDcEJBLEtBQUtBLEVBQUVBO29CQUFjLE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQUMsQ0FBQzthQUN6REEsQ0FBQ0E7UUFDTkEsQ0FBQ0E7UUFOZUYsZ0JBQVFBLEdBQVJBLFFBTWZBLENBQUFBO1FBRURBLFNBQWdCQSxZQUFZQSxDQUFDQSxHQUFXQSxFQUFFQSxHQUFXQTtZQUNqREcsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsQ0FBQ0EsR0FB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QUFHQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtnQkFFL0JBLENBQUNBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hEQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFFNUNBLEtBQUlBLENBQUNBLENBQUNBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLFVBQUNBLEtBQUtBLEVBQUVBLElBQUlBO29CQUMvQkEsSUFBSUEsUUFBUUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBRXBEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTt3QkFDdkNBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLENBQUNBOzRCQUN2QkEsS0FBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7NEJBQ3pCQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTs0QkFDZkEsS0FBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsSUFBSUEsbUJBQVNBLENBQWNBLElBQUlBLENBQUNBLENBQUNBOzRCQUVyREEsS0FBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxLQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTs0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QUFlQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUV4RUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBVUEsR0FBR0Esd0JBQWNBLENBQUNBLGdCQUFnQkEsQ0FBQ0E7WUFFeERBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBLFlBQVlBLEVBQUVBO2dCQUFRQSxLQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTtZQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUUvREEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBQ0EsR0FBV0E7Z0JBQU9BLEtBQUlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDekVBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLFVBQUNBLEtBQVlBO2dCQUM3QkEsS0FBS0EsQ0FBQ0EsY0FBY0EsRUFBRUEsQ0FBQ0E7Z0JBRXZCQSxLQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtZQUN4QkEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDSEEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsVUFBQ0EsS0FBYUE7Z0JBQU9BLEtBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLENBQUNBLENBQUFBO1lBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3JFQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQTtnQkFBUUEsS0FBSUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0E7WUFBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDN0NBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBO2dCQUFRQSxLQUFJQSxDQUFD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QkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7Z0JBQ3RCQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtnQkFFdEJBLEFBQ0FBLG1CQURtQkE7b0JBQ2ZBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO2dCQUNwQkEsR0FBR0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDcERBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLE9BQU9BLEdBQUdBLFFBQVFBLENBQUNBLEdBQUdBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO2dCQUNqRUEsQ0FBQ0E7Z0JBQ0RBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUUxQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQ2xEQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtvQkFDaEJBLEFBQ0FBLGVBRGVBO29CQUNmQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFD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LEtBQUtBLENBQUNBO1lBQ3JDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxVQUFVQSxJQUFJQSxLQUFLQSxDQUFDQSxVQUFVQSxLQUFLQSxFQUFFQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxXQUFXQSxLQUFLQSxJQUFJQSxDQUFDQTtnQkFBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDOUZBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLFVBQVVBLElBQUlBLElBQUlBLENBQUNBLFdBQVdBLEtBQUtBLElBQUlBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNoRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsVUFBVUEsSUFBSUEsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsRUFBRUEsS0FBS0EsS0FBS0EsQ0FBQ0EsVUFBVUEsQ0FBQ0E7Z0JBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1lBQy9FQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxZQUFZQSxDQUFDQTtnQkFBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFFdENBLElBQUlBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1lBR2xCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDM0NBLEFBQ0FBLHVDQUR1Q0E7Z0JBQ3ZDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtnQkFDZEEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQzNDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxLQUFLQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDekNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBO3dCQUNiQSxLQUFLQSxDQUFDQTtvQkFDVkEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO2dCQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQTtvQkFBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBR3pCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDMURBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO29CQUNkQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxXQUFXQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTt3QkFDaERBLElBQUlBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNoREEsSUFBSUEsZUFBZUEsR0FBdUJBLEtBQUtBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUMvREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsTUFBTUEsS0FBS0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsSUFDN0NBLGVBQWVBLENBQUNBLEtBQUtBLEtBQUtBLFVBQVVBLENBQUNBLEtBQUtBLElBQzFDQSxlQUFlQSxDQUFDQSxXQUFXQSxLQUFLQSxVQUFVQSxDQUFDQSxXQUFXQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDNURBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBOzRCQUNiQSxLQUFLQSxDQUFDQTt3QkFDVkEsQ0FBQ0E7b0JBQ0xBLENBQUNBO29CQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQTt3QkFBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQzdCQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUdEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDN0NBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO2dCQUNkQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDN0NBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLEtBQUtBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUMxQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0E7d0JBQ2JBLEtBQUtBLENBQUNBO29CQUNWQSxDQUFDQTtnQkFDTEEsQ0FBQ0E7Z0JBRURBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBO29CQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUM3QkEsQ0FBQ0E7WUFHREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FB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LEdBQUcsRUFBVSxhQUFhLEVBQUUsSUFBSSxFQUFFO1FBQzdELEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFNLGFBQWEsRUFBRSxJQUFJLEVBQUU7UUFDN0QsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUssYUFBYSxFQUFFLElBQUksRUFBRTtRQUM3RCxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBVSxhQUFhLEVBQUUsSUFBSSxFQUFFO1FBQzdELEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFNLGFBQWEsRUFBRSxJQUFJLEVBQUU7UUFDN0QsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUssYUFBYSxFQUFFLElBQUksRUFBRTtRQUM3RCxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBVSxhQUFhLEVBQUUsSUFBSSxFQUFFO1FBQzdELEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFNLGFBQWEsRUFBRSxJQUFJLEVBQUU7UUFDN0QsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUssYUFBYSxFQUFFLElBQUksRUFBRTtRQUM3RCxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBVSxhQUFhLEVBQUUsSUFBSSxFQUFFO0tBQ2hFO0lBQ0QsWUFBWSxFQUFFLElBQUk7SUFDbEIsY0FBYyxFQUFFLENBQUMsSUFBSSxDQUFDO0NBQ3pCLENBQUMsQ0FBQyIsImZpbGUiOiJkZmEudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgREZBUnVubmVyLkhlbHBlcnMge1xuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGRlbGF5KHRpbWU6IG51bWJlcik6IFBpbmt5U3dlYXIuUHJvbWlzZSB7XG4gICAgICAgIHZhciBwcm9taXNlID0gcGlua3lTd2VhcigpO1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcm9taXNlKHRydWUpO1xuICAgICAgICB9LCB0aW1lKTtcbiAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgZXhwb3J0IGludGVyZmFjZSBJbnRlcnZhbCB7XG4gICAgICAgIGludGVydmFsSWQ6IG51bWJlcjtcbiAgICAgICAgY2xlYXI6ICgpID0+IHZvaWQ7XG4gICAgfVxuXG4gICAgLy9JbnRlcnZhbCB1dGlsaXR5IGZ1bmN0aW9uXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGludGVydmFsKGZ1bmM6ICgpID0+IHZvaWQsIHRpbWU6IG51bWJlcik6IEludGVydmFsIHtcbiAgICAgICAgdmFyIGludGVydmFsID0gd2luZG93LnNldEludGVydmFsKGZ1bmMsIHRpbWUpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW50ZXJ2YWxJZDogaW50ZXJ2YWwsXG4gICAgICAgICAgICBjbGVhcjogZnVuY3Rpb24gKCkgeyB3aW5kb3cuY2xlYXJJbnRlcnZhbChpbnRlcnZhbCk7IH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBleHBvcnQgZnVuY3Rpb24gcmFuZG9tTnVtYmVyKG1pbjogbnVtYmVyLCBtYXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAobWF4IC0gbWluKSkgKyBtaW47XG4gICAgfVxuXG4gICAgZXhwb3J0IGZ1bmN0aW9uIG9iamVjdElzQShvYmplY3Q6IGFueSwgdHlwZTogYW55KSB7XG4gICAgICAgIGlmICh0eXBlLmhhc093blByb3BlcnR5KFwicHJvdG90eXBlXCIpKSB7XG4gICAgICAgICAgICByZXR1cm4gb2JqZWN0LmNvbnN0cnVjdG9yLm5hbWUgPT09IHR5cGUucHJvdG90eXBlLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgREZBUnVubmVyIHtcbiAgICBleHBvcnQgY2xhc3MgQnJpZGdlIHtcblxuICAgICAgICBwcml2YXRlIGhhbmRsZXJzOiBCcmlkZ2VIYW5kbGVyW107XG5cbiAgICAgICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVycyA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCBhbmQgc3Vic2NyaWJlIHRvIGFuIGV2ZW50XG4gICAgICAgICAqIEBwYXJhbSBldmVudCBUeXBlIG9mIGJyaWRnZSBldmVudCB0byBoYW5kbGVcbiAgICAgICAgICogQHBhcmFtIGNhbGxiYWNrIEhhbmRsaW5nIGNhbGxiYWNrIGRlbGVnYXRlXG4gICAgICAgICAqIEByZXR1cm4gVW5pcXVlIGlkIHJlcHJlc2VudGluZyB0aGlzIGV2ZW50XG4gICAgICAgICAqL1xuICAgICAgICBvbihldmVudDogc3RyaW5nLCBjYWxsYmFjazogQnJpZGdlQ2FsbGJhY2s8YW55Pik6IG51bWJlciB7XG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgdmFyIGhhbmRsZXI6IEJyaWRnZUhhbmRsZXIgPSB7XG4gICAgICAgICAgICAgICAgZXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIGlkOiBERkFSdW5uZXIuSGVscGVycy5yYW5kb21OdW1iZXIoMCwgRGF0ZS5ub3coKSksXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVycy5wdXNoKGhhbmRsZXIpO1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZXIuaWQ7XG4gICAgICAgIH1cblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIGFuIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICogQHBhcmFtIGlkIFVuaXF1ZSBpZCByZXByZXNlbnRpbmcgdGhlIGV2ZW50IHRvIHJlbW92ZVxuICAgICAgICAgKi9cbiAgICAgICAgb2ZmKGlkOiBudW1iZXIpOiBCcmlkZ2U7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgYW4gZXZlbnQgaGFuZGxlclxuICAgICAgICAgKiBAcGFyYW0gY2FsbGJhY2sgRnVuY3Rpb24gY2FsbGJhY2sgYXNzaWduZWQgdG8gdGhlIGV2ZW50IHRvIHJlbW92ZVxuICAgICAgICAgKi9cbiAgICAgICAgb2ZmKGNhbGxiYWNrOiBCcmlkZ2VDYWxsYmFjazxhbnk+KTogQnJpZGdlO1xuICAgICAgICBvZmYoaWRPckNhbGxiYWNrOiBhbnkpOiBCcmlkZ2Uge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gLTE7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaGFuZGxlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGlkT3JDYWxsYmFjayA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFuZGxlcnNbaV0uaWQgPT09IGlkT3JDYWxsYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5oYW5kbGVyc1tpXS5jYWxsYmFjayA9PT0gaWRPckNhbGxiYWNrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEaXNwYXRjaCBhbiBldmVudFxuICAgICAgICAgKiBAcGFyYW0gZXZlbnQgVHlwZSBvZiBicmlkZ2UgZXZlbnQgdG8gZGlzcGF0Y2hcbiAgICAgICAgICogQHBhcmFtIGRhdGEgRGF0YSB0byBwYXNzIGFsb25nIHRvIGV2ZW50IGhhbmRsZXJzXG4gICAgICAgICAqIEBwYXJhbSBjb250ZXh0PXdpbmRvdyBDb250ZXh0IGluIHdoaWNoIHRvIGV4ZWN1dGUgaGFuZGxpbmcgY2FsbGJhY2sgZGVsZWdhdGVzXG4gICAgICAgICAqL1xuICAgICAgICB0cmlnZ2VyKGV2ZW50OiBzdHJpbmcsIGRhdGE6IGFueSA9IG51bGwsIGNvbnRleHQ6IGFueSA9IHdpbmRvdyk6IEJyaWRnZSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZXJzLmZvckVhY2goZnVuY3Rpb24gKGhhbmRsZXI6IEJyaWRnZUhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFuZGxlci5ldmVudCA9PT0gZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIuY2FsbGJhY2suY2FsbChjb250ZXh0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZXIuY2FsbGJhY2suY2FsbChjb250ZXh0LCBkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWNsYXJlIGNsYXNzIEJyaWRnZUhhbmRsZXIge1xuICAgICAgICBldmVudDogc3RyaW5nO1xuICAgICAgICBpZDogbnVtYmVyO1xuICAgICAgICBjYWxsYmFjazogQnJpZGdlQ2FsbGJhY2s8YW55PjtcbiAgICB9XG5cbiAgICBleHBvcnQgaW50ZXJmYWNlIEJyaWRnZUNhbGxiYWNrPFQ+IHtcbiAgICAgICAgKGRhdGE/OiBUKTogdm9pZDtcbiAgICAgICAgKGRhdGE/OiBhbnkpOiB2b2lkO1xuICAgIH1cblxuICAgIGV4cG9ydCBpbnRlcmZhY2UgRXZlbnRCcmlkZ2VDYWxsYmFjazxUPiB7XG4gICAgICAgIChldmVudDogRXZlbnQsIGRhdGE/OiBUKTogdm9pZDtcbiAgICAgICAgKGV2ZW50OiBFdmVudCwgZGF0YT86IGFueSk6IHZvaWQ7XG4gICAgfVxufVxuIixudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCwibW9kdWxlIERGQVJ1bm5lciB7XG5cbiAgICBleHBvcnQgY2xhc3MgU3RhdGUge1xuICAgICAgICBwcml2YXRlIF9pZDogc3RyaW5nO1xuICAgICAgICBwcml2YXRlIF90cmFuc2l0aW9uczogVHJhbnNpdGlvbltdO1xuXG4gICAgICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIHRyYW5zaXRpb25zOiBUcmFuc2l0aW9uW10gPSBbXSkge1xuICAgICAgICAgICAgdGhpcy5faWQgPSBpZDtcbiAgICAgICAgICAgIHRoaXMuX3RyYW5zaXRpb25zID0gdHJhbnNpdGlvbnM7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgaWQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5faWQ7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdHJhbnNpdGlvbnMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdHJhbnNpdGlvbnM7XG4gICAgICAgIH1cblxuICAgICAgICBpc0FjY2VwdFN0YXRlKGFjY2VwdFN0YXRlczogU3RhdGVbXSk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhY2NlcHRTdGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5faWQgPT09IGFjY2VwdFN0YXRlc1tpXS5pZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFRoaXMgc3RhdGUgaXMgbm90IGFuIGFjY2VwdCBzdGF0ZVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJhbnNpdGlvbihpbnB1dDogc3RyaW5nKTogU3RhdGUge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl90cmFuc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90cmFuc2l0aW9uc1tpXS5pbnB1dCA9PT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zaXRpb25zW2ldLmRlc3RpbmF0aW9uO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTm8gdHJhbnNpdGlvbiBmb3VuZCBmb3IgZ2l2ZW4gaW5wdXRcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0VHJhbnNpdGlvbkJ5SW5wdXQoaW5wdXQ6IHN0cmluZyk6IFRyYW5zaXRpb24ge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl90cmFuc2l0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90cmFuc2l0aW9uc1tpXS5pbnB1dCA9PT0gaW5wdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3RyYW5zaXRpb25zW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gTm8gdHJhbnNpdGlvbiBmb3VuZCBmb3IgZ2l2ZW4gaW5wdXRcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZXhwb3J0IGNsYXNzIFRyYW5zaXRpb24ge1xuICAgICAgICBwcml2YXRlIF9pbnB1dDogc3RyaW5nO1xuICAgICAgICBwcml2YXRlIF9kZXN0aW5hdGlvbjogU3RhdGU7XG5cbiAgICAgICAgY29uc3RydWN0b3IoY2hhcmFjdGVyOiBzdHJpbmcsIGRlc3RpbmF0aW9uOiBTdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5faW5wdXQgPSBjaGFyYWN0ZXI7XG4gICAgICAgICAgICB0aGlzLl9kZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGlucHV0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2lucHV0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGRlc3RpbmF0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2Rlc3RpbmF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGRlc3RpbmF0aW9uKGRlc3RpbmF0aW9uOiBTdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5fZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsIm1vZHVsZSBERkFSdW5uZXIge1xuXG4gICAgZXhwb3J0IGNsYXNzIERGQSB7XG4gICAgICAgIHByaXZhdGUgX3N0YXRlczogU3RhdGVbXSAgICAgICAgPSBbXTtcbiAgICAgICAgcHJpdmF0ZSBfYWxwaGFiZXQ6IHN0cmluZ1tdICAgICA9IFtdO1xuICAgICAgICBwcml2YXRlIF9zdGFydFN0YXRlOiBTdGF0ZSAgICAgID0gbnVsbDtcbiAgICAgICAgcHJpdmF0ZSBfYWNjZXB0U3RhdGVzOiBTdGF0ZVtdICA9IFtdO1xuXG4gICAgICAgIHN0YXRpYyBjcmVhdGVNYWNoaW5lKGpzb246IERGQUZyb21KU09OKTogREZBIHtcbiAgICAgICAgICAgIHZhciBlbWl0UmVzdWx0ID0gZmFsc2UsXG4gICAgICAgICAgICAgICAgZGZhID0gbmV3IERGQSgpO1xuXG4gICAgICAgICAgICAvLyBBZGQgc3RhdGVzXG4gICAgICAgICAgICBpZiAoanNvbi5zdGF0ZXMgJiYgQXJyYXkuaXNBcnJheShqc29uLnN0YXRlcykpIHtcbiAgICAgICAgICAgICAgICBqc29uLnN0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChzdGF0ZUlkOiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGZhLnN0YXRlcy5wdXNoKG5ldyBTdGF0ZShzdGF0ZUlkKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgZW1pdFJlc3VsdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFkZCBhbHBoYWJldFxuICAgICAgICAgICAgaWYgKGpzb24uYWxwaGFiZXQgJiYgQXJyYXkuaXNBcnJheShqc29uLmFscGhhYmV0KSkge1xuICAgICAgICAgICAgICAgIGpzb24uYWxwaGFiZXQuZm9yRWFjaChmdW5jdGlvbiAoY2hhcmFjdGVyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICAgICAgZGZhLmFscGhhYmV0LnB1c2goY2hhcmFjdGVyKTtcblxuICAgICAgICAgICAgICAgICAgICBlbWl0UmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQWRkIHRyYW5zaXRpb25zXG4gICAgICAgICAgICBpZiAoanNvbi50cmFuc2l0aW9ucyAmJiBBcnJheS5pc0FycmF5KGpzb24udHJhbnNpdGlvbnMpKSB7XG4gICAgICAgICAgICAgICAganNvbi50cmFuc2l0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uICh0cmFuc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdHJhbnNpdGlvbi5zb3VyY2UgPT09ICdzdHJpbmcnICYmXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgdHJhbnNpdGlvbi5pbnB1dCA9PT0gJ3N0cmluZycgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGVvZiB0cmFuc2l0aW9uLmRlc3RpbmF0aW9uID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNvdXJjZVN0YXRlID0gZGZhLmdldFN0YXRlQnlJZCh0cmFuc2l0aW9uLnNvdXJjZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGVzdGluYXRpb25TdGF0ZSA9IGRmYS5nZXRTdGF0ZUJ5SWQodHJhbnNpdGlvbi5kZXN0aW5hdGlvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzb3VyY2VTdGF0ZSAhPT0gbnVsbCAmJiBkZXN0aW5hdGlvblN0YXRlICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlU3RhdGUudHJhbnNpdGlvbnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3IFRyYW5zaXRpb24odHJhbnNpdGlvbi5pbnB1dCwgZGVzdGluYXRpb25TdGF0ZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNldCBzdGFydCBzdGF0ZVxuICAgICAgICAgICAgaWYgKGpzb24uc3RhcnRTdGF0ZSAmJiB0eXBlb2YganNvbi5zdGFydFN0YXRlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIHZhciBzdGFydFN0YXRlID0gZGZhLmdldFN0YXRlQnlJZChqc29uLnN0YXJ0U3RhdGUpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHN0YXJ0U3RhdGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgZGZhLnN0YXJ0U3RhdGUgPSBzdGFydFN0YXRlO1xuXG4gICAgICAgICAgICAgICAgICAgIGVtaXRSZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERlZmF1bHQgdG8gZmlyc3Qgc3RhdGUsIGlmIGF2YWlsYWJsZVxuICAgICAgICAgICAgICAgICAgICBpZiAoZGZhLnN0YXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZmEuc3RhcnRTdGF0ZSA9IGRmYS5zdGF0ZXNbMF07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGVtaXRSZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBEZWZhdWx0IHRvIGZpcnN0IHN0YXRlLCBpZiBhdmFpbGFibGVcbiAgICAgICAgICAgICAgICBpZiAoZGZhLnN0YXRlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGRmYS5zdGFydFN0YXRlID0gZGZhLnN0YXRlc1swXTtcblxuICAgICAgICAgICAgICAgICAgICBlbWl0UmVzdWx0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEFkZCBhY2NlcHQgc3RhdGVzLCBjcmVhdGluZyBuZXcgc3RhdGVzIGlmIG5lY2Vzc2FyeVxuICAgICAgICAgICAgaWYgKGpzb24uYWNjZXB0U3RhdGVzICYmIEFycmF5LmlzQXJyYXkoanNvbi5hY2NlcHRTdGF0ZXMpKSB7XG4gICAgICAgICAgICAgICAganNvbi5hY2NlcHRTdGF0ZXMuZm9yRWFjaChmdW5jdGlvbiAoYWNjZXB0U3RhdGVJZDogc3RyaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhY2NlcHRTdGF0ZSA9IGRmYS5nZXRTdGF0ZUJ5SWQoYWNjZXB0U3RhdGVJZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGFjY2VwdFN0YXRlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY2NlcHRTdGF0ZSA9IG5ldyBTdGF0ZShhY2NlcHRTdGF0ZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRmYS5zdGF0ZXMucHVzaChhY2NlcHRTdGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBkZmEuYWNjZXB0U3RhdGVzLnB1c2goYWNjZXB0U3RhdGUpO1xuXG4gICAgICAgICAgICAgICAgICAgIGVtaXRSZXN1bHQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZW1pdFJlc3VsdCkgcmV0dXJuIGRmYTtcblxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0aWMgdmFsaWRhdGUoZGZhOiBERkEpOiBib29sZWFuIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGZhLnN0YXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgZGZhLmFscGhhYmV0Lmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkZmEuc3RhdGVzW2ldLnRyYW5zaXRpb24oZGZhLmFscGhhYmV0W2pdKSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBzdGF0ZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhdGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGFscGhhYmV0KCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2FscGhhYmV0O1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IHN0YXJ0U3RhdGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fc3RhcnRTdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldCBzdGFydFN0YXRlKHN0YXJ0U3RhdGU6IFN0YXRlKSB7XG4gICAgICAgICAgICB0aGlzLl9zdGFydFN0YXRlID0gc3RhcnRTdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBhY2NlcHRTdGF0ZXMoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fYWNjZXB0U3RhdGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgZXF1YWxzKG90aGVyOiBERkEpOiBib29sZWFuO1xuICAgICAgICBlcXVhbHMob3RoZXI6IERGQUZyb21KU09OKTogYm9vbGVhbjtcbiAgICAgICAgZXF1YWxzKG90aGVyOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgICAgIGlmICghb3RoZXIpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgaWYgKG90aGVyIGluc3RhbmNlb2YgREZBKSB7XG4gICAgICAgICAgICAgICAgb3RoZXIgPSBvdGhlci50b0pTT04oKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFvdGhlci5zdGF0ZXMpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmICghb3RoZXIuYWxwaGFiZXQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmICghb3RoZXIudHJhbnNpdGlvbnMpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIGlmICgoIW90aGVyLnN0YXJ0U3RhdGUgfHwgb3RoZXIuc3RhcnRTdGF0ZSA9PT0gXCJcIikgJiYgdGhpcy5fc3RhcnRTdGF0ZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgaWYgKG90aGVyLnN0YXJ0U3RhdGUgJiYgdGhpcy5fc3RhcnRTdGF0ZSA9PT0gbnVsbCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgaWYgKG90aGVyLnN0YXJ0U3RhdGUgJiYgdGhpcy5fc3RhcnRTdGF0ZS5pZCAhPT0gb3RoZXIuc3RhcnRTdGF0ZSkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgaWYgKCFvdGhlci5hY2NlcHRTdGF0ZXMpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIHN0YXRlcyBhbmQgdHJhbnNpdGlvbnNcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc3RhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgdGhhdCB0aGUgc3RhdGUgZXhpc3RzIGluIG90aGVyXG4gICAgICAgICAgICAgICAgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB2ID0gMDsgdiA8IG90aGVyLnN0YXRlcy5sZW5ndGg7IHYrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fc3RhdGVzW2ldLmlkID09PSBvdGhlci5zdGF0ZXNbdl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghZm91bmQpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGZvciBtYXRjaGluZyB0cmFuc2l0aW9uc1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHYgPSAwOyB2IDwgdGhpcy5fc3RhdGVzW2ldLnRyYW5zaXRpb25zLmxlbmd0aDsgdisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHUgPSAwOyB1IDwgb3RoZXIudHJhbnNpdGlvbnMubGVuZ3RoOyB1KyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB0cmFuc2l0aW9uID0gdGhpcy5fc3RhdGVzW2ldLnRyYW5zaXRpb25zW3ZdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG90aGVyVHJhbnNpdGlvbjogVHJhbnNpdGlvbkZyb21KU09OID0gb3RoZXIudHJhbnNpdGlvbnNbdV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAob3RoZXJUcmFuc2l0aW9uLnNvdXJjZSA9PT0gdGhpcy5fc3RhdGVzW2ldLmlkIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJUcmFuc2l0aW9uLmlucHV0ID09PSB0cmFuc2l0aW9uLmlucHV0IHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJUcmFuc2l0aW9uLmRlc3RpbmF0aW9uID09PSB0cmFuc2l0aW9uLmRlc3RpbmF0aW9uLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFmb3VuZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ2hlY2sgYWxwaGFiZXRcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fYWxwaGFiZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHYgPSAwOyB2IDwgb3RoZXIuYWxwaGFiZXQubGVuZ3RoOyB2KyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FscGhhYmV0W2ldID09PSBvdGhlci5hbHBoYWJldFt2XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoIWZvdW5kKSByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGFjY2VwdCBzdGF0ZXNcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fYWxwaGFiZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIHYgPSAwOyB2IDwgb3RoZXIuYWxwaGFiZXQubGVuZ3RoOyB2KyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FscGhhYmV0W2ldID09PSBvdGhlci5hbHBoYWJldFt2XSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKCFmb3VuZCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldFN0YXRlQnlJZChpZDogc3RyaW5nKTogU3RhdGUge1xuICAgICAgICAgICAgaWYgKGlkICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zdGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXRlc1tpXS5pZCA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9zdGF0ZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFN0YXRlIG5vdCBmb3VuZFxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBzdHJpbmdJbkFscGhhYmV0KHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2FscGhhYmV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuX2FscGhhYmV0W2ldID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gZm91bmQ7XG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ZUlzQWNjZXB0U3RhdGUoc3RhdGU6IFN0YXRlKTogYm9vbGVhbiB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuX2FjY2VwdFN0YXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9hY2NlcHRTdGF0ZXNbaV0uaWQgPT09IHN0YXRlLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdG9KU09OKCk6IERGQUZyb21KU09OIHtcbiAgICAgICAgICAgIHZhciBzdGF0ZXM6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICB2YXIgYWxwaGFiZXQ6IHN0cmluZ1tdID0gW107XG4gICAgICAgICAgICB2YXIgdHJhbnNpdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHN0cmluZ1xuICAgICAgICAgICAgICAgIGlucHV0OiBzdHJpbmdcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbjogc3RyaW5nXG4gICAgICAgICAgICB9W10gPSBbXTtcbiAgICAgICAgICAgIHZhciBhY2NlcHRTdGF0ZXM6IHN0cmluZ1tdID0gW107XG5cbiAgICAgICAgICAgIHRoaXMuX3N0YXRlcy5mb3JFYWNoKGZ1bmN0aW9uIChzdGF0ZTogU3RhdGUpIHtcbiAgICAgICAgICAgICAgICBzdGF0ZXMucHVzaChzdGF0ZS5pZCk7XG5cbiAgICAgICAgICAgICAgICBzdGF0ZS50cmFuc2l0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uICh0cmFuc2l0aW9uOiBUcmFuc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyYW5zaXRpb25zLnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBzdGF0ZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlucHV0OiB0cmFuc2l0aW9uLmlucHV0LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb246IHRyYW5zaXRpb24uZGVzdGluYXRpb24uaWRcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5fYWxwaGFiZXQuZm9yRWFjaChmdW5jdGlvbiAoc3RyOiBzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICBhbHBoYWJldC5wdXNoKHN0cik7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy5fYWNjZXB0U3RhdGVzLmZvckVhY2goZnVuY3Rpb24gKHN0YXRlOiBTdGF0ZSkge1xuICAgICAgICAgICAgICAgIGFjY2VwdFN0YXRlcy5wdXNoKHN0YXRlLmlkKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHN0YXRlczogc3RhdGVzLFxuICAgICAgICAgICAgICAgIGFscGhhYmV0OiBhbHBoYWJldCxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uczogdHJhbnNpdGlvbnMsXG4gICAgICAgICAgICAgICAgc3RhcnRTdGF0ZTogdGhpcy5fc3RhcnRTdGF0ZSA/IHRoaXMuX3N0YXJ0U3RhdGUuaWQgOiBcIlwiLFxuICAgICAgICAgICAgICAgIGFjY2VwdFN0YXRlczogYWNjZXB0U3RhdGVzXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG5cbiAgICAgICAgdGVzdFN0cmluZyhzdHI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3N0YXJ0U3RhdGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9yZWFkU3RyaW5nKHN0ciwgdGhpcy5fc3RhcnRTdGF0ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIF9yZWFkU3RyaW5nKHN0cjogc3RyaW5nLCBjdXJyZW50U3RhdGU6IFN0YXRlKTogYm9vbGVhbiB7XG4gICAgICAgICAgICBpZiAoc3RyID09PSBcIlwiICYmIGN1cnJlbnRTdGF0ZS5pc0FjY2VwdFN0YXRlKHRoaXMuX2FjY2VwdFN0YXRlcykpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RyID09PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaW5wdXQgPSBcIlwiLFxuICAgICAgICAgICAgICAgIG5leHRTdGF0ZTogU3RhdGUgPSBudWxsO1xuICAgICAgICAgICAgLy8gR2V0IHRoZSBuZXh0IHN0YXRlIGdpdmVuIGN1cnJlbnQgYWxwaGFiZXRcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fYWxwaGFiZXQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpbnB1dCA9IHRoaXMuX2FscGhhYmV0W2ldO1xuICAgICAgICAgICAgICAgIGlmIChzdHIuaW5kZXhPZihpbnB1dCkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgbmV4dFN0YXRlID0gY3VycmVudFN0YXRlLnRyYW5zaXRpb24oaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChuZXh0U3RhdGUgPT09IG51bGwpIHJldHVybiBmYWxzZTtcblxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIklucHV0OiBcIiArIGlucHV0ICsgXCIgICBSZXN0OiBcIiArIHN0ci5zbGljZShpbnB1dC5sZW5ndGgpKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cobmV4dFN0YXRlKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3JlYWRTdHJpbmcoc3RyLnNsaWNlKGlucHV0Lmxlbmd0aCksIG5leHRTdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJtb2R1bGUgREZBUnVubmVyIHtcblxuICAgIGV4cG9ydCBjbGFzcyBBcHBsaWNhdGlvbiB7XG4gICAgICAgIHByaXZhdGUgX3RhYnM6IFRhYnM7XG4gICAgICAgIHByaXZhdGUgX2V4YW1wbGVzOiBFeGFtcGxlcztcbiAgICAgICAgcHJpdmF0ZSBfZXJyb3I6IEVycm9yTWVzc2FnZTtcbiAgICAgICAgcHJpdmF0ZSBfanNvbjogSlNPTkVudHJ5O1xuICAgICAgICBwcml2YXRlIF9kZXNpZ25lcjogRGVzaWduZXI7XG4gICAgICAgIHByaXZhdGUgX3Rlc3RlcjogVGVzdGVyO1xuICAgICAgICBwcml2YXRlIF91cGxvYWQ6IFVwbG9hZDtcblxuICAgICAgICBwcml2YXRlIF9kZWJ1Z01vZGU6IGJvb2xlYW47XG5cbiAgICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgICAgICAkKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLl90YWJzID0gbmV3IFRhYnMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9leGFtcGxlcyA9IG5ldyBFeGFtcGxlcygpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yID0gbmV3IEVycm9yTWVzc2FnZSgpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2pzb24gPSBuZXcgSlNPTkVudHJ5KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fZGVzaWduZXIgPSBuZXcgRGVzaWduZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl90ZXN0ZXIgPSBuZXcgVGVzdGVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fdXBsb2FkID0gbmV3IFVwbG9hZCgpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVidWdNb2RlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl91cGxvYWQudXBsb2FkKChqc29uOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fanNvbi52YWx1ZUZyb21VcGxvYWQgPSBqc29uO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc2VydmljZXMuZXZlbnRzLm9uKCdkZmFDaGFuZ2VkJywgKCkgPT4geyB0aGlzLmRmYUNoYW5nZWQoKTsgfSk7XG5cbiAgICAgICAgICAgICAgICBzZXJ2aWNlcy5kZmEgPSBuZXcgREZBKCk7XG4gICAgICAgICAgICAgICAgc2VydmljZXMuZXZlbnRzLnRyaWdnZXIoJ2RmYUNoYW5nZWQnKTtcblxuICAgICAgICAgICAgICAgICQoJyNqc29uJykuaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgZXJyb3IoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICBnZXQgdGFicygpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl90YWJzO1xuICAgICAgICB9XG5cbiAgICAgICAgZ2V0IGpzb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fanNvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBkZXNpZ25lcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9kZXNpZ25lcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGdldCBkZWJ1Z01vZGUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZGVidWdNb2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0IGRlYnVnTW9kZShkZWJ1Z01vZGU6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHRoaXMuX2RlYnVnTW9kZSA9IGRlYnVnTW9kZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlYnVnKCkge1xuICAgICAgICAgICAgdGhpcy5fZGVidWdNb2RlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgZGZhQ2hhbmdlZCgpIHtcbiAgICAgICAgICAgIGlmIChzZXJ2aWNlcy5kZmEgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBpZiAoREZBLnZhbGlkYXRlKHNlcnZpY2VzLmRmYSkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gREZBIGlzIHZhbGlkXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Vycm9yLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBERkEgaXMgaW52YWxpZFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9lcnJvci5oaWRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJcbnZhciBzZXJ2aWNlczoge1xuICAgIGV2ZW50czogREZBUnVubmVyLkJyaWRnZTtcbiAgICBleGFtcGxlczogREZBUnVubmVyLkRGQUZyb21KU09OW107XG4gICAgZGZhOiBERkFSdW5uZXIuREZBO1xufSA9IHtcbiAgICBldmVudHM6IG5ldyBERkFSdW5uZXIuQnJpZGdlKCksXG4gICAgZXhhbXBsZXM6IFtdLFxuICAgIGRmYTogbnVsbFxufTtcblxuJC5mbi5oYXNBdHRyID0gZnVuY3Rpb24obmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgdmFyIGF0dHIgPSB0aGlzLmF0dHIobmFtZSk7XG4gICAgcmV0dXJuIGF0dHIgIT09IHVuZGVmaW5lZCAmJiBhdHRyICE9PSBmYWxzZTtcbiAgICAvL3JldHVybiB0aGlzLmF0dHIobmFtZSkgIT09IHVuZGVmaW5lZDtcbn07XG5cbnZhciBhcHAgPSBuZXcgREZBUnVubmVyLkFwcGxpY2F0aW9uKCk7XG5cbmFwcC5kZWJ1ZygpO1xuIiwiLy8gQWRkIGV4YW1wbGVzIHRvIGV4YW1wbGVzIHNlcnZpY2Vcblxuc2VydmljZXMuZXhhbXBsZXMucHVzaCh7XG4gICAgbmFtZTogXCJ7dyB8IHcgaXMgdGhlIGVtcHR5IHN0cmluZyBvciBlbmRzIGluIGEgMH1cIixcbiAgICBzdGF0ZXM6IFtcInExXCIsIFwicTJcIl0sXG4gICAgYWxwaGFiZXQ6IFtcIjBcIiwgXCIxXCJdLFxuICAgIHRyYW5zaXRpb25zOiBbXG4gICAgICAgIHsgc291cmNlOiBcInExXCIsIGlucHV0OiBcIjBcIiwgZGVzdGluYXRpb246IFwicTFcIiB9LFxuICAgICAgICB7IHNvdXJjZTogXCJxMVwiLCBpbnB1dDogXCIxXCIsIGRlc3RpbmF0aW9uOiBcInEyXCIgfSxcbiAgICAgICAgeyBzb3VyY2U6IFwicTJcIiwgaW5wdXQ6IFwiMVwiLCBkZXN0aW5hdGlvbjogXCJxMlwiIH0sXG4gICAgICAgIHsgc291cmNlOiBcInEyXCIsIGlucHV0OiBcIjBcIiwgZGVzdGluYXRpb246IFwicTFcIiB9XG4gICAgXSxcbiAgICBcInN0YXJ0U3RhdGVcIjogXCJxMVwiLFxuICAgIFwiYWNjZXB0U3RhdGVzXCI6IFtcInExXCJdXG59KTtcblxuc2VydmljZXMuZXhhbXBsZXMucHVzaCh7XG4gICAgbmFtZTogXCJ7dyB8IHcgaGFzIGV4YWN0bHkgdHdvIGEnc31cIixcbiAgICBzdGF0ZXM6IFtcInExXCIsIFwicTJcIiwgXCJxM1wiLCBcInE0XCJdLFxuICAgIGFscGhhYmV0OiBbXCJhXCIsIFwiYlwiXSxcbiAgICB0cmFuc2l0aW9uczogW1xuICAgICAgICB7IHNvdXJjZTogXCJxMVwiLCBpbnB1dDogXCJiXCIsIGRlc3RpbmF0aW9uOiBcInExXCIgfSxcbiAgICAgICAgeyBzb3VyY2U6IFwicTFcIiwgaW5wdXQ6IFwiYVwiLCBkZXN0aW5hdGlvbjogXCJxMlwiIH0sXG4gICAgICAgIHsgc291cmNlOiBcInEyXCIsIGlucHV0OiBcImJcIiwgZGVzdGluYXRpb246IFwicTJcIiB9LFxuICAgICAgICB7IHNvdXJjZTogXCJxMlwiLCBpbnB1dDogXCJhXCIsIGRlc3RpbmF0aW9uOiBcInEzXCIgfSxcbiAgICAgICAgeyBzb3VyY2U6IFwicTNcIiwgaW5wdXQ6IFwiYlwiLCBkZXN0aW5hdGlvbjogXCJxM1wiIH0sXG4gICAgICAgIHsgc291cmNlOiBcInEzXCIsIGlucHV0OiBcImFcIiwgZGVzdGluYXRpb246IFwicTRcIiB9LFxuICAgICAgICB7IHNvdXJjZTogXCJxNFwiLCBpbnB1dDogXCJhXCIsIGRlc3RpbmF0aW9uOiBcInE0XCIgfSxcbiAgICAgICAgeyBzb3VyY2U6IFwicTRcIiwgaW5wdXQ6IFwiYlwiLCBkZXN0aW5hdGlvbjogXCJxNFwiIH1cbiAgICBdLFxuICAgIFwic3RhcnRTdGF0ZVwiOiBcInExXCIsXG4gICAgXCJhY2NlcHRTdGF0ZXNcIjogW1wicTNcIl1cbn0pO1xuXG5zZXJ2aWNlcy5leGFtcGxlcy5wdXNoKHtcbiAgICBuYW1lOiBcImEqYihhfGIpKlxcdHt3IHwgdyBoYXMgYXQgbGVhc3Qgb25lIGJ9XCIsXG4gICAgc3RhdGVzOiBbXCJxMVwiLCBcInEyXCJdLFxuICAgIGFscGhhYmV0OiBbXCJhXCIsIFwiYlwiXSxcbiAgICB0cmFuc2l0aW9uczogW1xuICAgICAgICB7IHNvdXJjZTogXCJxMVwiLCBpbnB1dDogXCJhXCIsIGRlc3RpbmF0aW9uOiBcInExXCIgfSxcbiAgICAgICAgeyBzb3VyY2U6IFwicTFcIiwgaW5wdXQ6IFwiYlwiLCBkZXN0aW5hdGlvbjogXCJxMlwiIH0sXG4gICAgICAgIHsgc291cmNlOiBcInEyXCIsIGlucHV0OiBcImFcIiwgZGVzdGluYXRpb246IFwicTJcIiB9LFxuICAgICAgICB7IHNvdXJjZTogXCJxMlwiLCBpbnB1dDogXCJiXCIsIGRlc3RpbmF0aW9uOiBcInEyXCIgfVxuICAgIF0sXG4gICAgXCJzdGFydFN0YXRlXCI6IFwicTFcIixcbiAgICBcImFjY2VwdFN0YXRlc1wiOiBbXCJxMlwiXVxufSk7XG5cbnNlcnZpY2VzLmV4YW1wbGVzLnB1c2goe1xuICAgIFwibmFtZVwiOiBcInt3IHwgdyA9IFxcXCJmb29iYXJcXFwifVwiLFxuICAgIFwic3RhdGVzXCI6IFtcInExXCIsIFwicTJcIiwgXCJxM1wiXSxcbiAgICBcImFscGhhYmV0XCI6IFtcImZvb1wiLCBcImJhclwiXSxcbiAgICBcInRyYW5zaXRpb25zXCI6IFtcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInExXCIsIFwiaW5wdXRcIjogXCJmb29cIiwgXCJkZXN0aW5hdGlvblwiOiBcInEzXCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInExXCIsIFwiaW5wdXRcIjogXCJiYXJcIiwgXCJkZXN0aW5hdGlvblwiOiBcInEzXCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInEyXCIsIFwiaW5wdXRcIjogXCJmb29cIiwgXCJkZXN0aW5hdGlvblwiOiBcInEzXCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInEyXCIsIFwiaW5wdXRcIjogXCJiYXJcIiwgXCJkZXN0aW5hdGlvblwiOiBcInEzXCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInEzXCIsIFwiaW5wdXRcIjogXCJmb29cIiwgXCJkZXN0aW5hdGlvblwiOiBcInEzXCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInEzXCIsIFwiaW5wdXRcIjogXCJiYXJcIiwgXCJkZXN0aW5hdGlvblwiOiBcInEyXCIgfVxuICAgIF0sXG4gICAgXCJzdGFydFN0YXRlXCI6IFwicTFcIixcbiAgICBcImFjY2VwdFN0YXRlc1wiOiBbXCJxMlwiXVxufSk7XG5cbnNlcnZpY2VzLmV4YW1wbGVzLnB1c2goe1xuICAgIFwibmFtZVwiOiBcInt3IHwgdyA9IFxcXCJvb21wYSBsb29tcGFcXFwifVwiLFxuICAgIFwic3RhdGVzXCI6IFsgXCJxMVwiLCBcInEyXCIsIFwicTNcIiwgXCJxNFwiLCBcInE1XCIgXSxcbiAgICBcImFscGhhYmV0XCI6IFtcIm9vbXBhXCIsIFwibG9vbXBhXCIsIFwiIFwiXSxcbiAgICBcInRyYW5zaXRpb25zXCI6IFtcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInExXCIsIFwiaW5wdXRcIjogXCJvb21wYVwiLCAgICAgXCJkZXN0aW5hdGlvblwiOiBcInEyXCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInExXCIsIFwiaW5wdXRcIjogXCJsb29tcGFcIiwgICAgXCJkZXN0aW5hdGlvblwiOiBcInE1XCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInExXCIsIFwiaW5wdXRcIjogXCIgXCIsICAgICAgICAgXCJkZXN0aW5hdGlvblwiOiBcInE1XCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInEyXCIsIFwiaW5wdXRcIjogXCJvb21wYVwiLCAgICAgXCJkZXN0aW5hdGlvblwiOiBcInE1XCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInEyXCIsIFwiaW5wdXRcIjogXCJsb29tcGFcIiwgICAgXCJkZXN0aW5hdGlvblwiOiBcInE1XCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInEyXCIsIFwiaW5wdXRcIjogXCIgXCIsICAgICAgICAgXCJkZXN0aW5hdGlvblwiOiBcInEzXCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInEzXCIsIFwiaW5wdXRcIjogXCJvb21wYVwiLCAgICAgXCJkZXN0aW5hdGlvblwiOiBcInE1XCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInEzXCIsIFwiaW5wdXRcIjogXCJsb29tcGFcIiwgICAgXCJkZXN0aW5hdGlvblwiOiBcInE0XCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInEzXCIsIFwiaW5wdXRcIjogXCIgXCIsICAgICAgICAgXCJkZXN0aW5hdGlvblwiOiBcInE1XCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInE0XCIsIFwiaW5wdXRcIjogXCJvb21wYVwiLCAgICAgXCJkZXN0aW5hdGlvblwiOiBcInE1XCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInE0XCIsIFwiaW5wdXRcIjogXCJsb29tcGFcIiwgICAgXCJkZXN0aW5hdGlvblwiOiBcInE1XCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInE0XCIsIFwiaW5wdXRcIjogXCIgXCIsICAgICAgICAgXCJkZXN0aW5hdGlvblwiOiBcInE1XCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInE1XCIsIFwiaW5wdXRcIjogXCJvb21wYVwiLCAgICAgXCJkZXN0aW5hdGlvblwiOiBcInE1XCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInE1XCIsIFwiaW5wdXRcIjogXCJsb29tcGFcIiwgICAgXCJkZXN0aW5hdGlvblwiOiBcInE1XCIgfSxcbiAgICAgICAgeyBcInNvdXJjZVwiOiBcInE1XCIsIFwiaW5wdXRcIjogXCIgXCIsICAgICAgICAgXCJkZXN0aW5hdGlvblwiOiBcInE1XCIgfVxuICAgIF0sXG4gICAgXCJzdGFydFN0YXRlXCI6IFwicTFcIixcbiAgICBcImFjY2VwdFN0YXRlc1wiOiBbXCJxNFwiXVxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
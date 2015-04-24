
var services: {
    events: DFARunner.Bridge;
    examples: DFARunner.DFAFromJSON[];
    dfa: DFARunner.DFA;
} = {
    events: new DFARunner.Bridge(),
    examples: [],
    dfa: null
};

$.fn.hasAttr = function(name: string): boolean {
    var attr = this.attr(name);
    return attr !== undefined && attr !== false;
    //return this.attr(name) !== undefined;
};

var app = new DFARunner.Application();

app.debug();

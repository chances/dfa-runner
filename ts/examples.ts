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
    "states": [ "q1", "q2", "q3", "q4", "q5" ],
    "alphabet": ["oompa", "loompa", " "],
    "transitions": [
        { "source": "q1", "input": "oompa",     "destination": "q2" },
        { "source": "q1", "input": "loompa",    "destination": "q5" },
        { "source": "q1", "input": " ",         "destination": "q5" },
        { "source": "q2", "input": "oompa",     "destination": "q5" },
        { "source": "q2", "input": "loompa",    "destination": "q5" },
        { "source": "q2", "input": " ",         "destination": "q3" },
        { "source": "q3", "input": "oompa",     "destination": "q5" },
        { "source": "q3", "input": "loompa",    "destination": "q4" },
        { "source": "q3", "input": " ",         "destination": "q5" },
        { "source": "q4", "input": "oompa",     "destination": "q5" },
        { "source": "q4", "input": "loompa",    "destination": "q5" },
        { "source": "q4", "input": " ",         "destination": "q5" },
        { "source": "q5", "input": "oompa",     "destination": "q5" },
        { "source": "q5", "input": "loompa",    "destination": "q5" },
        { "source": "q5", "input": " ",         "destination": "q5" }
    ],
    "startState": "q1",
    "acceptStates": ["q4"]
});

services.examples.push({
    "name": "{w | w is a binary multiple of 5}",
    "states": ["q0", "q1", "q2", "q3", "q4"],
    "alphabet": ["0", "1"],
    "transitions": [
        { "source": "q0", "input": "0", "destination": "q0" },
        { "source": "q0", "input": "1", "destination": "q1" },
        { "source": "q1", "input": "0", "destination": "q2" },
        { "source": "q1", "input": "1", "destination": "q4" },
        { "source": "q2", "input": "0", "destination": "q3" },
        { "source": "q2", "input": "1", "destination": "q0" },
        { "source": "q3", "input": "0", "destination": "q4" },
        { "source": "q3", "input": "1", "destination": "q3" },
        { "source": "q4", "input": "0", "destination": "q1" },
        { "source": "q4", "input": "1", "destination": "q2" }
    ],
    "startState": "q0",
    "acceptStates": ["q0"]
});

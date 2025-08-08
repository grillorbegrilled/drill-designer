// state.js
var stepSizeInches = 22.5; // 8-to-5 default
var currentStep = 0;
var isPlaying = false;

var kids = [
    {
        id: "A", x: 40, y: 30, direction: 0, moving: true, color: "yellow",
        changes: [{ step: 8, direction: 180 }, { step: 16, stop: true }]
    },
    {
        id: "B", x: 40, y: 32, direction: 0, moving: true, color: "red",
        changes: [{ step: 8, direction: 180 }, { step: 16, stop: true }]
    },
    {
        id: "C", x: 38, y: 30, direction: 0, moving: true, color: "blue",
        changes: [{ step: 8, direction: 180 }, { step: 16, stop: true }]
    },
    {
        id: "D", x: 38, y: 32, direction: 0, moving: true, color: "green",
        changes: [{ step: 8, direction: 180 }, { step: 16, stop: true }]
    }
];

var startingFormation = kids.map(kid => ({
    id: kid.id,
    x: kid.x,
    y: kid.y,
    direction: kid.direction,
    moving: kid.moving,
    color: kid.color
}));

var snapshots = new Map();
snapshots.set(0, JSON.parse(JSON.stringify(startingFormation)));

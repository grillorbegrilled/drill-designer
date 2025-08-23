let kids = [];

let selectedIds = new Set();

let startingFormation = null;
let snapshots = new Map();

let tempo = 180;

function setStartingFormation()
{
    startingFormation = kids.map(kid => ({
    id: kid.id,
    x: kid.x,
    y: kid.y,
    d: kid.d,
    m: kid.m,
    c: kid.c
}));
    
    snapshots = new Map();
    snapshots.set(0, JSON.parse(JSON.stringify(startingFormation)));
}

function cloneKidStates() {
    return kids.map(kid => ({
        id: kid.id,
        x: kid.x,
        y: kid.y,
        d: kid.d,
        m: kid.m,
        c: kid.c
    }));
}

function applySnapshot(state) {
    kids.forEach(kid => {
        const match = state.find(s => s.id === kid.id);
        if (match) {
            kid.x = match.x;
            kid.y = match.y;
            kid.d = match.d;
            kid.m = match.m;
            kid.c = match.c;
        }
    });
}

let addKidPreview = null; // Will hold dot preview data or null

function addKid(x, y, color, direction) {
  kids.push({
    id: Date.now() + Math.random(),
    x,
    y,
    d: direction ?? 0,
    m: false,
    c,
    ch: []
  });

    setStartingFormation();
}

function removeKids() {
    if (currentStep === 0) {
    for (let i = kids.length - 1; i >= 0; i--) {
        if (selectedIds.has(kids[i].id)) {
            kids.splice(i, 1);
        }
    }

    setStartingFormation();
    render();
    }
}

/*sample data for kids array
[
    {
        id: "A",
        x: 40,
        y: 30,
        direction: 0,
        moving: true,
        color: "yellow",
        changes: [
            { step: 8, direction: 180 },
            { step: 16, moving: false }
        ]
    },
    {
        id: "B",
        x: 40,
        y: 32,
        direction: 0,
        moving: true,
        color: "red",
        changes: [
            { step: 8, direction: 180 },
            { step: 16, moving: false }
        ]
    },
    {
        id: "C",
        x: 40,
        y: 34,
        direction: 0,
        moving: true,
        color: "blue",
        changes: [
            { step: 8, direction: 180 },
            { step: 16, moving: false }
        ]
    },
    {
        id: "D",
        x: 40,
        y: 36,
        direction: 0,
        moving: true,
        color: "green",
        changes: [
            { step: 8, direction: 180 },
            { step: 16, moving: false }
        ]
    }
];
*/

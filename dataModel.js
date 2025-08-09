let kids = [
    {
        id: "A",
        x: 40,
        y: 30,
        direction: 0,
        moving: true,
        color: "yellow",
        changes: [
            { step: 8, direction: 180 },
            { step: 16, stop: true }
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
            { step: 16, stop: true }
        ]
    },
    {
        id: "C",
        x: 38,
        y: 30,
        direction: 0,
        moving: true,
        color: "blue",
        changes: [
            { step: 8, direction: 180 },
            { step: 16, stop: true }
        ]
    },
    {
        id: "D",
        x: 38,
        y: 32,
        direction: 0,
        moving: true,
        color: "green",
        changes: [
            { step: 8, direction: 180 },
            { step: 16, stop: true }
        ]
    }
];

const startingFormation = kids.map(kid => ({
    id: kid.id,
    x: kid.x,
    y: kid.y,
    direction: kid.direction,
    moving: kid.moving,
    color: kid.color
}));

let snapshots = new Map();
snapshots.set(0, JSON.parse(JSON.stringify(startingFormation)));

function cloneKidStates() {
    return kids.map(kid => ({
        id: kid.id,
        x: kid.x,
        y: kid.y,
        direction: kid.direction,
        moving: kid.moving,
        color: kid.color
    }));
}

function applySnapshot(state) {
    kids.forEach(kid => {
        const match = state.find(s => s.id === kid.id);
        if (match) {
            kid.x = match.x;
            kid.y = match.y;
            kid.direction = match.direction;
            kid.moving = match.moving;
            kid.color = match.color;
        }
    });
}

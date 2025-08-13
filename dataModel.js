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

let selectedIds = new Set();

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

function addKid(x, y, color) {
  kids.push({
    id: `K${kidIdCounter++}`,
    x,
    y,
    direction: 0,
    moving: true,
    color,
    changes: []
  });
}

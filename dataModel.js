let kids = [];

let selectedIds = new Set();

let startingFormation = null;
let snapshots = new Map();

function setStartingFormation()
{
    startingFormation = kids.map(kid => ({
    id: kid.id,
    x: kid.x,
    y: kid.y,
    direction: kid.direction,
    moving: kid.moving,
    color: kid.color
}));
    
    snapshots = new Map();
    snapshots.set(0, JSON.parse(JSON.stringify(startingFormation)));
}

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

let addKidPreview = null; // Will hold dot preview data or null

function addKid(x, y, color, direction) {
  kids.push({
    id: Date.now() + Math.random(),
    x,
    y,
    direction: direction ?? 0,
    moving: false,
    color,
    changes: []
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

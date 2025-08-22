function applyChange(ids, change, step = currentStep) {
    for (let i = 0; i < kids.length; i++) {
        const kid = kids[i];

        if (!ids.includes(kid.id)) continue;

        // Remove future changes. More efficient than calling removeFutureChanges().
        kid.changes = kid.changes.filter(c => c.step < step);

        // Build effective current state
        let state = { ...kid };
        for (let j = 0; j < kid.changes.length; j++) {
            if (kid.changes[j].step <= step) {
                state = { ...state, ...kid.changes[j] };
            }
        }

        // Compute new change
        const newChange = { step: step };

        if ("directionDelta" in change) newChange.direction = (state.direction + change.directionDelta + 360) % 360;
        else if ("direction" in change) newChange.direction = change.direction;

        if ("moving" in change) newChange.moving = change.moving;

        // Redundancy check
        let isRedundant = true;
        for (let key in newChange) {
            if (key !== "step" && newChange[key] !== state[key]) {
                isRedundant = false;
                break;
            }
        }

        if (isRedundant) continue;

        // Apply the change
        kid.changes.push(newChange);
    }

    // Clear future snapshots
    for (let snapStep of Array.from(snapshots.keys())) {
        if (snapStep > step) {
            snapshots.delete(snapStep);
        }
    }

    // Re-render next step
    simulateToStep(step + 1);
}

function removeFutureChanges(ids, step) {
  for (const kid of kids) {
    if (ids.has(kid.id)) {
      kid.changes = kid.changes.filter(c => c.step < step);
    }
  }
}

function turn(ids, delta, step = currentStep) {
    const change = { directionDelta: delta }; //increment kid.direction by delta degrees
    change.moving = !turnAndStop;
    applyChange(ids, change, step);
}

function turnHardDirection(ids, direction, step = currentStep) {
    const change = { direction: direction }; //set kid.direction to literal value
    change.moving = !turnAndStop;
    applyChange(ids, change, step);
}

function right(ids = [...selectedIds], step = currentStep) {
    turn(ids, 90, step);
}

function forward(ids = [...selectedIds], step = currentStep) {
    applyChange(ids, { moving: true }, step);
}

function left(ids = [...selectedIds], step = currentStep) {
    turn(ids, 270, step);
}

function toTheRear(ids = [...selectedIds], step = currentStep) {
    turn(ids, 180, step);
}

function stop(ids = [...selectedIds], step = currentStep, direction = null) {
    const change = { moving: false };

    if (direction) change.direction = direction;
    
    applyChange(ids, change, step);
}

function obliqueRight(ids = [...selectedIds], step = currentStep) {
    turn(ids, 45, step);
}

function obliqueLeft(ids = [...selectedIds], step = currentStep) {
    turn(ids, 315, step);
}

function obliqueBackLeft(ids = [...selectedIds], step = currentStep) {
    turn(ids, 225, step);
}

function obliqueBackRight(ids = [...selectedIds], step = currentStep) {
    turn(ids, 135, step);
}

const turnS = (ids = [...selectedIds], step = currentStep) => turnHardDirection(ids, 90, step);
const turnE = (ids = [...selectedIds], step = currentStep) => turnHardDirection(ids, 0, step);
const turnN = (ids = [...selectedIds], step = currentStep) => turnHardDirection(ids, 270, step);
const turnW = (ids = [...selectedIds], step = currentStep) => turnHardDirection(ids, 180, step);
const turnSE = (ids = [...selectedIds], step = currentStep) => turnHardDirection(ids, 45, step);
const turnNE = (ids = [...selectedIds], step = currentStep) => turnHardDirection(ids, 315, step);
const turnNW = (ids = [...selectedIds], step = currentStep) => turnHardDirection(ids, 225, step);
const turnSW = (ids = [...selectedIds], step = currentStep) => turnHardDirection(ids, 135, step);

function dynamicSort(points) {
    const xs = points.map(p => p.x);
    const ys = points.map(p => p.y);
    const rangeX = Math.max(...xs) - Math.min(...xs);
    const rangeY = Math.max(...ys) - Math.min(...ys);

    return points.sort(
        rangeX > rangeY
            ? (a, b) => (a.x !== b.x ? a.x - b.x : a.y - b.y)
            : (a, b) => (a.y !== b.y ? a.y - b.y : a.x - b.x)
    );
}

function areKidsAligned() {
    if (selectedIds.size < 2) return false; // need at least 2 for a line

    const selectedKids = kids.filter(k => selectedIds.has(k.id));
    const allXEqual = selectedKids.every(k => k.x === selectedKids[0].x);
    const allYEqual = selectedKids.every(k => k.y === selectedKids[0].y);

    return allXEqual || allYEqual;
}

function gatePinwheel(vertex, clockwise, steps, selectedKids) {
    if (!areKidsAligned()) {
        alert("Selected kids must be aligned in a straight line.");
        return;
    }

    addGatePinwheelChanges(vertex, clockwise, steps, selectedKids);
    render();
}

function stepOff(direction, startingPoint, delay, ripples = 0, rippleDelay = 0) {
    //if (!areKidsAligned()) {
  //      alert("Selected kids must be aligned in a straight line.");
//        return;
  //  }

    const sortedKids = dynamicSort(kids.filter(kid => selectedIds.has(kid.id)));
    const step = currentStep;
    const len = sortedKids.length;
    if (startingPoint < 0 || startingPoint >= len) return console.warn("Invalid startingPoint index.");
    const startKid = sortedKids[startingPoint];

    removeFutureChanges(selectedIds, step); //must remove all steps for selected kids starting at currentStep, because the initial hold might not take.
    //Add the first step
    applyChange([startKid.id], {direction: direction, moving: true}, step);
    //Add ripples, if any
    if (ripples) {
        console.log(`${step} ${ripples} ${rippleDelay}`);
        for(let i = 1; i <= ripples; i++) {
            toTheRear([startKid.id], step + (rippleDelay * i));
        }
    }
    
    if (len > 1) stop(sortedKids.filter(kid => kid.id !== startKid.id).map(kid => kid.id), step);//applyChange(sortedKids.filter(kid => kid.id !== startKid.id).map(kid => kid.id), { direction, moving: false }, step);
    for (let i = 1; startingPoint - i >= 0 || startingPoint + i < len; i++) {
        const ids = [];
        if (startingPoint - i >= 0) ids.push(sortedKids[startingPoint - i].id);
        if (startingPoint + i < len) ids.push(sortedKids[startingPoint + i].id);
        if (ids.length) turnHardDirection(ids, direction, step + (delay * i));

        if (ripples) {
            for(let j = 1; j <= ripples; j++) {
                toTheRear(ids, step + (delay * i) + (rippleDelay * j));
            }
        }
    }

    render();
}

function dropOff(direction, startingPoint, delay) {
    const sortedKids = dynamicSort(kids.filter(kid => selectedIds.has(kid.id)));
    const step = currentStep;
    const len = sortedKids.length;
    if (startingPoint < 0 || startingPoint >= len) return console.warn("Invalid startingPoint index.");
    const startKid = sortedKids[startingPoint];

    removeFutureChanges(selectedIds, step);

    applyChange([startKid.id], {direction: direction, moving: false}, step);
    
    for (let i = 1; startingPoint - i >= 0 || startingPoint + i < len; i++) {
        const ids = [];
        if (startingPoint - i >= 0) ids.push(sortedKids[startingPoint - i].id);
        if (startingPoint + i < len) ids.push(sortedKids[startingPoint + i].id);
        if (ids.length) stop(ids, direction, step + (delay * i));
    }

    render();
}

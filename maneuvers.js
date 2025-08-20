function applyChange(ids, change, step = currentStep) {
    for (let i = 0; i < kids.length; i++) {
        const kid = kids[i];

        if (!ids.includes(kid.id)) continue;

        // Remove future changes
        kid.changes = kid.changes.filter(c => c.step < currentStep);

        // Build effective current state
        let state = { ...kid };
        for (let j = 0; j < kid.changes.length; j++) {
            if (kid.changes[j].step <= currentStep) {
                state = { ...state, ...kid.changes[j] };
            }
        }

        // Compute new change
        const newChange = { step: step };

        if ("directionDelta" in change) {
            newChange.direction = (state.direction + change.directionDelta + 360) % 360;
        }

        if ("moving" in change) {
            newChange.moving = change.moving;
        }

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
    for (let step of Array.from(snapshots.keys())) {
        if (step > currentStep) {
            snapshots.delete(step);
        }
    }

    // Re-render next step
    simulateToStep(currentStep + 1);
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

function stop(ids = [...selectedIds], step = currentStep) {
    applyChange(ids, { moving: false }, step);
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

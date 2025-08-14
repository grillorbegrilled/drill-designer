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

function right() {
    const change = { directionDelta: 90 };
    change.moving = !turnAndStop;
    applyChange([...selectedIds], change); // Turn right
}

function forward() {
    applyChange([...selectedIds], { moving: true });
}

function left() {
    const change = { directionDelta: 270 };
    change.moving = !turnAndStop;
    applyChange([...selectedIds], change); // Turn right
}

function toTheRear() {
    const change = { directionDelta: 180 };
    change.moving = !turnAndStop;
    applyChange([...selectedIds], change); // Turn right
}

function stop() {
    applyChange([...selectedIds], { moving: false });
}

function obliqueRight() {
    const change = { directionDelta: 45 };
    change.moving = !turnAndStop;
    applyChange([...selectedIds], change); // Turn right
}

function obliqueLeft() {
    const change = { directionDelta: 315 };
    change.moving = !turnAndStop;
    applyChange([...selectedIds], change); // Turn right
}

function obliqueBackLeft() {
    const change = { directionDelta: 225 };
    change.moving = !turnAndStop;
    applyChange([...selectedIds], change); // Turn right
}

function obliqueBackRight() {
    const change = { directionDelta: 135 };
    change.moving = !turnAndStop;
    applyChange([...selectedIds], change); // Turn right
}

function gatePinwheel(vertex, clockwise, steps, selectedKids) {
    if (!areKidsAligned()) {
        alert("Selected kids must be aligned in a straight line.");
        return;
    }


    addGatePinwheelChanges(vertex, clockwise, steps, selectedKids);
    render();
}

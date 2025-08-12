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
    applyChange([...selectedIds], { directionDelta: 90 }); // Turn right
}

function forward() {
    applyChange([...selectedIds], { moving: true });
}

function left() {
    applyChange([...selectedIds], { directionDelta: 270 });
}

function aboutFace() {
    applyChange([...selectedIds], { directionDelta: 180 });
}

function stop() {
    applyChange([...selectedIds], { moving: false });
}

function obliqueRight() {
    applyChange([...selectedIds], { directionDelta: 45 });
}

function obliqueLeft() {
    applyChange([...selectedIds], { directionDelta: 315 });
}

function obliqueBackLeft() {
    applyChange([...selectedIds], { directionDelta: 225 });
}

function obliqueBackRight() {
    applyChange([...selectedIds], { directionDelta: 135 });
}

function gatePinwheel(type, clockwise) {
    if (!areKidsAligned()) {
        alert("Selected kids must be aligned in a straight line.");
        return;
    }

    const vertex = getVertex(type);
    const selectedKids = kids.filter(k => selectedIds.has(k.id));
    const gateSteps = calculateGateSteps(vertex, selectedKids);

    addGatePinwheelChanges(vertex, clockwise, gateSteps);
    render();
}

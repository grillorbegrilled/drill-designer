function applyChange(ids, change) {
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
        const newChange = { step: currentStep };

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
    applyChange(["A", "B", "C", "D"], { direction: 90 }); // Turn right
}

function forward() {
    applyChange(["A", "B", "C", "D"], { moving: true });
}

function left() {
    applyChange(["A", "B", "C", "D"], { direction: 270 });
}

function aboutFace() {
    applyChange(["A", "B", "C", "D"], { direction: 180 });
}

function stop() {
    applyChange(["A", "B", "C", "D"], { moving: false });
}

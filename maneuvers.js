function applyChange(ids, change) {
    for (let i = 0; i < kids.length; i++) {
        const kid = kids[i];

        if (ids.includes(kid.id)) {
            // Remove future changes
            kid.changes = kid.changes.filter(c => c.step < currentStep);

            // Compute new change based on current state
            const newChange = { step: currentStep };

            if ("direction" in change) {
                newChange.direction = (kid.direction + change.direction) % 360;
            }

            if ("stop" in change) {
                newChange.stop = change.stop;
            }

            kid.changes.push(newChange);
        }
    }

    // Remove snapshots beyond currentStep
    for (let step of Array.from(snapshots.keys())) {
        if (step > currentStep) {
            snapshots.delete(step);
        }
    }

    // Re-render next step
    simulateToStep(currentStep + 1);
}

function right() {
    applyChange(["A"], { direction: 90 }); // Turn right
}

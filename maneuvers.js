function applyChange(ids, change) {
    for (let i = 0; i < kids.length; i++) {
        const kid = kids[i];

        if (ids.includes(kid.id)) {
            // Remove future changes
            kid.changes = kid.changes.filter(c => c.step < currentStep);

            // Determine the most recent state
            let lastState = { ...kid };
            for (let j = kid.changes.length - 1; j >= 0; j--) {
                if (kid.changes[j].step <= currentStep) {
                    lastState = { ...lastState, ...kid.changes[j] };
                    break;
                }
            }

            // Check for redundancy
            let isRedundant = true;
            for (let key in change) {
                if (change[key] !== lastState[key]) {
                    isRedundant = false;
                    break;
                }
            }

            if (isRedundant) continue; // Skip if no actual change

            // Apply new change
            kid.changes.push({
                step: currentStep,
                ...change
            });
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

function applyChange(ids, change) {
    if (!Array.isArray(ids) || typeof change !== "object") return;

    kids.forEach(kid => {
        if (ids.includes(kid.id)) {
            // Remove existing changes at currentStep or later
            kid.changes = kid.changes.filter(c => c.step < currentStep);

            // Add new change
            kid.changes.push({
                step: currentStep,
                ...change
            });
        }
    });
}

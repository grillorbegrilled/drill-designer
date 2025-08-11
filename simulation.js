function advance(silent = false) {
    kids.forEach(kid => {
        const change = kid.changes.find(c => c.step === currentStep);
        if (change) {
            if (change.direction !== undefined) kid.direction = change.direction;
            if (change.moving !== undefined) kid.moving = change.moving;
        }

        if (kid.moving) {
            if ([45, 135, 225, 315].includes(kid.direction)) {
                if (kid.direction === 45 || kid.direction === 315) kid.x += 2/3;
                else kid.x -= 2/3;
        
                if (kid.direction === 45 || kid.direction === 135) kid.y += 2/3;
                else kid.y -= 2/3;
    
                const lastChange = [...kid.changes]
                    .filter(c => c.step < currentStep)
                    .sort((a, b) => b.step - a.step)[0];

                if (lastChange && (currentStep - lastChange.step + 1) % 6 === 0) { // +1 because currentStep doesn't update till after the updates.
                    kid.x = Math.round(kid.x);
                    kid.y = Math.round(kid.y);
                }
            } else {
                const radians = (kid.direction * Math.PI) / 180;
                kid.x += Math.cos(radians);
                kid.y += Math.sin(radians);
            }
        }
    });

    currentStep++;
    if (currentStep % 16 === 0) snapshots.set(currentStep, cloneKidStates());

    if (!silent) render();
}

function simulateToStep(targetStep) {
    let nearestSnapshotStep = 0;
    for (let s of Array.from(snapshots.keys()).sort((a, b) => b - a)) {
        if (s <= targetStep) {
            nearestSnapshotStep = s;
            break;
        }
    }

    applySnapshot(snapshots.get(nearestSnapshotStep));
    currentStep = nearestSnapshotStep;

    for (let step = nearestSnapshotStep; step < targetStep; step++) {
        advance(true);
    }

    render();
}

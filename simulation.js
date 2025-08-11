function advance(silent = false) {
    kids.forEach(kid => {
        const change = kid.changes.find(c => c.step === currentStep);
        if (change) {
            if (change.direction !== undefined) kid.direction = change.direction;
            if (change.moving !== undefined) kid.moving = change.moving;
        }

        if (kid.moving) {
            const radians = (kid.direction * Math.PI) / 180;
            kid.x += Math.cos(radians);
            kid.y += Math.sin(radians);
        }
    });

    currentStep++;
    if (currentStep % 16 === 0) {
        snapshots.set(currentStep, cloneKidStates());
    }

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

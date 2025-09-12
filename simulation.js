function advance(silent = false) {
    kids.forEach(kid => {
        const change = kid.ch.find(c => c.s === currentStep);
        var stepSize = 1;
        
        if (change) {
            if (change.d !== undefined) kid.d = change.d;
            if (change.m !== undefined) kid.m = change.m;
            if (change.ss !== undefined) stepSize = change.ss;
            //hate to do this, but it's necessary for pinwheels and gates. 
            if (change.x !== undefined) kid.x = change.x;
            if (change.y !== undefined) kid.y = change.y;
        }

        if (kid.m && change?.x === undefined && change?.y === undefined) {
            if (change?.ss === undefined && kid.d % 45 === 0 && kid.d % 2 === 1) {
                if (kid.d === 45 || kid.d === 315) kid.x += 2/3;
                else kid.x -= 2/3;
        
                if (kid.d === 45 || kid.d === 135) kid.y += 2/3;
                else kid.y -= 2/3;
    
                const lastChange = [...kid.ch]
                    .filter(c => c.s < currentStep)
                    .sort((a, b) => b.s - a.s)[0];

                if (lastChange && (currentStep - lastChange.s + 1) % 6 === 0) { // +1 because currentStep doesn't update till after the updates.
                    kid.x = Math.round(kid.x);
                    kid.y = Math.round(kid.y);
                }
            } else {
                const radians = (kid.d * Math.PI) / 180;
                kid.x += Math.cos(radians) * stepSize;
                kid.y += Math.sin(radians) * stepSize;
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

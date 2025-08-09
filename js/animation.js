// js/animation.js
function cloneKidStates() {
    return kids.map(function (kid) {
        return {
            id: kid.id,
            x: kid.x,
            y: kid.y,
            direction: kid.direction,
            moving: kid.moving,
            color: kid.color
        };
    });
}

function applySnapshot(state) {
    if (!state) return;
    kids.forEach(function (kid) {
        var match = state.find(function (s) { return s.id === kid.id; });
        if (match) {
            kid.x = match.x;
            kid.y = match.y;
            kid.direction = match.direction;
            kid.moving = match.moving;
            kid.color = match.color;
        }
    });
}

function advance(silent) {
    silent = !!silent;
    kids.forEach(function (kid) {
        var change = (kid.changes || []).find(function (c) { return c.step === currentStep; });
        if (change) {
            if (change.direction !== undefined) kid.direction = change.direction;
            if (change.stop) kid.moving = false;
        }

        if (kid.moving) {
            var radians = (kid.direction * Math.PI) / 180;
            kid.x += Math.cos(radians);
            kid.y += Math.sin(radians);
        }
    });

    currentStep++;
    if (currentStep % 16 === 0) {
        snapshots.set(currentStep, JSON.parse(JSON.stringify(cloneKidStates())));
    }

    if (!silent) render();
}

function simulateToStep(targetStep) {
    if (typeof targetStep !== "number" || targetStep < 0) return;

    // find nearest snapshot <= targetStep
    var snapshotSteps = Array.from(snapshots.keys()).sort(function (a, b) { return b - a; });
    var nearestSnapshotStep = 0;
    for (var i = 0; i < snapshotSteps.length; i++) {
        var s = snapshotSteps[i];
        if (s <= targetStep) {
            nearestSnapshotStep = s;
            break;
        }
    }

    applySnapshot(snapshots.get(nearestSnapshotStep));
    currentStep = nearestSnapshotStep;

    for (var step = nearestSnapshotStep; step < targetStep; step++) {
        advance(true);
    }

    render();
}

export let currentStep = 0;
export let isPlaying = false;

export let kids = [
    { id: "A", x: 40, y: 30, direction: 0, moving: true, color: "yellow", changes: [
        { step: 8, direction: 180 },
        { step: 16, stop: true }
    ]},
    { id: "B", x: 40, y: 32, direction: 0, moving: true, color: "red", changes: [
        { step: 8, direction: 180 },
        { step: 16, stop: true }
    ]},
    { id: "C", x: 38, y: 30, direction: 0, moving: true, color: "blue", changes: [
        { step: 8, direction: 180 },
        { step: 16, stop: true }
    ]},
    { id: "D", x: 38, y: 32, direction: 0, moving: true, color: "green", changes: [
        { step: 8, direction: 180 },
        { step: 16, stop: true }
    ]}
];

export const startingFormation = kids.map(kid => ({ ...kid }));

export let snapshots = new Map([[0, JSON.parse(JSON.stringify(startingFormation))]]);

export function cloneKidStates() {
    return kids.map(kid => ({ ...kid }));
}

export function applySnapshot(state) {
    kids.forEach(kid => {
        const match = state.find(s => s.id === kid.id);
        if (match) Object.assign(kid, match);
    });
}

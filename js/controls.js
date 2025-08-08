// controls.js
import { isPlaying, currentStep, snapshots } from './state.js';
import { advance, simulateToStep, applySnapshot } from './animation.js';
import { render } from './render.js';

export function togglePlay() {
    isPlaying = !isPlaying;
    document.getElementById("playBtn").textContent = isPlaying ? "⏹️" : "▶️";
    if (isPlaying) playLoop();
}

export function playLoop() {
    const maxStep = Math.max(...snapshots.keys());
    if (!isPlaying || currentStep >= maxStep) return;
    advance();
    setTimeout(playLoop, 300);
}

export function rewind() {
    isPlaying = false;
    document.getElementById("playBtn").textContent = "▶️";
    currentStep = 0;
    applySnapshot(snapshots.get(0));
    render();
}

export function stepForward() {
    const maxStep = Math.max(...snapshots.keys());
    if (currentStep < maxStep) simulateToStep(currentStep + 1);
}

export function stepBackward() {
    if (currentStep > 0) simulateToStep(currentStep - 1);
}

export function scrubToStep(e) {
    simulateToStep(parseInt(e.target.value));
}

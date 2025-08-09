// js/main.js
var ctx;

window.onload = function () {
    var canvas = document.getElementById("fieldCanvas");
    if (!canvas) return;
    ctx = canvas.getContext("2d");

    var playBtn = document.getElementById("playBtn");
    var rewindBtn = document.getElementById("rewindBtn");
    var stepBackBtn = document.getElementById("stepBackBtn");
    var stepForwardBtn = document.getElementById("stepForwardBtn");
    var scrubSlider = document.getElementById("scrubSlider");

    if (playBtn) playBtn.addEventListener("click", togglePlay);
    if (rewindBtn) rewindBtn.addEventListener("click", rewind);
    if (stepBackBtn) stepBackBtn.addEventListener("click", stepBackward);
    if (stepForwardBtn) stepForwardBtn.addEventListener("click", stepForward);
    if (scrubSlider) scrubSlider.addEventListener("input", scrubToStep);

    render();
};

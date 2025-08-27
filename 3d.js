const viewport = document.getElementById("viewport");
const vctx = viewport.getContext("2d");
const camera = { x: 80, y: 130, z: 7 };
const focalLength = 100;
const objectHeight = 3;

function togglePlay() {
    isPlaying = !isPlaying;
    document.getElementById("playBtn").textContent = isPlaying ? "⏹️" : "▶️";
    document.getElementById("addKidBtn").enabled = false;
    document.getElementById("removeKidBtn").enabled = false;
    if (isPlaying) playLoop();
}

function playLoop() {
    if (!isPlaying) return;
    try {
        advance();
        setTimeout(playLoop, (60 / tempo) * 1000);
    } catch (err) {
        console.log("Render error:", err);
    }
}

function rewind() {
    isPlaying = false;
    document.getElementById("playBtn").textContent = "▶️";
    currentStep = 0;
    document.getElementById("addKidBtn").enabled = true;
    document.getElementById("removeKidBtn").enabled = true;
    applySnapshot(snapshots.get(0));
    render();
}

function stepForward() {
    const maxStep = Math.max(...snapshots.keys());
    if (currentStep < maxStep) simulateToStep(currentStep + 1);
    else advance();
    document.getElementById("addKidBtn").enabled = false;
    document.getElementById("removeKidBtn").enabled = false;
}

function stepBackward() {
    if (currentStep > 0) {
        simulateToStep(currentStep - 1);
    }

    if (currentStep === 0) {
        document.getElementById("addKidBtn").enabled = true;
        document.getElementById("removeKidBtn").enabled = true;
    }
    
}

function scrubToStep(e) {
    const targetStep = parseInt(e.target.value);
    simulateToStep(targetStep);
}

window.onload = () => {
  // Initialize viewport field
  //drawStaticField();
    document.getElementById('loadBtn').addEventListener('click', () => {
      console.log("Load button clicked.");
      const fileInput = document.getElementById('fileInput');
      const file = fileInput.files[0];
      if (!file) {
        alert("Please select a JSON file first.");
        return;
      }

      const reader = new FileReader();
      reader.onload = function(event) {
        console.log("Loading...");
        try {
          const json = JSON.parse(event.target.result);

          if (!Array.isArray(json)) {
            alert("Invalid format: JSON must be an array.");
            return;
          }

          kids = json;
          //alert("JSON loaded successfully! 'kids' array updated.");
          console.log(`Loaded ${kids.length} kids`);
          document.getElementById('projectName').value = file.name.replace(/\.json$/, "");
          setStartingFormation();
          render();
        } catch (e) {
          alert("Error parsing JSON: " + e.message);
        }
      };

        reader.readAsText(file);
    });

    const slider = document.getElementById("tempo-slider");
    const valueDisplay = document.getElementById("tempo-value");
    slider.value = tempo;
    valueDisplay.textContent = tempo;
    slider.addEventListener("input", () => {
      tempo = parseInt(slider.value, 10);
      valueDisplay.textContent = tempo;
    });
    
    document.getElementById("playBtn").addEventListener("click", togglePlay);
    document.getElementById("rewindBtn").addEventListener("click", rewind);
    document.getElementById("stepBackBtn").addEventListener("click", stepBackward);
    document.getElementById("stepForwardBtn").addEventListener("click", stepForward);
    document.getElementById("scrubSlider").addEventListener("input", scrubToStep);

    render();
}

function updateStepDisplay() {
    const display = document.getElementById("stepDisplay");
    if (display) display.textContent = `Step: ${currentStep}`;
}

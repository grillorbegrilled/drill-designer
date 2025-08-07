const canvas = document.getElementById("fieldCanvas");
const ctx = canvas.getContext("2d");

function render() {
    const stepSizeInches = parseFloat(document.getElementById("stepSize").value);
    const { scaleX, scaleY } = drawField(ctx, stepSizeInches);
    drawKids(ctx, kids, scaleX, scaleY);
}

// Event listeners
document.getElementById("stepSize").addEventListener("change", render);
document.getElementById("hashType").addEventListener("change", render);

render();

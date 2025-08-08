const canvas = document.getElementById("fieldCanvas");
const ctx = canvas.getContext("2d");

// Default to 8-to-5 step size
const stepSizeInches = 22.5;

function render() {
    const { scaleX, scaleY } = drawField(ctx, stepSizeInches);
    drawKids(ctx, kids, scaleX, scaleY);
}

// Initial draw
render();

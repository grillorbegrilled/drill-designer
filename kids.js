let kids = [
    { x: 40.5, y: 30.25, color: "yellow" } // in steps
];

function drawKids(ctx, kids, scaleX, scaleY) {
    kids.forEach(kid => {
        ctx.beginPath();
        ctx.arc(kid.x * scaleX, kid.y * scaleY, 5, 0, Math.PI * 2);
        ctx.fillStyle = kid.color;
        ctx.fill();
    });
}

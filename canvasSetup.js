const canvas = document.getElementById("fieldCanvas");
const ctx = canvas.getContext("2d");
const stepSizeInches = 22.5; // 8-to-5 default
const fieldWidthSteps = 84; //round it down. //(160 * 12) / stepSizeInches;  // 85.33 for 8-to-5
const fieldLengthSteps = (300 * 12) / stepSizeInches; // 160 for 8-to-5
const scaleX = ctx.canvas.width / fieldLengthSteps;
const scaleY = ctx.canvas.height / fieldWidthSteps;
let currentStep = 0;
let isPlaying = false;

// --- VIEWPORT SETUP ---
const viewport = document.getElementById('viewport');
const vctx = viewport.getContext('2d');
const camera = { x: 80, y: 130, z: 7 };
const focalLength = 100;
const objectHeight = 3;

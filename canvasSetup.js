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
const viewport = document.getElementById("viewport");
const vctx = viewport.getContext("2d");

// FIELD SETTINGS
const vScaleX = viewport.width / fieldLengthSteps;
const vScaleY = viewport.height / fieldWidthSteps;

// CAMERA / CONE SETTINGS
const cameraAngle = 15 * Math.PI / 180; // 15°
const coneHeight = 3;   // cones 3 steps tall
const coneRadius = 1;   // 1 step radius at top

// --- OFFSCREEN FIELD CANVAS (cached static field) ---
const fieldCache = document.createElement("canvas");
fieldCache.width = viewport.width;
fieldCache.height = viewport.height;
const fctx = fieldCache.getContext("2d");

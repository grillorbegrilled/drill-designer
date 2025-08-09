const canvas = document.getElementById("fieldCanvas");
const ctx = canvas.getContext("2d");

const stepSizeInches = 22.5; // 8-to-5 default
let currentStep = 0;
let isPlaying = false;

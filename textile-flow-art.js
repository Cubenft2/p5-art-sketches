let params = {
  baseResolution: [3840, 2160], // 4K base
  scale: 1, // 0.5 for 2K, 2 for 8K
  strandCount: 100000,
  strandLength: 180,
  strandThickness: 0.5,
  chunkSize: 1000,
  macroNoiseScale: 0.002,
  microNoiseScale: 0.03
};

let strands = [];
let strandIndex = 0;
let seed = 1;

function setup() {
  createCanvas(
    params.baseResolution[0] * params.scale,
    params.baseResolution[1] * params.scale
  );
  colorMode(RGB);
  noFill();
  restartSketch();
}

function restartSketch() {
  randomSeed(seed);
  noiseSeed(seed);
  const w = params.baseResolution[0] * params.scale;
  const h = params.baseResolution[1] * params.scale;
  resizeCanvas(w, h);

  strands = [];
  strandIndex = 0;
  for (let i = 0; i < params.strandCount; i++) {
    strands.push({ x: random(width), y: random(height) });
  }

  background(20);
  drawGrid();
  loop();
}

function draw() {
  for (
    let i = 0;
    i < params.chunkSize && strandIndex < strands.length;
    i++, strandIndex++
  ) {
    drawStrand(strands[strandIndex]);
  }

  if (strandIndex >= strands.length) {
    noLoop();
  }
}

function drawStrand(s) {
  let x = s.x;
  let y = s.y;

  for (let i = 0; i < params.strandLength; i++) {
    const macro =
      noise(x * params.macroNoiseScale, y * params.macroNoiseScale) * TWO_PI * 2;
    const edgeDist = Math.min(width - x, x, height - y);
    const edgeInfluence = constrain(
      map(edgeDist, 0, height * 0.25, 1, 0),
      0,
      1
    );
    const edgeAngle = atan2(-y, width / 2 - x);
    let angle = lerp(macro, edgeAngle, edgeInfluence);
    angle +=
      (noise(
        x * params.microNoiseScale + 1000,
        y * params.microNoiseScale + 1000
      ) - 0.5) * 0.6;

    const nx = x + cos(angle);
    const ny = y + sin(angle);

    stroke(getBandColor(y));
    strokeWeight(params.strandThickness);
    line(x, y, nx, ny);

    x = nx;
    y = ny;
  }
}

function getBandColor(y) {
  const h = height;
  if (y < h / 3) {
    const t = map(y, 0, h / 3, 0, 1);
    return lerpColor(color("#7F1734"), color("#4B244A"), t); // Burgundy -> Plum
  } else if (y < (2 * h) / 3) {
    const t = map(y, h / 3, (2 * h) / 3, 0, 1);
    return lerpColor(color("#008080"), color("#B8A1D1"), t); // Teal -> Lavender
  } else {
    const t = map(y, (2 * h) / 3, h, 0, 1);
    return lerpColor(color("#D6C28B"), color("#6A7BA8"), t); // Faded Gold -> Slate Blue
  }
}

function drawGrid() {
  stroke(255, 15);
  strokeWeight(1);
  for (let x = 0; x <= width; x += 8) {
    line(x, 0, x, height);
  }
  for (let y = 0; y <= height; y += 8) {
    line(0, y, width, y);
  }
}

function keyPressed() {
  if (key === "s" || key === "S") {
    saveCanvas("textile-flow-art", "png");
  } else if (key === "1") {
    params.scale = 0.5; // 2K
    restartSketch();
  } else if (key === "2") {
    params.scale = 1; // 4K
    restartSketch();
  } else if (key === "3") {
    params.scale = 2; // 8K
    restartSketch();
  }
}


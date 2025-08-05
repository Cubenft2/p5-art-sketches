let params;
let strands = [];
let strandIndex = 0;

function setup() {
  params = {
    baseResolution: [3840, 2160], // default 4K
    scale: 1,                     // 0.5 for 2K, 2 for 8K
    strandCount: 50000,           // 50k strands
    strandLength: 180,
    strandThickness: 0.6,
    turbulence: 0.0015,
    chunkSize: 500,
    colors: [
      "#5B2C2C", "#8B3A3A", "#B26E63",
      "#D9A441", "#4C8C8A", "#445B74",
      "#8A7CA1", "#5B3E66", "#6E7D8C"
    ]
  };

  const w = params.baseResolution[0] * params.scale;
  const h = params.baseResolution[1] * params.scale;
  createCanvas(w, h);

  colorMode(HSB, 360, 100, 100, 100);
  noFill();

  // Prepare strands
  for (let i = 0; i < params.strandCount; i++) {
    strands.push({ x: random(width), y: random(height) });
  }

  background(20); // dark backdrop
  drawGrid();
}

function draw() {
  for (let i = 0; i < params.chunkSize && strandIndex < strands.length; i++, strandIndex++) {
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
    const n = noise(x * params.turbulence, y * params.turbulence) * TWO_PI * 2;
    const nx = x + cos(n) * 1.5;
    const ny = y + sin(n) * 1.5;

    // Color based on vertical position with band blending
    const bandPos = constrain(map(y, 0, height, 0, params.colors.length - 1), 0, params.colors.length - 1);
    const idx = floor(bandPos);
    const frac = bandPos - idx;
    const c1 = color(params.colors[idx]);
    const c2 = color(params.colors[min(idx + 1, params.colors.length - 1)]);
    stroke(lerpColor(c1, c2, frac));
    strokeWeight(params.strandThickness);
    line(x, y, nx, ny);

    x = nx;
    y = ny;
  }
}

function drawGrid() {
  stroke(0, 0, 100, 3); // low opacity grid
  strokeWeight(1);
  for (let x = 0; x <= width; x += 20) {
    line(x, 0, x, height);
  }
  for (let y = 0; y <= height; y += 20) {
    line(0, y, width, y);
  }
}

function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('textile-flow-art', 'png');
  }
}

let params;
let strands = [];

function setup() {
  params = {
    resolution: [3840, 2160], // Default 4K
    strandCount: 50000,       // 50k strands
    strandLength: 180,
    strandThickness: 0.6,
    turbulence: 0.0015,
    bands: 8,
    colors: [
      "#8B3A3A", "#A14D3A", "#D9A441",
      "#6E7D8C", "#8A7CA1", "#445B74",
      "#B1746F", "#5B3E66"
    ]
  };

  createCanvas(params.resolution[0], params.resolution[1]);
  colorMode(HSB, 360, 100, 100, 100);
  noLoop();

  // Generate strands
  for (let i = 0; i < params.strandCount; i++) {
    strands.push({
      x: random(width),
      y: random(height),
      band: floor(map(random(height), 0, height, 0, params.bands))
    });
  }

  background(20); // Dark background
}

function draw() {
  // Chunked rendering: draw 500 strands per frame
  let chunk = 500;
  for (let i = 0; i < chunk && strands.length > 0; i++) {
    drawStrand(strands.pop());
  }
  if (strands.length > 0) {
    requestAnimationFrame(draw); // Continue next frame
  }
}

function drawStrand(s) {
  let x = s.x;
  let y = s.y;
  let baseColor = color(params.colors[s.band]);
  let nextColor = color(params.colors[(s.band + 1) % params.colors.length]);

  beginShape();
  for (let i = 0; i < params.strandLength; i++) {
    let n = noise(x * params.turbulence, y * params.turbulence) * TWO_PI * 2;
    x += cos(n) * 1.5;
    y += sin(n) * 1.5;

    let c = lerpColor(baseColor, nextColor, i / params.strandLength);
    stroke(c);
    strokeWeight(params.strandThickness);
    vertex(x, y);
  }
  endShape();
}

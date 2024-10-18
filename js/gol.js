const CELL_SIZE = 10;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

const cellsWide = Math.floor(width / CELL_SIZE);
const cellsHigh = Math.floor(height / CELL_SIZE);

let delay = 100;
let matrix = createMatrix(cellsWide, cellsHigh);
let nextMatrix = createMatrix(cellsWide, cellsHigh);
let isRunning = true;
let iteration = 0;

function createMatrix(width, height) {
  return Array(height).fill().map(() => Array(width).fill(0));
}

function drawGlider() {
  const glider = [[0, 0], [1, 0], [2, 0], [2, 1], [1, 2]];
  glider.forEach(([x, y]) => matrix[y][x] = 1);
}

function toggleCell(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / CELL_SIZE);
  const y = Math.floor((event.clientY - rect.top) / CELL_SIZE);
  matrix[y][x] = 1 - matrix[y][x];
  paintCell(x, y, matrix[y][x]);
}

function paintCell(x, y, alive) { // paint a cell   
  ctx.fillStyle = alive ? 'black' : 'white';
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';  // Light gray with 50% opacity for the cell border
  ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

function paintMatrix() { // paint the matrix    
  for (let y = 0; y < cellsHigh; y++) {
    for (let x = 0; x < cellsWide; x++) {
      paintCell(x, y, matrix[y][x]);
    }
  }
}

function countNeighbors(x, y) { // count the number of neighbors of a cell
  let count = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      const nx = (x + dx + cellsWide) % cellsWide;
      const ny = (y + dy + cellsHigh) % cellsHigh;
      count += matrix[ny][nx];
    }
  }
  return count; 
}

function nextGeneration() { // calculate the next generation
  for (let y = 0; y < cellsHigh; y++) {
    for (let x = 0; x < cellsWide; x++) {
      const neighbors = countNeighbors(x, y);
      nextMatrix[y][x] = (matrix[y][x] && (neighbors === 2 || neighbors === 3)) || (!matrix[y][x] && neighbors === 3) ? 1 : 0;
    }
  }
  [matrix, nextMatrix] = [nextMatrix, matrix]; // swap the matrices
}

function update() { // update the matrix
  if (isRunning) {
    nextGeneration(); // calculate the next generation
    paintMatrix(); // paint the matrix
    iteration++; // increment the iteration
  }
}

function init() { // Initialize the Game of Life    
  drawGlider(); // draw a glider
  paintMatrix(); // paint the matrix
  gameLoop = setInterval(update, delay); // update the matrix at regular intervals
}

function updateDelay() { // update the delay
  delay = document.getElementById('delay').value; // get the delay from the input field
  clearInterval(gameLoop); // clear the interval
  gameLoop = setInterval(update, delay); // set the interval
}   

canvas.addEventListener('mousedown', toggleCell); // toggle a cell when the mouse is clicked

document.getElementById('delay').addEventListener('input', updateDelay);

document.addEventListener('keydown', (e) => { // toggle the running state when the space bar is pressed
  if (e.code === 'Space') {
    isRunning = !isRunning;
  }
});

init();

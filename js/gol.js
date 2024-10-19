const CELL_SIZE = 10;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const GLIDER = [[0, 0], [1, 0], [2, 0], [2, 1], [1, 2]];
const RPENTOMINO = [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]];
const SPACESHIP = [[1, 0], [4, 0], [0, 1], [0, 2], [4, 2], [0, 3], [1, 3], [2, 3], [3, 3]];
const GLIDERGUN = [
  [24, 0], [22, 1], [24, 1], [12, 2], [13, 2], [20, 2], [21, 2], [34, 2], [35, 2], 
  [11, 3], [15, 3], [20, 3], [21, 3], [34, 3], [35, 3], [0, 4], [1, 4], [10, 4], 
  [16, 4], [20, 4], [21, 4], [0, 5], [1, 5], [10, 5], [14, 5], [16, 5], [17, 5], 
  [22, 5], [24, 5], [10, 6], [16, 6], [24, 6], [11, 7], [15, 7], [12, 8], [13, 8]
];

let delay = 100;
let width = 800;
let height = 800;
let cellSize = 10;
let cellsWide = Math.floor(width / cellSize);
let cellsHigh = Math.floor(height / cellSize);
let matrix = createMatrix(cellsWide, cellsHigh);
let nextMatrix = createMatrix(cellsWide, cellsHigh);
let isRunning = true;
let iteration = 0;

function createMatrix(width, height) {
  return Array(height).fill().map(() => Array(width).fill(0));
}

function toggleCell(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / cellSize);
  const y = Math.floor((event.clientY - rect.top) / cellSize);
  matrix[y][x] = 1 - matrix[y][x];
  paintCell(x, y, matrix[y][x]);
}

function paintCell(x, y, alive) { // paint a cell   
  ctx.fillStyle = alive ? 'black' : 'white';
  ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';  // Light gray with 50% opacity for the cell border
  ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
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
  paintMatrix(); // paint the matrix
  gameLoop = setInterval(update, delay); // update the matrix at regular intervals
}

canvas.addEventListener('mousedown', toggleCell); // toggle a cell when the mouse is clicked

// update the delay when the slider is moved   
document.getElementById('delay').addEventListener('input', updateDelay);
function updateDelay() { // update the delay
    delay = document.getElementById('delay').value; // get the delay from the input field
    clearInterval(gameLoop); // clear the interval
    gameLoop = setInterval(update, delay); // set the interval
  }

// update the width when the slider is moved
document.getElementById('width').addEventListener('input', updateWidth);
function updateWidth() {
    width = parseInt(document.getElementById('width').value); // get the width from the input field
    cellsWide = Math.floor(width / cellSize);
    canvas.width = width;
    matrix = createMatrix(cellsWide, cellsHigh);
    nextMatrix = createMatrix(cellsWide, cellsHigh);
    clearInterval(gameLoop);
    paintMatrix();
    gameLoop = setInterval(update, delay);
}

// update the height when the slider is moved
document.getElementById('height').addEventListener('input', updateHeight);
function updateHeight() {
    height = parseInt(document.getElementById('height').value); // get the height from the input field
    cellsHigh = Math.floor(height / cellSize);
    canvas.height = height;
    matrix = createMatrix(cellsWide, cellsHigh);
    nextMatrix = createMatrix(cellsWide, cellsHigh);
    clearInterval(gameLoop);    
    paintMatrix();
    gameLoop = setInterval(update, delay);
}   

// update the cell size when the slider is moved
document.getElementById('cellSize').addEventListener('input', updateCellSize);
function updateCellSize() {
    cellSize = parseInt(document.getElementById('cellSize').value); // get the cell size from the input field
    canvas.width = width;
    canvas.height = height;
    matrix = createMatrix(cellsWide, cellsHigh);
    nextMatrix = createMatrix(cellsWide, cellsHigh);
    clearInterval(gameLoop);
    paintMatrix();
    gameLoop = setInterval(update, delay);
}

// find the centre of the matrix    
function findCentre() { 
    let centreX = Math.floor(cellsWide / 2);
    let centreY = Math.floor(cellsHigh / 2);
    return [centreX, centreY];
}

// draw a pattern at the centre when an option is selected  
document.getElementById('drawPatternBtn').addEventListener('click', function() {
    const patternName = document.getElementById('draw').value;
    drawPattern(patternName);
});
function drawPattern(patternName) {
    const centre = findCentre();
    let pattern;
    switch (patternName) {
        case 'glider':
            pattern = GLIDER;
            break;
        case 'rpentomino':
            pattern = RPENTOMINO;
            break;
        case 'spaceship':
            pattern = SPACESHIP;
            break;
        case 'gliderGun':
            pattern = GLIDERGUN;
            break;
        default:
            console.error('Unknown pattern:', patternName);
            return;
    }
    // Find the dimensions of the pattern
    const patternWidth = Math.max(...pattern.map(([x, _]) => x)) + 1;
    const patternHeight = Math.max(...pattern.map(([_, y]) => y)) + 1;
    // Calculate the offset to center the pattern
    const offsetX = Math.floor(centre[0] - patternWidth / 2);
    const offsetY = Math.floor(centre[1] - patternHeight / 2);

    pattern.forEach(([x, y]) => {
        const newX = x + offsetX;
        const newY = y + offsetY;
        if (newX >= 0 && newX < cellsWide && newY >= 0 && newY < cellsHigh) {
            matrix[newY][newX] = 1;
        }
    });
    paintMatrix();
}
document.addEventListener('keydown', (e) => { // toggle the running state when the space bar is pressed
  if (e.code === 'Space') {
    isRunning = !isRunning;
  }
});

document.addEventListener('DOMContentLoaded', function() {
  init();
});

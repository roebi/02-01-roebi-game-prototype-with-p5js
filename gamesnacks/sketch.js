let boardSize = 600;
let cols = 5;
let rows = 8;
let tileWidth = boardSize / cols;
let tileHeight = boardSize / rows;
let grid = [];
let playerScore = 0;
let highScore = 0;
let currentRow = 0;
let pressedTiles = [];
let leftMargin = 60;
let rowNumberWidth = 25;
let availableTiles = []; // Array to store available tiles for selection

function setup() {
  createCanvas(720, 1280);
  initializeGrid();
}

function initializeGrid() {
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(1, 10));
    }
  }
  currentRow = 0;
  pressedTiles = [];
  availableTiles = Array.from({ length: cols }, (_, i) => ({ col: i, row: rows - 1 }));
}

function draw() {
  background(240);
  
  // Draw game board
  fill(200);
  rect(leftMargin, 60, boardSize, boardSize);
  
  // Draw vertical lines
  stroke(0);
  strokeWeight(2);
  line(leftMargin - rowNumberWidth, 60, leftMargin - rowNumberWidth, 60 + boardSize);
  line(leftMargin - 1, 60, leftMargin - 1, 60 + boardSize);
  line(leftMargin + boardSize + 20, 60, leftMargin + boardSize + 20, 60 + boardSize);
  
  // Reset stroke settings
  noStroke();
  
  // Draw row numbers
  textSize(18);
  fill(0);
  textAlign(RIGHT, CENTER);
  for (let j = 0; j < rows; j++) {
    text(rows - j, leftMargin - 5, 60 + j * tileHeight + tileHeight / 2);
  }
  
  // Draw grid with random numbers and color pressed and available tiles
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (pressedTiles.some(tile => tile.col === i && tile.row === j)) {
        fill(100, 200, 100); // Green color for pressed tiles
      } else if (availableTiles.some(tile => tile.col === i && tile.row === j)) {
        fill(255, 255, 150); // Light yellow for available tiles
      } else {
        fill(255);
      }
      rect(leftMargin + i * tileWidth, 60 + j * tileHeight, tileWidth, tileHeight);
      fill(0);
      textSize(24);
      textAlign(CENTER, CENTER);
      text(grid[i][j], leftMargin + i * tileWidth + tileWidth / 2, 60 + j * tileHeight + tileHeight / 2);
    }
  }
  
  // Draw transparent bar with frame over the current row
  if (currentRow < rows) {
    fill(255, 255, 0, 100);
    rect(leftMargin - rowNumberWidth, 60 + boardSize - (currentRow + 1) * tileHeight, boardSize + rowNumberWidth + 20, tileHeight);
    noFill();
    stroke(200, 200, 0);
    strokeWeight(2);
    rect(leftMargin - rowNumberWidth, 60 + boardSize - (currentRow + 1) * tileHeight, boardSize + rowNumberWidth + 20, tileHeight);
    noStroke();
  }
  
  // Draw caret characters below each column
  textSize(32);
  fill(0);
  for (let i = 0; i < cols; i++) {
    text("^", leftMargin + i * tileWidth + tileWidth / 2, 60 + boardSize + 30);
  }
  
  // Draw UI elements
  drawButton(leftMargin, 700, 200, 60, "New Game");
  drawButton(leftMargin + 400, 700, 200, 60, "Reset Score");
  
  // Draw player info
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Player 1", leftMargin, 800);
  text("Score: " + playerScore, leftMargin, 830);
  text("High Score: " + highScore, leftMargin, 860);
  
  // Draw cards area
  fill(220);
  rect(leftMargin, 900, boardSize, 300);
  text("Cards", leftMargin, 890);
}

function drawButton(x, y, w, h, label) {
  fill(100);
  rect(x, y, w, h, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  text(label, x + w/2, y + h/2);
}

function mousePressed() {
  if (mouseX >= leftMargin && mouseX <= leftMargin + boardSize && mouseY >= 60 && mouseY <= 60 + boardSize) {
    let col = floor((mouseX - leftMargin) / tileWidth);
    let row = floor((mouseY - 60) / tileHeight);
    
    if (availableTiles.some(tile => tile.col === col && tile.row === row)) {
      playerScore += grid[col][row];
      pressedTiles.push({col: col, row: row});
      currentRow++;
      if (playerScore > highScore) {
        highScore = playerScore;
      }
      
      // Update available tiles for the next move
      availableTiles = [];
      if (row > 0) {
        availableTiles.push({col: col, row: row - 1}); // Tile directly above
        if (col > 0) availableTiles.push({col: col - 1, row: row - 1}); // Tile above and to the left
        if (col < cols - 1) availableTiles.push({col: col + 1, row: row - 1}); // Tile above and to the right
      }
    }
  }
  
  if (mouseX >= leftMargin && mouseX <= leftMargin + 200 && mouseY >= 700 && mouseY <= 760) {
    initializeGrid();
    playerScore = 0;
  }
  
  if (mouseX >= leftMargin + 400 && mouseX <= leftMargin + 600 && mouseY >= 700 && mouseY <= 760) {
    playerScore = 0;
  }
}

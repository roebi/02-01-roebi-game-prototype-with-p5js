let boardSize = 600;
let cols = 5;
let rows = 8;
let tileWidth = boardSize / cols;
let tileHeight = boardSize / rows;
let grid = [];
let playerScore = 0;
let highScore = 0; // Track the high score
let currentRow = 0; // Track the current row for the bar
let pressedTiles = []; // Array to store pressed tiles

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
}

function draw() {
  background(240);
  
  // Draw game board
  fill(200);
  rect(60, 60, boardSize, boardSize);
  
  // Draw vertical lines
  stroke(0);
  strokeWeight(2);
  line(40, 60, 40, 60 + boardSize);  // Left line
  line(boardSize + 80, 60, boardSize + 80, 60 + boardSize);  // Right line
  
  // Reset stroke settings
  noStroke();
  
  // Draw row numbers
  textSize(18);
  fill(0);
  textAlign(RIGHT, CENTER);
  for (let j = 0; j < rows; j++) {
    text(rows - j, 35, 60 + j * tileHeight + tileHeight / 2);
  }
  
  // Draw grid with random numbers and color pressed tiles
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      if (pressedTiles.some(tile => tile.col === i && tile.row === j)) {
        fill(100, 200, 100); // Green color for pressed tiles
      } else {
        fill(255);
      }
      rect(60 + i * tileWidth, 60 + j * tileHeight, tileWidth, tileHeight);
      fill(0);
      textSize(24);
      textAlign(CENTER, CENTER);
      text(grid[i][j], 60 + i * tileWidth + tileWidth / 2, 60 + j * tileHeight + tileHeight / 2);
    }
  }
  
  // Draw transparent bar with frame over the current row
  if (currentRow < rows) {
    // Draw the transparent bar
    fill(255, 255, 0, 100); // Yellow with 100/255 alpha (semi-transparent)
    rect(35, 60 + boardSize - (currentRow + 1) * tileHeight, boardSize + 45, tileHeight);
    
    // Draw the frame around the bar
    noFill();
    stroke(200, 200, 0); // Darker yellow for the frame
    strokeWeight(2);
    rect(35, 60 + boardSize - (currentRow + 1) * tileHeight, boardSize + 45, tileHeight);
    noStroke(); // Reset stroke
  }
  
  // Draw caret characters below each column
  textSize(32);
  fill(0);
  for (let i = 0; i < cols; i++) {
    text("^", 60 + i * tileWidth + tileWidth / 2, 60 + boardSize + 30);
  }
  
  // Draw UI elements
  drawButton(60, 700, 200, 60, "New Game");
  drawButton(460, 700, 200, 60, "Reset Score");
  
  // Draw player info
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Player 1", 60, 800);
  text("Score: " + playerScore, 60, 830);
  text("High Score: " + highScore, 60, 860);
  
  // Draw cards area
  fill(220);
  rect(60, 900, boardSize, 300);
  text("Cards", 60, 890);
}

function drawButton(x, y, w, h, label) {
  fill(100);
  rect(x, y, w, h, 10);
  fill(255);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);
}

function mousePressed() {
  if (mouseX >= 60 && mouseX <= 60 + boardSize && mouseY >= 60 && mouseY <= 60 + boardSize) {
    let col = floor((mouseX - 60) / tileWidth);
    let row = floor((mouseY - 60) / tileHeight);
    
    // Check if the pressed tile is in the current row
    if (row === rows - currentRow - 1 && !pressedTiles.some(tile => tile.col === col && tile.row === row)) {
      playerScore += grid[col][row];
      pressedTiles.push({col: col, row: row});
      
      // Move the bar to the next row
      currentRow++;
      
      // Update high score if needed
      if (playerScore > highScore) {
        highScore = playerScore;
      }
    }
  }
  
  if (mouseX >= 60 && mouseX <= 260 && mouseY >= 700 && mouseY <= 760) {
    initializeGrid();
    playerScore = 0;
  }
  
  if (mouseX >= 460 && mouseX <= 660 && mouseY >= 700 && mouseY <= 760) {
    playerScore = 0;
  }
}

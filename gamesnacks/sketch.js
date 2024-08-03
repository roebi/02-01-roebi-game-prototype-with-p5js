let boardSize = 600;
let cols = 5;
let rows = 8;
let tileWidth = boardSize / cols;
let tileHeight = boardSize / rows;
let grid = [];
let playerScore = 0;

function setup() {
  createCanvas(720, 1280);
  initializeGrid();
}

function initializeGrid() {
  // Initialize the grid with random numbers between 1 and 9
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(1, 10));
    }
  }
}

function draw() {
  background(240);
  
  // Draw game board
  fill(200);
  rect(60, 60, boardSize, boardSize);
  
  // Draw vertical lines
  stroke(0);  // Set line color to black
  strokeWeight(2);  // Set line thickness
  line(40, 60, 40, 60 + boardSize);  // Left line
  line(boardSize + 80, 60, boardSize + 80, 60 + boardSize);  // Right line
  
  // Reset stroke settings
  noStroke();
  
  // Draw grid with random numbers
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      fill(255);
      rect(60 + i * tileWidth, 60 + j * tileHeight, tileWidth, tileHeight);
      fill(0);
      textSize(24);
      textAlign(CENTER, CENTER);
      text(grid[i][j], 60 + i * tileWidth + tileWidth / 2, 60 + j * tileHeight + tileHeight / 2);
    }
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
  // Check if the click is within the game board
  if (mouseX >= 60 && mouseX <= 60 + boardSize && mouseY >= 60 && mouseY <= 60 + boardSize) {
    // Calculate which tile was clicked
    let col = floor((mouseX - 60) / tileWidth);
    let row = floor((mouseY - 60) / tileHeight);
    
    // Add the tile's value to the player's score
    playerScore += grid[col][row];
    
    // Reset the tile's value
    grid[col][row] = floor(random(1, 10));
  }
  
  // Check if the New Game button was clicked
  if (mouseX >= 60 && mouseX <= 260 && mouseY >= 700 && mouseY <= 760) {
    initializeGrid();
    playerScore = 0;
  }
  
  // Check if the Reset Score button was clicked
  if (mouseX >= 460 && mouseX <= 660 && mouseY >= 700 && mouseY <= 760) {
    playerScore = 0;
  }
}

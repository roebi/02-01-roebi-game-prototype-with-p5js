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
let availableTiles = [];
let maxScore = 0;
let minScore = Infinity;

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
  calculatePathScores();
}

function calculatePathScores() {
  maxScore = 0;
  minScore = Infinity;
  for (let i = 0; i < cols; i++) {
    let score = calculatePathScore(i, rows - 1, 0);
    maxScore = max(maxScore, score);
    minScore = min(minScore, score);
  }
}

function calculatePathScore(col, row, currentScore) {
  if (row < 0) return currentScore;
  let score = currentScore + grid[col][row];
  let scores = [score];
  if (col > 0) scores.push(calculatePathScore(col - 1, row - 1, score));
  if (col < cols - 1) scores.push(calculatePathScore(col + 1, row - 1, score));
  scores.push(calculatePathScore(col, row - 1, score));
  return max(scores);
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
  
  // Draw performance rating
  let performancePercentage = ((playerScore - minScore) / (maxScore - minScore)) * 100;
  let stars = Math.min(3, Math.floor(performancePercentage / 50) + 1);
  drawStars(leftMargin, 890, stars);
  
  // Draw cards area
  fill(220);
  rect(leftMargin, 900, boardSize, 300);
  text("Cards", leftMargin, 890);
}

function drawStars(x, y, stars) {
  for (let i = 0; i < 3; i++) {
    if (i < stars) {
      fill(255, 215, 0); // Gold color for filled stars
    } else {
      fill(200); // Gray color for empty stars
    }
    star(x + i * 40, y, 15, 30, 5);
  }
}

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
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

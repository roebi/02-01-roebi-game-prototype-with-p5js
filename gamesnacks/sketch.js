let boardSize = 600;
let cols, rows;
let tileWidth, tileHeight;
let grid = [];
let playerScore = 0;
let highScores = [];
let currentRow = 0;
let pressedTiles = [];
let leftMargin = 60;
let rowNumberWidth = 25;
let availableTiles = [];
let maxScore = 0;
let minScore = Infinity;
let currentLevel = 0;
let gameState = "LEVEL_SELECT"; // LEVEL_SELECT, PLAYING, LEVEL_COMPLETE
let levels = [];

function setup() {
  createCanvas(720, 1280);
  initializeLevels();
}

function initializeLevels() {
  for (let i = 3; i <= 9; i++) {
    levels.push({
      cols: 2,
      rows: i,
      highScore: 0,
      stars: 0,
      unlocked: i === 3
    });
  }
}

function initializeGrid() {
  cols = levels[currentLevel].cols;
  rows = levels[currentLevel].rows;
  tileWidth = boardSize / cols;
  tileHeight = boardSize / rows;
  
  grid = [];
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(1, 10));
    }
  }
  resetLevel();
  calculatePathScores();
}

function resetLevel() {
  currentRow = 0;
  pressedTiles = [];
  availableTiles = Array.from({ length: cols }, (_, i) => ({ col: i, row: rows - 1 }));
  playerScore = 0;
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
  
  if (gameState === "LEVEL_SELECT") {
    drawLevelSelect();
  } else if (gameState === "PLAYING") {
    drawGame();
  } else if (gameState === "LEVEL_COMPLETE") {
    drawLevelComplete();
  }
}

function drawLevelSelect() {
  textSize(32);
  fill(0);
  textAlign(CENTER, TOP);
  text("Select Level", width / 2, 30); // Title position
  
  // Adjusted position for the levels list to be at the top
  for (let i = levels.length - 1; i >= 0; i--) {
    let y = 100 + (levels.length - 1 - i) * 120; // Start from y = 100
    fill(levels[i].unlocked ? 200 : 100);
    rect(width / 2 - 150, y, 300, 100, 10);
    
    fill(0);
    textSize(24);
    textAlign(LEFT, CENTER);
    text("Level " + (i + 1), width / 2 - 70, y + 30); // Level text on the left
    
    // Draw stars on the right
    drawStars(width / 2 + 50, y + 60, levels[i].stars); // Adjusted Y position for stars
  }
}

function drawGame() {
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
  drawButton(leftMargin, 700, 200, 60, "Retry");
  drawButton(leftMargin + 400, 700, 200, 60, "Cancel");
  
  // Draw player info
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Level " + (currentLevel + 1), leftMargin, 800);
  text("Score: " + playerScore, leftMargin, 830);
}

function drawLevelComplete() {
  textSize(32);
  fill(0);
  textAlign(CENTER, TOP);
  text("Level " + (currentLevel + 1) + " Complete!", width / 2, 50);
  
  let performancePercentage = ((playerScore - minScore) / (maxScore - minScore)) * 100;
  let stars = Math.min(3, Math.floor(performancePercentage / 50) + 1);
  
  // Update the stars for the current level
  levels[currentLevel].stars = max(levels[currentLevel].stars, stars);
  
  drawStars(width / 2 - 75, 150, stars);
  
  textSize(24);
  text("Score: " + playerScore, width / 2, 250);
  
  // Offer retry if 0 or 1 star
  if (stars <= 1) {
    drawButton(width / 2 - 150, 350, 300, 60, "Retry Level");
  }
  
  // Offer continue if 2 or 3 stars
  if (stars >= 2 && currentLevel < levels.length - 1) {
    drawButton(width / 2 - 150, 350, 300, 60, "Continue to Next Level");
  }
  
  drawButton(width / 2 - 150, 450, 300, 60, "Level Select");
}

function drawStars(x, y, stars) {
  const starSpacing = 50; // Adjust the spacing between stars
  for (let i = 0; i < 3; i++) {
    if (i < stars) {
      fill(255, 215, 0); // Gold color for filled stars
    } else {
      fill(200); // Gray color for empty stars
    }
    star(x + i * starSpacing, y, 15, 30, 5);
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
  textSize(20);
  text(label, x + w/2, y + h/2);
}

function mousePressed() {
  if (gameState === "LEVEL_SELECT") {
    for (let i = levels.length - 1; i >= 0; i--) {
      let y = 100 + (levels.length - 1 - i) * 120; // Adjusted position for levels
      if (mouseX > width / 2 - 150 && mouseX < width / 2 + 150 &&
          mouseY > y && mouseY < y + 100 && levels[i].unlocked) {
        currentLevel = i;
        gameState = "PLAYING";
        initializeGrid();
        break;
      }
    }
  } else if (gameState === "PLAYING") {
    if (mouseX >= leftMargin && mouseX <= leftMargin + boardSize && mouseY >= 60 && mouseY <= 60 + boardSize) {
      let col = floor((mouseX - leftMargin) / tileWidth);
      let row = floor((mouseY - 60) / tileHeight);
      
      if (availableTiles.some(tile => tile.col === col && tile.row === row)) {
        playerScore += grid[col][row];
        pressedTiles.push({col: col, row: row});
        currentRow++;
        
        if (currentRow === rows) {
          gameState = "LEVEL_COMPLETE";
          let performancePercentage = ((playerScore - minScore) / (maxScore - minScore)) * 100;
          let stars = Math.min(3, Math.floor(performancePercentage / 50) + 1);
          levels[currentLevel].stars = max(levels[currentLevel].stars, stars);
          levels[currentLevel].highScore = max(levels[currentLevel].highScore, playerScore);
          if (currentLevel < levels.length - 1) {
            levels[currentLevel + 1].unlocked = true;
          }
        } else {
          // Update available tiles for the next move
          availableTiles = [];
          if (row > 0) {
            availableTiles.push({col: col, row: row - 1}); // Tile directly above
            if (col > 0) availableTiles.push({col: col - 1, row: row - 1}); // Tile above and to the left
            if (col < cols - 1) availableTiles.push({col: col + 1, row: row - 1}); // Tile above and to the right
          }
        }
      }
    }
    
    if (mouseX >= leftMargin && mouseX <= leftMargin + 200 && mouseY >= 700 && mouseY <= 760) {
      resetLevel();
    }
    
    if (mouseX >= leftMargin + 400 && mouseX <= leftMargin + 600 && mouseY >= 700 && mouseY <= 760) {
      gameState = "LEVEL_SELECT";
    }
  } else if (gameState === "LEVEL_COMPLETE") {
    let performancePercentage = ((playerScore - minScore) / (maxScore - minScore)) * 100;
    let stars = Math.min(3, Math.floor(performancePercentage / 50) + 1);
    
    // Retry Level (for 0 or 1 star)
    if (stars <= 1 && 
        mouseX > width / 2 - 150 && mouseX < width / 2 + 150 &&
        mouseY > 350 && mouseY < 410) {
      resetLevel();
      gameState = "PLAYING";
    }
    
    // Continue to Next Level (for 2 or 3 stars)
    if (stars >= 2 && currentLevel < levels.length - 1 &&
        mouseX > width / 2 - 150 && mouseX < width / 2 + 150 &&
        mouseY > 350 && mouseY < 410) {
      currentLevel++;
      gameState = "PLAYING";
      initializeGrid();
    }
    
    // Level Select
    if (mouseX > width / 2 - 150 && mouseX < width / 2 + 150 &&
        mouseY > 450 && mouseY < 510) {
      gameState = "LEVEL_SELECT";
    }
  }
}

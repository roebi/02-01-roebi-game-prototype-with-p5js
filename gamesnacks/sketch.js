
// for formatting use https://standardjs.com/

// define variables
// let colorem = ['background.jpg']
let oneToOneSquareAspectRatioFrameSize = 1080
let dim1920 = 1920
let dim1080 = 1080
let oneToOneSquareAspectRatioFrameSize = dim1080

// preload assets, i.e. images and sounds
function preload() {
  // aimage = loadImage('aimage.jpg')
  // asound = loadSound('asound.mp3')
}

// setup the canvas, define fonts, generate initial items, start run loop
function setup() {
  createCanvas(oneToOneSquareAspectRatioFrameSize, oneToOneSquareAspectRatioFrameSize);
  // textFont('A Font')
}

// draw all new states, runs about 60 times a second
function draw() {
  background(240)
  
  // google color picker: https://g.co/kgs/KsmaESc
  fill('yellow') // default white
  stroke('orange') // default black
  strokeWeight(20)
  circle(550, 50, 100)
  // ellipse()
  // square()
  // rect()
  // quad()
  // triangle()
  // line()
  // point()
  // arc()
  // textSize(10)
  // text('text', 80, 100)
  // text('mouse', mouseX, mouseY)
  // width: The width of the canvas
  // height: The height of the canvas
  // pmouseX: The previous x-coordinate of the mouse
  // pmouseY:The previous y-coordinate of the mouse
}

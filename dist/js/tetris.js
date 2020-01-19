const canvas = document.getElementById('tetris'); // eerst het camvas oproepen
const context = canvas.getContext('2d'); // get context out because can't draw on DOM element?

context.scale(20, 20);

// defining how the tetris blocks look like in a matrix
// in ARRAY - ARRAY

const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
]

// collision detection to use in playerDrop

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos]; // m is matrix o is offset
    for (let y = 0; y < m.lenght; ++y) {
        for (let x= 0; x < m[y].lenght; ++x) {
            // check player index on y and x, if its not zero continue
            if (m[y][x] !== 0 &&
                //making sure arena row exists aka not zero
                (arena[y + o.y] && 
                // if it exists we can access it offset child
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
                }
        }
    }
    // if no collision detected return false
    return false;
}

// functie om al de blokken te bewaren onderaan canvas
function createMatrix(w, h) {
    const matrix = [];
    while (h--) { // while h is not zero we decrease h with 1
        matrix.push(new Array(w).fill(0)); 
    }
    return matrix;
}

// general drawing function
function draw() {
    // clear the canvas everytime a piece is drawn
    context.fillStyle = '#000000'; // test 
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(arena, {x: 0, y:0});
    drawMatrix(player.matrix, player.pos);
}
 

 // get row and y index
 // offset voor de stukken te kunnen bewegen later
function drawMatrix(matrix, offset) { 
    matrix.forEach((row, y) => {
        // iterate over the row, get out the value and x index
        row.forEach((value, x)=> {
            // in the game values of 0 are nothing, so first a check if a value is assigned zero (transparant etc)
            if (value !== 0) {
                // then we draw, if it is zero then skip
                context.fillStyle = 'red';
                // x index for left, y for top, 1 for sizes
                context. fillRect(x + offset.x, 
                                  y + offset.y, 
                                  1, 1);
            }
        });
    });
}

// merge function
// to copy all values from player into arena, at correct position
function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        // iterate over the row
        row.forEach((value, x) => {
            // values that are zero are to be ignored with if
            if (value !== 0) {
                //copy the value into arena at correct offset
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    // test collide with arena and player
    if (collide(arena, player)) {
        // if we do collide move the player piece back up
        player.pos.y--;
        // merge the piece in the tables
        merge(arena, player);
        // and start a new piece at the top
        player.pos.y = 0;
    }
    dropCounter = 0;
}

let dropCounter = 0;
let dropInterval = 1000; // = milliseconds, every 1 second a piece drops

// update funtion to keep drawing
// and make the piece drop with time
let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    // console.log(player.pos.y);
    
    draw();
    requestAnimationFrame(update);
}

const arena = createMatrix(12, 20);
// console.log(arena); console.table(arena);

// start player structure op 5 van x en y
const player = {
    pos: {x: 5, y: 5},
    matrix: matrix, 
}

document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        player.pos.x--;
    } else if (event.keyCode === 39) {
        player.pos.x++;
    } else if (event.keyCode === 40) {
        playerDrop();
    }
});


update();

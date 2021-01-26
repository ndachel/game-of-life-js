//Conway's Gameof Life implementation using html5 canvas element and JS
//github @hjdachel
//Jan 2021
const canvasWidth = 1000;
const canvasHeight = 1000;
const p = .5;
const FPS = 7.5;

let startButton;
let stopButton;
let canvas;
let ctx;
let requestAnimationFramePID;
let continueAnimation = false;

let game;

const gameBoardSize = 25;

/** BEGIN CLASS DEFS (ES6 classes can't be hoisted) */


class Game {
    constructor(gameBoard, rule) {
        this.gameBoard = gameBoard;
        this.rule = rule;
    }

    nextIter() {
        //console.log(this.gameBoard);
        let nextGen = this.gameBoard.map(row => row.slice());
        for (let h = 0; h < this.gameBoard.length; h++) {
            for (let w = 0; w < this.gameBoard[h].length; w++) {
                if (this.alive(h, w)) {
                    nextGen[h][w] = 1;
                } else {
                    nextGen[h][w] = 0;
                }
            }
        }
        this.gameBoard = nextGen.map(row => row.slice());
    }

    alive(h, w) {
        let liveNeighbours = 0;
        const currCell = this.gameBoard[h][w];
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (this.gameBoard[(i + h + gameBoardSize) % gameBoardSize][(j + w + gameBoardSize) % gameBoardSize]) {
                    liveNeighbours++;
                }
            }
        }


        if (this.gameBoard[h][w]) {
            liveNeighbours--;
            if (liveNeighbours == this.rule[0] || liveNeighbours == this.rule[1]) {
                return true;
            } else {
                return false;
            }
        } else if (liveNeighbours == this.rule[2]) {
            return true;
        } else return false;

    }

}

/** END CLASS DEFs */

/** onload, listen on buttons and call run() to begin the game */
window.onload = () => {
    canvas = document.getElementById('canvas');
    canvas.addEventListener("mousedown", function(e){changeBlock(canvas, e);});
    canvas.addEventListener("mousemove", function(e){showBlock(canvas, e);});
    ctx = canvas.getContext('2d');
    startButton = $("#startButton");
    stopButton = $("#stopButton");

    const board = init(gameBoardSize);
    const rule = [2, 3, 3]; //rule[0] & rule[1] for living cells, rule[2] for dead cells.
    game = new Game(board, rule);

    requestAnimationFramePID = window.requestAnimationFrame(gameLoop);

    //start button is pressed
    startButton.click(() => {       
        continueAnimation = true; 
    });

    stopButton.click(() => {
        continueAnimation = false;
        setTimeout(() => {
            clearCanvas();
        }, 250);
        // clearCanvas();
    });

}

/** draws a grid rectangle at the specified x and y */
const drawLiveRect = (x, y) => {
    size = canvasWidth / gameBoardSize
    ctx.fillStyle = "#9cd9c1";
    ctx.fillRect(x + 0.5, y + 0.5, size, size);
};

/** draws a grid on the gameboard for old man eyes */
const drawGrid = () => {
    ctx.fillStyle = "#666666";
    for(let y = 0; y < canvasHeight; y = y + canvasHeight / gameBoardSize) { ctx.fillRect(0, y, canvasWidth, 1);}
    for(let x = 0; x < canvasWidth;  x = x + canvasWidth / gameBoardSize) { ctx.fillRect(x, 0, 1, canvasHeight);}
};

/** generates an initial game board of cells with the correct x and y values. Calls generatePlaceholder for each row */
const init = (numberOfCells) => {
    let filler = Array(numberOfCells).fill(0);
    let board = [];

    for (let i = 0; i < numberOfCells; i++) {
        board.push(filler.slice());
    }

    return board;
}

/** Draws the game board given as the arg on the canvas. Calls drawLiveRect */
const drawBoard = (board) => {
    const cellOffset = canvasWidth / gameBoardSize;
    for (let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            if (board[y][x] == 1) {
                drawLiveRect(x * cellOffset, y * cellOffset);
            }
        }
    }
};

/** clears the entire canvas */
const clearCanvas = () => {
    ctx.fillStyle = "#34343488";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

const changeBlock = (canvas, event) => { 
    size = canvasWidth / gameBoardSize
    let rect = canvas.getBoundingClientRect(); 
    let x = Math.floor((event.clientX - rect.left) / size);
    let y = Math.floor((event.clientY - rect.top)  / size);
    console.log(x, y);
    game.gameBoard[y][x] = !game.gameBoard[y][x];

};

const showBlock = (canvas, event) => { 
    size = canvasWidth / gameBoardSize
    let rect = canvas.getBoundingClientRect(); 
    let x = Math.floor((event.clientX - rect.left) / size);
    let y = Math.floor((event.clientY - rect.top) / size);

    ctx.fillStyle = "#9cd4d905";
    ctx.beginPath();ctx.arc((x*size)+size/2, (y*size)+size/2, size, 0, 360);ctx.fill();
    
    ctx.fillStyle = "#9cd4d9";
    ctx.fillRect((x * size), (y * size), size, size);
};

const gameLoop = () => {
    setTimeout(() => {
        clearCanvas();
        drawGrid();
        drawBoard(game.gameBoard);
        
        if (continueAnimation) {
            game.nextIter();
        }
        requestAnimationFramePID = window.requestAnimationFrame(gameLoop);
    }, 1000 / FPS);

};
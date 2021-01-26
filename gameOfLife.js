//Conway's Gameof Life implementation using html5 canvas element and JS
//github @hjdachel
//Jan 2021
const canvasWidth = 1000;
const canvasHeight = 1000;
const p = .5;
const FPS = 7.5;

let startButton;
let stopButton;
let grid;
let canvas;
let ctx;
let requestAnimationFramePID;
let continueAnimation = true;

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
    ctx = canvas.getContext('2d');
    startButton = $("#startButton");
    stopButton = $("#stopButton");

    const board = init(gameBoardSize);
    const rule = [2, 3, 3]; //rule[0] & rule[1] for living cells, rule[2] for dead cells.
    game = new Game(board, rule);

    /** Blinker (oscillator) */
    // game.gameBoard[0][12] = 1;
    // game.gameBoard[1][12] = 1;
    // game.gameBoard[2][12] = 1;

    /** Glider (spaceship) */
    //game.gameBoard[1][1] = 1
    //game.gameBoard[2][2] = 1
    //game.gameBoard[3][2] = 1
    //game.gameBoard[3][1] = 1
    //game.gameBoard[3][0] = 1


    /** Block (still life) */
    // game.gameBoard[5][5] = 1;
    // game.gameBoard[5][6] = 1;
    // game.gameBoard[6][5] = 1;
    // game.gameBoard[6][6] = 1;

    //start button is pressed
    startButton.click(() => {
        grid = ($("#showGrid").is(":checked"));
        
        /** load a config from the checkboxes  - lazy and not scalable!! - needs refactor*/
        if ($("#0_0").is(":checked")){ game.gameBoard[0][0] = 1;}
        if ($("#0_1").is(":checked")){ game.gameBoard[0][1] = 1;}
        if ($("#0_2").is(":checked")){ game.gameBoard[0][2] = 1;}
        if ($("#0_3").is(":checked")){ game.gameBoard[0][3] = 1;}
        
        if ($("#1_0").is(":checked")){ game.gameBoard[1][0] = 1;}
        if ($("#1_1").is(":checked")){ game.gameBoard[1][1] = 1;}
        if ($("#1_2").is(":checked")){ game.gameBoard[1][2] = 1;}
        if ($("#1_3").is(":checked")){ game.gameBoard[1][3] = 1;}

        if ($("#2_0").is(":checked")){ game.gameBoard[2][0] = 1;}
        if ($("#2_1").is(":checked")){ game.gameBoard[2][1] = 1;}
        if ($("#2_2").is(":checked")){ game.gameBoard[2][2] = 1;}
        if ($("#2_3").is(":checked")){ game.gameBoard[2][3] = 1;}

        if ($("#3_0").is(":checked")){ game.gameBoard[3][0] = 1;}
        if ($("#3_1").is(":checked")){ game.gameBoard[3][1] = 1;}
        if ($("#3_2").is(":checked")){ game.gameBoard[3][2] = 1;}
        if ($("#3_3").is(":checked")){ game.gameBoard[3][3] = 1;}
        
        continueAnimation = true; 
        requestAnimationFramePID = window.requestAnimationFrame(gameLoop);
    });

    stopButton.click(() => {
        continueAnimation = false;
        grid = false;
        setTimeout(() => {
            clearCanvas();
        }, 250);
        // clearCanvas();
    });

}


/** draws a 40x40 rectangle at the specified x and y */
const drawLiveRect = (x, y) => {
    ctx.fillStyle = "#9cd9c1";
    ctx.fillRect(x + 0.5, y + 0.5, 40, 40);
};

/** draws a grid on the gameboard for old man eyes */
const drawGrid = () => {
    if (grid == true){
        ctx.fillStyle = "#666666";
        for(let y = 0; y < canvasHeight; y = y + canvasHeight / gameBoardSize) { ctx.fillRect(0, y, canvasWidth, 1);}
        for(let x = 0; x < canvasWidth;  x = x + canvasWidth / gameBoardSize) { ctx.fillRect(x, 0, 1, canvasHeight);}
    }
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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


const gameLoop = () => {
    setTimeout(() => {
        clearCanvas();
        drawGrid();
        drawBoard(game.gameBoard);
        game.nextIter();
        if (continueAnimation) {
            requestAnimationFramePID = window.requestAnimationFrame(gameLoop);
        }
    }, 1000 / FPS);

};
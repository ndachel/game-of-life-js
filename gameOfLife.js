//Conway's Gameof Life implementation using html5 canvas element and JS
//github @hjdachel
//Jan 2021
const cWidth = 1000;
const cHeight = 1000;
const p = .5;
let startButton;
let stopButton;
let canvas;
let ctx;


/** BEGIN CLASS DEFS (ES6 classes can't be hoisted) */

//Status = live or dead (true or false)
class Cell {
    constructor(x, y, status) {
        this.x = x;
        this.y = y;
        this.status = status;
    }

}

class Game {
    constructor(gameBoard) {
        this.gameBoard = gameBoard;
    }

    nextIter() {
        let nextGen = [...gameBoard];
        for (let h = 0; h < this.gameBoard.length; h++) {
            for (let w = 0; w < gameBoard[h].length; w++) {
                if (alive(h, w)) {
                    nextGen[h][w].status = true;
                } else {
                    nextGen[h][w].status = false;
                }
            }
        }
    }

}

/** END CLASS DEFs */

/** onload, listen on buttons and call run() to begin the game */
window.onload = () => {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    startButton = $("#startButton");
    stopButton = $("#stopButton");

    //start button is pressed
    startButton.click( () => {
        // for (let i = 0; i < 25; i++) {
        //     drawLiveRect((40 * i), 0);
        // }
        init();
    });

    stopButton.click( () => {
        clearCanvas();
    });

}


/** draws a 40x40 rectangle at the specified x and y */
const drawLiveRect = (x, y) => {
    ctx.fillStyle = "white";
    ctx.fillRect(x + 0.5, y + 0.5, 40, 40);
};


/** generates a row of initial Cell objects with the correct x, going from 0-960. takes current Y value as arg  */
const generatePlaceholder = (y) => {
    let placeholder = []
    let currX = 0;
    let currBool = false;

    for (let i = 0; i < 25; i++) {
        placeholder.push(new Cell(currX, y, currBool));
        currX += 40;
    }
    return placeholder;
}

/** generates an initial game board of cells with the correct x and y values. Calls generatePlaceholder for each row */
const init = () => {
    let board = [];
    let currY = 0;

    for (let i = 0; i < 25; i++) {
        board.push(generatePlaceholder(currY));
        currY += 40;
    }

    return board;
}

/** Draws the game board given as the arg on the canvas. Calls drawLiveRect */
const drawBoard = (board) => {
    let alive = filterAlive(board);

    alive.forEach( (element) => {
        drawLiveRect(element.x, element.y);
    });
};

/** filters a game board by living cells */
filterAlive = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
        let curr = arr[i].filter((obj) => {
            return obj.status === true;
        });

        curr.forEach(element => newArr.push(element));

    }
    return newArr;
};

/** clears the entire canvas */
const clearCanvas = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}


/** constructs a Game object and runs the game. */
const run = () => {
    const game = new Game(init());
}
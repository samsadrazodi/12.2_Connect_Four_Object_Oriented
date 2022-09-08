/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
class Game {
  constructor(p1, p2, HEIGHT = 6, WIDTH = 7) {
    this.players = [p1, p2];
    this.HEIGHT = HEIGHT;
    this.WIDTH = WIDTH;
    this.currPlayer = p1;
    this.makeBoard();
    this.makeHtmlBoard();

  }

  makeBoard() {

    this.board = [];
    for (let y = 0; y < this.HEIGHT; y++) {
      this.board.push(Array.from({ length: this.WIDTH }));
    }
  }


  makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';


    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');
    //top.addEventListener('click', this.handleClick.bind(this));
    this.gameClickHandler = this.handleClick.bind(this);
    top.addEventListener("click", this.gameClickHandler);
    for (let x = 0; x < this.WIDTH; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }

    board.append(top);

    // make main part of board
    for (let y = 0; y < this.HEIGHT; y++) {
      const row = document.createElement('tr');

      for (let x = 0; x < this.WIDTH; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y} -${x} `);
        row.append(cell);
      }

      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.HEIGHT - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    const spot = document.getElementById(`${y} -${x} `);
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.classList.add(`drop${y + 1}`);
    //piece.style.top = -50 * (y + 2);


    spot.append(piece);
  }
  endGame(msg) {
    alert(msg);
    const selectorRow = document.querySelector("#column-top");
    selectorRow.removeEventListener("click", this.handleGameClick);
  }

  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    // check for win
    if (this.checkForWin()) {
      return this.endGame(`${this.currPlayer.name} won!`);
    }

    // check for tie
    if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    if (this.currPlayer === this.players[0]) {

      player2name.classList.remove('player2after');
      player1name.classList.add('player1after')

    } else {
      player1name.classList.remove('player1after')
      player2name.classList.add('player2after')
    }
  }
  checkForWin() {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    const _win = cells => cells.every(([y, x]) =>
      y >= 0 &&
      y < this.HEIGHT &&
      x >= 0 &&
      x < this.WIDTH &&
      this.board[y][x] === this.currPlayer
    );


    for (let y = 0; y < this.HEIGHT; y++) {
      for (let x = 0; x < this.WIDTH; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

}

// Define Player class along with elements name and color
class Player {
  constructor(color, name) {
    this.color = color;
    this.name = name;
  }
}


document.getElementById('start-game').addEventListener('click', () => {
  let p1 = new Player(document.getElementById('p1-color').value, document.getElementById('p1-name').value);
  let p2 = new Player(document.getElementById('p2-color').value, document.getElementById('p2-name').value);

  // Hiding inputs after start-game is clicked
  document.getElementById('p1-color').style.display = 'none';
  document.getElementById('p1-name').style.display = 'none';
  document.getElementById('p2-color').style.display = 'none';
  document.getElementById('p2-name').style.display = 'none';
  document.getElementById('start-game').style.display = 'none';

  // Selecting the div elements I needed for creating a players div on top of game
  let playersDiv = document.getElementById('players');
  let player1Text = document.getElementById('player1name');
  let player2Text = document.getElementById('player2name');
  let p1Color = document.getElementById('p1-color').value;
  let p2Color = document.getElementById('p2-color').value;

  // Setting the values of the divs inside the playersDiv and its child divs
  playersDiv.style.backgroundColor = 'rgba(85, 83, 77, 0.2)';
  player1Text.innerText = document.getElementById('p1-name').value;
  player2Text.innerText = document.getElementById('p2-name').value;
  document.querySelector('.dotPlayer1').style.backgroundColor = `${p1Color}`;
  document.querySelector('.dotPlayer2').style.backgroundColor = `${p2Color}`;

  let button = document.createElement('button')
  button.innerHTML = "Reset Game";
  button.style.color = 'blue';
  document.body.appendChild(button);
  button.addEventListener("click", function () {
    location.reload();
  })
  // Starting the game
  new Game(p1, p2);
})







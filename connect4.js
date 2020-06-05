/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

class Board{
  // This is a generic board class that can be used by any type of abstract
  // board game that you place pieces on a board in

  constructor( height, width ){
    this.height = height;
    this.width = width;
    this.__innerBoard = this.__makeBoard( )
    this.board = this.__makeHtmlBoard( )
  }

  __makeBoard() {
    /** makeBoard: create in-JS board structure:
     *   board = array of rows, each row is array of cells  (board[x][y]) */
    const board = []
    for (let x = 0; x < this.width; x++) {
      // array of rows, each row is array of cells  (board[x][y])
      board.push(Array.from({ length: this.height }));
      board[x].fill(0)
    }
    return board
  }
  
  /** makeHtmlBoard: make HTML table and row of column tops. */
  __makeHtmlBoard() {
    const board = document.getElementById('board');
    board.innerHTML = ""
  
    // make main part of board
    for (let x = 0; x < this.width; x++) {
      const row = document.createElement('tr');
      
      for (let y = 0; y < this.height; y++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${x}-${y}`);
        cell.classList.add("space")
        row.append(cell);
      }
      
      board.append(row);
    }
    return board
  }
  
}


class Connect4Board extends Board {
  constructor( height, width, victoryCondition = 4 ){
    super( height, width )
    this.victoryCondition = victoryCondition
    this.currPlayer = 1
  }
  
  // updates the __makeHtmlBoard() method to add event listener
  __makeHtmlBoard(){
    const board = super.__makeHtmlBoard()
    this.__handleClick = this.__handleClick.bind(this)
    board.addEventListener('click', this.__handleClick);
    return board
  }
  
  /** placeInTable: update DOM to place piece into HTML table of board */
  placePiece(x, y) {

    // places the piece in the js 2d array model of the board
    this.__innerBoard[x][y] = this.currPlayer;

    const playerName = `p${this.currPlayer}`

    // places the piece on the DOM
    const piece = document.createElement('div');
    piece.classList.add('piece', playerName);
    piece.id = `${x}-${y}` // this helps with the placing
    piece.style = `--row: ${this.height - y}`// this is used to calculate how long to run the animation
    const spot = document.getElementById(`${x}-${y}`);
    spot.append(piece);
  }

  /** findSpotForCol: given column x, return top empty y (null if filled) */
  __findSpotForCol(x) {

    // check for full column
    if( this.__innerBoard[x][this.height-1] ) return null

    for (let y = 0; y < this.height; y++) {
      if (!this.__innerBoard[x][y]) {
        return y;
      }
    }
  }
  
  /** handleClick: handle click of column top to play piece */
  __handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id[0]
  
    // get next spot in column (if none, ignore click)
    const y = this.__findSpotForCol( x );
    if (y === null) {
      return;
    }
  
    // place piece in board and add to HTML table
    this.placePiece(x, y);
    
    // check for win
    if (this.__checkForWin( x, y )) {
      return this.__endGame(`Player ${this.currPlayer} won!`);
    }
    
    // check for tie
    if ( this.__innerBoard.every(row => row[ this.height-1 ]) ) {
      return this.__endGame('Tie!');
    }

    // switch currPlayer
    this.switchCurrentPlayer()
  }

  // switches currentPlayer
  switchCurrentPlayer(){
    this.currPlayer = this.currPlayer - 1 ? 1 : 2 
  }

  // __checkForWin checks to see if the last piece played caused a win
  
  __checkForWin( x, y ) {

    // initialize to one to account for the peice that just got played
    let rightdiag = 1
    let leftdiag = 1
    let vert = 1
    let horiz = 1

    const player = this.__innerBoard[x][y]
    const board = this.__innerBoard
    const h = this.height
    const w = this.width
    const v = this.victoryCondition

    // the following 7 for loops increment each direction until there is a break in the 
    // line of current player's pieces, then breaks out of the loop and moves to the next
    for( let i = 1; i <= v; i++ ){
      if( !this.__isPlayer(x+i, y+i, player) ) break
      rightdiag++
    }
    for( let i = 1; i <= v; i++ ){
      if( !this.__isPlayer(x-i, y-i, player) ) break
      rightdiag++
    }
    for( let i = 1; i <= v; i++ ){
      if( !this.__isPlayer(x+i,  y , player) ) break
      horiz++
    }
    for( let i = 1; i <= v; i++ ){
      if( !this.__isPlayer(x-i,  y , player) ) break
      horiz++
    }
    for( let i = 1; i <= v; i++ ){
      if( !this.__isPlayer(x+i, y-i, player) ) break
      leftdiag++
    }
    for( let i = 1; i <= v; i++ ){
      if( !this.__isPlayer(x-i, y+i, player) ) break
      leftdiag++
    }
    for( let i = 1; i <= v; i++ ){
      if( !this.__isPlayer( x , y-i, player) ) break
      vert++
    }

    // 
    if( horiz >= v || vert >= v || leftdiag >= v || rightdiag >= v ) return true
    else return false
  }

  //  checks if the space indicacted is occupied by 
  __isPlayer( x, y, player ){
    if( x >= 0 && 
      y >= 0 && 
      x < this.width && 
      y < this.height && 
      this.__innerBoard[x][y] === player ) return true
    else return false
  }

  /** endGame: announce game end */
  __endGame(msg) {
    document.querySelectorAll(".piece").forEach( piece => piece.addEventListener("animationend", ()=> alert(msg) ) )
    document.getElementById('board').removeEventListener('click', this.__handleClick)
  }
} 

class Player{
  // this creates a player object 
  constructor( name, playerColor ){
    // keeps a color for the player's pieces
    this.color = playerColor
    this.name = name
  }

}


class Game{
  // 
  constructor( height, width ){
    // get the colors
    const player1Color = document.querySelector('input[name="player-1-color"]').value
    const player2Color = document.querySelector('input[name="player-2-color"]').value

    this.board = new Connect4Board( height, width )
    this.player1 = new Player( "1", player1Color )
    this.player2 = new Player( "2", player2Color )

    this.currPlayer = this.player1

    // the following lines modify the board object to allow additional funtionality
    this.board.currPlayer = +this.currPlayer.name

    // this allows the switchCurrentPlayer function to switch current player on both 
    // the board object and the game object when it is called
    this.board.switchCurrentPlayer = function() {
      this.currPlayer = this.currPlayer === this.player1 ? this.player2 : this.player1
      this.board.currPlayer = +this.currPlayer.name
    }.bind(this)

    // This allows custom colored peices
    this.board.placePiece = function(x,y) {
      // first call the original function
      this.board.__proto__.placePiece.call( this.board, x, y)
      // then change the piece color to the custom color
      if( this.currPlayer.color ){document.getElementById(`${x}-${y}`
      ).firstElementChild.style.backgroundImage= `radial-gradient(circle at center, ${this.currPlayer.color} 15%,black 150%)` }
    }.bind(this)
    
  }
  
}

// document.addEventListener("DOMContentsLoaded", ()=>
// } )
// const board = new Connect4Board(HEIGHT,WIDTH)

let game = undefined

document.querySelector('[name="start-btn"]').addEventListener("click", e =>{
  e.preventDefault()
  game = new Game( HEIGHT, WIDTH )
})


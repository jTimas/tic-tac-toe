class GameBoard {
  constructor() {
    this.isOver = false;
    this.lastPlayer = 1;
    this.movesCount = 0;
    this.symbols = ['X', 'O'];
    this.board = ['', '', '', '', '', '', '', ''];
    this.players = [
      {
        name: null,
        wins: 0
      },
      {
        name: null,
        wins: 0
      }
    ];
  }

  init(player1, player2) {
    this.players[0].name = player1;
    this.players[1].name = player2;
    document.querySelector("#game").style.display = 'block';
    resizeCells();
    this.updateScore();
    this.updateActivePlayer();
  }

  updateScore() {
    this.players.map((player, index) => {
      let playerElement = document.getElementsByClassName('player')[index];
      playerElement.getElementsByClassName('name')[0].innerHTML = '[' + this.symbols[index] + '] ' + player.name;
      playerElement.getElementsByClassName('wins')[0].innerHTML = player.wins;
    });
  }

  updateActivePlayer() {
    let index = this.lastPlayer === 0 ? 1 : 0;
    let playerElement = document.getElementsByClassName('activePlayer')[0];
    playerElement.getElementsByClassName('name')[0].innerHTML = '[' + this.symbols[index] + '] ' + this.players[index].name;
  }

  addBoardPoints(conditions) {
    while(conditions.length) {
      let condition = conditions[conditions.length - 1];
      this.board[condition] += this.symbols[this.lastPlayer];
      conditions.pop();
      if(this.checkWinCondition(condition)) break;
    }
  }

  checkWinCondition(condition) {
    if(this.board[condition] === this.symbols[this.lastPlayer].repeat(3)) {
      this.gameOver();
      return true;
    }
    return false;
  }

  onPlayerClick(event) {
    if(event.target.innerHTML.length === 0 && !this.isOver) {
      let nextPlayer = this.lastPlayer === 0 ? 1 : 0;
      event.target.innerHTML = this.symbols[nextPlayer];
      event.target.classList.add(this.symbols[nextPlayer]);
      this.lastPlayer = nextPlayer;
      this.updateActivePlayer();
      this.addBoardPoints(event.target.dataset.conditions.split(','), nextPlayer);
      this.movesCount++;
      if(this.movesCount === 9 && !this.isOver)
        this.gameOver(true);
    }
  }

  gameOver(draw = false) {
    document.querySelector('.info-box').style.display = 'block';
    if(draw) {
      document.querySelector('#winner').innerHTML = 'Lygiosios';
    } else {
      document.querySelector('#winner').innerHTML = 'Laimėjo: ' + this.players[this.lastPlayer].name;
      this.players[this.lastPlayer].wins++;
      this.updateScore();
    }
    this.isOver = true;
  }

  clearBoard() {
    document.querySelector('.info-box').style.display = 'none';
    this.board = ['', '', '', '', '', '', '', ''];
    let cells = document.getElementsByClassName('btn-cell');
    for(let i = 0; i < cells.length; ++i) {
      cells[i].innerHTML = '';
      cells[i].classList.remove('X');
      cells[i].classList.remove('O');
    }
  }

  rematch() {
    this.isOver = false;
    this.movesCount = 0;
    this.clearBoard();
  }

  quitGame() {
    location.reload();
  }
}

const game = new GameBoard();

function resizeCells() {
  let cells = document.getElementsByClassName('btn-cell');
  width = cells[0].offsetWidth;
  for(let i = 0; i < cells.length; ++i) {
    cells[i].style.height = width + 'px';
  }
}

document.querySelector("#form").addEventListener("submit", function(e){
  e.preventDefault();
  document.querySelector("#form .error-text").innerHTML = "";
  let player1 = e.target[0].value;
  let player2 = e.target[1].value;
  if(player1.length === 0 || player2.length === 0) {
    document.querySelector("#form .error-text").innerHTML = "Užpildykite duomenis!"
  } else if(player1 === player2) {
    document.querySelector("#form .error-text").innerHTML = "Vardai negali būti vienodi!"
  } else {
    document.querySelector("#form").style.display = 'none';
    game.init(e.target[0].value, e.target[1].value);
  }
});


window.addEventListener('resize', () => {
  resizeCells();
});
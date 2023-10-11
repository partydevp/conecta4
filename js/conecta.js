const tittle = document.querySelector(".tittle");
const divBoard = document.getElementById("board");
const btn_start = document.getElementById("btn-start");
const sct_buttons = document.querySelector(".st-buttons");
const divFooter = document.querySelector(".footer-content");
const divBtns = document.querySelector(".st-buttons");
const pointer = document.getElementById("pointer");

const ROWS = 6;
const COLUMNS = 7;
let board, columns_select;
let turn = 1; //CPU 0, PLAYER 1
let gameEnd = false;
let winner = null;

/* const ARROWDOWN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
<path fill-rule="evenodd" d="M12 2.25a.75.75 0 01.75.75v16.19l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0l-3.75-3.75a.75.75 0 111.06-1.06l2.47 2.47V3a.75.75 0 01.75-.75z" clip-rule="evenodd" />
</svg>`; */

const ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
<path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.918z" clip-rule="evenodd" />
</svg>`;

const div = document.createElement("div");
div.innerHTML = ICON;
tittle.appendChild(div);

//JUGADAS GANADORAS
const WINNER_ROWS = [
  [0, 1, 2, 3],
  [1, 2, 3, 4],
  [2, 3, 4, 5],
  [3, 4, 5, 6],
];

const WINNER_COLUMS = [
  [0, 1, 2, 3],
  [1, 2, 3, 4],
  [2, 3, 4, 5],
];

const WINNER_DIAGONALS = [
  //diagonales +6
  [3, 9, 15, 21],
  [4, 10, 16, 22],
  [5, 11, 17, 23],
  [6, 12, 18, 24],
  [10, 16, 22, 28],
  [11, 17, 23, 29],
  [12, 18, 24, 30],
  [13, 19, 25, 31],
  [17, 23, 29, 35],
  [18, 24, 30, 36],
  [19, 25, 31, 37],
  [20, 26, 32, 38],
  //diagonales +8
  [0, 8, 16, 24],
  [1, 9, 17, 25],
  [2, 10, 18, 26],
  [3, 11, 19, 27],
  [7, 15, 23, 31],
  [8, 16, 24, 32],
  [9, 17, 25, 33],
  [10, 18, 26, 34],
  [14, 22, 30, 38],
  [15, 23, 31, 39],
  [16, 24, 32, 40],
  [17, 25, 33, 41],
];

const types_squares = {
  player: 1,
  cpu: 2,
  empty: 0,
};

const token_player = "\u{1F534}"; //red
const token_cpu = "\u{1F535}"; //blue

//FUNCIONES
const gameWin = (arrayWin) => {
  divFooter.textContent = `GANADOR: ${winner}`;
  arrayWin.forEach((element) => {
    const square = document.querySelector(`[data-id="${element.position}"]`);
    square.classList.add("win");
  });
  btn_start.disabled = false;
};

const checkWinner = () => {
  //mínimo de fichas no nulas
  const arrNotEmpty = board.filter((obj) => obj.value !== 0);
  if (arrNotEmpty.length < 5) return;

  //verificar las líneas
  //línea es la parte entera de la división de la posición entre 7
  for (x = ROWS - 1; x >= 0; x--) {
    const rowCheck = board.filter(
      (obj) => Math.floor(obj.position / COLUMNS) === x
    );
    for (option of WINNER_ROWS) {
      const [a, b, c, d] = option;
      if (
        rowCheck[a].value === rowCheck[b].value &&
        rowCheck[a].value === rowCheck[c].value &&
        rowCheck[a].value === rowCheck[d].value &&
        rowCheck[a].value !== types_squares.empty
      ) {
        gameEnd = true;
        rowCheck[a].value === types_squares.player
          ? (winner = "Player")
          : (winner = "CPU");
        return gameWin([rowCheck[a], rowCheck[b], rowCheck[c], rowCheck[d]]);
      }
    }
  }

  //verificar las columnas
  for (y = COLUMNS - 1; y >= 0; y--) {
    const rowCheck = board.filter((obj) => obj.position % COLUMNS === y);
    for (option of WINNER_COLUMS) {
      const [a, b, c, d] = option;
      if (
        rowCheck[a].value === rowCheck[b].value &&
        rowCheck[a].value === rowCheck[c].value &&
        rowCheck[a].value === rowCheck[d].value &&
        rowCheck[a].value !== types_squares.empty
      ) {
        gameEnd = true;
        rowCheck[a].value === types_squares.player
          ? (winner = "Player 1")
          : (winner = "Player 2");
        return gameWin([rowCheck[a], rowCheck[b], rowCheck[c], rowCheck[d]]);
      }
    }
  }

  //Validación de las diagonales
  for (option of WINNER_DIAGONALS) {
    const [a, b, c, d] = option;
    if (
      board[a].value === board[b].value &&
      board[a].value === board[c].value &&
      board[a].value === board[d].value &&
      board[a].value !== types_squares.empty
    ) {
      gameEnd = true;
      board[a].value === types_squares.player
        ? (winner = "Jugador 1")
        : (winner = "Jugador 2");
      return gameWin([board[a], board[b], board[c], board[d]]);
    }
  }

  //validación del empate
  if (board.every((square) => square.value !== types_squares.empty)) {
    gameEnd = true;
    winner = "PARTIDA EN TABLAS";
    btn_start.disabled = false;
    return (divFooter.textContent = winner);
  }
};

const renderBoard = () => {
  board.forEach((row, index) => {
    if (board[index].value === types_squares.player) {
      const move = document.querySelector(
        `[data-id="${board[index].position}"]`
      );
      move.innerText = token_player;
      return;
    }
    if (board[index].value === types_squares.cpu) {
      const move = document.querySelector(
        `[data-id="${board[index].position}"]`
      );
      move.innerText = token_cpu;
      return;
    }
  });
};

const cpuPlays = (col) => {
  if (turn === 0) {
    const arrCol = board.filter(
      (obj) => obj.position % COLUMNS === parseInt(col)
    );
    for (let row = arrCol.length - 1; row >= 0; row--) {
      if (arrCol[row].value === types_squares.empty) {
        arrCol[row].value = types_squares.cpu;
        break;
      }
    }

    renderBoard();
    turn = 1;
    renderPlayer();
    checkWinner();
  }
};

const playerPlays = (col) => {
  if (turn === 1) {
    //selecciono el array de la columna
    //la columna es el resto de dividir entre el numero de columnas
    const arrCol = board.filter(
      (obj) => obj.position % COLUMNS === parseInt(col)
    );
    for (let row = arrCol.length - 1; row >= 0; row--) {
      if (arrCol[row].value === types_squares.empty) {
        arrCol[row].value = types_squares.player;
        break;
      }
    }
    renderBoard();
    turn = 0;
    renderPlayer();
    checkWinner();
  }
};

const manageMove = (e) => {
  const columnSelect = e.target.dataset.col;
  if (!gameEnd) {
    if (turn === 0) {
      window.removeEventListener("mousemove", handleMouse);
      pointer.style.backgroundColor = "red";
      window.addEventListener("mousemove", handleMouse);
      cpuPlays(columnSelect);
      return;
    }
    if (turn === 1) {
      window.removeEventListener("mousemove", handleMouse);
      pointer.style.backgroundColor = "blue";
      window.addEventListener("mousemove", handleMouse);
      playerPlays(columnSelect);
      return;
    }
  }
};

renderPlayer = () => {
  switch (turn) {
    case 0:
      divFooter.textContent = `turno Jugador 2 ${token_cpu}`;
      break;

    case 1:
      divFooter.textContent = `turno Jugador 1 ${token_player}`;
      break;
  }
};

const setBoard = () => {
  board.forEach((row, rowIndex) => {
    const div = document.createElement("div");
    const span = document.createElement("span");
    div.classList.add("square");
    div.appendChild(span);
    div.dataset.id = `${rowIndex}`;
    divBoard.appendChild(div);
    //convierto el array en array de objetos
    board[rowIndex] = {
      value: board[rowIndex],
      position: rowIndex,
    };
  });
  divBoard.classList.add("visible");
  sct_buttons.classList.add("visible");
  divBtns.style.display = "grid";

  //eventos de click
  columns_select = document.querySelectorAll(".st-buttons-bt");
  columns_select.forEach((btn) => btn?.addEventListener("click", manageMove));
  //evento del ratón
  window.addEventListener("mousemove", handleMouse);
};

const startGame = () => {
  divBoard.innerHTML = "";
  gameEnd = false;
  winner = null;
  board = Array.from(Array(ROWS * COLUMNS).fill(types_squares.empty));
  setBoard();
  renderPlayer();
  btn_start.disabled = true;
};

const handleMouse = (event) => {
  const { clientX, clientY } = event;
  pointer.style.transform = `translateY(${clientY}px) translateX(${clientX}px)`;
};

//EVENTOS GENERALES
btn_start.addEventListener("click", startGame);

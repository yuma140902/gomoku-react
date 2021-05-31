const ROWS = 10;
const COLUMNS = 10;

function onload() {
  restart();
}

function restart() {
  const goban = document.getElementById("goban");

  while (goban.firstChild) {
    goban.removeChild(goban.firstChild);
  }

  for (let i = 0; i < ROWS; ++i) {
    const row = document.createElement("tr");
    for (let j = 0; j < COLUMNS; ++j) {
      const cell = document.createElement("td");
      cell.classList.add("stone");
      row.appendChild(cell);
    }
    goban.appendChild(row);
  }

  for (let i = 0; i < ROWS; ++i) {
    for (let j = 0; j < COLUMNS; ++j) {
      const cell = goban.rows[i].cells[j];
      cell.onclick = function () { cell_onclick(this, i, j); };
    }
  }

  document.getElementById("turn").hidden = false;
  document.getElementById("winner").hidden = true;

  state = STATE_WHITE;
}

const STATE_WHITE = "○";
const STATE_BLACK = "●";
const STATE_FINISHED = "fin";

let state;

const game_is_finished = function () {
  return state === STATE_FINISHED;
}


function cell_or_default(goban, row, column) {
  if (0 <= row && row < ROWS && 0 <= column && column < COLUMNS) {
    return goban.rows[row].cells[column].innerText;
  }
  return undefined;
}

const directions = [
  [1, 0],
  [0, 1],
  [1, 1],
  [1, -1]
];

function judge_winner(row, column) {

  const row_orig = row;
  const column_orig = column;

  let has_won = false;
  for (const direction of directions) {
    const goban = document.getElementById("goban");

    let count = 1;

    let row = row_orig + direction[0];
    let column = column_orig + direction[1];
    while (cell_or_default(goban, row, column) === state) {
      row += direction[0];
      column += direction[1];
      ++count;
    }

    row = row_orig - direction[0];
    column = column_orig - direction[1];
    while (cell_or_default(goban, row, column) === state) {
      row -= direction[0];
      column -= direction[1];
      ++count;
    }

    if (count >= 5) {
      has_won = true;
      break;
    };
  }

  return has_won ? state : undefined;
}

function toggle_turn() {
  state = (state === STATE_BLACK) ? STATE_WHITE : STATE_BLACK;
  document.getElementById("turn").firstChild.innerText = state;
}

function show_winner(winner) {
  document.getElementById("turn").hidden = true;
  const msgbox = document.getElementById("winner");
  msgbox.hidden = false;
  msgbox.firstChild.innerText = winner;
}


function cell_onclick(cell, row, column) {
  if (game_is_finished() || cell.innerText != "") return;

  cell.innerText = state;

  const winner = judge_winner(row, column);
  if (winner == undefined) {
    toggle_turn();
  }
  else {
    show_winner(winner);
    state = STATE_FINISHED;
  }
}
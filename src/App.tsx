import React, { useState } from 'react';
import './App.css';


const ROWS = 10;
const COLUMNS = 10;

type CellState = "none" | "white" | "black";
type Winner = CellState;
type Turn = "white" | "black";
interface BoardState {
  cells: CellState[],
  turn: Turn,
  isFinished: boolean,
  winner: Winner
}

function serializeIdx(x: number, y: number): number {
  return x * ROWS + y;
}

function cell_or_default(goban: CellState[], x: number, y: number): CellState {
  const idx = serializeIdx(x, y);
  return (0 <= idx && idx < goban.length) ? goban[idx] : "none";
}

function judgeWinner(goban: CellState[], x: number, y: number, turn: Turn): Winner {
  const x_orig = x;
  const y_orig = y;
  const directions = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1]
  ];

  let has_won = false;
  for (const direction of directions) {

    let count = 1;

    let x = x_orig + direction[0];
    let y = y_orig + direction[1];
    while (cell_or_default(goban, x, y) === turn) {
      x += direction[0];
      y += direction[1];
      ++count;
    }

    x = x_orig - direction[0];
    y = y_orig - direction[1];
    while (cell_or_default(goban, x, y) === turn) {
      x -= direction[0];
      y -= direction[1];
      ++count;
    }

    if (count >= 5) {
      has_won = true;
      break;
    };
  }

  return has_won ? turn : "none";
}

function cell_state_to_string(state: CellState): string {
  return state === "none" ? "" : state === "white" ? "○" : "●";
}

const Cell = (props: { value: CellState, onclick: (event: any) => void }) => {

  return (
    <button className="cell stone" onClick={props.onclick}>{cell_state_to_string(props.value)}</button >
  )
}

const StatusBox = (props: { turn: Turn, isFinished: boolean, winner: Winner }) => {
  return (
    <div>
      {!props.isFinished
        ? <p id="turn">次は<span className="stone">{cell_state_to_string(props.turn)}</span>の手番です</p>
        : <p id="winner"><span className="stone">{cell_state_to_string(props.winner)}</span>が勝ちました</p>}
    </div>
  )
}

const Board = () => {

  const [state, setState] = useState<BoardState>({
    cells: Array<CellState>(ROWS * COLUMNS).fill("none"),
    turn: "white",
    isFinished: false,
    winner: "none"
  });

  const toggleTurn = (turn: Turn): Turn =>
    turn === "white" ? "black" : "white";

  const handleCellClick = (x: number, y: number) => {
    if (state.isFinished || state.cells[serializeIdx(x, y)] !== "none") return;
    const cells = state.cells.slice();
    cells[serializeIdx(x, y)] = state.turn;


    const winner = judgeWinner(cells, x, y, state.turn);
    const turn = toggleTurn(state.turn);
    const isFinished = winner !== "none";

    setState({ cells, turn, isFinished, winner });
  }

  const renderCell = (x: number, y: number) => <Cell value={state.cells[serializeIdx(x, y)]} onclick={() => handleCellClick(x, y)} />;


  const goban = [];
  for (let i = 0; i < ROWS; ++i) {
    const row_cells = [];
    for (let j = 0; j < COLUMNS; ++j) {
      row_cells.push(renderCell(i, j));
    }
    goban.push(<div className="board-row">{row_cells}</div>);
  }

  return (
    <div id="game" className="item">
      <StatusBox turn={state.turn} isFinished={state.isFinished} winner={state.winner} />
      <div id="goban">
        {goban}
      </div>
    </div>
  )
}

const SideBar = () => {
  return (
    <div id="side" className="item">
      <button /*onclick="restart()"*/>RESTART</button>
      <section>
        <h1>遊び方</h1>
        <ol>
          <li>[RESTART]を押します</li>
          <li>白黒を交互に打ちます</li>
          <li>先に5つ縦横斜めのどこかに連続して並べたら勝利です</li>
        </ol>
      </section>
    </div>
  )
}

function App() {
  return (
    <div className="App">
      <h1>五目並べ</h1>
      <div className="container">
        <Board />
        <SideBar />
      </div>
    </div>
  );
}

export default App;

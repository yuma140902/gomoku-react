import React, { useState } from 'react';
import './App.css';


const ROWS = 10;
const COLUMNS = 10;

type BlackOrWhite = "white" | "black";
type Cell = BlackOrWhite | "none";
type Winner = BlackOrWhite | "none";
type Turn = BlackOrWhite;

interface BoardState {
  cells: Cell[],
  turn: Turn,
  isFinished: boolean,
  winner: Winner
}

function serializeIdx(x: number, y: number): number {
  return x * ROWS + y;
}

function cellOrNone(goban: Cell[], x: number, y: number): Cell {
  const idx = serializeIdx(x, y);
  return (0 <= idx && idx < goban.length) ? goban[idx] : "none";
}

function judgeWinner(goban: Cell[], x: number, y: number, turn: Turn): Winner {
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
    while (cellOrNone(goban, x, y) === turn) {
      x += direction[0];
      y += direction[1];
      ++count;
    }

    x = x_orig - direction[0];
    y = y_orig - direction[1];
    while (cellOrNone(goban, x, y) === turn) {
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

const StoneSvg = (props: { value: BlackOrWhite | any }) => {
  if (props.value !== "white" && props.value !== "black") return null;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="30" fill={props.value} stroke="black" stroke-width="5"></circle>
    </svg>
  );
}

const CellElm = (props: { value: Cell, onclick: (event: any) => void }) => {
  return (
    <div className="cell-wrapper">
      <div className="cell" onClick={props.onclick}><StoneSvg value={props.value} /></div>
    </div >
  )
}

const StatusBox = (props: { turn: Turn, isFinished: boolean, winner: Winner }) => {
  return (
    <div>
      {!props.isFinished
        ? <p>次は<div className="inline-stone"><StoneSvg value={props.turn} /></div>の手番です</p>
        : <p>&nbsp;<div className="inline-stone"><StoneSvg value={props.winner} /></div>が勝ちました</p>}
    </div>
  )
}

const Board = () => {

  const [state, setState] = useState<BoardState>({
    cells: Array<Cell>(ROWS * COLUMNS).fill("none"),
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

  const renderCell = (x: number, y: number) => <CellElm value={state.cells[serializeIdx(x, y)]} onclick={() => handleCellClick(x, y)} />;

  const restart = () => {
    setState({
      cells: Array<Cell>(ROWS * COLUMNS).fill("none"),
      turn: "white",
      isFinished: false,
      winner: "none"
    });
  }


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
      <button onClick={() => restart()}>RESTART</button>
    </div>
  )
}

const SideBar = () => {
  return (
    <div id="side" className="item">
      <section>
        <h1>遊び方</h1>
        <ol>
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

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

function judgeWinner(x: number, y: number): Winner {
  return "none"
}

const Cell = (props: { value: CellState, onclick: (event: any) => void }) => {
  const cell_state_to_string = (state: CellState): string =>
    state === "none" ? "" : state === "white" ? "○" : "●";

  return (
    <button className="cell stone" onClick={props.onclick}>{cell_state_to_string(props.value)}</button >
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

    const turn = toggleTurn(state.turn);
    const winner = judgeWinner(x, y);
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
      <p id="turn">次は<span className="stone">○</span>の手番です</p>
      <p id="winner" hidden><span className="stone"></span>が勝ちました</p>
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
